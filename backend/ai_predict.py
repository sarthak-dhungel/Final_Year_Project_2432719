# ai_predict.py  (lazy-loading, safe at import time)
import os, io, json, threading
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as T

router = APIRouter(prefix="/api/ai", tags=["AI"])

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "krishi_model_ts.pt")
CLASS_MAP_PATH = os.path.join(BASE_DIR, "class_to_idx.json")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# lazy objects
_model = None
_idx_to_class = None
_model_lock = threading.Lock()   # safe concurrent load

_transform = T.Compose([
    T.Resize((224,224)),
    T.ToTensor(),
    T.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

def _lazy_load():
    """Load model and class map once, thread-safe. Raises informative errors."""
    global _model, _idx_to_class
    if _model is not None and _idx_to_class is not None:
        return
    with _model_lock:
        if _model is not None and _idx_to_class is not None:
            return
        # load class map first (so errors are clear)
        if not os.path.exists(CLASS_MAP_PATH):
            raise FileNotFoundError(f"class map not found at {CLASS_MAP_PATH}")
        with open(CLASS_MAP_PATH, "r") as f:
            class_to_idx = json.load(f)
        # invert to idx->class (keys in JSON may be strings)
        _idx_to_class = {str(v): k for k, v in class_to_idx.items()}
        # load model
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"model file not found at {MODEL_PATH}")
        # choose device cpu by default; GPU load can be enabled later
        device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            _model = torch.jit.load(MODEL_PATH, map_location=device)
            _model.eval()
        except Exception as e:
            # convert to clearer message
            raise RuntimeError(f"failed to load TorchScript model: {e}")

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    # lazy load on first request
    try:
        _lazy_load()
    except FileNotFoundError as e:
        # return 500 with clear message
        raise HTTPException(status_code=500, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    x = _transform(img).unsqueeze(0)
    device = next(_model.parameters()).device if hasattr(_model, "parameters") else "cpu"
    x = x.to(device)

    with torch.no_grad():
        logits = _model(x)
        probs = torch.nn.functional.softmax(logits, dim=1)
        top_p, top_idx = probs.topk(3, dim=1)

    results = []
    for p, idx in zip(top_p[0].cpu().tolist(), top_idx[0].cpu().tolist()):
        label = _idx_to_class.get(str(int(idx)), "unknown")
        results.append({"label": label, "prob": float(p)})

    low_confidence = results and results[0]["prob"] < 0.6
    return JSONResponse({"predictions": results, "low_confidence": bool(low_confidence)})

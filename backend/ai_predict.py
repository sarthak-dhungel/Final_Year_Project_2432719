# ai_predict.py  (lazy-loading, safe at import time)
import os, io, json, threading, base64
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as T
from database import db
from datetime import datetime
from disease_remedies import DISEASE_REMEDIES

router = APIRouter(prefix="/api/ai", tags=["AI"])

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "krishi_model_ts.pt")
CLASS_MAP_PATH = os.path.join(BASE_DIR, "class_to_idx.json")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# lazy objects
_model = None
_idx_to_class = None
_model_lock = threading.Lock()

_transform = T.Compose([
    T.Resize((224,224)),
    T.ToTensor(),
    T.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

def _lazy_load():
    global _model, _idx_to_class
    if _model is not None and _idx_to_class is not None:
        return
    with _model_lock:
        if _model is not None and _idx_to_class is not None:
            return
        if not os.path.exists(CLASS_MAP_PATH):
            raise FileNotFoundError(f"class map not found at {CLASS_MAP_PATH}")
        with open(CLASS_MAP_PATH, "r") as f:
            class_to_idx = json.load(f)
        _idx_to_class = {str(v): k for k, v in class_to_idx.items()}
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"model file not found at {MODEL_PATH}")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            _model = torch.jit.load(MODEL_PATH, map_location=device)
            _model.eval()
        except Exception as e:
            raise RuntimeError(f"failed to load TorchScript model: {e}")

@router.post("/predict")
async def predict(request: Request, file: UploadFile = File(...)):
    try:
        _lazy_load()
    except FileNotFoundError as e:
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
        # Attach remedy data from DISEASE_REMEDIES if available
        remedy = DISEASE_REMEDIES.get(label)
        results.append({
            "label": label,
            "prob": float(p),
            "remedy": remedy  # may be None if label not in remedies dict
        })

    low_confidence = results and results[0]["prob"] < 0.6

    # --- Save image + prediction to MongoDB as Base64 ---
    try:
        image_b64 = base64.b64encode(contents).decode("utf-8")
        mime_type = file.content_type or "image/jpeg"
        image_data_uri = f"data:{mime_type};base64,{image_b64}"

        user_id = request.headers.get("X-User-Id", "anonymous")
        top_prediction = results[0] if results else {}

        await db.images.insert_one({
            "userId": user_id,
            "filename": file.filename,
            "imageData": image_data_uri,
            "mimeType": mime_type,
            "disease": top_prediction.get("label", "unknown"),
            "confidence": round(top_prediction.get("prob", 0.0) * 100, 2),
            "allPredictions": [{"label": r["label"], "prob": r["prob"]} for r in results],
            "lowConfidence": bool(low_confidence),
            "uploadedAt": datetime.utcnow(),
            "status": "analysed"
        })
    except Exception as db_err:
        print(f"[WARN] Failed to save image to MongoDB: {db_err}")

    return JSONResponse({"predictions": results, "low_confidence": bool(low_confidence)})
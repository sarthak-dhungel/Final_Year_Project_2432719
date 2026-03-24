# ai_predict.py - Complete version with disease remedies
import os, io, json, threading
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as T
from disease_remedies import get_remedy, get_severity_level  # ← Add this import

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
    """Load model and class map once, thread-safe."""
    global _model, _idx_to_class
    if _model is not None and _idx_to_class is not None:
        return
    with _model_lock:
        if _model is not None and _idx_to_class is not None:
            return
        
        # Load class map
        if not os.path.exists(CLASS_MAP_PATH):
            raise FileNotFoundError(f"class map not found at {CLASS_MAP_PATH}")
        with open(CLASS_MAP_PATH, "r") as f:
            class_to_idx = json.load(f)
        
        # Convert to idx->class (ensure string keys for safety)
        _idx_to_class = {str(v): k for k, v in class_to_idx.items()}
        
        # Load TorchScript model
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"model file not found at {MODEL_PATH}")
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            _model = torch.jit.load(MODEL_PATH, map_location=device)
            _model.eval()
            print(f"✅ Model loaded successfully on {device}")
            print(f"✅ Loaded {len(_idx_to_class)} classes")
        except Exception as e:
            raise RuntimeError(f"Failed to load TorchScript model: {e}")

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Lazy load on first request
    try:
        _lazy_load()
    except (FileNotFoundError, RuntimeError) as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Read and validate image
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # Preprocess
    x = _transform(img).unsqueeze(0)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    x = x.to(device)

    # Inference
    with torch.no_grad():
        logits = _model(x)
        probs = torch.nn.functional.softmax(logits, dim=1)
        top_p, top_idx = probs.topk(3, dim=1)

    # Build predictions with remedies
    predictions = []
    for prob, idx in zip(top_p[0].cpu().tolist(), top_idx[0].cpu().tolist()):
        # Get disease name from class mapping
        disease_name = _idx_to_class.get(str(int(idx)), f"Unknown_{idx}")
        confidence_pct = prob * 100
        
        # Get remedy and severity
        remedy = get_remedy(disease_name)
        severity = get_severity_level(confidence_pct, disease_name)
        
        predictions.append({
            "disease": disease_name,
            "confidence": round(confidence_pct, 2),
            "severity": severity,
            "remedy": remedy if remedy else {
                "name_en": disease_name,
                "name_np": disease_name,
                "symptoms": "No information available",
                "organic_treatment": "Consult agricultural expert",
                "chemical_treatment": "Consult agricultural expert",
                "prevention": "Follow good agricultural practices"
            }
        })

    # Check if primary prediction has low confidence
    low_confidence = predictions[0]["confidence"] < 60.0
    
    # Debug logging
    print(f"🔍 Top prediction: {predictions[0]['disease']} ({predictions[0]['confidence']:.2f}%)")
    
    return JSONResponse({
        "success": True,
        "predictions": predictions,
        "primary_disease": predictions[0]["disease"],
        "confidence": predictions[0]["confidence"],
        "low_confidence": low_confidence,
        "message": "Retake photo with better lighting" if low_confidence else "Diagnosis successful"
    })
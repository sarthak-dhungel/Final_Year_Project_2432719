from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Optional
import math
from datetime import datetime
from database import db

router = APIRouter()

class SoilAnalysisRequest(BaseModel):
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    moisture: float
    temperature: float = 25

class CropRecommendation(BaseModel):
    name: str
    emoji: str
    description: str
    soil_fit: int
    highly_recommended: bool

CROPS_DATABASE = [
    {"name": "Wheat", "emoji": "🌾", "optimal_ph_min": 6.0, "optimal_ph_max": 6.5, "nitrogen_min": 60, "nitrogen_max": 80, "phosphorus_min": 40, "phosphorus_max": 60, "potassium_min": 40, "potassium_max": 60, "moisture_min": 40, "moisture_max": 60, "description": "Perfect pH and NPK levels"},
    {"name": "Rice", "emoji": "🌾", "optimal_ph_min": 5.5, "optimal_ph_max": 6.5, "nitrogen_min": 80, "nitrogen_max": 120, "phosphorus_min": 30, "phosphorus_max": 50, "potassium_min": 30, "potassium_max": 50, "moisture_min": 60, "moisture_max": 80, "description": "Good moisture retention"},
    {"name": "Corn", "emoji": "🌽", "optimal_ph_min": 5.8, "optimal_ph_max": 6.5, "nitrogen_min": 100, "nitrogen_max": 150, "phosphorus_min": 40, "phosphorus_max": 70, "potassium_min": 40, "potassium_max": 70, "moisture_min": 45, "moisture_max": 65, "description": "Adequate nitrogen levels"},
    {"name": "Soybean", "emoji": "🫘", "optimal_ph_min": 6.0, "optimal_ph_max": 6.5, "nitrogen_min": 20, "nitrogen_max": 40, "phosphorus_min": 30, "phosphorus_max": 60, "potassium_min": 30, "potassium_max": 60, "moisture_min": 40, "moisture_max": 60, "description": "Optimal phosphorus content"},
    {"name": "Cotton", "emoji": "🌿", "optimal_ph_min": 6.5, "optimal_ph_max": 7.5, "nitrogen_min": 60, "nitrogen_max": 100, "phosphorus_min": 30, "phosphorus_max": 60, "potassium_min": 50, "potassium_max": 80, "moisture_min": 40, "moisture_max": 60, "description": "Suitable potassium levels"},
    {"name": "Sugarcane", "emoji": "🎋", "optimal_ph_min": 6.5, "optimal_ph_max": 7.5, "nitrogen_min": 100, "nitrogen_max": 150, "phosphorus_min": 40, "phosphorus_max": 70, "potassium_min": 60, "potassium_max": 100, "moisture_min": 50, "moisture_max": 70, "description": "Good soil structure"},
    {"name": "Potato", "emoji": "🥔", "optimal_ph_min": 5.0, "optimal_ph_max": 6.5, "nitrogen_min": 100, "nitrogen_max": 150, "phosphorus_min": 50, "phosphorus_max": 80, "potassium_min": 100, "potassium_max": 150, "moisture_min": 45, "moisture_max": 65, "description": "High potassium requirement"},
    {"name": "Tomato", "emoji": "🍅", "optimal_ph_min": 6.0, "optimal_ph_max": 6.5, "nitrogen_min": 80, "nitrogen_max": 120, "phosphorus_min": 60, "phosphorus_max": 100, "potassium_min": 80, "potassium_max": 120, "moisture_min": 50, "moisture_max": 70, "description": "Balanced nutrient needs"},
    {"name": "Banana", "emoji": "🍌", "optimal_ph_min": 5.8, "optimal_ph_max": 6.5, "nitrogen_min": 200, "nitrogen_max": 300, "phosphorus_min": 40, "phosphorus_max": 80, "potassium_min": 300, "potassium_max": 500, "moisture_min": 60, "moisture_max": 80, "description": "Very high potassium needs"},
    {"name": "Onion", "emoji": "🧅", "optimal_ph_min": 6.0, "optimal_ph_max": 6.5, "nitrogen_min": 80, "nitrogen_max": 120, "phosphorus_min": 40, "phosphorus_max": 70, "potassium_min": 60, "potassium_max": 100, "moisture_min": 40, "moisture_max": 60, "description": "Moderate nutrient needs"},
]

def calculate_parameter_score(value, min_val, max_val):
    if value < min_val:
        return max(0, 100 - min((min_val - value) * 10, 100))
    elif value > max_val:
        return max(0, 100 - min((value - max_val) * 10, 100))
    else:
        center = (min_val + max_val) / 2
        return max(90, 100 - (abs(value - center) / (max_val - min_val) * 20))

def calculate_soil_fit(soil, crop):
    scores = {
        "ph": calculate_parameter_score(soil.ph, crop["optimal_ph_min"], crop["optimal_ph_max"]),
        "n": calculate_parameter_score(soil.nitrogen, crop["nitrogen_min"], crop["nitrogen_max"]),
        "p": calculate_parameter_score(soil.phosphorus, crop["phosphorus_min"], crop["phosphorus_max"]),
        "k": calculate_parameter_score(soil.potassium, crop["potassium_min"], crop["potassium_max"]),
        "m": calculate_parameter_score(soil.moisture, crop["moisture_min"], crop["moisture_max"]),
    }
    weights = {"ph": 0.25, "n": 0.20, "p": 0.20, "k": 0.20, "m": 0.15}
    return round(sum(scores[k] * weights[k] for k in scores))


@router.post("/analyze")
async def analyze_soil(soil: SoilAnalysisRequest, request: Request) -> Dict:
    if not (0 <= soil.ph <= 14):
        raise HTTPException(status_code=400, detail="pH must be between 0 and 14")
    if not (0 <= soil.nitrogen <= 100):
        raise HTTPException(status_code=400, detail="Nitrogen must be between 0 and 100%")
    if not (0 <= soil.phosphorus <= 100):
        raise HTTPException(status_code=400, detail="Phosphorus must be between 0 and 100%")
    if not (0 <= soil.potassium <= 100):
        raise HTTPException(status_code=400, detail="Potassium must be between 0 and 100%")
    if not (0 <= soil.moisture <= 100):
        raise HTTPException(status_code=400, detail="Moisture must be between 0 and 100%")

    user_id = request.headers.get("X-User-Id", "anonymous")

    await db.soil_readings.insert_one({
        "userId": user_id,
        "moisture": soil.moisture,
        "temperature": soil.temperature,
        "ec": 0,
        "ph": soil.ph,
        "nitrogen": soil.nitrogen,
        "phosphorus": soil.phosphorus,
        "potassium": soil.potassium,
        "timestamp": datetime.utcnow(),
        "source": "manual"
    })

    recommendations = []
    for crop in CROPS_DATABASE:
        soil_fit = calculate_soil_fit(soil, crop)
        recommendations.append({
            "name": crop["name"], "emoji": crop["emoji"],
            "description": crop["description"], "soil_fit": soil_fit,
            "highly_recommended": soil_fit >= 80
        })
    recommendations.sort(key=lambda x: x["soil_fit"], reverse=True)

    insights = []
    if soil.ph < 5.5:
        insights.append({"type": "ph", "title": "pH Balance", "message": f"pH {soil.ph} is acidic. Consider adding lime."})
    elif soil.ph > 7.5:
        insights.append({"type": "ph", "title": "pH Balance", "message": f"pH {soil.ph} is alkaline. Most crops prefer neutral soil."})
    else:
        insights.append({"type": "ph", "title": "pH Balance", "message": f"pH {soil.ph} is ideal for most crops"})

    if soil.moisture < 40:
        insights.append({"type": "moisture", "title": "Moisture Level", "message": f"Moisture {soil.moisture}%. Consider irrigation"})
    elif soil.moisture > 70:
        insights.append({"type": "moisture", "title": "Moisture Level", "message": f"Moisture {soil.moisture}%. Ensure proper drainage"})
    else:
        insights.append({"type": "moisture", "title": "Moisture Level", "message": f"Moisture {soil.moisture}%. Good level"})

    deficient = []
    if soil.nitrogen < 50: deficient.append("nitrogen")
    if soil.phosphorus < 35: deficient.append("phosphorus")
    if soil.potassium < 40: deficient.append("potassium")
    if deficient:
        insights.append({"type": "nutrient", "title": "Nutrient Status", "message": f"Low {', '.join(deficient)}. Consider fertilizers"})
    else:
        insights.append({"type": "nutrient", "title": "Nutrient Status", "message": "NPK levels are adequate"})

    return {
        "recommendations": recommendations[:6],
        "insights": insights,
        "soil_parameters": {"ph": soil.ph, "nitrogen": soil.nitrogen, "phosphorus": soil.phosphorus, "potassium": soil.potassium, "moisture": soil.moisture, "temperature": soil.temperature}
    }


# ============ ARDUINO LIVE READINGS ============

class SoilReadingInput(BaseModel):
    moisture: float = 0
    temperature: float = 0
    ec: float = 0
    ph: float = 0
    nitrogen: float = 0
    phosphorus: float = 0
    potassium: float = 0

@router.post("/reading")
async def save_soil_reading(data: SoilReadingInput, request: Request):
    user_id = request.headers.get("X-User-Id", "anonymous")
    reading = {
        "userId": user_id,
        "moisture": data.moisture,
        "temperature": data.temperature,
        "ec": data.ec,
        "ph": data.ph,
        "nitrogen": data.nitrogen,
        "phosphorus": data.phosphorus,
        "potassium": data.potassium,
        "timestamp": datetime.utcnow()
    }
    result = await db.soil_readings.insert_one(reading)
    return {"message": "Reading saved", "id": str(result.inserted_id)}

@router.get("/latest")
async def get_latest_reading(request: Request):
    user_id = request.query_params.get("userId")
    query = {"userId": user_id} if user_id else {}
    reading = await db.soil_readings.find_one(query, sort=[("timestamp", -1)])
    if not reading:
        return {"message": "No readings yet", "data": None}
    reading["_id"] = str(reading["_id"])
    return {"data": reading}

@router.get("/history")
async def get_reading_history(request: Request, limit: int = 20):
    user_id = request.query_params.get("userId")
    query = {"userId": user_id} if user_id else {}
    cursor = db.soil_readings.find(query).sort("timestamp", -1).limit(limit)
    readings = []
    async for r in cursor:
        r["_id"] = str(r["_id"])
        readings.append(r)
    readings.reverse()
    return {"readings": readings, "count": len(readings)}
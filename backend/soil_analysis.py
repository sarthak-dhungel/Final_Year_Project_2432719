from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
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

class CropRecommendation(BaseModel):
    name: str
    emoji: str
    description: str
    soil_fit: int
    highly_recommended: bool

CROPS_DATABASE = [
    {
        "name": "Wheat",
        "emoji": "🌾",
        "optimal_ph_min": 6.0, "optimal_ph_max": 6.5,
        "nitrogen_min": 60, "nitrogen_max": 80,
        "phosphorus_min": 40, "phosphorus_max": 60,
        "potassium_min": 40, "potassium_max": 60,
        "moisture_min": 40, "moisture_max": 60,
        "description": "Perfect pH and NPK levels"
    },
    {
        "name": "Rice",
        "emoji": "🌾",
        "optimal_ph_min": 5.5, "optimal_ph_max": 6.5,
        "nitrogen_min": 80, "nitrogen_max": 120,
        "phosphorus_min": 30, "phosphorus_max": 50,
        "potassium_min": 30, "potassium_max": 50,
        "moisture_min": 60, "moisture_max": 80,
        "description": "Good moisture retention"
    },
    {
        "name": "Corn",
        "emoji": "🌽",
        "optimal_ph_min": 5.8, "optimal_ph_max": 6.5,
        "nitrogen_min": 100, "nitrogen_max": 150,
        "phosphorus_min": 40, "phosphorus_max": 70,
        "potassium_min": 40, "potassium_max": 70,
        "moisture_min": 45, "moisture_max": 65,
        "description": "Adequate nitrogen levels"
    },
    {
        "name": "Soybean",
        "emoji": "🫘",
        "optimal_ph_min": 6.0, "optimal_ph_max": 6.5,
        "nitrogen_min": 20, "nitrogen_max": 40,
        "phosphorus_min": 30, "phosphorus_max": 60,
        "potassium_min": 30, "potassium_max": 60,
        "moisture_min": 40, "moisture_max": 60,
        "description": "Optimal phosphorus content"
    },
    {
        "name": "Cotton",
        "emoji": "🌿",
        "optimal_ph_min": 6.5, "optimal_ph_max": 7.5,
        "nitrogen_min": 60, "nitrogen_max": 100,
        "phosphorus_min": 30, "phosphorus_max": 60,
        "potassium_min": 50, "potassium_max": 80,
        "moisture_min": 40, "moisture_max": 60,
        "description": "Suitable potassium levels"
    },
    {
        "name": "Sugarcane",
        "emoji": "🎋",
        "optimal_ph_min": 6.5, "optimal_ph_max": 7.5,
        "nitrogen_min": 100, "nitrogen_max": 150,
        "phosphorus_min": 40, "phosphorus_max": 70,
        "potassium_min": 60, "potassium_max": 100,
        "moisture_min": 50, "moisture_max": 70,
        "description": "Good soil structure"
    },
    {
        "name": "Potato",
        "emoji": "🥔",
        "optimal_ph_min": 5.0, "optimal_ph_max": 6.5,
        "nitrogen_min": 100, "nitrogen_max": 150,
        "phosphorus_min": 50, "phosphorus_max": 80,
        "potassium_min": 100, "potassium_max": 150,
        "moisture_min": 45, "moisture_max": 65,
        "description": "High potassium requirement"
    },
    {
        "name": "Tomato",
        "emoji": "🍅",
        "optimal_ph_min": 6.0, "optimal_ph_max": 6.5,
        "nitrogen_min": 80, "nitrogen_max": 120,
        "phosphorus_min": 60, "phosphorus_max": 100,
        "potassium_min": 80, "potassium_max": 120,
        "moisture_min": 50, "moisture_max": 70,
        "description": "Balanced nutrient needs"
    },
    {
        "name": "Banana",
        "emoji": "🍌",
        "optimal_ph_min": 5.8, "optimal_ph_max": 6.5,
        "nitrogen_min": 200, "nitrogen_max": 300,
        "phosphorus_min": 40, "phosphorus_max": 80,
        "potassium_min": 300, "potassium_max": 500,
        "moisture_min": 60, "moisture_max": 80,
        "description": "Very high potassium needs"
    },
    {
        "name": "Onion",
        "emoji": "🧅",
        "optimal_ph_min": 6.0, "optimal_ph_max": 6.5,
        "nitrogen_min": 80, "nitrogen_max": 120,
        "phosphorus_min": 40, "phosphorus_max": 70,
        "potassium_min": 60, "potassium_max": 100,
        "moisture_min": 40, "moisture_max": 60,
        "description": "Moderate nutrient needs"
    },
]

def calculate_parameter_score(value: float, min_val: float, max_val: float) -> float:
    if value < min_val:
        distance = min_val - value
        penalty = min(distance * 10, 100)
        return max(0, 100 - penalty)
    elif value > max_val:
        distance = value - max_val
        penalty = min(distance * 10, 100)
        return max(0, 100 - penalty)
    else:
        center = (min_val + max_val) / 2
        distance_from_center = abs(value - center)
        range_size = max_val - min_val
        score = 100 - (distance_from_center / range_size * 20)
        return max(90, score)

def calculate_soil_fit(soil: SoilAnalysisRequest, crop: Dict) -> float:
    ph_score = calculate_parameter_score(soil.ph, crop["optimal_ph_min"], crop["optimal_ph_max"])
    n_score = calculate_parameter_score(soil.nitrogen, crop["nitrogen_min"], crop["nitrogen_max"])
    p_score = calculate_parameter_score(soil.phosphorus, crop["phosphorus_min"], crop["phosphorus_max"])
    k_score = calculate_parameter_score(soil.potassium, crop["potassium_min"], crop["potassium_max"])
    moisture_score = calculate_parameter_score(soil.moisture, crop["moisture_min"], crop["moisture_max"])

    weights = {"ph": 0.25, "n": 0.20, "p": 0.20, "k": 0.20, "moisture": 0.15}

    total_score = (
        ph_score * weights["ph"] +
        n_score * weights["n"] +
        p_score * weights["p"] +
        k_score * weights["k"] +
        moisture_score * weights["moisture"]
    )

    return round(total_score)

@router.post("/analyze")
async def analyze_soil(soil: SoilAnalysisRequest) -> Dict:
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

    # Save analysis to soil_readings for dashboard
    await db.soil_readings.insert_one({
        "moisture": soil.moisture,
        "temperature": 0,
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
            "name": crop["name"],
            "emoji": crop["emoji"],
            "description": crop["description"],
            "soil_fit": soil_fit,
            "highly_recommended": soil_fit >= 80
        })

    recommendations.sort(key=lambda x: x["soil_fit"], reverse=True)
    top_recommendations = recommendations[:6]

    insights = []

    if soil.ph < 5.5:
        insights.append({"type": "ph", "title": "pH Balance", "message": f"pH {soil.ph} is acidic. Consider adding lime to raise pH for better crop variety."})
    elif soil.ph > 7.5:
        insights.append({"type": "ph", "title": "pH Balance", "message": f"pH {soil.ph} is alkaline. Most crops prefer slightly acidic to neutral soil."})
    else:
        insights.append({"type": "ph", "title": "pH Balance", "message": f"pH {soil.ph} is ideal for most crops"})

    if soil.moisture < 40:
        insights.append({"type": "moisture", "title": "Moisture Level", "message": f"Current moisture is {soil.moisture}%. Consider irrigation"})
    elif soil.moisture > 70:
        insights.append({"type": "moisture", "title": "Moisture Level", "message": f"Moisture level is {soil.moisture}%. Ensure proper drainage"})
    else:
        insights.append({"type": "moisture", "title": "Moisture Level", "message": f"Current moisture is {soil.moisture}%. Good moisture level"})

    npk_balanced = abs(soil.nitrogen - 60) < 20 and abs(soil.phosphorus - 45) < 15 and abs(soil.potassium - 50) < 15
    if npk_balanced:
        insights.append({"type": "nutrient", "title": "Nutrient Status", "message": "NPK levels are balanced. Consider organic compost for sustainability"})
    else:
        deficient = []
        if soil.nitrogen < 50:
            deficient.append("nitrogen")
        if soil.phosphorus < 35:
            deficient.append("phosphorus")
        if soil.potassium < 40:
            deficient.append("potassium")

        if deficient:
            insights.append({"type": "nutrient", "title": "Nutrient Status", "message": f"Low {', '.join(deficient)}. Consider appropriate fertilizers"})
        else:
            insights.append({"type": "nutrient", "title": "Nutrient Status", "message": "NPK levels are adequate"})

    return {
        "recommendations": top_recommendations,
        "insights": insights,
        "soil_parameters": {
            "ph": soil.ph,
            "nitrogen": soil.nitrogen,
            "phosphorus": soil.phosphorus,
            "potassium": soil.potassium,
            "moisture": soil.moisture
        }
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
async def save_soil_reading(data: SoilReadingInput):
    reading = {
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
async def get_latest_reading():
    reading = await db.soil_readings.find_one(sort=[("timestamp", -1)])
    if not reading:
        return {"message": "No readings yet", "data": None}
    reading["_id"] = str(reading["_id"])
    return {"data": reading}

@router.get("/history")
async def get_reading_history(limit: int = 20):
    cursor = db.soil_readings.find().sort("timestamp", -1).limit(limit)
    readings = []
    async for r in cursor:
        r["_id"] = str(r["_id"])
        readings.append(r)
    readings.reverse()
    return {"readings": readings, "count": len(readings)}
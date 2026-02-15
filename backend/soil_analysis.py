from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import math

router = APIRouter()

class SoilAnalysisRequest(BaseModel):
    ph: float
    nitrogen: float  # percentage
    phosphorus: float  # percentage
    potassium: float  # percentage
    moisture: float  # percentage

class CropRecommendation(BaseModel):
    name: str
    emoji: str
    description: str
    soil_fit: int  # percentage
    highly_recommended: bool

# Comprehensive crop database with pH, NPK, and moisture requirements
CROPS_DATABASE = [
    # Major crops from design
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
    # Additional crops
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
    """Calculate how well a value fits within a range (0-100)"""
    if value < min_val:
        # Below minimum - calculate distance penalty
        distance = min_val - value
        penalty = min(distance * 10, 100)  # 10% penalty per unit below
        return max(0, 100 - penalty)
    elif value > max_val:
        # Above maximum - calculate distance penalty
        distance = value - max_val
        penalty = min(distance * 10, 100)
        return max(0, 100 - penalty)
    else:
        # Within range - calculate how close to optimal center
        center = (min_val + max_val) / 2
        distance_from_center = abs(value - center)
        range_size = max_val - min_val
        score = 100 - (distance_from_center / range_size * 20)  # Max 20% penalty
        return max(90, score)  # Minimum 90 if within range

def calculate_soil_fit(soil: SoilAnalysisRequest, crop: Dict) -> float:
    """Calculate overall soil fitness for a crop"""
    ph_score = calculate_parameter_score(
        soil.ph, 
        crop["optimal_ph_min"], 
        crop["optimal_ph_max"]
    )
    
    n_score = calculate_parameter_score(
        soil.nitrogen,
        crop["nitrogen_min"],
        crop["nitrogen_max"]
    )
    
    p_score = calculate_parameter_score(
        soil.phosphorus,
        crop["phosphorus_min"],
        crop["phosphorus_max"]
    )
    
    k_score = calculate_parameter_score(
        soil.potassium,
        crop["potassium_min"],
        crop["potassium_max"]
    )
    
    moisture_score = calculate_parameter_score(
        soil.moisture,
        crop["moisture_min"],
        crop["moisture_max"]
    )
    
    # Weighted average (pH and NPK more important than moisture)
    weights = {
        "ph": 0.25,
        "n": 0.20,
        "p": 0.20,
        "k": 0.20,
        "moisture": 0.15
    }
    
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
    """Analyze soil and return crop recommendations"""
    
    # Validate input ranges
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
    
    # Calculate soil fit for each crop
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
    
    # Sort by soil fit (highest first)
    recommendations.sort(key=lambda x: x["soil_fit"], reverse=True)
    
    # Take top 6 for display
    top_recommendations = recommendations[:6]
    
    # Generate insights
    insights = []
    
    # pH insight
    if soil.ph < 5.5:
        insights.append({
            "type": "ph",
            "title": "pH Balance",
            "message": f"pH {soil.ph} is acidic. Consider adding lime to raise pH for better crop variety."
        })
    elif soil.ph > 7.5:
        insights.append({
            "type": "ph",
            "title": "pH Balance",
            "message": f"pH {soil.ph} is alkaline. Most crops prefer slightly acidic to neutral soil."
        })
    else:
        insights.append({
            "type": "ph",
            "title": "pH Balance",
            "message": f"pH {soil.ph} is ideal for most crops"
        })
    
    # Moisture insight
    if soil.moisture < 40:
        insights.append({
            "type": "moisture",
            "title": "Moisture Level",
            "message": f"Current moisture is {soil.moisture}%. Consider irrigation"
        })
    elif soil.moisture > 70:
        insights.append({
            "type": "moisture",
            "title": "Moisture Level",
            "message": f"Moisture level is {soil.moisture}%. Ensure proper drainage"
        })
    else:
        insights.append({
            "type": "moisture",
            "title": "Moisture Level",
            "message": f"Current moisture is {soil.moisture}%. Good moisture level"
        })
    
    # NPK insight
    npk_balanced = abs(soil.nitrogen - 60) < 20 and abs(soil.phosphorus - 45) < 15 and abs(soil.potassium - 50) < 15
    if npk_balanced:
        insights.append({
            "type": "nutrient",
            "title": "Nutrient Status",
            "message": "NPK levels are balanced. Consider organic compost for sustainability"
        })
    else:
        deficient = []
        if soil.nitrogen < 50:
            deficient.append("nitrogen")
        if soil.phosphorus < 35:
            deficient.append("phosphorus")
        if soil.potassium < 40:
            deficient.append("potassium")
        
        if deficient:
            insights.append({
                "type": "nutrient",
                "title": "Nutrient Status",
                "message": f"Low {', '.join(deficient)}. Consider appropriate fertilizers"
            })
        else:
            insights.append({
                "type": "nutrient",
                "title": "Nutrient Status",
                "message": "NPK levels are adequate"
            })
    
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
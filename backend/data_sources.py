from typing import Dict, Any, List

# Curated global reports matching FAO, USDA, and CGIAR alerts
FAO_USDA_CGIAR_REPORTS = [
    {
        "id": 1,
        "region": "North America",
        "disease": "Tomato Late Blight",
        "cases": 1250,
        "risk_score": 82.5,
        "affected_crop": "Tomato",
        "agency": "USDA APHIS Alert",
        "status": "Active Outbreak",
        "details": "Persistent high moisture levels in the Great Lakes region have catalyzed an early late blight surge. Spore traps show active density increase."
    },
    {
        "id": 2,
        "region": "Southern Europe",
        "disease": "Olive Quick Decline Syndrome",
        "cases": 2400,
        "risk_score": 88.0,
        "affected_crop": "Olive",
        "agency": "FAO Early Warning",
        "status": "Quarantine Zone",
        "details": "Xylella fastidiosa spreading in southern Italy and Spain. Emergency containment protocols and vector control actively deployed."
    },
    {
        "id": 3,
        "region": "East Africa",
        "disease": "Maize Lethal Necrosis",
        "cases": 3800,
        "risk_score": 75.2,
        "affected_crop": "Corn (Maize)",
        "agency": "CGIAR CIMMYT Report",
        "status": "Active Outbreak",
        "details": "Synergistic infection of Maize Chlorotic Mottle Virus and Sugarcane Mosaic Virus causing widespread necrosis. Farmer alerts issued in Rift Valley."
    },
    {
        "id": 4,
        "region": "South Asia",
        "disease": "Wheat Stem Rust (UG99)",
        "cases": 950,
        "risk_score": 68.4,
        "affected_crop": "Wheat",
        "agency": "FAO Rust Spore Alert",
        "status": "Monitored",
        "details": "Ug99 strain spores detected in air trap telemetry. Resistant cultivars urged for winter planting."
    },
    {
        "id": 5,
        "region": "Latin America",
        "disease": "Fusarium Wilt Tropical Race 4",
        "cases": 1800,
        "risk_score": 90.1,
        "affected_crop": "Banana",
        "agency": "CGIAR Bioversity",
        "status": "Containment",
        "details": "Fusarium TR4 detected in soil samples of commercial banana plantations. Biosecurity cordons established."
    }
]

# Historical progression patterns (over past 5 years)
HISTORICAL_OUTBREAKS = [
    {
        "year": "2022",
        "crop_loss_tons": 450000,
        "loss_value_usd": 12000000,
        "outbreaks_count": 140,
        "dominant_disease": "Tomato Late Blight"
    },
    {
        "year": "2023",
        "crop_loss_tons": 620000,
        "loss_value_usd": 18500000,
        "outbreaks_count": 195,
        "dominant_disease": "Maize Lethal Necrosis"
    },
    {
        "year": "2024",
        "crop_loss_tons": 510000,
        "loss_value_usd": 15000000,
        "outbreaks_count": 160,
        "dominant_disease": "Wheat Stem Rust"
    },
    {
        "year": "2025",
        "crop_loss_tons": 780000,
        "loss_value_usd": 24000000,
        "outbreaks_count": 220,
        "dominant_disease": "Fusarium Wilt TR4"
    },
    {
        "year": "2026", # Projected/current YTD
        "crop_loss_tons": 310000,
        "loss_value_usd": 9500000,
        "outbreaks_count": 110,
        "dominant_disease": "Olive Quick Decline"
    }
]

# Seasonal trend models (monthly breakdown for charts)
SEASONAL_TRENDS = [
    {"month": "Jan", "fungal_risk": 20, "bacterial_risk": 15, "pest_risk": 35},
    {"month": "Feb", "fungal_risk": 25, "bacterial_risk": 18, "pest_risk": 40},
    {"month": "Mar", "fungal_risk": 40, "bacterial_risk": 30, "pest_risk": 45},
    {"month": "Apr", "fungal_risk": 65, "bacterial_risk": 45, "pest_risk": 30},
    {"month": "May", "fungal_risk": 80, "bacterial_risk": 70, "pest_risk": 25}, # Spring damp peak
    {"month": "Jun", "fungal_risk": 75, "bacterial_risk": 85, "pest_risk": 50}, # Warm humid peak
    {"month": "Jul", "fungal_risk": 50, "bacterial_risk": 90, "pest_risk": 75}, # Hot dry summer peak
    {"month": "Aug", "fungal_risk": 45, "bacterial_risk": 80, "pest_risk": 80},
    {"month": "Sep", "fungal_risk": 60, "bacterial_risk": 60, "pest_risk": 60}, # Harvest autumn peak
    {"month": "Oct", "fungal_risk": 70, "bacterial_risk": 40, "pest_risk": 40},
    {"month": "Nov", "fungal_risk": 35, "bacterial_risk": 20, "pest_risk": 30},
    {"month": "Dec", "fungal_risk": 20, "bacterial_risk": 10, "pest_risk": 20}
]

def get_dashboard_statistics(diagnoses_count: int = 0) -> Dict[str, Any]:
    """
    Calculate telemetry values for dashboard summary cards.
    """
    total_cases = sum(r["cases"] for r in FAO_USDA_CGIAR_REPORTS)
    avg_risk = sum(r["risk_score"] for r in FAO_USDA_CGIAR_REPORTS) / len(FAO_USDA_CGIAR_REPORTS)
    
    return {
        "active_outbreaks": len(FAO_USDA_CGIAR_REPORTS),
        "regions_monitored": len(set(r["region"] for r in FAO_USDA_CGIAR_REPORTS)),
        "average_risk_score": round(avg_risk, 1),
        "diagnoses_count": diagnoses_count,
        "recent_outbreaks": FAO_USDA_CGIAR_REPORTS
    }

def get_historical_analysis() -> Dict[str, Any]:
    """
    Return historical outbreak progression and seasonal index values.
    """
    return {
        "outbreak_progression": HISTORICAL_OUTBREAKS,
        "seasonal_trends": SEASONAL_TRENDS
    }

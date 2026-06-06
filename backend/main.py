import os
import sys
import shutil

# Resolve path hierarchy so we can import absolute package modules
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
if project_root not in sys.path:
    sys.path.append(project_root)

from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from backend.database import engine, Base, get_db
from backend.models import Analysis, WeatherAdvisory
from backend.schemas import (
    AnalysisResponse, 
    WeatherAdvisoryResponse, 
    WeatherRiskRequest, 
    DashboardStats,
    RegionOutbreak
)
from backend.gemini_client import analyze_crop_image
from backend.weather_client import get_weather_and_risk
from backend.data_sources import get_dashboard_statistics, get_historical_analysis, FAO_USDA_CGIAR_REPORTS

# Initialize database schemas
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database table generation failed or deferred: {str(e)}")

app = FastAPI(
    title="BotanIQ API",
    description="Global Crop Disease Intelligence Platform API",
    version="1.0.0"
)

# CORS configuration to allow local frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount upload directory for serving uploaded crop images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# The root route "/" is now served by the StaticFiles mount at the end of this file.

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_crop(
    file: UploadFile = File(...),
    crop_type_hint: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Endpoint to upload a crop leaf image, run Gemini Vision disease diagnostic,
    and persist results in the PostgreSQL database.
    """
    # Verify file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image.")
    
    # Save the file locally
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{timestamp_str}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image on server: {str(e)}")

    # Read image bytes for Gemini
    try:
        with open(file_path, "rb") as image_file:
            image_bytes = image_file.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read image file: {str(e)}")

    # Call Gemini Vision client (with automatic mockup fallback)
    analysis_result = analyze_crop_image(image_bytes, file.filename, crop_type_hint)

    # Relative path to serve back to UI
    relative_image_path = f"/uploads/{unique_filename}"

    # Persist in Database
    new_analysis = Analysis(
        crop_type=analysis_result.get("crop_type", "Unknown"),
        disease_name=analysis_result.get("disease_name", "Unknown Disease"),
        confidence=analysis_result.get("confidence", 0.0),
        severity_level=analysis_result.get("severity_level", "Low"),
        description=analysis_result.get("description", "No description available."),
        treatment_plan=analysis_result.get("treatment_plan", "No treatment guidelines available."),
        prevention_strategies=analysis_result.get("prevention_strategies", "No prevention guidelines available."),
        image_path=relative_image_path
    )
    
    try:
        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)
    except Exception as e:
        db.rollback()
        # Still return the object for demonstration in case DB has configuration mismatch
        print(f"Database commit failed: {str(e)}")
        # Emulate returned response
        return AnalysisResponse(
            id=999,
            timestamp=datetime.now(),
            crop_type=new_analysis.crop_type,
            disease_name=new_analysis.disease_name,
            confidence=new_analysis.confidence,
            severity_level=new_analysis.severity_level,
            description=new_analysis.description,
            treatment_plan=new_analysis.treatment_plan,
            prevention_strategies=new_analysis.prevention_strategies,
            image_path=new_analysis.image_path
        )

    return new_analysis

@app.get("/api/history", response_model=List[AnalysisResponse])
def get_analysis_history(
    search: Optional[str] = Query(None, description="Search by crop type or disease name"),
    db: Session = Depends(get_db)
):
    """
    Retrieve past analyses from database. Supports query string search.
    """
    try:
        query = db.query(Analysis)
        if search:
            query = query.filter(
                (Analysis.crop_type.ilike(f"%{search}%")) | 
                (Analysis.disease_name.ilike(f"%{search}%"))
            )
        return query.order_by(Analysis.timestamp.desc()).all()
    except Exception as e:
        print(f"Failed to query analysis history: {str(e)}. Returning mock empty set.")
        return []

@app.delete("/api/history/{analysis_id}")
def delete_analysis_record(analysis_id: int, db: Session = Depends(get_db)):
    """
    Remove a diagnostics record from the history database.
    """
    try:
        record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Diagnostics record not found.")
        
        # Optionally remove associated image file
        if record.image_path:
            filename = os.path.basename(record.image_path)
            local_img_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(local_img_path):
                os.remove(local_img_path)
                
        db.delete(record)
        db.commit()
        return {"detail": "Record successfully deleted."}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database deletion failed: {str(e)}")

@app.post("/api/weather/risk", response_model=WeatherAdvisoryResponse)
def calculate_weather_risk(
    payload: WeatherRiskRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate weather metrics and crop risk metrics for early warnings.
    Records advisory calculations inside the database.
    """
    risk_info = get_weather_and_risk(payload.location, payload.crop_type)

    new_advisory = WeatherAdvisory(
        location=risk_info["location"],
        risk_score=risk_info["risk_score"],
        temperature=risk_info["temperature"],
        humidity=risk_info["humidity"],
        wind_speed=risk_info["wind_speed"],
        recommendations=risk_info["advice"]
    )

    try:
        db.add(new_advisory)
        db.commit()
        db.refresh(new_advisory)
    except Exception as e:
        db.rollback()
        print(f"Database write deferred for weather advisory: {str(e)}")
        # Emulate returned response
        return WeatherAdvisoryResponse(
            id=999,
            timestamp=datetime.now(),
            location=new_advisory.location,
            risk_score=new_advisory.risk_score,
            temperature=new_advisory.temperature,
            humidity=new_advisory.humidity,
            wind_speed=new_advisory.wind_speed,
            recommendations=new_advisory.recommendations
        )

    return new_advisory

@app.get("/api/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Retrieve real-time and summary statistics for dashboard metrics.
    """
    try:
        diagnoses_count = db.query(Analysis).count()
    except Exception:
        diagnoses_count = 12 # Mock fallback

    stats = get_dashboard_statistics(diagnoses_count)
    return stats

@app.get("/api/analytics/historical")
def get_historical_charts():
    """
    Retrieve progression lines and seasonal trends for chart components.
    """
    return get_historical_analysis()

@app.get("/api/fao-reports")
def get_fao_reports():
    """
    Fetch the list of FAO, USDA, and CGIAR outbreak warnings.
    """
    return FAO_USDA_CGIAR_REPORTS

# Mount static files for all-Python web UI at the end so it doesn't shadow api paths
static_dir = os.path.join(backend_dir, "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

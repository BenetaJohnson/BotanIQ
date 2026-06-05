from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# Analysis Schemas
class AnalysisBase(BaseModel):
    crop_type: str = Field(..., example="Tomato")
    disease_name: str = Field(..., example="Late Blight")
    confidence: float = Field(..., example=92.5)
    severity_level: str = Field(..., example="High")
    description: str
    treatment_plan: str
    prevention_strategies: str
    image_path: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisResponse(AnalysisBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Weather Advisory Schemas
class WeatherAdvisoryBase(BaseModel):
    location: str = Field(..., example="Midwest Farms, US")
    risk_score: float = Field(..., example=65.2)
    temperature: float = Field(..., example=24.5)
    humidity: float = Field(..., example=82.0)
    wind_speed: float = Field(..., example=12.5)
    recommendations: str

class WeatherAdvisoryCreate(WeatherAdvisoryBase):
    pass

class WeatherAdvisoryResponse(WeatherAdvisoryBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Input schemas for endpoints
class WeatherRiskRequest(BaseModel):
    location: str = Field(..., example="California")
    crop_type: Optional[str] = Field("Tomato", example="Tomato")

# Statistics/Dashboard schemas
class RegionOutbreak(BaseModel):
    region: str
    disease: str
    cases: int
    risk_score: float
    affected_crop: str

class DashboardStats(BaseModel):
    active_outbreaks: int
    regions_monitored: int
    average_risk_score: float
    diagnoses_count: int
    recent_outbreaks: List[RegionOutbreak]

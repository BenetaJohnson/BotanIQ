from sqlalchemy import Column, Integer, String, Float, DateTime, Text, func
from backend.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    crop_type = Column(String(100), nullable=False)
    disease_name = Column(String(200), nullable=False)
    confidence = Column(Float, nullable=False)
    severity_level = Column(String(50), nullable=False)  # "Low", "Medium", "High"
    description = Column(Text, nullable=False)
    treatment_plan = Column(Text, nullable=False)  # Text content or JSON serialized
    prevention_strategies = Column(Text, nullable=False)  # Text content or JSON serialized
    image_path = Column(String(500), nullable=True)

class WeatherAdvisory(Base):
    __tablename__ = "weather_advisories"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    location = Column(String(250), nullable=False)
    risk_score = Column(Float, nullable=False)  # 0 to 100 scale
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    recommendations = Column(Text, nullable=False)

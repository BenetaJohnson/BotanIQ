import os
import sys
import pytest

# Resolve path hierarchy so we can run tests from inside backend directory or root
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
if project_root not in sys.path:
    sys.path.append(project_root)
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup test database (SQLite in-memory)
from backend.database import Base, get_db
from backend.main import app

SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency to use test database
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Generate tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
    assert "BotanIQ" in response.json()["platform"]

def test_get_stats():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "active_outbreaks" in data
    assert "regions_monitored" in data
    assert "average_risk_score" in data

def test_calculate_weather_risk():
    payload = {
        "location": "California",
        "crop_type": "Tomato"
      }
    response = client.post("/api/weather/risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "location" in data
    assert "risk_score" in data
    assert "temperature" in data
    assert "humidity" in data

def test_get_historical_analytics():
    response = client.get("/api/analytics/historical")
    assert response.status_code == 200
    data = response.json()
    assert "outbreak_progression" in data
    assert "seasonal_trends" in data

def test_get_fao_reports():
    response = client.get("/api/fao-reports")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "region" in data[0]
    assert "disease" in data[0]

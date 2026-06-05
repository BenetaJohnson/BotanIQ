# BotanIQ: REST API Documentation

This document describes the endpoints exposed by the BotanIQ FastAPI backend (`http://localhost:8000`).

---

## 1. Diagnostics API

### `POST /api/analyze`
Upload a leaf crop photograph to identify disease characteristics using Gemini Vision.

- **Request Format**: `multipart/form-data`
- **Request Body**:
  - `file`: Binary leaf image file (JPEG, PNG).
  - `crop_type_hint` (Optional): String hint (e.g. `Tomato`).
- **Response Format**: `application/json`
- **Sample Response**:
  ```json
  {
    "id": 1,
    "timestamp": "2026-06-05T08:15:30.450Z",
    "crop_type": "Tomato",
    "disease_name": "Tomato Late Blight",
    "confidence": 94.5,
    "severity_level": "High",
    "description": "Late blight is caused by the oomycete Phytophthora infestans. It affects leaves, stems, and fruits, causing rapid cell decay...",
    "treatment_plan": "Chemical Control: Apply protective copper-based fungicides. Biological Control: Introduce Bacillus subtilis sprays...",
    "prevention_strategies": "Plant certified disease-resistant tomato varieties. Keep a strict 3-year crop rotation schedule...",
    "image_path": "/uploads/20260605_134600_leaf.jpg"
  }
  ```

### `GET /api/history`
Retrieve the complete database log of diagnostics records.

- **Query Parameters**:
  - `search` (Optional): String query filtering results by crop or disease.
- **Response Format**: `application/json`
- **Sample Response**:
  ```json
  [
    {
      "id": 1,
      "timestamp": "2026-06-05T08:15:30.450Z",
      "crop_type": "Tomato",
      "disease_name": "Tomato Late Blight",
      "confidence": 94.5,
      "severity_level": "High",
      "description": "...",
      "treatment_plan": "...",
      "prevention_strategies": "...",
      "image_path": "/uploads/20260605_134600_leaf.jpg"
    }
  ]
  ```

### `DELETE /api/history/{id}`
Remove a diagnostic report record and delete the uploaded image file.

- **Path Parameters**:
  - `id`: Integer database primary key.
- **Response Format**: `application/json`
- **Sample Response**:
  ```json
  {
    "detail": "Record successfully deleted."
  }
  ```

---

## 2. Weather Advisory API

### `POST /api/weather/risk`
Calculate fungal, bacterial, and pest exposure risk indices based on localized weather telemetry.

- **Request Format**: `application/json`
- **Request Body**:
  ```json
  {
    "location": "Florida",
    "crop_type": "Tomato"
  }
  ```
- **Response Format**: `application/json`
- **Sample Response**:
  ```json
  {
    "id": 1,
    "timestamp": "2026-06-05T08:15:40.120Z",
    "location": "Florida Citrus Station, US",
    "temperature": 31.0,
    "humidity": 90.0,
    "wind_speed": 18.2,
    "risk_score": 88.5,
    "risk_level": "High",
    "recommendations": "CRITICAL ALERT: Environmental conditions are extremely favorable for fungal outbreaks. Implement protective treatments immediately..."
  }
  ```

---

## 3. Telemetry & Stats API

### `GET /api/stats`
Retrieve global stats and lists of active USDA/FAO threat warnings.

- **Response Format**: `application/json`
- **Sample Response**:
  ```json
  {
    "active_outbreaks": 5,
    "regions_monitored": 5,
    "average_risk_score": 80.8,
    "diagnoses_count": 1,
    "recent_outbreaks": [
      {
        "id": 1,
        "region": "North America",
        "disease": "Tomato Late Blight",
        "cases": 1250,
        "risk_score": 82.5,
        "affected_crop": "Tomato",
        "agency": "USDA APHIS Alert",
        "status": "Active Outbreak",
        "details": "..."
      }
    ]
  }
  ```

### `GET /api/analytics/historical`
Retrieve progression curves and monthly risk indexes for historical chart rendering.

- **Response Format**: `application/json`
- **Sample Response**:
  ```json
  {
    "outbreak_progression": [
      {
        "year": "2025",
        "crop_loss_tons": 780000,
        "loss_value_usd": 24000000,
        "outbreaks_count": 220,
        "dominant_disease": "Fusarium Wilt TR4"
      }
    ],
    "seasonal_trends": [
      {
        "month": "May",
        "fungal_risk": 80,
        "bacterial_risk": 70,
        "pest_risk": 25
      }
    ]
  }
  ```

# BotanIQ: System Architecture & Database Schema

This document details the system design, communication pipelines, and database relations for the BotanIQ Crop Disease Intelligence Platform.

---

## 1. System Architecture Diagram

The BotanIQ platform uses a decoupled Client-Server architecture. The Next.js frontend handles visualizations and user interactions, while the FastAPI backend handles calculations, database persistence, and external service calls.

```mermaid
graph TD
    %% Client Layer
    subgraph Client ["Client Layer (Next.js + Tailwind)"]
        UI["Web Dashboard UI"]
        Uploader["Canopy Image Uploader"]
        Advisory["Farm Climate Matrix Form"]
        Telemetry["Historical Trend Charts"]
    end

    %% Service Layer
    subgraph Services ["Service Layer (FastAPI Router)"]
        API["FastAPI Controller (/api/*)"]
        Gemini["Gemini client wrapper"]
        Weather["Weather risk calculator"]
        DataSync["FAO/USDA/CGIAR records compiler"]
    end

    %% Storage Layer
    subgraph Data ["Storage Layer"]
        DB[(PostgreSQL Database)]
        Storage["Foliar Uploads Directory"]
    end

    %% External APIs
    subgraph Cloud ["External Intelligence APIs"]
        GeminiVision["Google Gemini Vision API"]
        OpenWeather["OpenWeather Map API"]
    end

    %% Communication Flows
    UI -->|JSON requests| API
    Uploader -->|Multi-part image uploads| API
    Advisory -->|Compute local weather risk| API
    Telemetry -->|Query historical arrays| API

    API -->|Read/Write records| DB
    API -->|Write uploaded images| Storage

    Gemini -->|Analyze canopy photo bytes| GeminiVision
    Weather -->|Fetch micro-climate parameters| OpenWeather

    API --> Gemini
    API --> Weather
    API --> DataSync
```

---

## 2. Database Schema ERD

BotanIQ uses a relational database schema structured in PostgreSQL to store diagnostics history and weather logs.

```mermaid
erDiagram
    ANALYSES {
        int id PK "Serial, autoincrement"
        timestamp timestamp "DateTime with timezone"
        string crop_type "Crop classification hint (e.g. Tomato)"
        string disease_name "Identified pathogen disease or Healthy"
        float confidence "Model confidence percentage (0-100)"
        string severity_level "Outbreak severity (Low, Medium, High)"
        text description "Medical details of pathogen"
        text treatment_plan "Chemical, Biological, and Cultural control details"
        text prevention_strategies "Tailored field preventive guides"
        string image_path "Local static file server path to saved photo"
    }

    WEATHER_ADVISORIES {
        int id PK "Serial, autoincrement"
        timestamp timestamp "DateTime with timezone"
        string location "Geographic zone or station name"
        float risk_score "Computed vulnerability (0-100)"
        float temperature "Station temperature (C)"
        float humidity "Station relative humidity (%)"
        float wind_speed "Station wind velocity (km/h)"
        text recommendations "Meteorological preventative actions"
    }
```

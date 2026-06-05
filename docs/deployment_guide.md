# BotanIQ: Deployment Guide

This guide describes how to run and deploy the BotanIQ Crop Disease Intelligence Platform locally or in containerized environments.

---

## Prerequisites
- **Python**: v3.10 or higher
- **Node.js**: v18 or higher (LTS v22/v24 recommended)
- **Docker & Docker Compose** (Optional, for containerized deployments)

---

## 1. Quick Start: Local Run Configuration

### A. Environment Configuration
Create a `.env` file in the project root containing your API keys:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

### B. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   venv\Scripts\activate
   # Or for Linux/macOS: source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will boot at `http://localhost:8000`.

### C. Frontend Setup
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The client dashboard will boot at `http://localhost:3000`.

---

## 2. Docker Compose Deployment (Recommended for Production)

Docker Compose boots the Next.js app, FastAPI app, and a dedicated PostgreSQL database container in a unified internal network.

### A. Run commands
From the project root directory, run:
```bash
# Build and start all services in detached background mode
docker-compose up --build -d
```

### B. Access URLs
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend Swagger APIs**: `http://localhost:8000/docs`
- **PostgreSQL Database Port**: `localhost:5432` (User: `postgres`, Password: `postgres`, Database: `botaniq`)

### C. Shutdown
```bash
# Stop and destroy container network
docker-compose down -v
```
The `-v` flag deletes the temporary PostgreSQL volumes. Omit it if you want to persist the diagnostics records history.

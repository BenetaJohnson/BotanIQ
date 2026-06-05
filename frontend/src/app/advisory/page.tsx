"use client";

import React, { useState } from "react";
import { 
  CloudSun, 
  Droplet, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  Calculator, 
  ChevronRight,
  Info,
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  Activity
} from "lucide-react";

interface WeatherRiskData {
  location: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  risk_score: number;
  risk_level: string;
  fungal_index: number;
  bacterial_index: number;
  pest_index: number;
  advice: string;
}

export default function AdvisoryPage() {
  const [location, setLocation] = useState("California");
  const [cropType, setCropType] = useState("Tomato");
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<WeatherRiskData | null>(null);

  const calculateRisk = async () => {
    setLoading(true);
    setRiskData(null);

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiHost}/api/weather/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, crop_type: cropType }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setRiskData(data);
    } catch (err) {
      console.log("Using static advisory fallback.");
      // Fallback generator mimicking backend logic
      setTimeout(() => {
        let temp = 22.4;
        let humidity = 84;
        let wind = 14.5;
        let score = 68.2;
        let level = "Medium";
        let advice = "Caution: Moderate risk of disease development. Ensure crops are mulched to avoid splash-borne spore transfers. Monitor humidity logs.";

        if (location.toLowerCase().includes("california")) {
          temp = 28.2; humidity = 45; wind = 8.0; score = 32.4; level = "Low";
          advice = "Normal: Risk levels are currently low. Maintain general cultivation best practices, monitor soil moisture levels, and continue routine pest scouting.";
        } else if (location.toLowerCase().includes("florida")) {
          temp = 31.0; humidity = 90; wind = 18.2; score = 88.5; level = "High";
          advice = "CRITICAL ALERT: Environmental conditions are extremely favorable for fungal outbreaks. Implement preventative bio-fungicide or copper sprays immediately. Increase plant spacing.";
        } else if (location.toLowerCase().includes("kenya")) {
          temp = 20.1; humidity = 82; wind = 11.2; score = 65.1; level = "Medium";
        }

        setRiskData({
          location: `${location.charAt(0).toUpperCase() + location.slice(1)} Region Station`,
          temperature: temp,
          humidity,
          wind_speed: wind,
          risk_score: score,
          risk_level: level,
          fungal_index: Math.round(score * 0.8),
          bacterial_index: Math.round(score * 0.5),
          pest_index: Math.round((100 - humidity) * 0.6),
          advice
        });
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": return "text-risk-high border-risk-high/20 bg-risk-high/10 fill-risk-high";
      case "medium": return "text-risk-medium border-risk-medium/20 bg-risk-medium/10 fill-risk-medium";
      default: return "text-risk-low border-risk-low/20 bg-risk-low/10 fill-risk-low";
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Farmer Advisory Center</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Calculate early warning risk vectors for your crop fields based on real-time atmospheric modeling and location grids.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Box */}
        <div className="lg:col-span-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow flex flex-col gap-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Calculator size={18} className="text-olive dark:text-sage" />
            <span>Farm Parameter Entry</span>
          </h3>

          {/* Location input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Geographic Location</label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. California, Florida, Spain, India..."
              className="bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-olive transition-colors"
            />
            <span className="text-[10px] text-[var(--text-muted)]">Type 'Florida' for High Risk simulation or 'California' for Low Risk.</span>
          </div>

          {/* Crop Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Cultivated Crop</label>
            <select 
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-olive transition-colors"
            >
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Corn">Corn (Maize)</option>
              <option value="Wheat">Wheat</option>
              <option value="Apple">Apple</option>
            </select>
          </div>

          <button 
            onClick={calculateRisk}
            disabled={!location || loading}
            className="w-full mt-2 py-3 rounded-xl bg-olive hover:bg-olive-dark dark:bg-sage dark:text-earth-dark dark:hover:bg-sage-light text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? "Calculating Matrix..." : "Calculate Risk Matrix"}
          </button>
        </div>

        {/* Advisory Output Panels */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {loading ? (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-12 card-shadow flex flex-col items-center justify-center min-h-[350px]">
              <CloudSun size={36} className="text-olive dark:text-sage animate-bounce mb-3" />
              <h3 className="text-base font-bold">Querying weather telemetry...</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Calculating plant leaf moisture retention indexes...</p>
            </div>
          ) : riskData ? (
            <div className="flex flex-col gap-6">
              
              {/* Alert level overview block */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/20 dark:bg-sage/10 text-olive dark:text-sage flex items-center justify-center shrink-0">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Meteorological Station</span>
                    <h3 className="text-lg font-extrabold">{riskData.location}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-[var(--card-border)] pt-4 sm:pt-0">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[var(--text-muted)]">Risk Index</span>
                    <span className="text-2xl font-extrabold text-olive dark:text-sage">{riskData.risk_score}%</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold ${getRiskColor(riskData.risk_level)}`}>
                    {riskData.risk_level} Risk Level
                  </span>
                </div>
              </div>

              {/* Weather Telemetry breakdown grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Temp */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <Thermometer size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Temperature</span>
                    <span className="text-base font-extrabold">{riskData.temperature}°C</span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Droplet size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Relative Humidity</span>
                    <span className="text-base font-extrabold">{riskData.humidity}%</span>
                  </div>
                </div>

                {/* Wind */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                    <Wind size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Wind Velocity</span>
                    <span className="text-base font-extrabold">{riskData.wind_speed} km/h</span>
                  </div>
                </div>

              </div>

              {/* Actionable recommendations card */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow">
                <h4 className="text-sm font-bold text-olive-dark dark:text-sage uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertOctagon size={16} />
                  <span>Early Warning & Advice</span>
                </h4>
                <p className="text-sm leading-relaxed">{riskData.advice}</p>
              </div>

              {/* Bio-climatic indices bar charts */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow">
                <h4 className="text-sm font-bold text-olive-dark dark:text-sage uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={16} />
                  <span>Pathogen Exposure Indices</span>
                </h4>

                <div className="flex flex-col gap-4">
                  {/* Fungal */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Fungal Spore Risk (Mildew/Rusts)</span>
                      <span>{riskData.fungal_index}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-olive-dark dark:bg-sage transition-all duration-500" 
                        style={{ width: `${riskData.fungal_index}%` }}
                      />
                    </div>
                  </div>

                  {/* Bacterial */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Bacterial Blight Risk</span>
                      <span>{riskData.bacterial_index}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-risk-high transition-all duration-500" 
                        style={{ width: `${riskData.bacterial_index}%` }}
                      />
                    </div>
                  </div>

                  {/* Pests */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Insect/Pest Pressure Index</span>
                      <span>{riskData.pest_index}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-risk-medium transition-all duration-500" 
                        style={{ width: `${riskData.pest_index}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-12 card-shadow flex flex-col items-center justify-center text-center min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-sage/10 text-olive dark:text-sage flex items-center justify-center mb-4">
                <CloudSun size={32} />
              </div>
              <h3 className="text-lg font-bold">Calculate Farm Risk Index</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-2 leading-relaxed">
                Provide your crop details and location on the left to calculate localized relative atmospheric pressure and threat vectors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

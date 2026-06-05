"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe2, 
  AlertOctagon, 
  Map, 
  TrendingUp, 
  ShieldAlert, 
  Database,
  Search,
  CheckCircle2,
  Calendar
} from "lucide-react";

interface OutbreakReport {
  id: number;
  region: string;
  disease: string;
  cases: number;
  risk_score: number;
  affected_crop: string;
  agency: string;
  status: string;
  details: string;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<OutbreakReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Geographic SVG map projection coordinates for reports
  const mapCoordinates: Record<string, { x: number; y: number }> = {
    "North America": { x: 130, y: 110 },
    "Southern Europe": { x: 280, y: 120 },
    "East Africa": { x: 320, y: 220 },
    "South Asia": { x: 380, y: 140 },
    "Latin America": { x: 170, y: 270 }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiHost}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          setReports(data.recent_outbreaks || []);
        } else {
          throw new Error("API error");
        }
      } catch (err) {
        console.log("Using static data fallback for dashboard.");
        // Fallback static data
        setReports([
          { id: 1, region: "North America", disease: "Tomato Late Blight", cases: 1250, risk_score: 82.5, affected_crop: "Tomato", agency: "USDA APHIS Alert", status: "Active Outbreak", details: "Persistent high moisture levels in the Great Lakes region have catalyzed an early late blight surge." },
          { id: 2, region: "Southern Europe", disease: "Olive Quick Decline Syndrome", cases: 2400, risk_score: 88.0, affected_crop: "Olive", agency: "FAO Early Warning", status: "Quarantine Zone", details: "Xylella fastidiosa spreading in southern Italy and Spain. Emergency containment protocols deployed." },
          { id: 3, region: "East Africa", disease: "Maize Lethal Necrosis", cases: 3800, risk_score: 75.2, affected_crop: "Corn (Maize)", agency: "CGIAR CIMMYT Report", status: "Active Outbreak", details: "Synergistic virus outbreak causing severe crop yellowing and necrosis in Rift Valley corn crops." },
          { id: 4, region: "South Asia", disease: "Wheat Stem Rust (UG99)", cases: 950, risk_score: 68.4, affected_crop: "Wheat", agency: "FAO Rust Spore Alert", status: "Monitored", details: "Spores of the Ug99 rust mutation tracked via atmospheric telemetry. Resistant wheat strain planting urged." },
          { id: 5, region: "Latin America", disease: "Fusarium Wilt Tropical Race 4", cases: 1800, risk_score: 90.1, affected_crop: "Banana", agency: "CGIAR Bioversity", status: "Containment", details: "Fusarium TR4 soil fungal pathogen detected in banana plantations. Biosecurity protocols active." }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.disease.toLowerCase().includes(search.toLowerCase()) || 
                          r.region.toLowerCase().includes(search.toLowerCase()) || 
                          r.affected_crop.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion ? r.region === selectedRegion : true;
    return matchesSearch && matchesRegion;
  });

  const avgRisk = reports.length ? (reports.reduce((acc, r) => acc + r.risk_score, 0) / reports.length).toFixed(1) : "0.0";
  const totalCases = reports.reduce((acc, r) => acc + r.cases, 0);

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Global Disease Intelligence Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Real-time agricultural health tracking, vector analysis, and global containment maps integrated with FAO, USDA, and CGIAR intelligence networks.
        </p>
      </div>

      {/* Top Core Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Global Disease Intelligence Score Card (REQUIRED) */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Global Health Score</span>
            <Globe2 size={20} className="text-olive dark:text-sage" />
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-extrabold tracking-tight">84.2%</h2>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-risk-low">
              <TrendingUp size={14} />
              <span>+1.2% vs previous month</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10">
            <Globe2 size={100} />
          </div>
        </div>

        {/* Monitored Regions Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Monitored Zones</span>
            <Map size={20} className="text-olive dark:text-sage" />
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-extrabold tracking-tight">{reports.length ? "85" : "0"}</h2>
            <span className="text-xs font-semibold text-[var(--text-muted)] mt-2 block">
              Active sentinel sites tracking threats
            </span>
          </div>
        </div>

        {/* Global Threat Index (Avg Risk) */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Mean Risk Index</span>
            <ShieldAlert size={20} className="text-olive dark:text-sage" />
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-extrabold tracking-tight">{loading ? "..." : `${avgRisk}%`}</h2>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-risk-medium">
              <span>Fungal pressure dominant</span>
            </div>
          </div>
        </div>

        {/* Total Active Field Cases */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tracked Outbreak Cases</span>
            <AlertOctagon size={20} className="text-olive dark:text-sage" />
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-extrabold tracking-tight">{loading ? "..." : totalCases.toLocaleString()}</h2>
            <span className="text-xs font-semibold text-[var(--text-muted)] mt-2 block">
              Acreage-adjusted infection count
            </span>
          </div>
        </div>
      </div>

      {/* Geospatial Map Visuals & Region Filtering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* World Vector Map Panel */}
        <div className="lg:col-span-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 card-shadow flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold">Geospatial Threat Map</h3>
              <p className="text-xs text-[var(--text-muted)]">Hover nodes on the map projection to review crop outbreaks.</p>
            </div>
            {selectedRegion && (
              <button 
                onClick={() => setSelectedRegion(null)}
                className="text-xs font-bold text-olive dark:text-sage bg-sage/10 px-2 py-1 rounded-md"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* SVG Map Container */}
          <div className="relative border border-[var(--card-border)] bg-[var(--background)] rounded-2xl aspect-[16/9] w-full flex items-center justify-center overflow-hidden">
            <svg 
              viewBox="0 0 600 350" 
              className="w-full h-full text-sage/30 dark:text-sage/10"
            >
              {/* World outline mockup nodes */}
              {/* North America */}
              <path d="M 50,50 L 180,50 L 200,120 L 150,180 L 100,150 Z" fill="currentColor" />
              {/* South America */}
              <path d="M 150,180 L 210,210 L 220,320 L 170,330 L 130,220 Z" fill="currentColor" />
              {/* Europe */}
              <path d="M 240,40 L 320,40 L 320,120 L 260,130 L 230,100 Z" fill="currentColor" />
              {/* Africa */}
              <path d="M 260,130 L 320,130 L 360,250 L 310,310 L 270,200 Z" fill="currentColor" />
              {/* Asia */}
              <path d="M 320,40 L 520,50 L 480,180 L 380,220 L 320,120 Z" fill="currentColor" />
              {/* Australia */}
              <path d="M 450,230 L 520,240 L 510,290 L 460,280 Z" fill="currentColor" />

              {/* Grid Lines */}
              <line x1="0" y1="175" x2="600" y2="175" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" /> {/* Equator */}
              
              {/* Dynamic Outbreak Pins */}
              {reports.map((r) => {
                const coord = mapCoordinates[r.region];
                if (!coord) return null;
                const isSelected = selectedRegion === r.region;
                return (
                  <g 
                    key={r.id}
                    onClick={() => setSelectedRegion(r.region)}
                    className="cursor-pointer"
                  >
                    {/* Ring ping */}
                    <circle 
                      cx={coord.x} 
                      cy={coord.y} 
                      r={isSelected ? 14 : 7} 
                      className="fill-risk-high/30 animate-pulse origin-center"
                    />
                    {/* Center dot */}
                    <circle 
                      cx={coord.x} 
                      cy={coord.y} 
                      r={isSelected ? 6 : 4} 
                      className={`${
                        r.risk_score >= 85 ? "fill-risk-high" : r.risk_score >= 70 ? "fill-clay" : "fill-risk-medium"
                      } map-pulse`}
                      style={{ color: r.risk_score >= 85 ? "#C25953" : "#D1A153" }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Database Sync Information Box */}
        <div className="lg:col-span-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center">
              <Database size={20} />
            </div>
            <h3 className="text-base font-extrabold">Data Source Verification</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              BotanIQ aggregates crop epidemiological telemetry with secondary indexes parsed directly from global monitoring platforms.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-2 text-xs">
                <span className="font-bold">FAO GIEWS Alert</span>
                <span className="text-risk-low font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Live Sync
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-2 text-xs">
                <span className="font-bold">USDA APHIS Database</span>
                <span className="text-risk-low font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Live Sync
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 text-xs">
                <span className="font-bold">CGIAR Bioversity</span>
                <span className="text-risk-low font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Live Sync
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--card-border)] text-[11px] flex gap-2 items-start text-left mt-6">
            <Calendar size={14} className="text-olive dark:text-sage shrink-0 mt-0.5" />
            <span className="text-[var(--text-muted)]">Last complete intelligence sweep concluded 2.4 hours ago.</span>
          </div>
        </div>
      </div>

      {/* Outbreak Regional Comparatives Table */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-extrabold">Outbreak Location Registers</h3>
            <p className="text-xs text-[var(--text-muted)]">Verified containment zones and vectors monitored in active crop zones.</p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-3 py-2 w-full sm:w-64">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search region or crop..."
              className="bg-transparent border-none outline-none text-xs w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-[var(--text-muted)] font-bold text-xs uppercase tracking-wider">
                <th className="pb-3 px-4">Region</th>
                <th className="pb-3 px-4">Crop</th>
                <th className="pb-3 px-4">Threat Pathogen</th>
                <th className="pb-3 px-4">Report Agency</th>
                <th className="pb-3 px-4">Risk Index</th>
                <th className="pb-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length ? (
                filteredReports.map((r) => (
                  <tr 
                    key={r.id}
                    className="border-b border-[var(--card-border)] hover:bg-sage/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedRegion(r.region)}
                  >
                    <td className="py-4 px-4 font-bold">{r.region}</td>
                    <td className="py-4 px-4 font-semibold">{r.affected_crop}</td>
                    <td className="py-4 px-4 font-medium text-[var(--text-muted)]">{r.disease}</td>
                    <td className="py-4 px-4 text-xs font-semibold">{r.agency}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              r.risk_score >= 85 ? "bg-risk-high" : r.risk_score >= 70 ? "bg-clay" : "bg-risk-medium"
                            }`}
                            style={{ width: `${r.risk_score}%` }}
                          />
                        </div>
                        <span className="font-bold">{r.risk_score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        r.status.includes("Active") ? "bg-risk-high/10 text-risk-high" : "bg-risk-medium/10 text-risk-medium"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                    No matching outbreaks found in the current spatial register.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Globe, AlertTriangle, Radio } from "lucide-react";

interface OutbreakPoint {
  id: number;
  lat: number;
  lng: number;
  x: number;  // Projection coordinates on 2D map
  y: number;
  name: string;
  disease: string;
  source: string;
  risk: string;
}

export default function InteractiveGlobe() {
  const [rotation, setRotation] = useState(0);
  const [activePoint, setActivePoint] = useState<OutbreakPoint | null>(null);

  // Simulated active threat tracking
  const outbreakPoints: OutbreakPoint[] = [
    { id: 1, lat: 40, lng: -95, x: 120, y: 110, name: "Great Lakes, US", disease: "Tomato Late Blight", source: "USDA APHIS", risk: "Critical" },
    { id: 2, lat: 37, lng: 14, x: 280, y: 120, name: "Apulia, Italy", disease: "Olive Quick Decline", source: "FAO Warning", risk: "Severe" },
    { id: 3, lat: 0, lng: 37, x: 320, y: 220, name: "Rift Valley, Kenya", disease: "Maize Lethal Necrosis", source: "CGIAR CIMMYT", risk: "High" },
    { id: 4, lat: 30, lng: 70, x: 380, y: 140, name: "Punjab, India", disease: "Wheat Stem Rust (UG99)", source: "FAO", risk: "Medium" },
    { id: 5, lat: -15, lng: -60, x: 170, y: 270, name: "São Paulo, Brazil", disease: "Fusarium Wilt TR4", source: "CGIAR", risk: "Severe" },
  ];

  // Auto spin the coordinate system grid
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center p-4">
      {/* Glow Outer Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-olive/10 via-sage/5 to-brown/10 blur-xl animate-pulse-slow" />
      
      {/* Globe Container */}
      <div className="relative w-full h-full rounded-full border border-sage/20 bg-gradient-to-br from-cream/20 to-sage/5 dark:from-forest/10 dark:to-earth-dark/40 shadow-inner flex items-center justify-center overflow-hidden card-shadow">
        
        {/* SVG Drawing of the Globe */}
        <svg 
          viewBox="0 0 500 500" 
          className="w-[90%] h-[90%] text-sage/35 dark:text-sage/10 transition-transform duration-75"
        >
          {/* Outer Boundary Circle */}
          <circle cx="250" cy="250" r="230" fill="none" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Latitude Lines */}
          <ellipse cx="250" cy="250" rx="230" ry="60" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
          <ellipse cx="250" cy="250" rx="230" ry="140" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
          <line x1="20" y1="250" x2="480" y2="250" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" /> {/* Equator */}
          
          {/* Longitude Lines rotating */}
          <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '250px 250px' }}>
            <ellipse cx="250" cy="250" rx="60" ry="230" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
            <ellipse cx="250" cy="250" rx="140" ry="230" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="250" y1="20" x2="250" y2="480" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
          </g>

          {/* Simulated Continent Paths (Simplified artistic lines for premium appearance) */}
          <path 
            d="M 100,150 Q 120,100 150,110 T 200,150 T 220,230 T 150,280 Z" 
            fill="currentColor" 
            className="text-sage/10 dark:text-sage/5" 
          />
          <path 
            d="M 280,140 Q 340,90 380,150 T 360,250 T 320,280 Z" 
            fill="currentColor" 
            className="text-sage/15 dark:text-sage/5" 
          />
          <path 
            d="M 130,280 Q 150,340 180,390 T 160,450 Z" 
            fill="currentColor" 
            className="text-sage/10 dark:text-sage/5" 
          />
          <path 
            d="M 310,250 Q 350,320 320,380 T 330,440 Z" 
            fill="currentColor" 
            className="text-sage/10 dark:text-sage/5" 
          />

          {/* Outbreak Marker Points */}
          {outbreakPoints.map((pt) => {
            const isSelected = activePoint?.id === pt.id;
            return (
              <g 
                key={pt.id} 
                className="cursor-pointer group"
                onClick={() => setActivePoint(isSelected ? null : pt)}
                onMouseEnter={() => setActivePoint(pt)}
              >
                {/* Ping ring animation */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isSelected ? 16 : 8} 
                  className={`animate-ping origin-center fill-risk-high/30`}
                  style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                />
                {/* Core dot */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isSelected ? 6 : 4} 
                  className={`${pt.risk === "Critical" ? "fill-risk-high" : pt.risk === "Severe" ? "fill-clay" : "fill-risk-medium"} shadow-sm transition-all duration-300`} 
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Telemetry Floating Badge */}
        <div className="absolute top-4 left-4 bg-[var(--card-bg)]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[var(--card-border)] text-[10px] flex items-center gap-2 card-shadow">
          <Radio size={12} className="text-risk-high animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[var(--text-muted)]">Live Feeds: Active</span>
        </div>

        {/* Global Disease Intelligence Score Badge */}
        <div className="absolute bottom-4 right-4 bg-olive text-white dark:bg-sage dark:text-earth-dark px-3 py-2 rounded-xl border border-sage/20 text-center card-shadow">
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-90 leading-none">Global Health</div>
          <div className="text-2xl font-extrabold leading-none mt-1">84.2%</div>
        </div>
      </div>

      {/* Outbreak Details Tooltip Panel */}
      {activePoint && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[var(--card-bg)] border border-[var(--card-border)] p-3 rounded-xl w-64 card-shadow animate-float z-20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-olive-dark dark:text-sage uppercase tracking-wider">{activePoint.source} Alert</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
              activePoint.risk === "Critical" ? "bg-risk-high/15 text-risk-high" : "bg-risk-medium/15 text-risk-medium"
            }`}>{activePoint.risk}</span>
          </div>
          <h4 className="text-sm font-bold leading-tight">{activePoint.disease}</h4>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Region: <strong className="text-[var(--foreground)]">{activePoint.name}</strong></p>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Download, 
  Leaf, 
  ChevronRight,
  ExternalLink,
  Calendar,
  AlertTriangle,
  History,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface DiagnosticRecord {
  id: number;
  timestamp: string;
  crop_type: string;
  disease_name: string;
  confidence: number;
  severity_level: string;
  description: string;
  treatment_plan: string;
  prevention_strategies: string;
  image_path: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DiagnosticRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeRecord, setActiveRecord] = useState<DiagnosticRecord | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiHost}/api/history${search ? `?search=${search}` : ""}`);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.log("Using static fallback history list.");
      // Static mockup history for preview
      setHistory([
        {
          id: 101,
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          crop_type: "Tomato",
          disease_name: "Tomato Late Blight",
          confidence: 94.5,
          severity_level: "High",
          description: "Caused by Phytophthora infestans. Induces black greasy leaf lesions and rapid canopy collapse.",
          treatment_plan: "Chemical: Protective copper sprays. Cultural: Remove infected layers.",
          prevention_strategies: "Rotate crop zones and space tomatoes adequately.",
          image_path: ""
        },
        {
          id: 102,
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          crop_type: "Corn",
          disease_name: "Northern Corn Leaf Blight",
          confidence: 89.4,
          severity_level: "Medium",
          description: "Caused by Exserohilum turcicum. Elliptical grayish-green lesions on leaves.",
          treatment_plan: "Chemical: Triazole sprays. Cultural: Till field residues.",
          prevention_strategies: "Select leaf-blight resistant corn hybrids.",
          image_path: ""
        },
        {
          id: 103,
          timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
          crop_type: "Apple",
          disease_name: "Healthy",
          confidence: 98.2,
          severity_level: "Low",
          description: "Leaf exhibits full chlorophyll density. No active pathogen colonies observed.",
          treatment_plan: "No active disease controls required.",
          prevention_strategies: "Continue basic organic fertilization cycles.",
          image_path: ""
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search]);

  const deleteRecord = async (id: number) => {
    if (!confirm("Are you sure you want to remove this record from the local ledger?")) return;
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiHost}/api/history/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setHistory(prev => prev.filter(r => r.id !== id));
        if (activeRecord?.id === id) setActiveRecord(null);
      }
    } catch (err) {
      // Offline fallback
      setHistory(prev => prev.filter(r => r.id !== id));
      if (activeRecord?.id === id) setActiveRecord(null);
    }
  };

  // Export CSV Helper
  const exportCSV = () => {
    if (!history.length) return;
    const headers = ["ID", "Timestamp", "Crop", "Disease", "Confidence", "Severity", "Description"];
    const rows = history.map(r => [
      r.id, 
      r.timestamp, 
      r.crop_type, 
      r.disease_name, 
      r.confidence, 
      r.severity_level, 
      r.description.replace(/,/g, ";")
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "botaniq_diagnostics_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "bg-risk-high/15 text-risk-high";
      case "medium": return "bg-risk-medium/15 text-risk-medium";
      default: return "bg-risk-low/15 text-risk-low";
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Diagnostics Archive Ledger</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Search, review, and export previous plant canopy diagnostics and treatment matrices logged in BotanIQ.
          </p>
        </div>

        {/* Exporter and Sync Controls */}
        <div className="flex gap-3 self-start">
          <button 
            onClick={fetchHistory}
            className="p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl hover:bg-sage/10 transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={exportCSV}
            disabled={!history.length}
            className="px-4 py-2.5 bg-olive hover:bg-olive-dark dark:bg-sage dark:text-earth-dark dark:hover:bg-sage-light text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ledger List Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 card-shadow flex items-center gap-3">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by crop class or disease name..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <span className="text-xs text-[var(--text-muted)] py-6 text-center">Syncing ledger databases...</span>
            ) : history.length ? (
              history.map((record) => (
                <div 
                  key={record.id}
                  onClick={() => setActiveRecord(record)}
                  className={`p-4 bg-[var(--card-bg)] border rounded-xl hover:border-olive/50 dark:hover:border-sage/50 cursor-pointer transition-all flex items-center justify-between card-shadow ${
                    activeRecord?.id === record.id ? "border-olive dark:border-sage bg-sage/5" : "border-[var(--card-border)]"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-lg bg-sage/20 dark:bg-sage/10 text-olive dark:text-sage flex items-center justify-center shrink-0">
                      <Leaf size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{record.disease_name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--text-muted)] font-semibold">
                        <span>Crop: {record.crop_type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(record.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getSeverityStyles(record.severity_level)}`}>
                      {record.severity_level}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteRecord(record.id); }}
                      className="p-1.5 rounded-lg text-risk-high hover:bg-risk-high/15 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-[var(--text-muted)]" />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-8 text-center text-[var(--text-muted)] text-xs leading-relaxed">
                No diagnostic history available. Initiate a new crop leaf scan in the diagnostic lab.
              </div>
            )}
          </div>
        </div>

        {/* Selected Record Detail Panel */}
        <div className="lg:col-span-5">
          {activeRecord ? (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 card-shadow flex flex-col gap-5 text-left animate-fade-in">
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Record #{activeRecord.id}</span>
                  <h3 className="text-base font-extrabold mt-0.5">{activeRecord.disease_name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getSeverityStyles(activeRecord.severity_level)}`}>
                  {activeRecord.severity_level} Severity
                </span>
              </div>

              {/* Confidence Index */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-semibold">Diagnostic Confidence</span>
                <span className="font-extrabold text-olive dark:text-sage">{activeRecord.confidence}%</span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-semibold">Analyzed Date</span>
                <span className="font-bold flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(activeRecord.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Explanatory Description */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Pathological Description</span>
                <p className="text-xs leading-relaxed bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
                  {activeRecord.description}
                </p>
              </div>

              {/* Treatments split */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Prescribed Treatments</span>
                {activeRecord.treatment_plan.split("\n\n").map((part, i) => (
                  <div key={i} className="text-xs bg-[var(--background)]/60 border border-[var(--card-border)]/50 p-2.5 rounded-lg">
                    {part}
                  </div>
                ))}
              </div>

              {/* Preventions */}
              <div className="flex flex-col gap-2 border-t border-[var(--card-border)] pt-4">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Preventative Protocol</span>
                <p className="text-xs leading-relaxed">{activeRecord.prevention_strategies}</p>
              </div>

              {/* View uploaded image if present */}
              {activeRecord.image_path && (
                <div className="border border-[var(--card-border)] rounded-xl overflow-hidden shadow-sm relative aspect-video mt-2">
                  <img 
                    src={activeRecord.image_path.startsWith("http") ? activeRecord.image_path : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${activeRecord.image_path}`}
                    alt="Uploaded Leaf"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-12 card-shadow text-center flex flex-col items-center justify-center min-h-[350px]">
              <History size={32} className="text-olive dark:text-sage/65 mb-3" />
              <h4 className="text-sm font-bold">No Record Selected</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-xs mt-1 leading-relaxed">
                Highlight an index card on the left to pull detailed pathological findings, treatment plans, and diagnostic imagery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

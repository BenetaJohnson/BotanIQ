import React from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  Map, 
  LineChart, 
  ShieldAlert, 
  BookOpen, 
  ArrowRight, 
  Leaf, 
  CheckCircle,
  Database,
  SearchCode
} from "lucide-react";
import InteractiveGlobe from "@/components/InteractiveGlobe";

export default function LandingPage() {
  const stats = [
    { label: "Monitored Regions", value: "85+" },
    { label: "Global Threat Index", value: "84.2%" },
    { label: "Diagnostics Run", value: "48.5K+" },
    { label: "Early Detection Rate", value: "98.4%" }
  ];

  const features = [
    {
      title: "Disease Detection",
      description: "Upload leaf or crop photos to instantly scan for bacterial, fungal, and pest diseases using Gemini 2.5-flash Vision.",
      icon: UploadCloud,
      color: "from-olive to-olive-dark"
    },
    {
      title: "Global Disease Mapping",
      description: "Access regional outbreaks and threat vectors mapped globally from verified USDA, FAO, and CGIAR intelligence channels.",
      icon: Map,
      color: "from-sage to-sage-dark"
    },
    {
      title: "Historical Analytics",
      description: "Identify seasonal disease patterns, regional outbreak spreads, and crop-loss metrics to predict next season's risks.",
      icon: LineChart,
      color: "from-brown to-brown-dark"
    },
    {
      title: "Weather-Based Risk Insights",
      description: "Analyze local micro-climates and calculate custom bio-meteorological fungal and bacterial risk indexes.",
      icon: ShieldAlert,
      color: "from-clay to-risk-high"
    },
    {
      title: "Treatment Recommendations",
      description: "Receive immediate treatment schedules covering chemical, biological, and cultural controls tailored to specific crops.",
      icon: BookOpen,
      color: "from-olive-dark to-forest"
    }
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-4 md:py-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-olive/10 dark:bg-sage/10 text-olive-dark dark:text-sage text-xs font-bold border border-olive/20 dark:border-sage/20">
            <Leaf size={14} className="animate-pulse" />
            <span>Powered by Gemini Vision + FAO/USDA/CGIAR Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            AI-Powered Global <br />
            <span className="bg-gradient-to-r from-olive to-sage-dark bg-clip-text text-transparent dark:from-sage dark:to-beige">
              Crop Disease Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl">
            BotanIQ is the commercial-grade agricultural decision matrix. We empower farmers, researchers, and agribusiness organizations with instant vision diagnostics, global outbreak alerts, and weather-driven crop risk indexing.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link 
              href="/analysis" 
              className="px-6 py-3.5 rounded-xl bg-olive hover:bg-olive-dark text-white dark:bg-sage dark:text-earth-dark dark:hover:bg-sage-light font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span>Analyze Crop Leaf</span>
              <ArrowRight size={16} />
            </Link>
            <Link 
              href="/dashboard" 
              className="px-6 py-3.5 rounded-xl bg-[var(--card-bg)] hover:bg-sage/10 text-[var(--foreground)] border border-[var(--card-border)] font-bold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <span>Explore Outbreak Map</span>
              <Map size={16} />
            </Link>
          </div>

          {/* Quick Credibility Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-semibold text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-olive dark:text-sage" />
              <span>Real-time Gemini Vision</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-olive dark:text-sage" />
              <span>FAO & USDA Integrated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-olive dark:text-sage" />
              <span>Weather-Risk Indexing</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Globe Column */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <InteractiveGlobe />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 card-shadow">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y-2 divide-transparent lg:divide-y-0 lg:divide-x-2 divide-[var(--card-border)]">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 first:border-t-0 lg:first:border-l-0">
              <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-olive to-brown bg-clip-text text-transparent dark:from-sage dark:to-beige">
                {st.value}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)] mt-2 text-center uppercase tracking-wider">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section className="flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Complete Agricultural Control Matrix
          </h2>
          <p className="text-sm md:text-base text-[var(--text-muted)]">
            BotanIQ bundles high-resolution vision modeling with global macro datasets to protect crops from planting to harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="group p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl hover:border-olive/50 dark:hover:border-sage/50 card-shadow transition-all duration-300 flex flex-col text-left gap-4 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white card-shadow group-hover:scale-105 transition-transform`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold group-hover:text-olive dark:group-hover:text-sage transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
          
          {/* Scientific Credibility Card */}
          <div className="p-6 bg-gradient-to-br from-olive/10 to-sage/5 dark:from-forest/20 dark:to-earth-dark/40 border border-sage/20 rounded-2xl flex flex-col text-left gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-olive/20 text-olive-dark dark:text-sage flex items-center justify-center">
                <Database size={20} />
              </div>
              <h3 className="text-lg font-bold">Scientific Database Integration</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Our models cross-reference findings with localized threat advisories and historical progression charts compiled by world-class food security organizations.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-olive-dark dark:text-sage mt-2">
              <span className="px-2 py-1 bg-sage/20 rounded-md border border-sage/35">FAO</span>
              <span className="px-2 py-1 bg-sage/20 rounded-md border border-sage/35">USDA APHIS</span>
              <span className="px-2 py-1 bg-sage/20 rounded-md border border-sage/35">CGIAR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call To Action */}
      <section className="bg-gradient-to-br from-forest to-earth-dark text-white rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
        {/* Background visual highlight */}
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-sage/5 blur-3xl" />
        
        <Leaf size={48} className="text-sage animate-float" />
        <h2 className="text-3xl md:text-4xl font-extrabold max-w-2xl leading-tight">
          Ready to Protect Your Harvest with Advanced Intelligence?
        </h2>
        <p className="text-sm md:text-base text-sage/80 max-w-xl">
          Get started with instant image diagnostics or analyze regional weather indexes for your crop fields now.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-2 z-10">
          <Link 
            href="/analysis" 
            className="px-6 py-3.5 rounded-xl bg-sage hover:bg-sage-light text-earth-dark font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Run AI Diagnostic
          </Link>
          <Link 
            href="/advisory" 
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all hover:-translate-y-0.5"
          >
            Farmer Advisory Center
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/providers";
import { 
  Leaf, 
  LayoutDashboard, 
  UploadCloud, 
  BarChart3, 
  ShieldAlert, 
  History, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Bell,
  Search,
  Globe2,
  HelpCircle
} from "lucide-react";

export default function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Global Intelligence", path: "/dashboard", icon: LayoutDashboard },
    { name: "Disease Analysis", path: "/analysis", icon: UploadCloud },
    { name: "Historical Analytics", path: "/historical", icon: BarChart3 },
    { name: "Farmer Advisory", path: "/advisory", icon: ShieldAlert },
    { name: "Analysis History", path: "/history", icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[var(--card-bg)] border-b border-[var(--card-border)] card-shadow px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-sage/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-olive to-sage flex items-center justify-center text-white card-shadow">
              <Leaf size={22} className="animate-float" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-olive-dark to-brown bg-clip-text text-transparent dark:from-sage dark:to-beige">
              BotanIQ
            </span>
          </Link>
          <span className="hidden lg:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-sage/15 text-olive-dark dark:text-sage border border-sage/20">
            Powered by Gemini Vision + FAO/USDA/CGIAR
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Search Bar (Mock) */}
          <div className="hidden sm:flex items-center gap-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-3 py-1.5 w-60">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search intelligence..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:bg-sage/10 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-risk-high rounded-full border-2 border-[var(--card-bg)] map-pulse text-[0px]">alert</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:bg-sage/10 transition-colors"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="h-8 w-px bg-[var(--card-border)] hidden sm:block" />

          {/* Profile Mockup */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-olive/20 text-olive-dark dark:text-sage font-bold flex items-center justify-center text-sm border border-olive/30">
              AG
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-none">Agri Researcher</span>
              <span className="text-[10px] text-[var(--text-muted)]">Global Station</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Area (Sidebar + Content) */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] p-4 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] px-3">
              Disease Monitoring
            </div>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive 
                        ? "bg-olive text-white shadow-md dark:bg-sage dark:text-earth-dark" 
                        : "hover:bg-sage/10 hover:text-olive-dark dark:hover:text-sage"
                    }`}
                  >
                    <Icon size={18} className={`shrink-0 ${isActive ? "" : "text-[var(--text-muted)] group-hover:text-olive dark:group-hover:text-sage"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--card-border)] text-xs">
            <div className="flex items-center gap-2 text-olive dark:text-sage font-bold mb-1">
              <Globe2 size={14} />
              <span>Intelligence Status</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Global threat alerts are synced with FAO datasets.
            </p>
            <div className="mt-2 text-[10px] text-right font-medium">
              System v1.2.0
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Content */}
            <div className="relative flex flex-col w-64 max-w-sm bg-[var(--card-bg)] h-full p-4 z-10 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-olive flex items-center justify-center text-white">
                    <Leaf size={16} />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight">BotanIQ</span>
                </Link>
                <button 
                  className="p-1 rounded-lg hover:bg-sage/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1.5 flex-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? "bg-olive text-white dark:bg-sage dark:text-earth-dark" 
                          : "hover:bg-sage/10 hover:text-olive-dark dark:hover:text-sage"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--card-border)] text-xs mt-auto">
                <span className="font-bold block mb-1">BotanIQ Mobile App</span>
                <span className="text-[var(--text-muted)]">Scan and analyze crops in offline field mode.</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

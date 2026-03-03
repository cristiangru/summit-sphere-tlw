"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Verificăm dacă există deja un consimțământ salvat
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // 2. Listener pentru redeschiderea bannerului din Footer (sau altundeva)
    const handleOpenBanner = () => setShowBanner(true);
    window.addEventListener("open-cookie-settings", handleOpenBanner);
    return () => window.removeEventListener("open-cookie-settings", handleOpenBanner);
  }, []);

  // Funcție pentru actualizarea Google Consent Mode v2
  const updateGoogleConsent = (status: "granted" | "denied") => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: status,
        analytics_storage: status,
        ad_user_data: status,
        ad_personalization: status,
      });
    }
  };

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    updateGoogleConsent("granted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    updateGoogleConsent("denied");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-6 right-4 sm:right-6 z-[999] animate-in fade-in slide-in-from-bottom-5 duration-700 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 p-4 md:p-2 md:pl-6 rounded-[2rem] md:rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Section: Text & Icon */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row py-2">
            <div className="hidden sm:flex flex-shrink-0 w-10 h-10 bg-slate-900 rounded-full items-center justify-center text-white shadow-lg shadow-slate-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            
            <div className="max-w-2xl">
              <p className="text-slate-700 text-[13px] sm:text-sm leading-relaxed font-medium">
                SummitSphere utilizează cookie-uri pentru optimizarea experienței. 
                <span className="text-slate-500 font-normal ml-1">
                  Vă rugăm să selectați preferințele dumneavoastră privind consimțământul.
                </span>
              </p>
            </div>
          </div>

          {/* Section: Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={declineCookies}
              className="flex-1 md:flex-none px-6 py-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-[13px] sm:text-sm font-bold"
            >
              Refuză
            </button>
            <button 
              onClick={acceptCookies}
              className="flex-1 md:flex-none px-8 py-3 rounded-full bg-slate-900 text-white font-bold text-[13px] sm:text-sm hover:bg-slate-800 transition-all shadow-md active:scale-[0.97]"
            >
              Acceptă Tot
            </button>
            
            {/* Close Icon (Desktop Only) */}
            <button 
              onClick={() => setShowBanner(false)}
              className="hidden lg:flex mx-2 p-2 text-slate-300 hover:text-slate-500 transition-colors"
              aria-label="Închide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
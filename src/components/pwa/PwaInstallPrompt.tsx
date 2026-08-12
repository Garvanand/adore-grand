"use client";

import React, { useState, useEffect } from "react";
import { Car, Smartphone, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Listen for PWA BeforeInstallPrompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user previously dismissed prompt
      const dismissedAt = localStorage.getItem("adorepark_pwa_dismissed");
      if (dismissedAt) {
        const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 3600 * 24);
        if (daysSince < 7) return; // Don't show again for 7 days
      }

      // Show after meaningful interaction (delay 4 seconds or after first click)
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 2. Register Service Worker for PWA capabilities
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("AdorePark Service Worker registered:", reg.scope))
        .catch((err) => console.warn("Service Worker registration warning:", err));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("To add AdorePark shortcut to your home screen: Tap your browser menu (⋮ or share icon) and select 'Add to Home Screen'.");
      setShowPrompt(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted AdorePark PWA installation");
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("adorepark_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="p-4 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">Add AdorePark to your phone</h4>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Quick 1-tap home screen shortcut for Adore Grand parking coordination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstallClick}
            className="whitespace-nowrap font-bold text-xs shadow-md shadow-emerald-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Shortcut
          </Button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

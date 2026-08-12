"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

let globalDeferredPrompt: any = null;

export function triggerPwaInstallPrompt() {
  if (globalDeferredPrompt) {
    globalDeferredPrompt.prompt();
    globalDeferredPrompt.userChoice.then((choice: any) => {
      console.log("User PWA choice:", choice.outcome);
    });
  } else {
    alert(
      "To add AdorePark shortcut to your phone home screen:\n\n1. Tap your browser menu (⋮ on Chrome, or Share icon on Safari)\n2. Select 'Add to Home Screen' / 'Install App'."
    );
  }
}

export function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e;

      const dismissedAt = localStorage.getItem("adorepark_pwa_dismissed");
      if (dismissedAt) {
        const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 3600 * 24);
        if (daysSince < 7) return;
      }

      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("AdorePark SW registered:", reg.scope))
        .catch((err) => console.warn("SW warning:", err));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    triggerPwaInstallPrompt();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("adorepark_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500 text-white shadow-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">Add AdorePark to your phone</h4>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Quick 1-tap home screen shortcut for Adore Grand
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstallClick}
            className="whitespace-nowrap font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Add
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

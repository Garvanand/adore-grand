"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, X, Plus, Share, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

let globalDeferredPrompt: any = null;
let setGlobalShowModal: ((show: boolean) => void) | null = null;

export function openPwaInstallGuide() {
  if (globalDeferredPrompt) {
    globalDeferredPrompt.prompt();
    globalDeferredPrompt.userChoice.then((choice: any) => {
      console.log("User PWA choice:", choice.outcome);
    });
  } else if (setGlobalShowModal) {
    setGlobalShowModal(true);
  }
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setGlobalShowModal = setShowIosModal;

    // 1. Detect if app is already running in standalone PWA mode
    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (checkStandalone) {
      setIsStandalone(true);
      return;
    }

    // 2. Detect iOS platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // 3. Listen for Android/Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      globalDeferredPrompt = e;

      // Check local dismissal state (cooldown 7 days)
      const dismissedAt = localStorage.getItem("adorepark_install_dismissed");
      if (dismissedAt) {
        const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 3600 * 24);
        if (daysSince < 7) return;
      }

      // Show after 5 seconds delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show iOS prompt card after delay if on iOS and not dismissed
    if (iosDevice && !checkStandalone) {
      const dismissedAt = localStorage.getItem("adorepark_install_dismissed");
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 3600 * 24) >= 7) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }

    // Register Service Worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("SW Registered:", reg.scope))
          .catch((err) => console.warn("SW Warning:", err));
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === "accepted") {
          setShowBanner(false);
        }
      });
    } else {
      setShowIosModal(true);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("adorepark_install_dismissed", Date.now().toString());
  };

  if (isStandalone) return null;

  return (
    <>
      {/* ELEGANT MOBILE INSTALLATION PROMPT CARD */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pwa-slide-enter">
          <div className="p-4 rounded-3xl bg-slate-900 border-2 border-emerald-500 text-white shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    📱 Keep AdorePark one tap away
                  </h4>
                  <p className="text-slate-300 text-[11px] font-medium mt-0.5">
                    Open parking assistance faster from your Home Screen.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-extrabold text-slate-400 hover:text-white transition"
              >
                Not now
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleInstallClick}
                className="font-black text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-9 shadow-sm"
              >
                Add to Home Screen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ELEGANT MODAL FOR MANUAL / SAFARI / IOS GUIDANCE */}
      <Modal
        isOpen={showIosModal}
        onClose={() => setShowIosModal(false)}
        title="Install AdorePark App"
        subtitle="1-tap home screen shortcut for Adore Grand residents"
        className="max-w-md"
      >
        <div className="space-y-4 text-slate-900 py-1">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
            <h4 className="text-sm font-black font-heading flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              To install AdorePark on your phone:
            </h4>

            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-mono font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="flex items-center gap-1">
                  Tap <strong>Share</strong> <Share className="w-4 h-4 text-emerald-600" /> in browser bar
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-mono font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Choose <strong>Add to Home Screen</strong></span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowIosModal(false)}
            className="w-full h-12 font-black text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Got It
          </Button>
        </div>
      </Modal>
    </>
  );
}

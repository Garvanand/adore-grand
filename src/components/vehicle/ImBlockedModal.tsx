"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertOctagon, MapPin, Send, CheckCircle2, ShieldAlert, Car } from "lucide-react";
import { normalizePlateNumber, formatPlateNumber } from "@/lib/utils";

interface ImBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ImBlockedModal({ isOpen, onClose, onSuccess }: ImBlockedModalProps) {
  const [plateNumber, setPlateNumber] = useState("");
  const [location, setLocation] = useState("Basement 1 (B1) - Driveway");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const presetLocations = [
    "Basement 1 (B1) - Main Driveway",
    "Basement 2 (B2) - Near Pillar B-12",
    "Tower A Basement Exit Ramp",
    "Tower B Reserved Parking Bay",
    "Tower C Ground Visitor Bay",
    "Tower D Gate Pass Lane",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const norm = normalizePlateNumber(plateNumber);
    if (!norm || norm.length < 3) {
      setError("Please enter the blocking vehicle plate number (e.g. HR26AB1234)");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: norm,
          location,
          description: "URGENT BLOCKAGE: Resident reported blocked vehicle in parking area.",
          priority: "urgent",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setPlateNumber("");
          onClose();
          if (onSuccess) onSuccess();
        }, 1800);
      } else {
        setError(data.message || "Failed to submit blockage report");
      }
    } catch (err: any) {
      setError(err.message || "Error submitting report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚨 Quick Parking Assistance"
      subtitle="Report a blocked car or driveway at Adore Grand"
    >
      {isSuccess ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="text-xl font-extrabold text-slate-100">Blockage Alert Dispatched!</h4>
          <p className="text-xs text-slate-300 mt-1 max-w-xs">
            Nudge notification sent to owner of <strong className="text-emerald-400 font-mono">{formatPlateNumber(plateNumber)}</strong> & escalated to Gate 1 Security.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Car className="w-4 h-4 text-emerald-400" />
              Blocking Vehicle Number / गाड़ी का नंबर *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HR 26 AB 1234 or HR38"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-800 text-slate-100 font-mono text-lg tracking-wider focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose-400" />
              Blockage Location / जगह का चयन करें *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-800 text-slate-100 text-sm font-medium focus:outline-none focus:border-rose-500 transition"
            >
              {presetLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full py-4 text-base font-extrabold shadow-lg shadow-rose-600/30"
              isLoading={isSubmitting}
            >
              <ShieldAlert className="w-5 h-5" />
              Send Move Alert & Dispatch Security
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

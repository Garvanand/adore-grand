"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Send, MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";

interface MoveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: string;
    plateNumber: string;
    rawPlateNumber: string;
    tower: string;
    flatNumber: string;
    ownerName: string;
  } | null;
  onSuccess?: () => void;
}

export function MoveRequestModal({ isOpen, onClose, vehicle, onSuccess }: MoveRequestModalProps) {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError("Please specify the vehicle location");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: vehicle.plateNumber,
          vehicleId: vehicle.id,
          location,
          description,
          priority,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setLocation("");
          setDescription("");
          onClose();
          if (onSuccess) onSuccess();
        }, 1800);
      } else {
        setError(data.message || "Failed to send move request");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Vehicle Move: ${vehicle.rawPlateNumber}`}
      subtitle={`Owner: ${vehicle.ownerName} (Tower ${vehicle.tower} - Flat ${vehicle.flatNumber})`}
    >
      {isSuccess ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Move Alert Sent!</h4>
          <p className="text-sm text-slate-300 mt-1">
            An in-app nudge notification has been delivered to {vehicle.ownerName}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Where is the vehicle blocking? *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Basement 1 near Pillar B-12 / Blocking Slot A-702"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Diagonally parked blocking exit lane"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Urgency Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority("normal")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  priority === "normal"
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Normal Nudge
              </button>
              <button
                type="button"
                onClick={() => setPriority("urgent")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  priority === "urgent"
                    ? "bg-rose-600/20 border-rose-500 text-rose-400"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Urgent Blockage
              </button>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              <Send className="w-4 h-4" />
              Send Move Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

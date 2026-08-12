"use client";

import React, { useState } from "react";
import { QrCode, Printer, Building2, ShieldCheck, Download, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function QrPosterGenerator() {
  const [selectedZone, setSelectedZone] = useState("B1");
  const [customSubtitle, setCustomSubtitle] = useState("Pillar B-14 Basement Exit");

  const zones = [
    { id: "B1", name: "Basement B1", subtitle: "Basement B1 Parking & Driveway" },
    { id: "B2", name: "Basement B2", subtitle: "Basement B2 Parking Area" },
    { id: "B3", name: "Basement B3", subtitle: "Basement B3 Reserved Slots" },
    { id: "ground_parking", name: "Ground Visitor Parking", subtitle: "Ground Level Visitor Bay" },
    { id: "gate_1", name: "Gate 1 Security Desk", subtitle: "Main Entrance Gate 1" },
    { id: "gate_2", name: "Gate 2 Exit Gate", subtitle: "Exit Gate 2 Security Post" },
  ];

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://adorepark.vercel.app";
  const qrUrl = `${currentOrigin}/parking?zone=${selectedZone}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}&color=080c14&bgcolor=ffffff`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-emerald-400 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Adore Grand Printable QR Poster Studio
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate zone-specific QR posters for basement pillars, gates, and security desks
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handlePrint} className="font-extrabold gap-2">
            <Printer className="w-4 h-4" /> Print / Save Poster PDF
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Zone Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {zones.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  setSelectedZone(z.id);
                  setCustomSubtitle(z.subtitle);
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                  selectedZone === z.id
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-lg"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <span>{z.name}</span>
                {selectedZone === z.id && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* PRINTABLE POSTER CANVAS CONTAINER */}
          <div className="print-poster-container flex justify-center py-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 overflow-x-auto">
            {/* The Actual Printable Poster Box */}
            <div className="w-full max-w-md bg-slate-900 border-4 border-emerald-500 rounded-3xl p-8 text-center space-y-6 shadow-2xl text-white">
              {/* Header */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest border border-emerald-500/30">
                  <Building2 className="w-4 h-4" />
                  ADORE GRAND
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white font-heading">
                  PARKING ASSISTANCE
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Sector 85 • Faridabad, Haryana
                </p>
              </div>

              {/* QR Code Centerpiece */}
              <div className="space-y-3 flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-2xl border-2 border-emerald-400 inline-block">
                  <img
                    src={qrImageUrl}
                    alt={`AdorePark QR Code for ${selectedZone}`}
                    className="w-52 h-52 object-contain"
                  />
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  ZONE: {selectedZone.toUpperCase()} • {customSubtitle}
                </span>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <strong className="text-emerald-400 font-bold block text-sm">
                  SCAN TO FIND A VEHICLE OR REPORT A BLOCKED CAR
                </strong>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Open phone camera $\rightarrow$ Scan QR code $\rightarrow$ Instantly request owner to move car without WhatsApp groups.
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-2 font-mono border-t border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AdorePark Resident Portal • Gate 1 Duty: 0129-285-8585
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

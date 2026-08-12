import React from "react";
import { DutyModePanel } from "@/components/incident/DutyModePanel";
import { ShieldAlert, PhoneCall } from "lucide-react";

export default function SecurityDutyPage() {
  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      {/* Duty Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 to-rose-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-rose-100 font-mono">Live Gate 1 Duty Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-white" />
            Adore Grand Security Desk
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
            Real-time parking dispute resolution and direct resident calling station
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl text-xs font-mono font-bold">
          <PhoneCall className="w-4 h-4 text-white" />
          <span>Gate Desk: <strong>0129-285-8585</strong></span>
        </div>
      </div>

      {/* Main Touch Duty Panel */}
      <DutyModePanel />
    </div>
  );
}

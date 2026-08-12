import React from "react";
import { AdminCommandCenter } from "@/components/admin/AdminCommandCenter";
import { Building2, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="space-y-6 py-2 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-200 font-mono">
            RWA Society Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-white" />
            AdorePark Command Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
            Adore Grand (Sector 85, Faridabad) Parking Management & Audit Hub
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-white/20 text-center text-white">
            <span className="text-[10px] text-emerald-100 uppercase font-bold block">Towers</span>
            <strong className="font-mono text-base font-black">T1 - T7</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/20 text-center text-white">
            <span className="text-[10px] text-emerald-100 uppercase font-bold block">Audit Trail</span>
            <strong className="font-mono text-base font-black">Active</strong>
          </div>
        </div>
      </div>

      {/* Main Command Center Dashboard */}
      <AdminCommandCenter />
    </div>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InteractiveSocietyMap } from "@/components/illustration/InteractiveSocietyMap";
import { VehicleSearch } from "@/components/vehicle/VehicleSearch";
import { ImBlockedWorkflowModal } from "@/components/incident/ImBlockedWorkflowModal";
import { AddVehicleModal } from "@/components/vehicle/AddVehicleModal";
import { MapPin, Search, AlertOctagon, Plus, ShieldCheck, PhoneCall, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ParkingZoneContent() {
  const searchParams = useSearchParams();
  const initialZone = searchParams.get("zone") || "T1";

  const [selectedZone, setSelectedZone] = useState(initialZone.toUpperCase());
  const [isBlockedOpen, setIsBlockedOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto page-enter">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-3 shadow-md">
        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase font-mono tracking-wider inline-block">
          Adore Grand QR Assistance Entry
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
          You are at <span className="text-emerald-200">{selectedZone} Parking Zone</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-xl">
          Scan QR code assistance point for Adore Grand, Sector 85, Faridabad. Lookup vehicle owners or request movement.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() => setIsBlockedOpen(true)}
            variant="danger"
            size="md"
            className="font-black text-xs rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
          >
            <AlertOctagon className="w-4 h-4" /> Report Blocked Vehicle
          </Button>

          <Button
            onClick={() => setIsAddVehicleOpen(true)}
            variant="secondary"
            size="md"
            className="font-black text-xs rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Register My Vehicle
          </Button>
        </div>
      </div>

      {/* Interactive U-Shaped Society Map Component */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 font-heading">
          ADORE GRAND PARKING ZONE MAP
        </h2>
        <InteractiveSocietyMap
          selectedZone={selectedZone}
          onSelectZone={(z) => setSelectedZone(z)}
        />
      </section>

      {/* Vehicle Search Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="text-left space-y-1">
          <h2 className="text-xl font-black text-slate-900 font-heading uppercase text-emerald-800">
            Lookup Vehicle in Zone {selectedZone}
          </h2>
          <p className="text-xs text-slate-500 font-medium">Enter registration number (e.g. HR26AB1234)</p>
        </div>

        <VehicleSearch />
      </section>

      {/* Modals */}
      <ImBlockedWorkflowModal isOpen={isBlockedOpen} onClose={() => setIsBlockedOpen(false)} />
      <AddVehicleModal isOpen={isAddVehicleOpen} onClose={() => setIsAddVehicleOpen(false)} />
    </div>
  );
}

export default function ParkingZonePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-slate-500 font-bold gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Loading Adore Grand Parking Zone...</span>
        </div>
      }
    >
      <ParkingZoneContent />
    </Suspense>
  );
}

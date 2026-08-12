"use client";

import React, { useState } from "react";
import {
  Search,
  Building2,
  Phone,
  MessageCircle,
  Send,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MoveRequestModal } from "./MoveRequestModal";
import { VehicleGraphic } from "@/components/illustration/vehicles/VehicleGraphic";
import { formatPlateNumber, normalizePlateNumber } from "@/lib/utils";

export function VehicleSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const rawQ = overrideQuery !== undefined ? overrideQuery : query;
    if (!rawQ.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/vehicles/search?query=${encodeURIComponent(rawQ.trim())}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
      } else {
        setSearchError(data.message || "Failed to complete search.");
        setResults([]);
      }
    } catch (error) {
      console.error(error);
      setSearchError("Network connection issue. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePresetClick = (plate: string) => {
    setQuery(plate);
    handleSearch(undefined, plate);
  };

  const handleInputChange = (val: string) => {
    setQuery(val.toUpperCase());
  };

  return (
    <div className="w-full space-y-5">
      {/* Search Input Box & Recent Searches */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Main Search Input */}
        <form onSubmit={(e) => handleSearch(e)} className="relative flex-1 group">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter vehicle number (e.g. HR26AB1234)"
            className="w-full pl-5 pr-32 h-14 text-base font-mono font-black tracking-wider rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal placeholder:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 shadow-xs transition-all"
          />
          <div className="absolute inset-y-1.5 right-1.5 flex items-center">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="h-11 px-5 font-black text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              isLoading={isSearching}
            >
              Find Vehicle
            </Button>
          </div>
        </form>

        {/* Recent Searches Chips */}
        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 uppercase tracking-wider">Recent Searches:</span>
          {["HR26AB1234", "DL3CAX9911", "UP16CP9090", "HR51BF2020"].map((plate) => (
            <button
              key={plate}
              onClick={() => handlePresetClick(plate)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 font-mono font-bold transition text-xs shadow-xs shrink-0"
            >
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* STATE 1: SEARCHING... */}
      {isSearching && (
        <Card className="border-emerald-200 bg-emerald-50/40 p-8 text-center animate-pulse">
          <CardContent className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">Searching Adore Grand Registry...</h4>
            <p className="text-xs text-slate-500 font-medium">Checking tower records for vehicle {query}</p>
          </CardContent>
        </Card>
      )}

      {/* RESULTS / NOT FOUND / ERROR */}
      {!isSearching && hasSearched && (
        <div className="space-y-4 pt-1">
          {searchError ? (
            /* NETWORK ERROR */
            <Card className="border-rose-200 bg-rose-50/60 p-6 text-center">
              <CardContent className="flex flex-col items-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Network Connection Issue</h4>
                <p className="text-xs text-slate-600 font-medium max-w-sm">{searchError}</p>
                <Button
                  onClick={() => handleSearch()}
                  variant="outline"
                  size="sm"
                  className="mt-2 font-bold rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100"
                >
                  <RefreshCw className="w-4 h-4" /> Retry Search
                </Button>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            /* VEHICLE NOT FOUND */
            <Card className="border-amber-200 bg-amber-50/50 p-6 sm:p-8 text-center">
              <CardContent className="flex flex-col items-center py-4 space-y-3">
                <VehicleGraphic vehicleType="car" className="w-16 h-16" />
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 font-heading">
                    Couldn't find vehicle "{query}"
                  </h4>
                  <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                    This registration is not yet listed in the resident directory. You can check the number or send an unlisted blockage alert directly to Security Guard Ramesh Kumar at Gate 1.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs rounded-xl border-slate-300"
                    onClick={() => setQuery("")}
                  >
                    Check Number & Try Again
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    className="font-extrabold text-xs rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                    onClick={() => {
                      setSelectedVehicle({
                        id: "",
                        plateNumber: normalizePlateNumber(query),
                        rawPlateNumber: formatPlateNumber(query),
                        tower: "Unlisted",
                        flatNumber: "Visitor/Guest",
                        ownerName: "Unregistered Owner",
                      });
                      setIsMoveModalOpen(true);
                    }}
                  >
                    Send Report to Gate 1 Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* VEHICLE FOUND (VECTOR ILLUSTRATED RESULT CARD) */
            results.map((item) => (
              <Card
                key={item.id}
                className="border-emerald-200 bg-white shadow-lg rounded-3xl overflow-hidden hover:border-emerald-400 vehicle-card-enter"
              >
                {/* Found Success Banner */}
                <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Vehicle Found in Adore Grand Registry
                  </span>
                  <Badge variant="success">Registered Resident</Badge>
                </div>

                <CardContent className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* LEFT COLUMN: VECTOR VEHICLE GRAPHIC & SPECS */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50/60 border border-emerald-100/80 space-y-3">
                      {/* Vector Vehicle Component */}
                      <VehicleGraphic
                        vehicleType={item.vehicleType}
                        makeModel={item.makeModel}
                        color={item.color}
                        className="w-24 h-20"
                      />

                      {/* Registration Plate */}
                      <div>
                        <span className="font-mono font-black text-3xl text-slate-900 tracking-wider block">
                          {formatPlateNumber(item.plateNumber)}
                        </span>
                        <p className="text-xs font-bold text-slate-600 mt-1">
                          {item.color !== "Not Specified" ? `${item.color} ` : ""}{item.makeModel}
                        </p>
                      </div>

                      {/* Specs Badges */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] font-bold text-slate-700">
                        <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-mono">
                          {item.vehicleType.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200">
                          {item.parkingZone || "Park Boundary"}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: RESIDENT DETAILS & ACTION BUTTONS */}
                    <div className="md:col-span-7 space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase tracking-wider font-mono">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span>Tower {item.tower} • Flat {item.flatNumber}</span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-slate-900 font-heading">
                            {item.owner.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                            Contact Phone:{" "}
                            {item.owner.isPhonePublic ? (
                              <span className="font-mono font-bold text-slate-900">{item.owner.phone}</span>
                            ) : (
                              <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                                {item.owner.phoneMasked}
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* THREE DISTINCT ACTION BUTTONS */}
                      <div className="space-y-2.5 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* 1. CALL OWNER */}
                          <a href={`tel:${item.owner.phone}`} className="w-full">
                            <Button
                              variant="primary"
                              size="lg"
                              className="w-full h-12 font-extrabold text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            >
                              <Phone className="w-4 h-4" />
                              CALL OWNER
                            </Button>
                          </a>

                          {/* 2. WHATSAPP */}
                          <a
                            href={`https://wa.me/${item.owner.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                              item.owner.name
                            )},%20your%20vehicle%20${item.plateNumber}%20at%20Adore%20Grand%20needs%20to%20be%20moved.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button
                              variant="secondary"
                              size="lg"
                              className="w-full h-12 font-extrabold text-xs rounded-xl bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-sm"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WHATSAPP
                            </Button>
                          </a>
                        </div>

                        {/* 3. REQUEST MOVEMENT */}
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full h-12 font-extrabold text-xs rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500 shadow-sm"
                          onClick={() => {
                            setSelectedVehicle({
                              id: item.id,
                              plateNumber: item.plateNumber,
                              rawPlateNumber: formatPlateNumber(item.plateNumber),
                              tower: item.tower,
                              flatNumber: item.flatNumber,
                              ownerName: item.owner.name,
                            });
                            setIsMoveModalOpen(true);
                          }}
                        >
                          <Send className="w-4 h-4" />
                          REQUEST MOVEMENT
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Move Request Modal */}
      <MoveRequestModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        vehicle={selectedVehicle}
        onSuccess={() => {
          setIsMoveModalOpen(false);
        }}
      />
    </div>
  );
}

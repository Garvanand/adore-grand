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
  MapPin,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MoveRequestModal } from "./MoveRequestModal";
import { VehicleGraphic } from "@/components/illustration/vehicles/VehicleGraphic";
import { formatPlateNumber, normalizePlateNumber, getTelUrl, getWhatsAppUrl } from "@/lib/utils";

export function VehicleSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  // Inline Request Movement Section State (replaces popup modal overlay)
  const [activeRequestVehicleId, setActiveRequestVehicleId] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("Basement B1");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<"normal" | "urgent">("normal");
  const [isSubmittingInline, setIsSubmittingInline] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [requestSuccessId, setRequestSuccessId] = useState<string | null>(null);

  const handleInlineSubmit = async (e: React.FormEvent, item: any) => {
    e.preventDefault();
    if (!locationInput.trim()) {
      setInlineError("Please specify blockage location.");
      return;
    }

    setIsSubmittingInline(true);
    setInlineError(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: item.plateNumber,
          vehicleId: item.id,
          location: locationInput.trim(),
          description: descriptionInput.trim() || undefined,
          priority: priorityInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRequestSuccessId(item.id);
        setTimeout(() => {
          setRequestSuccessId(null);
          setActiveRequestVehicleId(null);
          setLocationInput("Basement B1");
          setDescriptionInput("");
        }, 2200);
      } else {
        setInlineError(data.message || "Failed to send move request.");
      }
    } catch (err: any) {
      setInlineError("Network connection issue. Please try again.");
    } finally {
      setIsSubmittingInline(false);
    }
  };

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
    <div className="w-full space-y-4">
      {/* Search Input Box & Recent Searches */}
      <div className="space-y-3">
        {/* Main Responsive Search Input */}
        <form onSubmit={(e) => handleSearch(e)} className="flex flex-col sm:flex-row items-stretch gap-2 group">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter vehicle number (e.g. HR26AB1234)"
              className="w-full pl-4 pr-4 h-13 text-sm sm:text-base font-mono font-black tracking-wider rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 shadow-xs transition-all"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="h-13 px-6 font-black text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0 flex items-center justify-center gap-2"
            isLoading={isSearching}
          >
            <Search className="w-4 h-4" />
            <span>Find Vehicle</span>
          </Button>
        </form>

        {/* Recent Searches Chips */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 scrollbar-none">
          <span className="text-slate-400 font-bold text-[10px] sm:text-[11px] shrink-0 uppercase tracking-wider">Quick Try:</span>
          {["HR26AB1234", "DL3CAX9911", "UP16CP9090", "HR51BF2020"].map((plate) => (
            <button
              key={plate}
              onClick={() => handlePresetClick(plate)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 font-mono font-bold transition text-[11px] sm:text-xs shadow-xs shrink-0"
            >
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* STATE 1: SEARCHING... */}
      {isSearching && (
        <Card className="border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 text-center animate-pulse">
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
            <Card className="border-rose-200 bg-rose-50/60 p-5 sm:p-6 text-center">
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
            <Card className="border-amber-200 bg-amber-50/50 p-5 sm:p-8 text-center">
              <CardContent className="flex flex-col items-center py-3 sm:py-4 space-y-3">
                <VehicleGraphic vehicleType="car" className="w-16 h-16" />
                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                    Couldn't find vehicle "{query}"
                  </h4>
                  <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                    This registration is not yet listed in the resident directory. You can check the number or send an unlisted blockage alert directly to Security Guard Ramesh Kumar at Gate 1.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full max-w-md mx-auto pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs rounded-xl border-slate-300 h-11"
                    onClick={() => setQuery("")}
                  >
                    Check Number & Try Again
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    className="font-extrabold text-xs rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm h-11"
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
                <div className="bg-emerald-50 px-4 sm:px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Vehicle Found in Adore Grand</span>
                  </span>
                  <Badge variant="success" className="shrink-0">Resident</Badge>
                </div>

                <CardContent className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                    {/* LEFT COLUMN: VECTOR VEHICLE GRAPHIC & SPECS */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50/60 border border-emerald-100/80 space-y-2.5">
                      <VehicleGraphic
                        vehicleType={item.vehicleType}
                        makeModel={item.makeModel}
                        color={item.color}
                        className="w-20 h-16 sm:w-24 sm:h-20"
                      />

                      <div>
                        <span className="font-mono font-black text-2xl sm:text-3xl text-slate-900 tracking-wider block">
                          {formatPlateNumber(item.plateNumber)}
                        </span>
                        <p className="text-xs font-bold text-slate-600 mt-0.5">
                          {item.color !== "Not Specified" ? `${item.color} ` : ""}{item.makeModel}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-700">
                        <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-mono">
                          {item.vehicleType.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200">
                          {item.parkingZone || "Park Boundary"}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: RESIDENT DETAILS & ACTION BUTTONS */}
                    <div className="md:col-span-7 space-y-4 sm:space-y-5">
                      <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-extrabold text-emerald-700 uppercase tracking-wider font-mono">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Tower {item.tower} • Flat {item.flatNumber}</span>
                        </div>

                        <div className="space-y-0.5">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                            {item.owner.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1">
                            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Contact Phone:</span>{" "}
                            {item.owner.isPhonePublic ? (
                              <span className="font-mono font-bold text-slate-900">{item.owner.phone}</span>
                            ) : (
                              <span className="font-mono font-bold text-slate-800 inline-flex items-center gap-1">
                                {item.owner.phoneMasked}
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* THREE DISTINCT ACTION BUTTONS */}
                      <div className="space-y-2.5 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* 1. CALL OWNER */}
                          <a href={getTelUrl(item.owner.phone)} className="w-full">
                            <Button
                              variant="primary"
                              size="lg"
                              className="w-full h-12 font-extrabold text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              CALL OWNER
                            </Button>
                          </a>

                          {/* 2. WHATSAPP */}
                          <a
                            href={getWhatsAppUrl(
                              item.owner.phone,
                              `Hello ${item.owner.name}, your vehicle ${item.plateNumber} at Adore Grand needs to be moved.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button
                              variant="secondary"
                              size="lg"
                              className="w-full h-12 font-extrabold text-xs rounded-xl bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-sm flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WHATSAPP
                            </Button>
                          </a>
                        </div>

                        {/* 3. REQUEST MOVEMENT BUTTON (Toggles Inline Section) */}
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full h-12 font-extrabold text-xs rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                          onClick={() => {
                            if (activeRequestVehicleId === item.id) {
                              setActiveRequestVehicleId(null);
                            } else {
                              setActiveRequestVehicleId(item.id);
                              setInlineError(null);
                            }
                          }}
                        >
                          <Send className="w-4 h-4" />
                          {activeRequestVehicleId === item.id ? "CLOSE REQUEST FORM" : "REQUEST MOVEMENT"}
                        </Button>

                        {/* INLINE REQUEST MOVEMENT FORM SECTION (Normal page view flow, no popup overlays) */}
                        {activeRequestVehicleId === item.id && (
                          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 space-y-3 shadow-md animate-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-amber-900 font-heading flex items-center gap-1.5 uppercase tracking-wide">
                                <Send className="w-4 h-4 text-amber-600" />
                                Request Movement Alert for {formatPlateNumber(item.plateNumber)}
                              </h4>
                              <button
                                type="button"
                                onClick={() => setActiveRequestVehicleId(null)}
                                className="p-1 rounded-lg text-amber-800 hover:bg-amber-100 transition text-xs font-extrabold"
                                title="Close"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {requestSuccessId === item.id ? (
                              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold text-center space-y-1">
                                <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-black text-sm">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  <span>Move Alert Sent Successfully!</span>
                                </div>
                                <p className="text-[11px] text-emerald-800 font-medium">
                                  In-app notification has been delivered to {item.owner.name}.
                                </p>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handleInlineSubmit(e, item)} className="space-y-3">
                                {inlineError && (
                                  <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span>{inlineError}</span>
                                  </div>
                                )}

                                <div>
                                  <label className="block text-[11px] font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                    Where is the vehicle blocking? *
                                  </label>
                                  {/* Quick Location Preset Pills */}
                                  <div className="flex flex-wrap gap-1.5 mb-2">
                                    {["Basement B1", "Basement B2", "Surface Parking", "Gate 1"].map((preset) => (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setLocationInput(preset)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                                          locationInput === preset
                                            ? "bg-amber-600 text-white border-amber-600"
                                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                                        }`}
                                      >
                                        {preset}
                                      </button>
                                    ))}
                                  </div>

                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Basement B1 near Pillar 14 / Slot A-702"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium shadow-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                                    Urgency Priority
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setPriorityInput("normal")}
                                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition ${
                                        priorityInput === "normal"
                                          ? "bg-emerald-600 text-white border-emerald-600"
                                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                      }`}
                                    >
                                      Normal Nudge
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setPriorityInput("urgent")}
                                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition ${
                                        priorityInput === "urgent"
                                          ? "bg-rose-600 text-white border-rose-600"
                                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                      }`}
                                    >
                                      Urgent Blockage
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveRequestVehicleId(null)}
                                    className="text-xs font-bold text-slate-600"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    isLoading={isSubmittingInline}
                                    className="text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 h-9 shadow-sm"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    Send Alert
                                  </Button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

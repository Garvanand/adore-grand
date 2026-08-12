"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Car,
  Search,
  Plus,
  Home,
  PhoneCall,
  WifiOff,
  UserCheck,
  Globe,
  Loader2,
  X,
  AlertOctagon,
  Shield,
} from "lucide-react";
import { formatPlateNumber, timeAgo, normalizePlateNumber } from "@/lib/utils";
import { VehicleGraphic } from "@/components/illustration/vehicles/VehicleGraphic";

export function DutyModePanel() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "hi">("hi"); // Default to Hindi for Gate 1 guards
  const [activeTab, setActiveTab] = useState<"home" | "search" | "report" | "contact">("home");
  const [isOnline, setIsOnline] = useState(true);
  const [shiftActive, setShiftActive] = useState(true);

  // Search state
  const [searchPlate, setSearchPlate] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMsg, setSearchMsg] = useState("");

  // Report state
  const [reportPlate, setReportPlate] = useState("");
  const [reportLocation, setReportLocation] = useState("T4");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState("");

  // Help/Escalation modal
  const [selectedIncidentForHelp, setSelectedIncidentForHelp] = useState<any>(null);
  const [resolvedIncidentId, setResolvedIncidentId] = useState<string | null>(null);

  // Network Online Check
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    // 12s polling interval (only runs when tab is active/visible)
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      fetchIncidents();
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (incidentId: string) => {
    setResolvedIncidentId(incidentId);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionNote: "Gate 1 Guard verified & cleared blockage." }),
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setResolvedIncidentId(null);
          fetchIncidents();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
      setResolvedIncidentId(null);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchPlate.trim()) return;

    setIsSearching(true);
    setSearchMsg("");
    setSearchResult(null);

    try {
      const res = await fetch(`/api/vehicles/search?query=${encodeURIComponent(searchPlate.trim())}`);
      const data = await res.json();
      if (data.success && data.results && data.results.length > 0) {
        setSearchResult(data.results[0]);
      } else {
        setSearchMsg(lang === "hi" ? "वाहन नहीं मिला" : "Vehicle not found");
      }
    } catch (err) {
      setSearchMsg(lang === "hi" ? "नेटवर्क समस्या" : "Network error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportPlate.trim()) return;

    setIsReporting(true);
    setReportSuccessMsg("");

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: reportPlate.trim(),
          location: `Tower ${reportLocation}`,
          tower: reportLocation.startsWith("T") ? reportLocation : "T1",
          flatNumber: "Gate 1 Duty Report",
          description: "Reported directly by Gate 1 Security Guard.",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReportPlate("");
        setReportSuccessMsg(lang === "hi" ? "✅ रिपोर्ट भेजी गई!" : "✅ Incident Reported!");
        fetchIncidents();
        setTimeout(() => {
          setReportSuccessMsg("");
          setActiveTab("home");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReporting(false);
    }
  };

  const activeIncidents = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "RESOLVED" && i.status !== "cancelled"
  );

  const locationPills = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "MANDIR", "PARK"];

  return (
    <div className="space-y-4 font-sans text-slate-900 select-none">
      {/* 1. OFFLINE WARNING BANNER */}
      {!isOnline && (
        <div className="p-4 rounded-3xl bg-rose-600 text-white font-black text-center space-y-1 shadow-2xl animate-bounce">
          <div className="flex items-center justify-center gap-2 text-lg">
            <WifiOff className="w-6 h-6" />
            <span>📡 NO INTERNET / इंटरनेट नहीं है</span>
          </div>
          <p className="text-xs text-rose-100 font-bold">
            Call Supervisor Directly: <a href="tel:+919800011122" className="underline font-mono text-sm">+91 98000 11122</a>
          </p>
        </div>
      )}

      {/* 2. GATE 1 HEADER & LANGUAGE TOGGLE */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-2 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-black uppercase text-emerald-400 tracking-wider">
              🛡️ GATE 1 • ADORE GRAND
            </span>
          </div>
          <h1 className="text-2xl font-black font-heading mt-0.5 tracking-tight">
            {lang === "hi" ? "गार्ड ड्यूटी डेस्क" : "Guard Duty Desk"}
          </h1>
        </div>

        {/* Hindi | English Language Toggle Button */}
        <button
          onClick={() => setLang(lang === "hi" ? "en" : "hi")}
          className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black border border-slate-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{lang === "hi" ? "English" : "हिंदी"}</span>
        </button>
      </div>

      {/* 3. SHIFT STATUS & LARGE VISUAL STATUS CARD */}
      {activeTab === "home" && (
        <>
          {/* Shift Toggle Strip */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Guard Ramesh Kumar • Shift: <strong>08:00 - 20:00</strong></span>
            </div>
            <button
              onClick={() => setShiftActive(!shiftActive)}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono font-black ${
                shiftActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              {shiftActive ? (lang === "hi" ? "ड्यूटी चालू" : "SHIFT ACTIVE") : (lang === "hi" ? "ड्यूटी बंद" : "OFF DUTY")}
            </button>
          </div>

          {/* HUGE VISUAL STATUS CARD (3-Second Rule) */}
          <div
            className={`p-6 rounded-3xl text-white shadow-xl text-center space-y-2 flex flex-col items-center justify-center transition-all ${
              activeIncidents.length === 0
                ? "bg-gradient-to-b from-emerald-600 to-emerald-700 border-4 border-emerald-500"
                : "bg-gradient-to-b from-rose-600 to-rose-700 border-4 border-rose-500 animate-pulse"
            }`}
          >
            {activeIncidents.length === 0 ? (
              <>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black">
                  🟢
                </div>
                <h2 className="text-3xl font-black font-heading tracking-wide">
                  {lang === "hi" ? "SAB THEEK (सब ठीक है)" : "ALL CLEAR"}
                </h2>
                <p className="text-xs text-emerald-100 font-extrabold">
                  {lang === "hi" ? "कोई गाड़ी ब्लॉक नहीं है" : "No active vehicle blockages"}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black">
                  🔴
                </div>
                <h2 className="text-3xl font-black font-heading tracking-wide">
                  {activeIncidents.length} {lang === "hi" ? "मदद की मांग (HELP REQUESTS)" : "HELP REQUESTS"}
                </h2>
                <p className="text-xs text-rose-100 font-extrabold">
                  {lang === "hi" ? "नीचे गाड़ी देखकर मालिक को कॉल करें" : "Review vehicle details & call owner below"}
                </p>
              </>
            )}
          </div>

          {/* ACTIVE REQUEST CARDS (HUGE TOUCH BUTTONS) */}
          <div className="space-y-4 pt-2">
            {activeIncidents.map((incident) => {
              const isDone = resolvedIncidentId === incident.id;
              return (
                <div
                  key={incident.id}
                  className={`p-5 rounded-3xl bg-white border-4 shadow-xl space-y-4 transition-all ${
                    isDone ? "border-emerald-500 bg-emerald-50 scale-95" : "border-rose-500"
                  }`}
                >
                  {/* Vehicle Graphic & Large Plate */}
                  <div className="flex items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <VehicleGraphic
                      vehicleType={incident.vehicleType || "car"}
                      className="w-16 h-12"
                    />

                    <div className="text-right">
                      <span className="font-mono font-black text-3xl text-slate-900 tracking-wider block">
                        {formatPlateNumber(incident.plateNumber || incident.vehiclePlate)}
                      </span>
                      <span className="text-xs font-extrabold text-slate-600 block">
                        {incident.makeModel || "White Car"}
                      </span>
                    </div>
                  </div>

                  {/* Location & Time Pills */}
                  <div className="grid grid-cols-2 gap-2 text-center font-extrabold text-xs">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-0.5">
                      <span className="text-[10px] text-amber-700 block uppercase font-mono">{lang === "hi" ? "स्थान (WHERE)" : "LOCATION"}</span>
                      <strong className="text-base font-black text-slate-900 block truncate">
                        {incident.location || `Tower ${incident.tower}`}
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">{lang === "hi" ? "समय (TIME)" : "REPORTED"}</span>
                      <strong className="text-sm font-black block">
                        {timeAgo(incident.createdAt)}
                      </strong>
                    </div>
                  </div>

                  {/* HUGE 1-TAP ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* 1. CALL OWNER (HUGE GREEN BUTTON) */}
                    <a
                      href={`tel:${incident.owner?.phone || "+919876543210"}`}
                      className="w-full"
                    >
                      <button className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer">
                        <Phone className="w-6 h-6" />
                        <span>{lang === "hi" ? "📞 कॉल" : "📞 CALL"}</span>
                      </button>
                    </a>

                    {/* 2. WHATSAPP (HUGE TEAL BUTTON) */}
                    <a
                      href={`https://wa.me/${(incident.owner?.phone || "919876543210").replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                        incident.owner?.name || "Resident"
                      )},%20your%20vehicle%20${incident.plateNumber}%20at%20Adore%20Grand%20Gate%201%20needs%20to%20be%20moved.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <button className="w-full h-16 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-base shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer">
                        <MessageCircle className="w-6 h-6" />
                        <span>{lang === "hi" ? "💬 WhatsApp" : "💬 WHATSAPP"}</span>
                      </button>
                    </a>
                  </div>

                  {/* 3. DONE & 4. HELP BUTTONS */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* DONE BUTTON */}
                    <button
                      onClick={() => handleResolve(incident.id)}
                      disabled={isDone}
                      className="w-full h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{isDone ? (lang === "hi" ? "✅ हो गया!" : "✅ DONE!") : (lang === "hi" ? "✅ पूरा हुआ" : "✅ DONE")}</span>
                    </button>

                    {/* HELP / ESCALATE BUTTON */}
                    <button
                      onClick={() => setSelectedIncidentForHelp(incident)}
                      className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span>{lang === "hi" ? "⚠️ मदद" : "⚠️ HELP"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* SEARCH VEHICLE TAB (🔍 VEHICLE) */}
      {activeTab === "search" && (
        <div className="space-y-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <h3 className="text-xl font-black text-slate-900 font-heading">
            {lang === "hi" ? "🔍 वाहन खोजें" : "🔍 SEARCH VEHICLE"}
          </h3>

          <form onSubmit={handleSearch} className="space-y-3">
            <input
              type="text"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
              placeholder="e.g. HR26AB1234"
              className="w-full h-16 px-4 text-2xl font-mono font-black rounded-2xl bg-slate-50 border-2 border-slate-300 text-slate-900 uppercase focus:border-emerald-600 focus:outline-none"
            />

            <button
              type="submit"
              disabled={isSearching}
              className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              <span>{lang === "hi" ? "खोजें" : "SEARCH"}</span>
            </button>
          </form>

          {searchMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-900 font-bold text-center text-sm border border-amber-200">
              {searchMsg}
            </div>
          )}

          {searchResult && (
            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-2xl text-slate-900">
                  {formatPlateNumber(searchResult.plateNumber)}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black text-xs">
                  Tower {searchResult.tower} • {searchResult.flatNumber}
                </span>
              </div>

              <div className="space-y-1 text-sm font-bold text-slate-800">
                <p>Owner: <strong>{searchResult.owner.name}</strong></p>
                <p>Vehicle: <strong>{searchResult.makeModel}</strong></p>
                <p>Phone: <strong className="font-mono">{searchResult.owner.phone}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a href={`tel:${searchResult.owner.phone}`} className="w-full">
                  <button className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>{lang === "hi" ? "कॉल करें" : "CALL"}</span>
                  </button>
                </a>

                <a
                  href={`https://wa.me/${searchResult.owner.phone.replace(/[^0-9]/g, "")}?text=Adore%20Grand%20Gate%201%20Notice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <button className="w-full h-14 rounded-2xl bg-teal-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>WHATSAPP</span>
                  </button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REPORT INCIDENT TAB (➕ REPORT) */}
      {activeTab === "report" && (
        <div className="space-y-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <h3 className="text-xl font-black text-slate-900 font-heading">
            {lang === "hi" ? "➕ नई ब्लॉक रिपोर्ट" : "➕ CREATE BLOCK REPORT"}
          </h3>

          {reportSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-center text-sm border border-emerald-300">
              {reportSuccessMsg}
            </div>
          )}

          <form onSubmit={handleCreateReport} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                {lang === "hi" ? "गाड़ी का नंबर (VEHICLE PLATE) *" : "VEHICLE PLATE NUMBER *"}
              </label>
              <input
                type="text"
                required
                value={reportPlate}
                onChange={(e) => setReportPlate(e.target.value.toUpperCase())}
                placeholder="e.g. HR26AB1234"
                className="w-full h-16 px-4 text-2xl font-mono font-black rounded-2xl bg-slate-50 border-2 border-slate-300 text-slate-900 uppercase focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                {lang === "hi" ? "स्थान (WHERE) *" : "WHERE IS IT BLOCKED? *"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {locationPills.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setReportLocation(loc)}
                    className={`h-12 rounded-xl text-xs font-black transition ${
                      reportLocation === loc
                        ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-500"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isReporting}
              className="w-full h-16 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              {isReporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <AlertOctagon className="w-6 h-6" />}
              <span>{lang === "hi" ? "🚨 रिपोर्ट भेजें" : "🚨 SEND REPORT"}</span>
            </button>
          </form>
        </div>
      )}

      {/* EMERGENCY CONTACTS TAB (☎️ CONTACT) */}
      {activeTab === "contact" && (
        <div className="space-y-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <h3 className="text-xl font-black text-slate-900 font-heading">
            {lang === "hi" ? "☎️ आपातकालीन नंबर" : "☎️ EMERGENCY CONTACTS"}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            <a href="tel:+919800011122" className="w-full">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-900 font-extrabold text-sm">
                <div>
                  <span className="block text-slate-900 font-black text-base">Security Supervisor Duty</span>
                  <span className="font-mono text-xs text-rose-700">+91 98000 11122</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
            </a>

            <a href="tel:+919800011123" className="w-full">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-900 font-extrabold text-sm">
                <div>
                  <span className="block text-slate-900 font-black text-base">Gate 2 Security Office</span>
                  <span className="font-mono text-xs text-slate-600">+91 98000 11123</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
            </a>

            <a href="tel:+919999900000" className="w-full">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-900 font-extrabold text-sm">
                <div>
                  <span className="block text-slate-900 font-black text-base">RWA President Office</span>
                  <span className="font-mono text-xs text-slate-600">+91 99999 00000</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
            </a>

            <a href="tel:112" className="w-full">
              <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-between text-rose-950 font-black text-sm">
                <div>
                  <span className="block font-black text-base">Police Emergency (112)</span>
                  <span className="font-mono text-xs">Faridabad Police Station</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-700 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* SUPERVISOR HELP MODAL */}
      {selectedIncidentForHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-xl font-black text-slate-900 font-heading">
              {lang === "hi" ? "सुपरवाइजर को कॉल करें?" : "Call Security Supervisor?"}
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              Escalate vehicle {selectedIncidentForHelp.plateNumber} to Gate Supervisor duty officer.
            </p>

            <div className="space-y-2 pt-2">
              <a href="tel:+919800011122" className="w-full block">
                <button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-md">
                  <Phone className="w-5 h-5" />
                  <span>{lang === "hi" ? "📞 हाँ, कॉल करें" : "📞 CALL SUPERVISOR"}</span>
                </button>
              </a>

              <button
                onClick={() => setSelectedIncidentForHelp(null)}
                className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer"
              >
                {lang === "hi" ? "रद्द करें" : "CANCEL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED GATE GUARD BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 h-20 px-4 flex items-center justify-around shadow-2xl text-white">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center gap-1 font-black text-xs ${
            activeTab === "home" ? "text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <Home className="w-6 h-6" />
          <span>{lang === "hi" ? "होम" : "HOME"}</span>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={`flex flex-col items-center justify-center gap-1 font-black text-xs ${
            activeTab === "search" ? "text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-6 h-6" />
          <span>{lang === "hi" ? "वाहन" : "VEHICLE"}</span>
        </button>

        <button
          onClick={() => setActiveTab("report")}
          className={`flex flex-col items-center justify-center gap-1 font-black text-xs ${
            activeTab === "report" ? "text-rose-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <Plus className="w-6 h-6" />
          <span>{lang === "hi" ? "रिपोर्ट" : "REPORT"}</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex flex-col items-center justify-center gap-1 font-black text-xs ${
            activeTab === "contact" ? "text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <PhoneCall className="w-6 h-6" />
          <span>{lang === "hi" ? "संपर्क" : "CONTACT"}</span>
        </button>
      </nav>
    </div>
  );
}

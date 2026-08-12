"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Car,
  ShieldAlert,
  Users,
  Clock,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Send,
  Plus,
  Lock,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  Settings as SettingsIcon,
  Bell,
  QrCode,
  Megaphone,
  Download,
  Server,
  BarChart3,
  MapPin,
  RefreshCw,
  Eye,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { QrPosterGenerator } from "./QrPosterGenerator";
import { formatPlateNumber, formatDateTime, timeAgo } from "@/lib/utils";

export function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "vehicles" | "residents" | "incidents" | "zones" | "analytics" | "security" | "announcements" | "audit" | "credentials" | "system" | "qr"
  >("overview");

  // KPI Metrics State
  const [metrics, setMetrics] = useState<any>({
    totalVehicles: 0,
    activeVehicles: 0,
    pendingVehicles: 0,
    flaggedVehicles: 0,
    activeIncidents: 0,
    incidentsToday: 0,
    resolvedToday: 0,
    avgResolutionMinutes: 12,
    escalatedIncidents: 0,
    totalResidents: 0,
    totalGuards: 0,
    towerStats: { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, Mandir: 0, "Park Boundary": 0 },
    zoneStats: { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, Mandir: 0, "Park Boundary": 0 },
  });

  // Vehicles Directory State (Paginated & Filtered)
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclePage, setVehiclePage] = useState(1);
  const [totalVehiclePages, setTotalVehiclePages] = useState(1);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleTowerFilter, setVehicleTowerFilter] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState("");

  // Residents Directory State (Paginated & Filtered)
  const [residents, setResidents] = useState<any[]>([]);
  const [residentPage, setResidentPage] = useState(1);
  const [totalResidentPages, setTotalResidentPages] = useState(1);
  const [residentSearch, setResidentSearch] = useState("");
  const [residentTowerFilter, setResidentTowerFilter] = useState("");

  // Incidents State
  const [incidents, setIncidents] = useState<any[]>([]);
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // System Health State
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annCategory, setAnnCategory] = useState("general");
  const [annTarget, setAnnTarget] = useState("all");
  const [annIsPinned, setAnnIsPinned] = useState(false);
  const [isPostingAnn, setIsPostingAnn] = useState(false);
  const [annMsg, setAnnMsg] = useState("");

  // Guard Duty State & Modal
  const [guards, setGuards] = useState<any[]>([]);
  const [isAddGuardOpen, setIsAddGuardOpen] = useState(false);
  const [guardName, setGuardName] = useState("");
  const [guardPhone, setGuardPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Functions
  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (data.success) setMetrics(data.metrics);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.success) setIncidents(data.incidents || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVehicles = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: vehicleSearch,
        tower: vehicleTowerFilter,
        type: vehicleTypeFilter,
        status: vehicleStatusFilter,
      });
      const res = await fetch(`/api/admin/vehicles?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setVehicles(data.vehicles || []);
        setTotalVehiclePages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchResidents = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: residentSearch,
        tower: residentTowerFilter,
      });
      const res = await fetch(`/api/admin/residents?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResidents(data.residents || []);
        setTotalResidentPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data.success) setAuditLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const res = await fetch("/api/admin/system");
      const data = await res.json();
      if (data.success) setSystemHealth(data.system);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchIncidents();
    fetchVehicles(1);
    fetchResidents(1);
    fetchAuditLogs();
    fetchAnnouncements();
    fetchSystemHealth();
  }, []);

  useEffect(() => {
    fetchVehicles(1);
  }, [vehicleSearch, vehicleTowerFilter, vehicleTypeFilter, vehicleStatusFilter]);

  useEffect(() => {
    fetchResidents(1);
  }, [residentSearch, residentTowerFilter]);

  // Action Handlers
  const handleVehicleAction = async (vehicleId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/vehicles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchVehicles(vehiclePage);
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResidentAction = async (userId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/residents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchResidents(residentPage);
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      setAnnMsg("Please enter Title and Content.");
      return;
    }

    setIsPostingAnn(true);
    setAnnMsg("");

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle.trim(),
          content: annContent.trim(),
          category: annCategory,
          targetAudience: annTarget,
          isPinned: annIsPinned,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAnnTitle("");
        setAnnContent("");
        setAnnMsg("Announcement published successfully to portal.");
        fetchAnnouncements();
      } else {
        setAnnMsg(data.message || "Failed to post announcement.");
      }
    } catch (err) {
      setAnnMsg("Connection error.");
    } finally {
      setIsPostingAnn(false);
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        fetchIncidents();
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const towers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "Mandir", "Park Boundary"];

  return (
    <div className="space-y-6 py-2 text-slate-900 font-sans">
      {/* Super Admin Top Greeting Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Adore Grand • Sector 85, Faridabad
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-1">
            Good morning, Super Admin
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <a href="/api/admin/vehicles/export" download className="block">
            <Button variant="outline" size="sm" className="font-extrabold text-xs rounded-xl border-slate-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
            </Button>
          </a>
          <button
            onClick={() => {
              fetchMetrics();
              fetchIncidents();
              fetchVehicles(vehiclePage);
              fetchResidents(residentPage);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Total Vehicles
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.totalVehicles}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Active Residents
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.totalResidents}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Active Guards
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.totalGuards}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">
            Open Incidents
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-900 font-mono flex items-center justify-between">
            <span>{metrics.activeIncidents}</span>
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Incidents Today
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.incidentsToday}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">
            Escalated
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-900 font-mono">
            {metrics.escalatedIncidents}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
            Resolved Today
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono flex items-center justify-between">
            <span>{metrics.resolvedToday}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "overview" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Overview
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "vehicles" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Car className="w-3.5 h-3.5" /> Vehicle Directory
        </button>

        <button
          onClick={() => setActiveTab("residents")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "residents" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Resident Directory
        </button>

        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "incidents" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Incidents ({metrics.activeIncidents})
        </button>

        <button
          onClick={() => setActiveTab("zones")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "zones" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Zone Intelligence
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "analytics" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Analytics
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "security" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Security Duty
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "announcements" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-400" /> Announcements
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "audit" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Audit Logs
        </button>

        <button
          onClick={() => setActiveTab("credentials")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "credentials" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Staff Credentials
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "system" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" /> System Health
        </button>
      </div>

      {/* MODULE 1: FULL VEHICLE DIRECTORY */}
      {activeTab === "vehicles" && (
        <Card className="border-slate-200 bg-white shadow-sm space-y-4 p-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">FULL VEHICLE DIRECTORY</h3>
              <p className="text-xs text-slate-500 font-medium">Complete society registered vehicle database</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a href="/api/admin/vehicles/export" download>
                <Button variant="outline" size="sm" className="font-extrabold text-xs rounded-xl border-slate-300 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-600" /> CSV Export
                </Button>
              </a>
            </div>
          </div>

          {/* Vehicle Directory Filters & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <input
              type="text"
              placeholder="Search plate, owner, tower, flat..."
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              className="px-3.5 h-10 text-xs font-mono font-bold rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-emerald-600"
            />

            <select
              value={vehicleTowerFilter}
              onChange={(e) => setVehicleTowerFilter(e.target.value)}
              className="px-3 h-10 text-xs font-bold rounded-xl bg-white border border-slate-300 focus:outline-none"
            >
              <option value="">All Towers & Zones</option>
              {towers.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="px-3 h-10 text-xs font-bold rounded-xl bg-white border border-slate-300 focus:outline-none"
            >
              <option value="">All Vehicle Types</option>
              <option value="car">Car</option>
              <option value="bike">Bike / Scooter</option>
              <option value="ev">EV</option>
              <option value="commercial">Commercial</option>
            </select>

            <select
              value={vehicleStatusFilter}
              onChange={(e) => setVehicleStatusFilter(e.target.value)}
              className="px-3 h-10 text-xs font-bold rounded-xl bg-white border border-slate-300 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="unregistered">Inactive / Deactivated</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Vehicles Directory Desktop Table / Mobile Cards */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px] font-black tracking-wider">
                <tr>
                  <th className="p-3">Vehicle Plate</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Make / Model</th>
                  <th className="p-3">Owner Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Tower / Flat</th>
                  <th className="p-3">Zone / Slot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-slate-500 font-bold">
                      No vehicles found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-black text-slate-900">
                        {formatPlateNumber(v.plateNumber)}
                      </td>
                      <td className="p-3 uppercase font-mono text-[11px] font-bold text-slate-600">
                        {v.vehicleType}
                      </td>
                      <td className="p-3 font-bold text-slate-800">{v.makeModel}</td>
                      <td className="p-3 font-bold text-slate-900">{v.owner?.name || "Adore Resident"}</td>
                      <td className="p-3 font-mono text-slate-700">{v.owner?.phone || "N/A"}</td>
                      <td className="p-3 font-bold text-slate-800">Tower {v.tower} • {v.flatNumber}</td>
                      <td className="p-3 text-slate-600">{v.parkingZone || v.tower} ({v.parkingSlot || "N/A"})</td>
                      <td className="p-3">
                        <Badge variant={v.status === "active" ? "success" : v.status === "flagged" ? "danger" : "neutral"}>
                          {v.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {v.status === "active" ? (
                            <button
                              onClick={() => handleVehicleAction(v.id, "deactivate")}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition cursor-pointer"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVehicleAction(v.id, "reactivate")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition cursor-pointer"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-500 font-medium">Page {vehiclePage} of {totalVehiclePages}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={vehiclePage <= 1}
                onClick={() => setVehiclePage((p) => Math.max(1, p - 1))}
                className="rounded-xl border-slate-300"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={vehiclePage >= totalVehiclePages}
                onClick={() => setVehiclePage((p) => Math.min(totalVehiclePages, p + 1))}
                className="rounded-xl border-slate-300"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* MODULE 2: RESIDENT DIRECTORY */}
      {activeTab === "residents" && (
        <Card className="border-slate-200 bg-white shadow-sm space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">RESIDENT DIRECTORY</h3>
              <p className="text-xs text-slate-500 font-medium">Verified Adore Grand resident user profiles</p>
            </div>

            <a href="/api/admin/residents/export" download>
              <Button variant="outline" size="sm" className="font-extrabold text-xs rounded-xl border-slate-300 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
              </Button>
            </a>
          </div>

          {/* Resident Directory Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <input
              type="text"
              placeholder="Search resident name, phone, tower, flat..."
              value={residentSearch}
              onChange={(e) => setResidentSearch(e.target.value)}
              className="px-3.5 h-10 text-xs font-bold rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-emerald-600"
            />

            <select
              value={residentTowerFilter}
              onChange={(e) => setResidentTowerFilter(e.target.value)}
              className="px-3 h-10 text-xs font-bold rounded-xl bg-white border border-slate-300 focus:outline-none"
            >
              <option value="">All Towers</option>
              {towers.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Resident Directory Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px] font-black tracking-wider">
                <tr>
                  <th className="p-3">Resident Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Tower</th>
                  <th className="p-3">Flat</th>
                  <th className="p-3">Registered Vehicles</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {residents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{r.name}</td>
                    <td className="p-3 font-mono text-slate-700">{r.phone}</td>
                    <td className="p-3 font-bold text-slate-800">Tower {r.tower}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{r.flatNumber}</td>
                    <td className="p-3 font-mono font-black text-emerald-800">{r.vehicleCount} Vehicles</td>
                    <td className="p-3">
                      <Badge variant={r.status === "active" ? "success" : "danger"}>
                        {(r.status || "active").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === "suspended" ? (
                        <button
                          onClick={() => handleResidentAction(r.id, "activate")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition cursor-pointer"
                        >
                          Restore Account
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResidentAction(r.id, "suspend")}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition cursor-pointer"
                        >
                          Disable Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODULE 3: SYSTEM HEALTH */}
      {activeTab === "system" && systemHealth && (
        <Card className="border-slate-200 bg-white shadow-sm space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">SYSTEM HEALTH MONITOR</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time AdorePark infrastructure diagnostics</p>
            </div>
            <Badge variant="success">All Systems Operational</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-slate-900">MongoDB Atlas Database</strong>
                <Badge variant="success">{systemHealth.database.status}</Badge>
              </div>
              <p className="text-xs text-slate-600 font-medium">Provider: {systemHealth.database.provider}</p>
              <p className="text-xs text-slate-500 font-mono">Connection Latency: {systemHealth.database.ping}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-slate-900">Authentication System</strong>
                <Badge variant="success">{systemHealth.authentication.status}</Badge>
              </div>
              <p className="text-xs text-slate-600 font-medium">Cookie: {systemHealth.authentication.sessionCookie}</p>
              <p className="text-xs text-slate-500 font-mono">JWT Algorithm: {systemHealth.authentication.jwtAlgorithm}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-slate-900">Browser Web Push</strong>
                <Badge variant="success">{systemHealth.webPush.status}</Badge>
              </div>
              <p className="text-xs text-slate-600 font-medium">Subject: {systemHealth.webPush.vapidSubject}</p>
            </div>
          </div>
        </Card>
      )}

      {/* MODULE 4: ANNOUNCEMENTS STUDIO */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Megaphone className="w-5 h-5 text-emerald-600" />
                  Post Society Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {annMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
                    {annMsg}
                  </div>
                )}
                <form onSubmit={handlePostAnnouncement} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Basement B1 Cleaning Schedule"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full px-3.5 h-11 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">Target Audience</label>
                    <select
                      value={annTarget}
                      onChange={(e) => setAnnTarget(e.target.value)}
                      className="w-full px-3 h-11 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                    >
                      <option value="all">All Adore Grand Residents</option>
                      <option value="T1">Tower T1</option>
                      <option value="T2">Tower T2</option>
                      <option value="T3">Tower T3</option>
                      <option value="T4">Tower T4</option>
                      <option value="T5">Tower T5</option>
                      <option value="T6">Tower T6</option>
                      <option value="T7">Tower T7</option>
                      <option value="security">Gate 1 Security Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">Content *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Notice details..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-300 font-medium"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-11 font-black text-xs rounded-xl bg-emerald-600 text-white"
                    isLoading={isPostingAnn}
                  >
                    Publish Announcement
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-heading">PUBLISHED ANNOUNCEMENTS ({announcements.length})</h3>
            {announcements.map((a) => (
              <Card key={a.id} className="border-slate-200 bg-white shadow-xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="info">{a.category.toUpperCase()}</Badge>
                    <span className="text-[11px] font-mono text-slate-400">{formatDateTime(a.createdAt)}</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">{a.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{a.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-heading">ACTIVE INCIDENTS COMMAND BOARD</h3>
            {incidents.filter((i) => i.status !== "RESOLVED" && i.status !== "resolved").length === 0 ? (
              <Card className="border-slate-200 bg-emerald-50/40 p-8 text-center">
                <CardContent className="flex flex-col items-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-800">All Society Parking Zones Clear</h4>
                </CardContent>
              </Card>
            ) : (
              incidents.filter((i) => i.status !== "RESOLVED" && i.status !== "resolved").map((inc) => (
                <Card key={inc.id} className="border-rose-200 bg-white shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono font-black text-lg text-slate-900">
                        {formatPlateNumber(inc.plateNumber)}
                      </span>
                      <p className="text-xs text-slate-500 font-bold">{inc.location} • {timeAgo(inc.createdAt)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      className="font-bold text-xs rounded-xl bg-emerald-600 text-white"
                      onClick={() => handleResolveIncident(inc.id)}
                    >
                      Resolve Incident
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-heading">EXPORT CONTROL CENTER</h3>
            <Card className="border-slate-200 bg-white p-4 space-y-2.5">
              <a href="/api/admin/vehicles/export" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300 justify-start">
                  <Download className="w-4 h-4 text-emerald-600 mr-2" /> Vehicle Directory (CSV)
                </Button>
              </a>
              <a href="/api/admin/residents/export" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300 justify-start">
                  <Download className="w-4 h-4 text-emerald-600 mr-2" /> Resident Directory (CSV)
                </Button>
              </a>
              <a href="/api/admin/incidents/export" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300 justify-start">
                  <Download className="w-4 h-4 text-emerald-600 mr-2" /> Incident Report (CSV)
                </Button>
              </a>
              <a href="/api/admin/audit-logs/export" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300 justify-start">
                  <Download className="w-4 h-4 text-emerald-600 mr-2" /> Audit Trail Log (CSV)
                </Button>
              </a>
              <a href="/api/admin/credentials/export?format=csv" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300 justify-start">
                  <Download className="w-4 h-4 text-emerald-600 mr-2" /> Staff Credentials (CSV)
                </Button>
              </a>
            </Card>
          </div>
        </div>
      )}

      {/* QR POSTERS TAB */}
      {activeTab === "qr" && <QrPosterGenerator />}
    </div>
  );
}

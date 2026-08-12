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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { IncidentTimelineView } from "@/components/incident/IncidentTimelineView";
import { QrPosterGenerator } from "./QrPosterGenerator";
import { formatPlateNumber, formatDateTime, timeAgo } from "@/lib/utils";

export function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "incidents" | "vehicles" | "residents" | "security" | "qr" | "audit" | "settings"
  >("overview");

  // KPI Metrics State
  const [metrics, setMetrics] = useState<any>({
    totalVehicles: 0,
    activeIncidents: 0,
    incidentsToday: 0,
    avgResolutionMinutes: 12,
    escalatedIncidents: 0,
    totalResidents: 0,
    totalGuards: 0,
  });

  // Incidents State
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  // Vehicles State (Paginated)
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclePage, setVehiclePage] = useState(1);
  const [totalVehiclePages, setTotalVehiclePages] = useState(1);
  const [vehicleSearch, setVehicleSearch] = useState("");

  // Residents State (Paginated)
  const [residents, setResidents] = useState<any[]>([]);
  const [residentPage, setResidentPage] = useState(1);
  const [totalResidentPages, setTotalResidentPages] = useState(1);
  const [residentSearch, setResidentSearch] = useState("");

  // Audit Logs State (Paginated)
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Security Staff Modal State
  const [isAddGuardOpen, setIsAddGuardOpen] = useState(false);
  const [guardName, setGuardName] = useState("");
  const [guardPhone, setGuardPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchVehicles = async (page = 1, search = "") => {
    try {
      const res = await fetch(`/api/admin/vehicles?page=${page}&limit=8&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setVehicles(data.vehicles || []);
        setTotalVehiclePages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchResidents = async (page = 1, search = "") => {
    try {
      const res = await fetch(`/api/admin/residents?page=${page}&limit=8&search=${encodeURIComponent(search)}`);
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

  useEffect(() => {
    fetchMetrics();
    fetchIncidents();
    fetchVehicles(vehiclePage, vehicleSearch);
    fetchResidents(residentPage, residentSearch);
    fetchAuditLogs();
  }, []);

  const handleSearchVehicles = (e: React.FormEvent) => {
    e.preventDefault();
    setVehiclePage(1);
    fetchVehicles(1, vehicleSearch);
  };

  const handleSearchResidents = (e: React.FormEvent) => {
    e.preventDefault();
    setResidentPage(1);
    fetchResidents(1, residentSearch);
  };

  const handleAddGuard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guardName, phone: guardPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddGuardOpen(false);
        setGuardName("");
        setGuardPhone("");
        fetchResidents(residentPage, residentSearch);
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchResidents(residentPage, residentSearch);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIncidentAction = async (incidentId: string, actionEndpoint: string) => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}/${actionEndpoint}`, {
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

  const activeIncidentsList = incidents.filter(
    (i) => i.status !== "RESOLVED" && i.status !== "CANCELLED" && i.status !== "resolved" && i.status !== "cancelled"
  );

  return (
    <div className="space-y-6 py-2">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Vehicles
          </span>
          <div className="text-2xl font-black text-white flex items-center justify-between">
            <span>{metrics.totalVehicles}</span>
            <Car className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
            Active Incidents
          </span>
          <div className="text-2xl font-black text-rose-100 flex items-center justify-between">
            <span>{metrics.activeIncidents}</span>
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Incidents Today
          </span>
          <div className="text-2xl font-black text-slate-100 flex items-center justify-between">
            <span>{metrics.incidentsToday}</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg Resolution
          </span>
          <div className="text-2xl font-black text-emerald-400 flex items-center justify-between">
            <span>{metrics.avgResolutionMinutes} mins</span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
            Escalations
          </span>
          <div className="text-2xl font-black text-rose-300 flex items-center justify-between">
            <span>{metrics.escalatedIncidents}</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "overview" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" /> Overview
        </button>

        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "incidents" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Active Incidents ({activeIncidentsList.length})
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "vehicles" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Car className="w-4 h-4" /> Vehicles
        </button>

        <button
          onClick={() => setActiveTab("residents")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "residents" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> Residents
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "security" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" /> Security Staff
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "qr" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-400" /> QR Posters
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "audit" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" /> Audit Logs
        </button>
      </div>

      {/* TAB: QR POSTERS GENERATOR */}
      {activeTab === "qr" && <QrPosterGenerator />}

      {/* TAB 1: OVERVIEW & ACTIVE INCIDENT BOARD */}
      {(activeTab === "overview" || activeTab === "incidents") && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Live Active Incident Board ({activeIncidentsList.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchIncidents}>
              Refresh Stream
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-y border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-4">Vehicle Plate</th>
                    <th className="p-4">Flat / Owner</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Reported</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Duty Security</th>
                    <th className="p-4 text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeIncidentsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                        No active parking blockages reported right now.
                      </td>
                    </tr>
                  ) : (
                    activeIncidentsList.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-900/60 transition">
                        <td className="p-4 font-mono font-black text-sm text-white">
                          {formatPlateNumber(inc.plateNumber)}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-200 block">
                            {inc.owner ? inc.owner.name : "Unregistered Owner"}
                          </span>
                          <span className="text-[11px] text-emerald-400">
                            {inc.owner ? `${inc.owner.tower} - ${inc.owner.flatNumber}` : "Visitor"}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-300">{inc.location}</td>
                        <td className="p-4 font-mono text-slate-400">{timeAgo(inc.createdAt)}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              inc.status === "ESCALATED" || inc.status === "escalated"
                                ? "danger"
                                : inc.status === "CONTACTED" || inc.status === "REMINDER_SENT"
                                ? "warning"
                                : "info"
                            }
                          >
                            {inc.status}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium text-slate-400">
                          {inc.resolvedBy || "Gate 1 Guard"}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedIncident(inc);
                                setIsTimelineModalOpen(true);
                              }}
                              className="text-xs"
                            >
                              Timeline
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIncidentAction(inc.id, "reminder")}
                              className="text-xs border-slate-700 text-amber-400"
                            >
                              Remind
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleIncidentAction(inc.id, "escalate")}
                              className="text-xs"
                            >
                              Escalate
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleIncidentAction(inc.id, "resolve")}
                              className="text-xs"
                            >
                              Resolve
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: VEHICLES MANAGEMENT */}
      {activeTab === "vehicles" && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl text-emerald-400 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Registered Vehicles Database
            </CardTitle>

            <form onSubmit={handleSearchVehicles} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search plate, make, flat..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <Button type="submit" variant="primary" size="sm">
                <Search className="w-3.5 h-3.5" />
              </Button>
            </form>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-y border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-4">Plate Number</th>
                    <th className="p-4">Type & Model</th>
                    <th className="p-4">Resident Owner</th>
                    <th className="p-4">Tower & Flat</th>
                    <th className="p-4">Slot / Pass</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 font-mono font-black text-sm text-slate-100">
                        {formatPlateNumber(v.plateNumber)}
                      </td>
                      <td className="p-4 font-medium text-slate-300">{v.makeModel} ({v.vehicleType})</td>
                      <td className="p-4 font-bold text-slate-200">
                        {v.owner ? v.owner.name : "N/A"}
                      </td>
                      <td className="p-4 font-medium text-emerald-400">{v.tower} - Flat {v.flatNumber}</td>
                      <td className="p-4 font-mono text-slate-400">{v.parkingSlot || "Slot B1"}</td>
                      <td className="p-4">
                        <Badge variant={v.status === "active" ? "success" : "neutral"}>
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Page {vehiclePage} of {totalVehiclePages}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vehiclePage <= 1}
                  onClick={() => {
                    setVehiclePage(vehiclePage - 1);
                    fetchVehicles(vehiclePage - 1, vehicleSearch);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vehiclePage >= totalVehiclePages}
                  onClick={() => {
                    setVehiclePage(vehiclePage + 1);
                    fetchVehicles(vehiclePage + 1, vehicleSearch);
                  }}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: RESIDENTS MANAGEMENT */}
      {activeTab === "residents" && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl text-emerald-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Resident & User Directory
            </CardTitle>

            <form onSubmit={handleSearchResidents} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search name, phone, flat..."
                value={residentSearch}
                onChange={(e) => setResidentSearch(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <Button type="submit" variant="primary" size="sm">
                <Search className="w-3.5 h-3.5" />
              </Button>
            </form>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-y border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-4">Resident Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Tower & Flat</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Account Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {residents.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 font-bold text-slate-100">{r.name}</td>
                      <td className="p-4 font-mono text-slate-400">{r.phone}</td>
                      <td className="p-4 font-medium text-emerald-400">{r.tower} - Flat {r.flatNumber}</td>
                      <td className="p-4">
                        <Badge variant="neutral">{r.role}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={r.status === "active" ? "success" : "danger"}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant={r.status === "active" ? "danger" : "primary"}
                          size="sm"
                          onClick={() => handleToggleUserStatus(r.id, r.status)}
                          className="text-xs"
                        >
                          {r.status === "active" ? "Deactivate Account" : "Reactivate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Page {residentPage} of {totalResidentPages}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={residentPage <= 1}
                  onClick={() => {
                    setResidentPage(residentPage - 1);
                    fetchResidents(residentPage - 1, residentSearch);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={residentPage >= totalResidentPages}
                  onClick={() => {
                    setResidentPage(residentPage + 1);
                    fetchResidents(residentPage + 1, residentSearch);
                  }}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: SECURITY STAFF MANAGEMENT */}
      {activeTab === "security" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-rose-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Guard Duty Roster
            </CardTitle>
            <Button variant="primary" size="sm" onClick={() => setIsAddGuardOpen(true)}>
              <Plus className="w-4 h-4" /> Add Security Officer
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-y border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-4">Guard Name</th>
                    <th className="p-4">Duty Phone</th>
                    <th className="p-4">Duty Station</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {residents
                    .filter((u) => u.role === "security")
                    .map((guard) => (
                      <tr key={guard.id} className="hover:bg-slate-900/60 transition">
                        <td className="p-4 font-bold text-slate-100">{guard.name}</td>
                        <td className="p-4 font-mono text-emerald-400">{guard.phone}</td>
                        <td className="p-4 font-medium text-slate-300">{guard.tower} ({guard.flatNumber})</td>
                        <td className="p-4">
                          <Badge variant="danger">{guard.role}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="success">{guard.status}</Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === "audit" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-400 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Security & Administrative Audit Log Trail
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-y border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Target Type</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 font-mono text-slate-400">{formatDateTime(log.createdAt)}</td>
                      <td className="p-4 font-medium text-slate-200">
                        {log.actor.name} ({log.actor.role})
                      </td>
                      <td className="p-4">
                        <Badge variant="info">{log.action}</Badge>
                      </td>
                      <td className="p-4 font-mono text-slate-300 capitalize">{log.targetType}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Security Guard Modal */}
      <Modal
        isOpen={isAddGuardOpen}
        onClose={() => setIsAddGuardOpen(false)}
        title="Add Security Guard"
        subtitle="Provision duty access for Gate 1 / Gate 2 security guards"
      >
        <form onSubmit={handleAddGuard} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Security Officer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar (Gate 1)"
              value={guardName}
              onChange={(e) => setGuardName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Duty Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. 9800011122"
              value={guardPhone}
              onChange={(e) => setGuardPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddGuardOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Provision Guard Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Incident Timeline Modal */}
      {selectedIncident && (
        <Modal
          isOpen={isTimelineModalOpen}
          onClose={() => setIsTimelineModalOpen(false)}
          title={`Incident Timeline: ${selectedIncident.incidentNumber}`}
          subtitle={`Vehicle: ${formatPlateNumber(selectedIncident.plateNumber)} • Location: ${selectedIncident.location}`}
        >
          <IncidentTimelineView timeline={selectedIncident.timeline || []} />
          <div className="pt-4 flex justify-end">
            <Button variant="ghost" onClick={() => setIsTimelineModalOpen(false)}>
              Close Timeline
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

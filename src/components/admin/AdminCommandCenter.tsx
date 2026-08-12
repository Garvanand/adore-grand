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
  Pin,
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
    "overview" | "incidents" | "vehicles" | "residents" | "security" | "announcements" | "qr" | "audit" | "settings"
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

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annCategory, setAnnCategory] = useState("general");
  const [annIsPinned, setAnnIsPinned] = useState(false);
  const [isPostingAnn, setIsPostingAnn] = useState(false);
  const [annMsg, setAnnMsg] = useState("");

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

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements || []);
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
    fetchAnnouncements();
  }, []);

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
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
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

  const activeIncidentsList = incidents.filter(
    (i) => i.status !== "RESOLVED" && i.status !== "CANCELLED" && i.status !== "resolved" && i.status !== "cancelled"
  );

  return (
    <div className="space-y-6 py-2 text-slate-900">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Total Vehicles
          </span>
          <div className="text-2xl font-black text-slate-900 flex items-center justify-between font-mono">
            <span>{metrics.totalVehicles}</span>
            <Car className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider block">
            Active Incidents
          </span>
          <div className="text-2xl font-black text-rose-900 flex items-center justify-between font-mono">
            <span>{metrics.activeIncidents}</span>
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Incidents Today
          </span>
          <div className="text-2xl font-black text-slate-900 flex items-center justify-between font-mono">
            <span>{metrics.incidentsToday}</span>
            <Activity className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Avg Resolution
          </span>
          <div className="text-2xl font-black text-emerald-700 flex items-center justify-between font-mono">
            <span>{metrics.avgResolutionMinutes} mins</span>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider block">
            Escalations
          </span>
          <div className="text-2xl font-black text-rose-900 flex items-center justify-between font-mono">
            <span>{metrics.escalatedIncidents}</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "overview" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Activity className="w-4 h-4" /> Overview
        </button>

        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "incidents" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Active Incidents ({activeIncidentsList.length})
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "vehicles" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Car className="w-4 h-4" /> Vehicles
        </button>

        <button
          onClick={() => setActiveTab("residents")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "residents" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Users className="w-4 h-4" /> Residents
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "announcements" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-500" /> Announcements Studio
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "security" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Shield className="w-4 h-4" /> Security Duty
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "qr" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <QrCode className="w-4 h-4" /> QR Posters
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "audit" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" /> Audit Logs
        </button>
      </div>

      {/* TAB CONTENT: ANNOUNCEMENTS STUDIO (Super Admin Only) */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 5 COLS: CREATE ANNOUNCEMENT FORM */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Megaphone className="w-5 h-5 text-emerald-600" />
                  Post New Society Notice
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {annMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
                    {annMsg}
                  </div>
                )}

                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      Announcement Title *
                    </label>
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
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      Notice Category
                    </label>
                    <select
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value)}
                      className="w-full px-3 h-11 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none"
                    >
                      <option value="general">General Society Notice</option>
                      <option value="parking">Parking & Vehicles</option>
                      <option value="maintenance">Basement & Lift Maintenance</option>
                      <option value="urgent">Urgent Security Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      Detailed Content *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Enter detailed notice content for Adore Grand residents..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-300 font-medium focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pinCheck"
                      checked={annIsPinned}
                      onChange={(e) => setAnnIsPinned(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <label htmlFor="pinCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Pin Notice to top of Announcements page
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full h-12 font-black text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    isLoading={isPostingAnn}
                  >
                    Publish Notice to Portal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT 7 COLS: RECENT ANNOUNCEMENTS */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-heading">
              PUBLISHED ANNOUNCEMENTS ({announcements.length})
            </h3>

            {announcements.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 font-bold text-xs">
                No announcements published yet.
              </div>
            ) : (
              announcements.map((a) => (
                <Card key={a.id} className="border-slate-200 bg-white shadow-xs">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={a.category === "urgent" ? "danger" : "info"}>
                        {a.category.toUpperCase()}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatDateTime(a.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900">{a.title}</h4>
                    <p className="text-xs text-slate-600 font-medium whitespace-pre-line">{a.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-heading">ACTIVE INCIDENTS BOARD</h3>
            {activeIncidentsList.length === 0 ? (
              <Card className="border-slate-200 bg-emerald-50/40 p-8 text-center">
                <CardContent className="flex flex-col items-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-800">All Society Parking Zones Clear</h4>
                </CardContent>
              </Card>
            ) : (
              activeIncidentsList.map((inc) => (
                <Card key={inc.id} className="border-rose-200 bg-white shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono font-black text-lg text-slate-900">
                        {formatPlateNumber(inc.vehiclePlate)}
                      </span>
                      <p className="text-xs text-slate-500 font-bold">{inc.location} • {timeAgo(inc.reportedAt)}</p>
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
            <h3 className="text-lg font-black text-slate-900 font-heading">QUICK ACTIONS</h3>
            <Card className="border-slate-200 bg-white p-4 space-y-3">
              <a href="/api/admin/credentials/export?format=csv" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300">
                  Export Staff Credentials (CSV)
                </Button>
              </a>
              <a href="/api/admin/credentials/export?format=txt" download className="block w-full">
                <Button variant="outline" size="sm" className="w-full font-bold text-xs rounded-xl border-slate-300">
                  Export Staff Credentials (TXT)
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

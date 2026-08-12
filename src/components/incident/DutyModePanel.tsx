"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Phone, CheckCircle2, AlertTriangle, Clock, MapPin, RefreshCw, Car, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatPlateNumber, timeAgo } from "@/lib/utils";

export function DutyModePanel() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("Owner arrived and cleared the parking blockage.");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Poll every 10 seconds for night duty alerts
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/incidents/${selectedIncident.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionNote }),
      });
      const data = await res.json();
      if (data.success) {
        setIsResolveModalOpen(false);
        fetchIncidents();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved");

  return (
    <div className="space-y-6">
      {/* Duty Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Active Escalations</span>
            <div className="text-3xl font-black text-rose-100 mt-1">{activeIncidents.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Resolved Today</span>
            <div className="text-3xl font-black text-emerald-100 mt-1">{resolvedIncidents.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Duty Station</span>
            <div className="text-sm font-bold text-slate-100 mt-1">Gate 1 Main Security Office</div>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchIncidents} className="text-slate-400 hover:text-white">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Active Incidents Stream */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              Live Escalations & Parking Blockages
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">High-contrast touch controls for night duty security staff</p>
          </div>
          <Badge variant={activeIncidents.length > 0 ? "danger" : "success"}>
            {activeIncidents.length > 0 ? "ATTENTION REQUIRED" : "ALL CLEAR"}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {activeIncidents.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">No active parking blockages reported right now.</p>
              <p className="text-xs text-slate-500 mt-1">New resident escalations will appear here in real-time.</p>
            </div>
          ) : (
            activeIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-5 rounded-2xl bg-slate-950 border-2 border-rose-600/40 hover:border-rose-500 shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xl text-white tracking-wider">
                          {formatPlateNumber(incident.plateNumber)}
                        </span>
                        <Badge variant="danger">{incident.priority}</Badge>
                      </div>
                      <span className="text-xs text-rose-400 font-semibold">{incident.incidentNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {incident.owner && (
                      <a href={`tel:${incident.owner.phone}`}>
                        <Button variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                          <Phone className="w-4 h-4" />
                          Call Owner
                        </Button>
                      </a>
                    )}

                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setSelectedIncident(incident);
                        setIsResolveModalOpen(true);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 font-bold border border-slate-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Mark Resolved
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Blockage Spot
                    </span>
                    <strong className="text-slate-100 text-sm">{incident.location}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium">Registered Owner</span>
                    <strong className="text-slate-100 text-sm">
                      {incident.owner ? `${incident.owner.name} (${incident.owner.tower} - ${incident.owner.flatNumber})` : "Unregistered Owner"}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Reported By
                    </span>
                    <strong className="text-slate-100 text-sm">
                      {incident.reportedBy ? `${incident.reportedBy.name} (${incident.reportedBy.tower}-${incident.reportedBy.flatNumber})` : "Resident"} ({timeAgo(incident.createdAt)})
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resolution Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Resolve Parking Incident"
        subtitle={selectedIncident ? `Vehicle: ${formatPlateNumber(selectedIncident.plateNumber)} (${selectedIncident.incidentNumber})` : ""}
      >
        <form onSubmit={handleResolve} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Guard Duty Resolution Note *
            </label>
            <textarea
              rows={3}
              required
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
              placeholder="e.g. Guard visited basement, owner arrived and moved car to slot B1-42."
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Confirm Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

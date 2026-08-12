"use client";

import React, { useState, useEffect } from "react";
import { Car, Plus, Bell, ShieldAlert, CheckCircle2, Clock, MapPin, Send, AlertTriangle, ArrowRight, Eye, Phone, MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AddVehicleModal } from "@/components/vehicle/AddVehicleModal";
import { VehicleGraphic } from "@/components/illustration/vehicles/VehicleGraphic";
import { formatPlateNumber, timeAgo, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [userRes, vehicleRes, incidentRes, notifRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/vehicles"),
        fetch("/api/incidents"),
        fetch("/api/notifications"),
      ]);

      const userData = await userRes.json();
      const vehicleData = await vehicleRes.json();
      const incidentData = await incidentRes.json();
      const notifData = await notifRes.json();

      if (userData.authenticated) setUser(userData.user);
      if (vehicleData.success) setVehicles(vehicleData.vehicles || []);
      if (incidentData.success) setIncidents(incidentData.incidents || []);
      if (notifData.success) setNotifications(notifData.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcknowledge = async (incidentId: string, action: "moving" | "checking") => {
    if (!incidentId) return;
    setActionLoadingId(incidentId);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents((prev) =>
          prev.map((inc) =>
            (inc.id === incidentId || inc._id === incidentId)
              ? { ...inc, status: "CONTACTED" }
              : inc
          )
        );
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEscalateIncident = async (incidentId: string) => {
    if (!incidentId) return;
    try {
      const res = await fetch(`/api/incidents/${incidentId}/escalate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Resident requested escalation from portal." }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    if (!incidentId) return;
    setActionLoadingId(incidentId);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionNote: "Owner responded and cleared the parking space." }),
      });
      const data = await res.json();
      if (data.success) {
        // Remove resolved incident immediately from local state
        setIncidents((prev) =>
          prev.filter((inc) => inc.id !== incidentId && inc._id !== incidentId)
        );
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 py-2 max-w-6xl mx-auto page-enter">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase font-mono tracking-wider">
            Adore Grand Resident Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            Good evening, {user?.name || "Resident"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Tower {user?.tower || "T1"} • Flat {user?.flatNumber || "1204"} • Sector 85 Faridabad
          </p>
        </div>

        <Button
          onClick={() => setIsAddVehicleOpen(true)}
          variant="secondary"
          size="md"
          className="font-extrabold text-xs rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 border-white shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Vehicle
        </Button>
      </div>

      {/* Grid: My Vehicles & Active Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: MY REGISTERED VEHICLES */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 font-heading">
              MY REGISTERED VEHICLES ({vehicles.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold rounded-xl border-slate-300"
              onClick={() => setIsAddVehicleOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>

          {vehicles.length === 0 ? (
            <Card className="border-dashed border-slate-300 bg-slate-50 py-8 text-center">
              <CardContent className="flex flex-col items-center space-y-2">
                <VehicleGraphic vehicleType="car" className="w-16 h-14" />
                <h4 className="text-sm font-bold text-slate-800">No Vehicles Registered Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Register your car or bike so neighbors can reach you when parking space is blocked.
                </p>
                <Button
                  onClick={() => setIsAddVehicleOpen(true)}
                  variant="primary"
                  size="sm"
                  className="font-bold text-xs rounded-xl bg-emerald-600 text-white mt-2"
                >
                  <Plus className="w-4 h-4" /> Add Vehicle
                </Button>
              </CardContent>
            </Card>
          ) : (
            vehicles.map((v) => (
              <Card key={v._id || v.id} className="border-slate-200 bg-white shadow-sm hover:border-emerald-300 transition-all">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <VehicleGraphic
                      vehicleType={v.vehicleType}
                      makeModel={v.makeModel}
                      color={v.color}
                      className="w-16 h-14 shrink-0"
                    />
                    <div>
                      <span className="font-mono font-black text-xl text-slate-900 tracking-wider block">
                        {formatPlateNumber(v.plateNumber)}
                      </span>
                      <p className="text-xs font-bold text-slate-600">
                        {v.color !== "Not Specified" ? `${v.color} ` : ""}{v.makeModel}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Slot: {v.parkingSlot || "Park Boundary"}
                      </p>
                    </div>
                  </div>

                  <Badge variant={v.status === "active" ? "success" : "neutral"}>
                    {v.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* RIGHT 5 COLS: ACTIVE ALERTS & INCIDENTS */}
        <div className="lg:col-span-5 space-y-4">
          {(() => {
            const activeIncidents = incidents.filter(
              (inc) =>
                inc.status &&
                inc.status.toUpperCase() !== "RESOLVED" &&
                inc.status.toUpperCase() !== "CANCELLED"
            );

            return (
              <>
                <h2 className="text-lg font-black text-slate-900 font-heading">
                  ACTIVE PARKING REQUESTS ({activeIncidents.length})
                </h2>

                {activeIncidents.length === 0 ? (
                  <Card className="border-slate-200 bg-emerald-50/40 py-8 text-center">
                    <CardContent className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">All Clear! No Active Blockages</h4>
                      <p className="text-xs text-slate-500 font-medium max-w-xs">
                        None of your vehicles are currently reported as blocking others.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  activeIncidents.map((inc) => {
                    const incId = inc.id || inc._id;
                    const isContacted = inc.status?.toUpperCase() === "CONTACTED";
                    return (
                      <Card key={incId} className="border-rose-200 bg-rose-50/50 shadow-sm">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-base text-rose-900">
                              {formatPlateNumber(inc.plateNumber)}
                            </span>
                            <Badge variant={isContacted ? "info" : "danger"}>
                              {inc.status}
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-700 font-bold">
                            Reported at: {inc.location} ({timeAgo(inc.createdAt)})
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              size="sm"
                              variant={isContacted ? "secondary" : "primary"}
                              className={`font-extrabold text-xs rounded-xl ${
                                isContacted
                                  ? "bg-teal-100 text-teal-900 border-teal-300 opacity-90"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              }`}
                              onClick={() => handleAcknowledge(incId, "moving")}
                              isLoading={actionLoadingId === incId}
                              disabled={isContacted}
                            >
                              {isContacted ? "✅ Moving Vehicle Now" : "I'm Moving Car Now"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="font-bold text-xs rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100"
                              onClick={() => handleResolveIncident(incId)}
                              isLoading={actionLoadingId === incId}
                            >
                              Mark Resolved
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onSuccess={() => fetchData()}
        defaultTower={user?.tower || "T1"}
        defaultFlat={user?.flatNumber || "1204"}
      />
    </div>
  );
}

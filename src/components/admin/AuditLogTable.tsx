"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, Eye, Search, Filter, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

export function AuditLogTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"logs" | "users">("logs");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logsRes, usersRes] = await Promise.all([
        fetch("/api/admin/audit-logs"),
        fetch("/api/admin/users"),
      ]);

      const logsData = await logsRes.json();
      const usersData = await usersRes.json();

      if (logsData.success) setLogs(logsData.logs || []);
      if (usersData.success) setUsers(usersData.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyUser = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isVerified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            Society Security & Audit Center
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Adore Grand RWA Administrative Oversight</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "logs" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Audit Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "users" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            User Approvals ({users.length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {activeTab === "logs" ? (
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
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No audit logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 whitespace-nowrap font-mono text-slate-400">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {log.actor.name} ({log.actor.role})
                        <span className="block text-[10px] text-slate-500">{log.actor.tower} - {log.actor.flatNumber}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={log.action.includes("RESOLVED") ? "success" : log.action.includes("ESCALATED") ? "danger" : "info"}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-300 font-mono capitalize">{log.targetType}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-y border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Resident Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Tower & Flat</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-4 font-bold text-slate-200">{u.name}</td>
                    <td className="p-4 font-mono text-slate-400">{u.phone}</td>
                    <td className="p-4 font-medium text-emerald-400">{u.tower} - Flat {u.flatNumber}</td>
                    <td className="p-4">
                      <Badge variant="neutral">{u.role}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={u.isVerified ? "success" : "warning"}>
                        {u.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant={u.isVerified ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleVerifyUser(u.id, u.isVerified)}
                      >
                        {u.isVerified ? "Revoke" : "Approve Resident"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

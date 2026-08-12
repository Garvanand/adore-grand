"use client";

import React from "react";
import { CheckCircle2, Clock, ShieldAlert, AlertTriangle, Phone, XCircle, ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export interface TimelineEvent {
  timestamp: string | Date;
  status: string;
  note?: string;
}

interface IncidentTimelineViewProps {
  timeline: TimelineEvent[];
}

export function IncidentTimelineView({ timeline }: IncidentTimelineViewProps) {
  if (!timeline || timeline.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
      case "pending_nudge":
        return <Clock className="w-4 h-4 text-sky-400" />;
      case "CONTACTED":
        return <Phone className="w-4 h-4 text-emerald-400" />;
      case "REMINDER_SENT":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "ESCALATED":
      case "escalated":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "RESOLVED":
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "CANCELLED":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "CONTACTED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "REMINDER_SENT":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "ESCALATED":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold";
      case "RESOLVED":
        return "bg-emerald-600/20 text-emerald-400 border-emerald-500/30 font-bold";
      case "CANCELLED":
        return "bg-slate-800 text-slate-400 border-slate-700";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-3 py-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-emerald-400" />
        Incident Activity Timeline
      </h4>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-3 text-xs">
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              {getStatusIcon(event.status)}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 w-full space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border ${getStatusBadgeColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
              {event.note && (
                <p className="text-slate-200 font-medium text-xs mt-1 leading-relaxed">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

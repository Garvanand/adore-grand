"use client";

import React, { useState, useEffect } from "react";
import { Bell, Megaphone, Calendar, User, Pin, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnnouncements(data.announcements || []);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto page-enter">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white space-y-2 shadow-md">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase font-mono tracking-wider">
            Adore Grand Notice Board
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-emerald-200" />
          Society Announcements
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 font-medium">
          Official parking updates, basement maintenance, and society notices from Adore Grand RWA Management.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 motion-skeleton h-28" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="border-slate-200 bg-white p-8 text-center">
            <CardContent className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">No Announcements Posted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                RWA Super Admin will post parking maintenance and society notices here.
              </p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((item) => (
            <Card key={item.id} className="border-slate-200 bg-white shadow-xs hover:border-emerald-300 motion-card">
              <CardContent className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {item.isPinned && (
                      <span className="p-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <Badge variant={item.category === "urgent" ? "danger" : "info"}>
                      {(item.category || "general").toUpperCase()}
                    </Badge>
                    <h3 className="text-lg font-black text-slate-900 font-heading">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    Posted by: <strong>{item.postedBy}</strong>
                  </span>
                  <span className="text-emerald-700 font-mono">Adore Grand Sector 85 Faridabad</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

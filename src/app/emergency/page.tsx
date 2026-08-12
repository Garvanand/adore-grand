"use client";

import React from "react";
import { PhoneCall, ShieldCheck, Wrench, Zap, ArrowLeft, Building2, MapPin, MessageCircle, Mail, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function EmergencyContactsPage() {
  const contacts = [
    {
      name: "Sagar",
      role: "Security & Maintenance Head",
      phone: "8130037280",
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
    {
      name: "Happy",
      role: "Security Duty Officer",
      phone: "8800357292",
      icon: PhoneCall,
      color: "bg-sky-100 text-sky-700 border-sky-300",
    },
    {
      name: "Mohit",
      role: "Electrician",
      phone: "9315273368",
      icon: Zap,
      color: "bg-amber-100 text-amber-700 border-amber-300",
    },
    {
      name: "Satish",
      role: "Lift Maintenance Technician",
      phone: "9565498118",
      icon: Wrench,
      color: "bg-rose-100 text-rose-700 border-rose-300",
    },
  ];

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto page-enter">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white space-y-2 shadow-md">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase font-mono tracking-wider">
            Adore Grand Emergency Desk
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight flex items-center gap-3">
          <PhoneCall className="w-8 h-8 text-rose-200" />
          Security & Maintenance Contacts
        </h1>
        <p className="text-xs sm:text-sm text-rose-100 font-medium">
          Direct 1-tap call & WhatsApp station for Adore Grand Sector 85 Faridabad residents.
        </p>
      </div>

      {/* Grid: 4 Primary Emergency Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((item) => {
          const IconComp = item.icon;
          return (
            <Card key={item.phone} className="border-slate-200 bg-white shadow-xs hover:border-emerald-300 motion-card">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl border ${item.color} flex items-center justify-center font-bold shrink-0`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-heading">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">{item.role}</p>
                    <span className="text-xs font-mono font-black text-slate-900 block mt-0.5">
                      +91 {item.phone}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a href={`tel:${item.phone}`} className="w-full">
                    <Button variant="primary" size="sm" className="w-full font-black text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                      <PhoneCall className="w-3.5 h-3.5" /> Call Now
                    </Button>
                  </a>

                  <a
                    href={`https://wa.me/91${item.phone}?text=Hello%20${encodeURIComponent(item.name)},%20I%20am%20a%20resident%20at%20Adore%20Grand.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="secondary" size="sm" className="w-full font-black text-xs rounded-xl bg-teal-600 hover:bg-teal-700 text-white border-teal-600">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* TECHNICAL EMERGENCY SUPPORT CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase font-mono tracking-wider">
              24/7 Developer Support
            </span>
          </div>
          <h3 className="text-lg font-black font-heading flex items-center gap-2 text-white">
            <Code className="w-5 h-5 text-emerald-400" />
            Technical Emergency Contact
          </h3>
          <p className="text-xs text-slate-300 font-medium">
            For app bugs, server outage, database issue, or technical emergencies:
          </p>
        </div>

        <a href="mailto:garvanand03@gmail.com" className="shrink-0 w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full sm:w-auto font-black text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            <Mail className="w-4 h-4" /> Email garvanand03@gmail.com
          </Button>
        </a>
      </div>

      {/* Maintenance Office & Gate 1 Guidance Box */}
      <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-900 space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-700" />
          <h3 className="text-base font-black font-heading">
            Maintenance Office & Gate 1 Security Desk
          </h3>
        </div>
        <p className="text-xs text-amber-800 font-bold leading-relaxed">
          For any other society issue or physical assistance, please reach out directly to the <strong>Maintenance Office located under Tower T7</strong> or speak to the <strong>Security Guard on duty at Gate 1 Entrance</strong>.
        </p>
        <div className="pt-1 text-[11px] font-mono text-amber-700 font-extrabold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-700" />
          Adore Grand, Sector 85, Faridabad, Haryana - 121002
        </div>
      </div>
    </div>
  );
}

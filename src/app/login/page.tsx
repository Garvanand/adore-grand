"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, Phone, Car, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [tower, setTower] = useState("T1");
  const [flatNumber, setFlatNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [makeModel, setMakeModel] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const towers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "MANDIR", "PARK_BOUNDARY", "OTHER"];

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !flatNumber.trim() || !phone.trim() || !plateNumber.trim()) {
      setErrorMsg("Please fill in Name, Tower, Flat Number, Phone Number, and Car Plate Number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          tower,
          flatNumber: flatNumber.trim(),
          phone: phone.trim(),
          plateNumber: plateNumber.trim(),
          makeModel: makeModel.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(data.message || "Failed to sign in. Please check details.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      {/* Light Mode High-Contrast Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-widest font-mono">
          <Building2 className="w-4 h-4 text-emerald-600" />
          ADORE GRAND RESIDENT SIGN-IN
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
          AdorePark Resident Portal
        </h1>
        <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
          Sign in with your flat & vehicle details for 1-tap parking coordination. No SMS OTP required.
        </p>
      </div>

      {/* Light Mode White Card Container */}
      <Card className="border-slate-200 shadow-xl bg-white rounded-3xl">
        <CardContent className="p-6 space-y-5 text-slate-900">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleQuickLogin} className="space-y-4">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Resident Full Name * (नाम)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* 2. Tower & Flat Number Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Tower * (टावर)
                </label>
                <select
                  value={tower}
                  onChange={(e) => setTower(e.target.value)}
                  className="w-full px-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  {towers.map((t) => (
                    <option key={t} value={t}>
                      {t.startsWith("T") ? `Tower ${t}` : t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Flat No. * (फ्लैट)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1204"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full px-3.5 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* 3. Phone Number */}
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Mobile Number * (फोन नंबर)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* 4. Car Plate Number */}
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Car / Vehicle Plate No. * (गाड़ी का नंबर)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Car className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. HR 26 AB 1234"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-black uppercase tracking-wider focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* 5. Car Make/Model (Optional) */}
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Car Make / Model (Optional - जैसे: White Honda City)
              </label>
              <input
                type="text"
                placeholder="e.g. White Honda City"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full px-3.5 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-13 font-black text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              isLoading={isLoading}
            >
              Sign In to Resident Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/staff/login"
              className="text-xs font-extrabold text-slate-500 hover:text-rose-600 transition inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              Security Guard / RWA Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

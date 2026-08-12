"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, Phone, Car, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Building2 className="w-4 h-4 text-emerald-400" />
          Adore Grand Resident Sign-In
        </div>
        <h1 className="text-3xl font-black text-white font-heading">AdorePark Resident Portal</h1>
        <p className="text-xs text-slate-300 font-medium">
          Sign in with your flat & vehicle details for 1-tap parking coordination. No SMS OTP required.
        </p>
      </div>

      <Card className="border-slate-800 shadow-2xl bg-slate-900/90">
        <CardContent className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleQuickLogin} className="space-y-4">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
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
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 2. Tower & Flat Number Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Tower * (टावर)
                </label>
                <select
                  value={tower}
                  onChange={(e) => setTower(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500"
                >
                  {towers.map((t) => (
                    <option key={t} value={t}>
                      {t.startsWith("T") ? `Tower ${t}` : t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Flat No. * (फ्लैट)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1204"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 3. Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
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
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 4. Car / Vehicle Registration Plate Number */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Car / Vehicle Plate No. * (गाड़ी का नंबर)
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
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono font-black uppercase tracking-wider focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 5. Car Details (Optional) */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Car Make / Model (Optional - जैसे: White Honda City)
              </label>
              <input
                type="text"
                placeholder="e.g. White Honda City"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-14 font-extrabold text-sm shadow-lg shadow-emerald-600/30"
              isLoading={isLoading}
            >
              Sign In to Resident Dashboard
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <Link href="/staff/login" className="text-xs font-bold text-rose-400 hover:underline flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Security Guard / RWA Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

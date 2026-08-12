"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { VehicleGraphic } from "@/components/illustration/vehicles/VehicleGraphic";
import {
  Car,
  Building2,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
} from "lucide-react";
import { formatPlateNumber, normalizePlateNumber } from "@/lib/utils";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTower?: string;
  defaultFlat?: string;
}

export function AddVehicleModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTower,
  defaultFlat,
}: AddVehicleModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState<"car" | "bike" | "scooter" | "other">("car");
  const [makeModel, setMakeModel] = useState("");
  const [color, setColor] = useState("White");
  const [tower, setTower] = useState("T1");
  const [flatNumber, setFlatNumber] = useState("");
  const [parkingZone, setParkingZone] = useState("Park Boundary");
  const [ownerName, setOwnerName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (defaultTower) setTower(defaultTower.startsWith("T") ? defaultTower : "T1");
    if (defaultFlat) setFlatNumber(defaultFlat);
  }, [defaultTower, defaultFlat]);

  const towers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"];
  const zones = ["Towers", "Mandir", "Park Boundary", "Other"];

  const handleRegister = async () => {
    if (!plateNumber.trim() || !makeModel.trim() || !flatNumber.trim() || !ownerName.trim()) {
      setErrorMsg("Please fill in Registration Plate, Model, Flat Number, and Resident Name.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: normalizePlateNumber(plateNumber),
          vehicleType,
          makeModel: makeModel.trim(),
          color,
          tower,
          flatNumber: flatNumber.trim(),
          parkingZone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(3); // Success Screen
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(data.message || "Failed to register vehicle.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPlateNumber("");
    setMakeModel("");
    setColor("White");
    setTower("T1");
    setFlatNumber("");
    setParkingZone("Park Boundary");
    setOwnerName("");
    setErrorMsg("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetForm}
      title="Add your vehicle"
      subtitle="Let's make it easier for residents to reach you."
      className="max-w-lg"
    >
      <div className="space-y-5 text-slate-900">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold">
            {errorMsg}
          </div>
        )}

        {/* LIVE PREVIEW VEHICLE CARD */}
        {step < 3 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-200 shadow-sm flex items-center gap-4">
            <VehicleGraphic
              vehicleType={vehicleType}
              makeModel={makeModel}
              color={color}
              className="w-16 h-14 shrink-0"
            />
            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest font-mono">
                Live Card Preview
              </span>
              <h4 className="font-mono font-black text-xl text-slate-900 tracking-wider truncate">
                {plateNumber.trim() ? formatPlateNumber(plateNumber) : "HR 26 AB 1234"}
              </h4>
              <p className="text-xs text-slate-600 font-bold truncate">
                {color} {makeModel.trim() || "Hyundai Creta"}
              </p>
              <p className="text-[11px] text-emerald-700 font-extrabold">
                {tower} • Flat {flatNumber.trim() || "1204"} ({parkingZone})
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: VEHICLE & OWNER SPECS */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Vehicle Registration Plate * (गाड़ी का नंबर)
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. HR 26 AB 1234"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                className="w-full px-4 h-13 text-base font-mono font-black uppercase tracking-wider rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Vehicle Type *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none"
                >
                  <option value="car">Car / Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="bike">Bike / Motorcycle</option>
                  <option value="scooter">Scooter / EV</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Make & Model *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyundai Creta"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  className="w-full px-3.5 h-12 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Resident Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Garv Anand"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 h-12 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Vehicle Colour
                </label>
                <input
                  type="text"
                  placeholder="e.g. White / Silver"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3.5 h-12 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none"
                />
              </div>
            </div>

            <Button
              onClick={() => {
                if (!plateNumber.trim() || !makeModel.trim() || !ownerName.trim()) {
                  setErrorMsg("Please fill in Registration Plate, Model, and Resident Name.");
                  return;
                }
                setErrorMsg("");
                setStep(2);
              }}
              className="w-full h-13 font-black text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              Next: Tower & Parking Spot <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: TOWER & PARKING ZONE SELECTION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1.5">
                Select Tower * (टावर)
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {towers.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTower(t)}
                    className={`py-2 rounded-xl text-xs font-black transition border ${
                      tower === t
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Flat Number * (फ्लैट)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1204"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full px-3.5 h-12 text-xs font-mono font-bold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  Parking Zone *
                </label>
                <select
                  value={parkingZone}
                  onChange={(e) => setParkingZone(e.target.value)}
                  className="w-full px-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3 h-13 font-bold rounded-2xl border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              <Button
                onClick={handleRegister}
                isLoading={isLoading}
                className="w-2/3 h-13 font-black text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                REGISTER VEHICLE
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PLEASANT SUCCESS SCREEN */}
        {step === 3 && (
          <div className="space-y-5 text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 font-heading">
                You're all set!
              </h3>
              <p className="text-xs text-slate-600 font-bold max-w-xs mx-auto">
                "Residents can now reach you quickly when your vehicle needs to be moved."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Registered vehicle {formatPlateNumber(plateNumber)} under Flat {tower}-{flatNumber}</span>
            </div>

            <Button
              onClick={resetForm}
              className="w-full h-13 font-black text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              Return to Home
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

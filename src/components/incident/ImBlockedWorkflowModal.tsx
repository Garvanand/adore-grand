"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InteractiveSocietyMap } from "@/components/illustration/InteractiveSocietyMap";
import {
  Car,
  MapPin,
  Camera,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Building2,
  Landmark,
  Trees,
  ArrowRight,
  ArrowLeft,
  AlertOctagon,
  Clock,
  Check,
} from "lucide-react";
import { normalizePlateNumber, formatPlateNumber, getTelUrl, getWhatsAppUrl } from "@/lib/utils";

interface ImBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImBlockedWorkflowModal({ isOpen, onClose }: ImBlockedModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedZone, setSelectedZone] = useState("T1");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [foundVehicle, setFoundVehicle] = useState<any>(null);
  const [createdIncident, setCreatedIncident] = useState<any>(null);

  const handleLookupVehicle = async () => {
    if (!plateNumber.trim()) {
      setErrorMsg("Please enter the blocking vehicle registration number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const norm = normalizePlateNumber(plateNumber);
      const res = await fetch(`/api/vehicles/search?query=${encodeURIComponent(norm)}`);
      const data = await res.json();

      if (data.success && data.results && data.results.length > 0) {
        setFoundVehicle(data.results[0]);
      } else {
        setFoundVehicle({
          plateNumber: norm,
          rawPlateNumber: formatPlateNumber(plateNumber),
          tower: selectedZone,
          flatNumber: "Visitor/Unregistered",
          owner: { name: "Unregistered Owner", phone: "+91 98765 43210" },
        });
      }
      setStep(2);
    } catch (err) {
      setErrorMsg("Connection issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: normalizePlateNumber(plateNumber),
          location: selectedZone,
          description: description.trim() || undefined,
          priority: "urgent",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedIncident(data.incident);
        setStep(6); // Success Step
      } else {
        setErrorMsg(data.message || "Failed to submit movement request.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setPlateNumber("");
    setSelectedZone("T1");
    setDescription("");
    setFoundVehicle(null);
    setCreatedIncident(null);
    setErrorMsg("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetFlow}
      title="🚨 I'm Blocked"
      subtitle="Let's help you reach the vehicle owner."
      className="max-w-xl"
    >
      <div className="space-y-5 text-slate-900">
        {step <= 5 && (
          <div className="flex items-center justify-between gap-1 text-[11px] font-extrabold text-slate-500 border-b border-slate-100 pb-3 font-mono">
            <span className={step >= 1 ? "text-emerald-700 font-black" : ""}>1. Vehicle</span>
            <span>➔</span>
            <span className={step >= 2 ? "text-emerald-700 font-black" : ""}>2. Location</span>
            <span>➔</span>
            <span className={step >= 3 ? "text-emerald-700 font-black" : ""}>3. Confirm</span>
            <span>➔</span>
            <span className={step >= 4 ? "text-emerald-700 font-black" : ""}>4. Photo</span>
            <span>➔</span>
            <span className={step >= 5 ? "text-emerald-700 font-black" : ""}>5. Submit</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: VEHICLE NUMBER INPUT */}
        {step === 1 && (
          <div key="step-1" className="step-slide-enter space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Step 1: Enter Vehicle Plate Number *
              </label>
              <p className="text-xs text-slate-500 font-semibold">
                Which vehicle is blocking your spot or driveway?
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Car className="w-5 h-5" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="e.g. HR 26 AB 1234"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 h-14 text-lg font-mono font-black uppercase tracking-wider rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <Button
              onClick={handleLookupVehicle}
              isLoading={isLoading}
              className="w-full h-13 font-black text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              Next: Select Location
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: INTERACTIVE U-SHAPED SOCIETY MAP ZONE SELECTOR */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Step 2: Where is the blocking vehicle located? *
              </label>
              <p className="text-xs text-slate-500 font-semibold">
                Tap the exact zone on the Adore Grand mini map:
              </p>
            </div>

            <InteractiveSocietyMap
              selectedZone={selectedZone}
              onSelectZone={(z) => setSelectedZone(z)}
            />

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3 h-12 font-bold rounded-2xl border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="w-2/3 h-12 font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next: Confirm Vehicle <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: VEHICLE CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Step 3: Confirm Vehicle Details
            </label>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-300 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono font-black text-2xl text-slate-900">
                    {foundVehicle?.rawPlateNumber || formatPlateNumber(plateNumber)}
                  </span>
                  <p className="text-xs text-slate-600 font-bold">
                    {foundVehicle?.makeModel || "Registered Car"}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Location: <strong>{selectedZone}</strong></span>
                <span>Resident: <strong>{foundVehicle?.owner?.name || "Adore Resident"}</strong></span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="w-1/3 h-12 font-bold rounded-2xl border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="w-2/3 h-12 font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next: Photo (Optional) <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: OPTIONAL PHOTO */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Step 4: Attach Photo (Optional - ऐच्छिक)
              </label>
              <p className="text-xs text-slate-500 font-semibold">
                Helps security identify exact spot. You can skip this step.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 font-bold">Tap to upload photo or take picture</p>
              <input
                type="text"
                placeholder="Optional Photo URL / Note"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="w-1/3 h-12 font-bold rounded-2xl border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(5)}
                className="w-2/3 h-12 font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next: Final Submit <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL SUBMIT */}
        {step === 5 && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Ready to Request Movement?
              </h3>
              <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
                This will alert vehicle owner <strong>{foundVehicle?.owner?.name}</strong> and notify Gate 1 Security Guard Ramesh Kumar.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(4)}
                className="w-1/3 h-14 font-bold rounded-2xl border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleSubmitReport}
                isLoading={isLoading}
                className="w-2/3 h-14 font-extrabold text-sm rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-md"
              >
                REQUEST VEHICLE MOVEMENT
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: SUCCESS */}
        {step === 6 && (
          <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                Request Sent Successfully!
              </h3>
              <p className="text-xs text-slate-600 font-bold max-w-sm mx-auto">
                "Try calling the owner while they receive the instant alert."
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <a href={getTelUrl(foundVehicle?.owner?.phone || "01292858585")} className="w-full">
                  <Button variant="primary" size="lg" className="w-full h-12 font-black text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Phone className="w-4 h-4" /> CALL OWNER
                  </Button>
                </a>

                <a
                  href={getWhatsAppUrl(
                    foundVehicle?.owner?.phone || "9876543210",
                    `Hello, your vehicle ${plateNumber} is blocking at Adore Grand.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="secondary" size="lg" className="w-full h-12 font-black text-xs rounded-xl bg-teal-600 hover:bg-teal-700 text-white border-teal-600">
                    <MessageCircle className="w-4 h-4" /> WHATSAPP
                  </Button>
                </a>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 font-black text-xs rounded-xl bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                onClick={async () => {
                  if (createdIncident?.id) {
                    await fetch(`/api/incidents/${createdIncident.id}/escalate`, { method: "POST" });
                  }
                  alert("Incident escalated directly to Gate 1 Security Duty Roster.");
                }}
              >
                <ShieldCheck className="w-4 h-4 text-rose-600" /> ESCALATE TO SECURITY
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block font-mono">
                Assistance Timeline
              </span>
              <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-bold">
                <div className="p-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Check className="w-3 h-3 mx-auto text-emerald-600" />
                  <span>Reported</span>
                </div>
                <div className="p-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Check className="w-3 h-3 mx-auto text-emerald-600" />
                  <span>Owner Contacted</span>
                </div>
                <div className="p-1 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-3 h-3 mx-auto text-amber-600 animate-spin" />
                  <span>Reminder</span>
                </div>
                <div className="p-1 rounded bg-slate-100 text-slate-500">
                  <span>Security</span>
                </div>
                <div className="p-1 rounded bg-slate-100 text-slate-500">
                  <span>Resolved</span>
                </div>
              </div>
            </div>

            <Button
              onClick={resetFlow}
              variant="outline"
              size="md"
              className="w-full font-extrabold rounded-xl border-slate-300"
            >
              Done & Return Home
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

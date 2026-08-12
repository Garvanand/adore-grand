import React from "react";
import Link from "next/link";
import { ArrowLeft, Car, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-lg mx-auto page-enter">
      <div className="w-20 h-20 rounded-3xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shadow-sm">
        <AlertTriangle className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
          404 • Page Not Found
        </span>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          Lost in Adore Grand?
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          The requested page does not exist or has been moved.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full font-black rounded-2xl gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Button>
        </Link>

        <Link href="/emergency" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full font-bold rounded-2xl">
            Contact Security
          </Button>
        </Link>
      </div>
    </div>
  );
}

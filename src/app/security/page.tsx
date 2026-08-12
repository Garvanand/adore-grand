import React from "react";
import { DutyModePanel } from "@/components/incident/DutyModePanel";

export const dynamic = "force-dynamic";

export default function SecurityDutyPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-2 px-2 sm:px-4 page-enter min-h-screen pb-24">
      <DutyModePanel />
    </div>
  );
}

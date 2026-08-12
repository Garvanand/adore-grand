"use client";

import React from "react";

interface VehicleVectorProps {
  color?: string;
  type?: "sedan" | "hatchback" | "ev";
  className?: string;
}

export function CarIllustration({ color = "#059669", type = "sedan", className = "w-12 h-12" }: VehicleVectorProps) {
  return (
    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Car Shadow */}
      <ellipse cx="50" cy="52" rx="42" ry="5" fill="#e2e8f0" />

      {/* Car Body Base */}
      <path
        d="M10 38C10 34 14 32 20 31L30 20C34 16 42 14 55 14H68C76 14 82 18 86 24L90 32C94 34 96 37 96 40V44C96 46 94 48 92 48H8C6 48 4 46 4 44V40C4 38 6 38 10 38Z"
        fill={color}
      />

      {/* Roof Highlight */}
      <path d="M32 21C35 17 42 15 54 15H66C73 15 79 19 82 24L86 31H25L32 21Z" fill="#ffffff" opacity="0.3" />

      {/* Windows Glass */}
      <path d="M34 22L47 22V31H26L34 22Z" fill="#bae6fd" opacity="0.9" />
      <path d="M51 22H66C72 22 76 25 79 31H51V22Z" fill="#bae6fd" opacity="0.9" />

      {/* Headlight & Taillight */}
      <rect x="91" y="35" width="4" height="6" rx="2" fill="#fef08a" />
      <rect x="5" y="35" width="4" height="6" rx="2" fill="#f43f5e" />

      {/* Wheels */}
      <circle cx="26" cy="46" r="10" fill="#1e293b" />
      <circle cx="26" cy="46" r="5" fill="#94a3b8" />
      <circle cx="74" cy="46" r="10" fill="#1e293b" />
      <circle cx="74" cy="46" r="5" fill="#94a3b8" />
    </svg>
  );
}

"use client";

import React from "react";

interface ScooterProps {
  color?: string;
  className?: string;
}

export function ScooterIllustration({ color = "#059669", className = "w-12 h-12" }: ScooterProps) {
  return (
    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="50" cy="52" rx="36" ry="4" fill="#cbd5e1" />

      {/* Scooter Body & Apron */}
      <path d="M20 42C20 32 25 24 35 24H48L38 42H20Z" fill={color} />
      <path d="M60 42L72 20H80L74 42H60Z" fill={color} />

      {/* Seat */}
      <path d="M28 22C32 22 50 22 55 24C55 27 50 28 28 28C24 28 24 22 28 22Z" fill="#1e293b" />

      {/* Handlebar & Headlight */}
      <path d="M72 20L76 12H82" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="14" r="3.5" fill="#fef08a" />

      {/* Footrest Floorboard */}
      <rect x="36" y="40" width="28" height="4" rx="2" fill="#475569" />

      {/* Small Scooter Wheels */}
      <circle cx="24" cy="45" r="9" fill="#1e293b" />
      <circle cx="24" cy="45" r="4" fill="#cbd5e1" />
      <circle cx="76" cy="45" r="9" fill="#1e293b" />
      <circle cx="76" cy="45" r="4" fill="#cbd5e1" />
    </svg>
  );
}

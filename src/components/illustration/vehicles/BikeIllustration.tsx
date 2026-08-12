"use client";

import React from "react";

interface BikeProps {
  color?: string;
  className?: string;
}

export function BikeIllustration({ color = "#d97706", className = "w-12 h-12" }: BikeProps) {
  return (
    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="50" cy="52" rx="38" ry="4" fill="#cbd5e1" />

      {/* Frame & Engine Block */}
      <path d="M25 44L45 28H65L75 44" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <rect x="42" y="32" width="16" height="12" rx="3" fill="#64748b" />

      {/* Fuel Tank */}
      <path d="M42 26C42 22 48 20 58 20H66C70 20 72 23 70 26L66 28H45L42 26Z" fill={color} />

      {/* Seat */}
      <path d="M30 24C35 24 40 24 45 28H26C24 26 26 24 30 24Z" fill="#1e293b" />

      {/* Handlebar & Light */}
      <path d="M68 20L74 12H80" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <circle cx="78" cy="15" r="3" fill="#fef08a" />

      {/* Wheels */}
      <circle cx="24" cy="44" r="12" stroke="#1e293b" strokeWidth="5" fill="none" />
      <circle cx="24" cy="44" r="4" fill="#94a3b8" />
      <circle cx="76" cy="44" r="12" stroke="#1e293b" strokeWidth="5" fill="none" />
      <circle cx="76" cy="44" r="4" fill="#94a3b8" />
    </svg>
  );
}

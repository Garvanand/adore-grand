"use client";

import React from "react";

interface SUVProps {
  color?: string;
  className?: string;
}

export function SUVIllustration({ color = "#0284c7", className = "w-12 h-12" }: SUVProps) {
  return (
    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="50" cy="53" rx="44" ry="5" fill="#cbd5e1" />

      {/* Roof Rails */}
      <rect x="25" y="10" width="50" height="3" rx="1.5" fill="#475569" />

      {/* SUV Body */}
      <path
        d="M10 38C10 32 14 30 20 28L28 16C31 12 38 12 50 12H72C80 12 85 16 88 22L92 30C95 32 97 35 97 38V45C97 47 95 49 93 49H7C5 49 3 47 3 45V38Z"
        fill={color}
      />

      {/* Windows */}
      <path d="M30 15L48 15V28H23L30 15Z" fill="#bae6fd" opacity="0.9" />
      <path d="M52 15H71C76 15 81 18 84 28H52V15Z" fill="#bae6fd" opacity="0.9" />

      {/* Headlight & Taillight */}
      <rect x="92" y="32" width="4" height="8" rx="2" fill="#fef08a" />
      <rect x="4" y="32" width="4" height="8" rx="2" fill="#f43f5e" />

      {/* Large SUV Wheels */}
      <circle cx="26" cy="47" r="11" fill="#0f172a" />
      <circle cx="26" cy="47" r="6" fill="#cbd5e1" />
      <circle cx="76" cy="47" r="11" fill="#0f172a" />
      <circle cx="76" cy="47" r="6" fill="#cbd5e1" />
    </svg>
  );
}

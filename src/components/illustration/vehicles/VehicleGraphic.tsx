"use client";

import React from "react";
import { CarIllustration } from "./CarIllustration";
import { SUVIllustration } from "./SUVIllustration";
import { BikeIllustration } from "./BikeIllustration";
import { ScooterIllustration } from "./ScooterIllustration";

interface VehicleGraphicProps {
  vehicleType?: string;
  makeModel?: string;
  color?: string;
  className?: string;
}

export function VehicleGraphic({
  vehicleType = "car",
  makeModel = "",
  color,
  className = "w-14 h-14",
}: VehicleGraphicProps) {
  const normType = (vehicleType || "").toLowerCase();
  const normModel = (makeModel || "").toLowerCase();

  // Determine hex color from color string
  let hexColor = "#059669"; // Emerald default
  if (color) {
    const c = color.toLowerCase();
    if (c.includes("white") || c.includes("silver")) hexColor = "#0284c7";
    else if (c.includes("black") || c.includes("dark")) hexColor = "#334155";
    else if (c.includes("red") || c.includes("maroon")) hexColor = "#e11d48";
    else if (c.includes("blue") || c.includes("sky")) hexColor = "#0284c7";
    else if (c.includes("yellow") || c.includes("gold")) hexColor = "#d97706";
  }

  if (normType.includes("suv") || normModel.includes("creta") || normModel.includes("harrier") || normModel.includes("fortuner")) {
    return <SUVIllustration color={hexColor} className={className} />;
  }

  if (normType.includes("bike") || normType.includes("motorcycle") || normModel.includes("bullet") || normModel.includes("royal")) {
    return <BikeIllustration color={hexColor} className={className} />;
  }

  if (normType.includes("scooter") || normModel.includes("activa") || normModel.includes("jupiter") || normModel.includes("ola")) {
    return <ScooterIllustration color={hexColor} className={className} />;
  }

  return <CarIllustration color={hexColor} className={className} />;
}

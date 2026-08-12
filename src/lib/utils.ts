import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes vehicle plate numbers to uppercase alphanumeric format.
 * E.g. "hr 85-ab 1234" -> "HR85AB1234"
 */
export function normalizePlateNumber(plate: any): string {
  if (!plate || typeof plate !== "string") return "";
  return plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

/**
 * Formats a normalized plate number for clean UI display.
 * E.g. "HR85AB1234" -> "HR 85 AB 1234"
 */
export function formatPlateNumber(plate: string): string {
  const norm = normalizePlateNumber(plate);
  if (norm.length <= 4) return norm;
  // Match Indian plate standard pattern e.g., HR 85 AB 1234
  const match = norm.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{1,3})([0-9]{1,4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return norm;
}

/**
 * Masks phone number for resident privacy in public lookup.
 * E.g., "+919876543210" -> "+91 98*** **210"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return "N/A";
  const clean = phone.trim();
  if (clean.length < 10) return "******" + clean.slice(-3);
  
  const last3 = clean.slice(-3);
  const prefix = clean.startsWith("+91") ? "+91 " + clean.slice(3, 5) : clean.slice(0, 2);
  return `${prefix}*** ***${last3}`;
}

/**
 * Format timestamp to friendly string
 */
export function formatDateTime(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Time ago helper
 */
export function timeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSafeDate(date: any, formatStr: string, fallback: string = "N/A") {
  if (!date) return fallback;
  try {
    const d = new Date(date);
    if (!isValid(d)) return fallback;
    return format(d, formatStr);
  } catch (error) {
    return fallback;
  }
}

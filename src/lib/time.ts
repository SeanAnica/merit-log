import type { TimeUnit } from "@/types/setting";

export type { TimeUnit };

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  minutes: "Minutes",
  hours: "Hours",
  days: "Days",
};

export const TIME_UNIT_STEP: Record<TimeUnit, number> = {
  minutes: 1,
  hours: 0.5,
  days: 0.5,
};

export const TIME_UNIT_PLACEHOLDER: Record<TimeUnit, string> = {
  minutes: "e.g. 90",
  hours: "e.g. 4.5",
  days: "e.g. 0.5",
};

/** Convert a value expressed in `unit` to minutes. */
export function unitToMinutes(value: number, unit: TimeUnit, hoursPerDay: number): number {
  switch (unit) {
    case "minutes": return Math.round(value);
    case "hours":   return Math.round(value * 60);
    case "days":    return Math.round(value * hoursPerDay * 60);
  }
}

/** Convert minutes to a value expressed in `unit`. */
export function minutesToUnit(minutes: number, unit: TimeUnit, hoursPerDay: number): number {
  switch (unit) {
    case "minutes": return minutes;
    case "hours":   return Math.round((minutes / 60) * 100) / 100;
    case "days":    return Math.round((minutes / (hoursPerDay * 60)) * 100) / 100;
  }
}

/** Format minutes as a human-readable string in the chosen unit. */
export function formatTime(minutes: number, unit: TimeUnit, hoursPerDay: number): string {
  const value = minutesToUnit(minutes, unit, hoursPerDay);
  switch (unit) {
    case "minutes": return `${value} min`;
    case "hours":   return `${value} h`;
    case "days":    return `${value} d`;
  }
}

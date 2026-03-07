import { create } from "zustand";
import type { TimeUnit } from "@/types/setting";
import { settingService } from "@/services/settingService";

interface SettingsState {
  time_unit: TimeUnit;
  hours_per_day: number;
  loaded: boolean;
  load: () => Promise<void>;
  setTimeUnit: (unit: TimeUnit) => Promise<void>;
  setHoursPerDay: (hours: number) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  time_unit: "hours",
  hours_per_day: 8,
  loaded: false,

  load: async () => {
    const settings = await settingService.getAll();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    set({
      time_unit: (map["time_unit"] as TimeUnit) ?? "hours",
      hours_per_day: map["hours_per_day"] ? Number(map["hours_per_day"]) : 8,
      loaded: true,
    });
  },

  setTimeUnit: async (unit) => {
    await settingService.set("time_unit", unit);
    set({ time_unit: unit });
  },

  setHoursPerDay: async (hours) => {
    await settingService.set("hours_per_day", String(hours));
    set({ hours_per_day: hours });
  },
}));

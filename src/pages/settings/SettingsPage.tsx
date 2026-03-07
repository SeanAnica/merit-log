import { useEffect, useState } from "react";
import type { JSX } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { TIME_UNIT_LABELS } from "@/lib/time";
import type { TimeUnit } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage(): JSX.Element {
  const { time_unit, hours_per_day, loaded, setTimeUnit, setHoursPerDay } = useSettingsStore();
  const [hoursInput, setHoursInput] = useState(String(hours_per_day));

  useEffect(() => {
    setHoursInput(String(hours_per_day));
  }, [hours_per_day]);

  async function handleHoursBlur() {
    const val = parseFloat(hoursInput);
    if (!isNaN(val) && val > 0) {
      await setHoursPerDay(val);
    } else {
      setHoursInput(String(hours_per_day));
    }
  }

  if (!loaded) return <></>;

  return (
    <div className="max-w-md space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Time tracking
        </h2>

        <div className="space-y-1">
          <Label>Time unit</Label>
          <Select
            value={time_unit}
            onValueChange={(val) => setTimeUnit(val as TimeUnit)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {TIME_UNIT_LABELS[unit]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            Unit used when entering and displaying allocated time on tasks.
          </p>
        </div>

        {time_unit === "days" && (
          <div className="space-y-1">
            <Label htmlFor="hours_per_day">Hours per day</Label>
            <Input
              id="hours_per_day"
              type="number"
              min={1}
              max={24}
              step={0.5}
              className="w-48"
              value={hoursInput}
              onChange={(e) => setHoursInput(e.target.value)}
              onBlur={handleHoursBlur}
            />
            <p className="text-xs text-slate-500">
              How many hours count as 1 working day (e.g. 8 → 0.5 d = 4 h).
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

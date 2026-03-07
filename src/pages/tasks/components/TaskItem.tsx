import { useState } from "react";
import type { Task } from "@/types";
import type { TaskStatus } from "@/types/task";
import { taskService } from "@/services/taskService";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatTime } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TaskFormDialog from "./TaskFormDialog";
import SubtaskList from "./SubtaskList";

const STATUS_BADGE: Record<TaskStatus, string> = {
  planned: "bg-slate-700 text-slate-300",
  active: "bg-blue-900 text-blue-300",
  done: "bg-sky-900 text-sky-300",
};

function parseLocalDate(value: string): Date | null {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDeadlineProgress(task: Task): number | null {
  if (!task.end_date) return null;

  const startSource = task.start_date ?? task.created_at;
  if (!startSource) return null;

  const start = parseLocalDate(startSource);
  const end = parseLocalDate(task.end_date);
  if (!start || !end) return null;

  const startTime = startOfDay(start).getTime();
  const endTime = startOfDay(end).getTime();
  if (endTime < startTime) return null;

  const today = startOfDay(new Date()).getTime();
  if (today >= endTime) return 1;
  if (endTime === startTime) return 0;

  const progress = (today - startTime) / (endTime - startTime);
  return Math.min(1, Math.max(0, progress));
}

function getProgressBarColor(task: Task, progress: number | null): string {
  if (task.status === "done") return "bg-sky-500";
  if (progress == null) return "bg-slate-600";
  if (progress >= 1) return "bg-red-500";
  if (progress >= 0.75) return "bg-orange-500";
  if (progress >= 0.5) return "bg-yellow-500";
  return "bg-green-500";
}

function getProgressLabel(task: Task, progress: number | null): string | null {
  if (!task.end_date) return null;
  if (task.status === "done") return "Completed";
  if (progress == null) return `Due ${task.end_date}`;
  if (progress >= 1) return "Due today";
  return `${Math.round(progress * 100)}% to deadline`;
}

interface Props {
  task: Task;
  onUpdated: (task: Task) => void;
  onDeleted: (id: number) => void;
}

export default function TaskItem({ task, onUpdated, onDeleted }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { time_unit, hours_per_day } = useSettingsStore();
  const deadlineProgress = getDeadlineProgress(task);
  const progressLabel = getProgressLabel(task, deadlineProgress);
  const progressBarColor = getProgressBarColor(task, deadlineProgress);

  async function handleDelete() {
    try {
      await taskService.delete(task.id!);
      onDeleted(task.id!);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <li className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{task.title}</span>
            <Badge className={STATUS_BADGE[task.status]}>{task.status}</Badge>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-slate-400">{task.description}</p>
          )}

          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
            {task.start_date && <span>Start: {task.start_date}</span>}
            {task.end_date && <span>End: {task.end_date}</span>}
            {task.allocated_minutes != null && (
              <span>Allocated: {formatTime(task.allocated_minutes, time_unit, hours_per_day)}</span>
            )}
          </div>

          {task.end_date && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <span>Deadline</span>
                {progressLabel && <span>{progressLabel}</span>}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${progressBarColor}`}
                  style={{ width: `${Math.max((deadlineProgress ?? 0) * 100, task.status === "done" ? 100 : 6)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide subtasks" : "Subtasks"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-800 pt-4">
          <SubtaskList taskId={task.id!} />
        </div>
      )}

      <TaskFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        task={task}
        onSuccess={onUpdated}
      />
    </li>
  );
}

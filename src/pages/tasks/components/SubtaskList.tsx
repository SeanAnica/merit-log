import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subtaskSchema, type SubtaskFormValues } from "../taskSchema";
import { subtaskService } from "@/services/subtaskService";
import type { Subtask } from "@/types";
import type { SubtaskStatus } from "@/types/subtask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_LABEL: Record<SubtaskStatus, string> = {
  planned: "Planned",
  active: "Active",
  done: "Done",
};

interface Props {
  taskId: number;
}

export default function SubtaskList({ taskId }: Props) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [adding, setAdding] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SubtaskFormValues>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: { title: "", status: "planned" },
  });

  useEffect(() => {
    subtaskService
      .listByTask(taskId)
      .then(setSubtasks)
      .catch(console.error);
  }, [taskId]);

  async function onAdd(values: SubtaskFormValues) {
    try {
      const created = await subtaskService.create({ ...values, task_id: taskId });
      setSubtasks((prev) => [...prev, created]);
      reset({ title: "", status: "planned" });
      setAdding(false);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStatusChange(subtask: Subtask, status: SubtaskStatus) {
    try {
      const updated = await subtaskService.update({ ...subtask, id: subtask.id!, status });
      setSubtasks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: number) {
    try {
      await subtaskService.delete(id);
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Subtasks
      </p>

      {subtasks.length === 0 && !adding && (
        <p className="text-sm text-slate-600">No subtasks yet.</p>
      )}

      <ul className="space-y-1">
        {subtasks.map((subtask) => (
          <li
            key={subtask.id}
            className="flex items-center gap-2 rounded-md bg-slate-800/50 px-3 py-2 text-sm"
          >
            <span className="flex-1">{subtask.title}</span>
            <Select
              value={subtask.status}
              onValueChange={(val) =>
                handleStatusChange(subtask, val as SubtaskStatus)
              }
            >
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABEL) as SubtaskStatus[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-red-400 hover:text-red-300"
              onClick={() => handleDelete(subtask.id!)}
            >
              ✕
            </Button>
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={handleSubmit(onAdd)} className="flex items-center gap-2">
          <Input
            {...register("title")}
            placeholder="Subtask title"
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="submit" size="sm" disabled={isSubmitting}>
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setAdding(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-slate-400"
          onClick={() => setAdding(true)}
        >
          + Add subtask
        </Button>
      )}
    </div>
  );
}

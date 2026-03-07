import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormValues } from "../taskSchema";
import { taskService } from "@/services/taskService";
import { useSettingsStore } from "@/stores/settingsStore";
import { unitToMinutes, minutesToUnit, TIME_UNIT_LABELS, TIME_UNIT_STEP, TIME_UNIT_PLACEHOLDER } from "@/lib/time";
import type { Task } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess: (task: Task) => void;
}

export default function TaskFormDialog({ open, onOpenChange, task, onSuccess }: Props) {
  const isEdit = !!task;
  const { time_unit, hours_per_day } = useSettingsStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { status: "planned" },
  });

  useEffect(() => {
    if (open) {
      reset(
        task
          ? {
              title: task.title,
              description: task.description ?? "",
              start_date: task.start_date ?? "",
              end_date: task.end_date ?? "",
              allocated: task.allocated_minutes != null
                ? minutesToUnit(task.allocated_minutes, time_unit, hours_per_day)
                : undefined,
              status: task.status,
            }
          : { title: "", description: "", start_date: "", end_date: "", status: "planned" },
      );
    }
  }, [open, task, reset, time_unit, hours_per_day]);

  async function onSubmit(values: TaskFormValues) {
    try {
      const allocated_minutes = values.allocated != null
        ? unitToMinutes(values.allocated, time_unit, hours_per_day)
        : undefined;

      const taskData = {
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        allocated_minutes,
        status: values.status,
      };

      const result = isEdit
        ? await taskService.update({ ...taskData, id: task!.id! })
        : await taskService.create(taskData);

      onSuccess(result);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Task title" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="start_date">Start date</Label>
              <Input id="start_date" type="date" {...register("start_date")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="end_date">End date</Label>
              <Input id="end_date" type="date" {...register("end_date")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="allocated">
                Allocated ({TIME_UNIT_LABELS[time_unit].toLowerCase()})
              </Label>
              <Input
                id="allocated"
                type="number"
                min={0}
                step={TIME_UNIT_STEP[time_unit]}
                placeholder={TIME_UNIT_PLACEHOLDER[time_unit]}
                {...register("allocated")}
              />
              {errors.allocated && (
                <p className="text-sm text-destructive">{errors.allocated.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val) =>
                  setValue("status", val as TaskFormValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

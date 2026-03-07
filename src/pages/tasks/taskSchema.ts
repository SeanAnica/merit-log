import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  // Value expressed in the user's chosen time unit — converted to minutes on submit
  allocated: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional(),
  ),
  status: z.enum(["planned", "active", "done"]),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const subtaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  status: z.enum(["planned", "active", "done"]),
});

export type SubtaskFormValues = z.infer<typeof subtaskSchema>;

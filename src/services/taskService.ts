import { invoke } from "@tauri-apps/api/core";
import type { Task } from "@/types";

export const taskService = {
  create: (task: Omit<Task, "id" | "created_at">): Promise<Task> =>
    invoke("create_task", { task }),

  get: (id: number): Promise<Task> =>
    invoke("get_task", { id }),

  list: (): Promise<Task[]> =>
    invoke("list_tasks"),

  update: (task: Task & { id: number }): Promise<Task> =>
    invoke("update_task", { task }),

  delete: (id: number): Promise<void> =>
    invoke("delete_task", { id }),
};

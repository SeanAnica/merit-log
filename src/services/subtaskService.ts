import { invoke } from "@tauri-apps/api/core";
import type { Subtask } from "@/types";

export const subtaskService = {
  create: (subtask: Omit<Subtask, "id" | "created_at">): Promise<Subtask> =>
    invoke("create_subtask", { subtask }),

  listByTask: (taskId: number): Promise<Subtask[]> =>
    invoke("list_subtasks", { task_id: taskId }),

  update: (subtask: Subtask & { id: number }): Promise<Subtask> =>
    invoke("update_subtask", { subtask }),

  delete: (id: number): Promise<void> =>
    invoke("delete_subtask", { id }),
};

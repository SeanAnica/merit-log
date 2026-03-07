export type SubtaskStatus = "planned" | "active" | "done";

export interface Subtask {
  id?: number;
  task_id: number;
  title: string;
  status: SubtaskStatus;
  created_at?: string;
}

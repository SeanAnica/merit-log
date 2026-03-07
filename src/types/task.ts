export type TaskStatus = "planned" | "active" | "done";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  allocated_minutes?: number;
  status: TaskStatus;
  created_at?: string;
}

import type { Task } from "@/types";
import TaskItem from "./TaskItem";

interface Props {
  tasks: Task[];
  onUpdated: (task: Task) => void;
  onDeleted: (id: number) => void;
}

export default function TaskList({ tasks, onUpdated, onDeleted }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">
        No tasks yet. Create your first one.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdated={onUpdated} onDeleted={onDeleted} />
      ))}
    </ul>
  );
}

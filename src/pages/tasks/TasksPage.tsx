import { useEffect, useState } from "react";
import type { JSX } from "react";
import type { Task } from "@/types";
import { taskService } from "@/services/taskService";
import { Button } from "@/components/ui/button";
import TaskList from "./components/TaskList";
import TaskFormDialog from "./components/TaskFormDialog";

export default function TasksPage(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    taskService
      .list()
      .then(setTasks)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  function handleUpdated(task: Task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }

  function handleDeleted(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <Button onClick={() => setCreateOpen(true)}>New task</Button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && (
        <TaskList tasks={tasks} onUpdated={handleUpdated} onDeleted={handleDeleted} />
      )}

      <TaskFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreated}
      />
    </div>
  );
}

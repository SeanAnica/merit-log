import type { JSX } from "react";
import DashboardPage from "../pages/dashboard/DashboardPage";
import JournalPage from "../pages/journal/JournalPage";
import TasksPage from "../pages/tasks/TasksPage";
import GoalsPage from "../pages/goals/GoalsPage";
import SettingsPage from "../pages/settings/SettingsPage";

export type AppRoute = {
  path: string;
  label: string;
  element: JSX.Element;
  end?: boolean;
};

export const APP_ROUTES: AppRoute[] = [
  { path: "/", label: "Dashboard", element: <DashboardPage />, end: true },
  { path: "/journal", label: "Journal", element: <JournalPage /> },
  { path: "/tasks", label: "Tasks", element: <TasksPage /> },
  { path: "/goals", label: "Goals", element: <GoalsPage /> },
  { path: "/settings", label: "Settings", element: <SettingsPage /> },
];

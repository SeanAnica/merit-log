import type { JSX } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./app/routes";

const linkStyle = ({
  isActive,
}: {
  isActive: boolean;
}): string =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-slate-100 text-slate-900"
      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50",
  ].join(" ");

export default function App(): JSX.Element {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/90 bg-slate-900/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 py-4 sm:px-6">
          {APP_ROUTES.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={linkStyle}
              end={route.end}>
              {route.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <Routes>
          {APP_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

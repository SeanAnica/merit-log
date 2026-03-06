import { Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "@/app/routes";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-slate-950 text-slate-100">
      <Navbar />
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

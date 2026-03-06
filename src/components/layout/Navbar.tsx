import { NavLink } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/app/routes";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/90 bg-slate-900/70 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl flex-wrap gap-1 px-4 py-3 sm:px-6">
        {APP_ROUTES.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.end}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                isActive && "bg-slate-800 text-slate-50"
              )
            }
          >
            {route.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

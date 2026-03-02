import { NavLink, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import ObjectifsPage from "./pages/ObjectifsPage";
import ParametresPage from "./pages/ParametresPage";
import TachesPage from "./pages/TachesPage";
import { JSX } from "react";

const linkStyle = ({
  isActive,
}: {
  isActive: boolean;
}): React.CSSProperties => ({
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "white" : "inherit",
  background: isActive ? "#333" : "transparent",
});

export default function App(): JSX.Element {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        minHeight: "100vh",
      }}>
      <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <NavLink to="/" style={linkStyle} end>
            Dashboard
          </NavLink>
          <NavLink to="/journal" style={linkStyle}>
            Journal
          </NavLink>
          <NavLink to="/taches" style={linkStyle}>
            Tâches
          </NavLink>
          <NavLink to="/objectifs" style={linkStyle}>
            Objectifs
          </NavLink>
          <NavLink to="/parametres" style={linkStyle}>
            Paramètres
          </NavLink>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/taches" element={<TachesPage />} />
          <Route path="/objectifs" element={<ObjectifsPage />} />
          <Route path="/parametres" element={<ParametresPage />} />
        </Routes>
      </main>
    </div>
  );
}

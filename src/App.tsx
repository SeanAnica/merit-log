import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useSettingsStore } from "@/stores/settingsStore";

export default function App() {
  const load = useSettingsStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return <Layout />;
}

import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Health() {
  const [db, setDb] = useState("...");

  useEffect(() => {
    api.get("/api/health").then(r => setDb(r.data.db)).catch(() => setDb("down"));
  }, []);

  return (
    <>
      <h2>Database Health</h2>
      <p>Status: <strong>{db}</strong></p>
    </>
  );
}

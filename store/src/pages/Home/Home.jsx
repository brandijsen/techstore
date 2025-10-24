import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Catalog from "./components/Catalog.jsx";
import { useSelector } from "react-redux";

export default function Home() {
  const [pong, setPong] = useState(null);
    const user = useSelector((state) => state.auth.user);


useEffect(() => {
  api.get("/api/ping")
    .then(r => setPong(r.data.message))
    .catch(err => {
      console.error("Ping error:", err?.message, err?.response?.data);
      setPong("error");
    });
}, []);

  return (
    <>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Benvenuto nel TechStore</h1>
      {user ? (
        <p className="text-lg">Ciao, <strong>{user.name}</strong>! 👋</p>
      ) : (
        <p className="text-lg">Effettua l'accesso per iniziare lo shopping.</p>
      )}
    </div>
    <Catalog/>
      <p>Ping test: <strong>{pong ?? "..."}</strong></p>

    </>
  );
}

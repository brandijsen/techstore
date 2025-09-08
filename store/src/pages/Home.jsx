import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Home() {
  const [pong, setPong] = useState(null);

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
      <h1>Welcome to TechStore</h1>
      <p>Ping test: <strong>{pong ?? "..."}</strong></p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
  Tailwind Button
</button>
    </>
  );
}

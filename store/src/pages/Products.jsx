import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/demo/products")
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2>Products</h2>
      <ul>
        {items.map(p => (
          <li key={p.id}>
            {p.name} — €{Number(p.price).toFixed(2)} — stock: {p.stock}
          </li>
        ))}
      </ul>
    </>
  );
}

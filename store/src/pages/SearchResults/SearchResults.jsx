import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../lib/api.js";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/api/products?q=${query}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Errore nella ricerca:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <p className="p-4">Caricamento...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Risultati per: <span className="italic text-gray-600">{query}</span>
      </h2>

      {products.length === 0 ? (
        <p>Nessun prodotto trovato.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.brand}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

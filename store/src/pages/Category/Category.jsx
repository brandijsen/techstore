import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";

const Category = () => {
  const { slug } = useParams(); // es. "smartphone"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/api/products?category=${slug}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Errore nel caricamento dei prodotti:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Caricamento prodotti...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 capitalize">
        Categoria: {slug}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-600">Nessun prodotto trovato per questa categoria.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-gray-600 text-sm">€{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;

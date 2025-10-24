import React, { useState, useEffect } from "react";
import { api } from "../src/lib/api";
import { useNavigate } from "react-router-dom";

const CategoriesMenuButton = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Errore nel caricamento delle categorie:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    setIsOpen(false);
    navigate(`/category/${slug}`);
  };

  const handleAllClick = () => {
    setIsOpen(false);
    navigate("/products"); // oppure navigate("/category/all") se vuoi una pagina dedicata
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Bottone principale */}
      <button
        className="px-4 py-2 bg-white text-gray-800 rounded-md  transition"
      >
        Categorie ▾
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <ul className="py-1">
            {/* ✅ Voce “All Categories” */}
            <li
              onClick={handleAllClick}
              className="px-4 py-2 cursor-pointer font-semibold text-blue-600 hover:bg-gray-100 transition"
            >
              All Categories
            </li>

            {/* Divider visivo */}
            <hr className="my-1" />

            {/* Altre categorie */}
            {categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoriesMenuButton;

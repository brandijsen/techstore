import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query.trim()}`);
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center rounded-md overflow-hidden bg-white"
    >
      <input
        type="text"
        placeholder="Cerca un prodotto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-2 w-64 text-black focus:outline-none"
      />
      <button
        type="submit"
        className="bg-gray-500 text-white px-4 py-2 hover:bg-gray-700 transition border-l border-gray-800"
      >
        Cerca
      </button>
    </form>
  );
};

export default Searchbar;

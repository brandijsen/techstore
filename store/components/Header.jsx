import React from "react";
import { Link } from "react-router-dom";
import CategoriesMenuButton from "./CategoriesMenuButton";
import Searchbar from "./Searchbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="w-full bg-gray-900 text-white border-b border-gray-800">
      <div className="flex items-center justify-between px-8 py-3">
        {/* 🔹 Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-gray-300 transition"
        >
          TechStore
        </Link>

        {/* 🔹 Menu Categories + Searchbar */}
        <div className="flex items-center gap-6">
          <CategoriesMenuButton />
          <Searchbar />
        </div>

        {/* 🔹 Navbar (login, profilo, carrello) */}
        <Navbar />
      </div>
    </header>
  );
};

export default Header;

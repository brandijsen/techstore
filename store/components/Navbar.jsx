import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, LogIn, LogOut, ShoppingCart } from "lucide-react";
import { logout } from "../src/redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center gap-4">
      <Link to="/cart" className="relative hover:text-gray-300">
        <ShoppingCart className="inline mr-1" size={20} />
        Carrello
      </Link>

      {isAuthenticated ? (
        <div className="relative group">
          <button className="flex items-center gap-1 hover:text-gray-300">
            <User size={18} /> {user?.name}
          </button>
          <div className="absolute right-0 hidden group-hover:block bg-gray-800 text-white rounded-md mt-2 shadow-lg min-w-[150px]">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">
              Profilo
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              <LogOut size={16} className="inline mr-1" /> Logout
            </button>
          </div>
        </div>
      ) : (
        <Link to="/login" className="hover:text-gray-300 flex items-center gap-1">
          <LogIn size={18} /> Accedi
        </Link>
      )}
    </div>
  );
};

export default Navbar;

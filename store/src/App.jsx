import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Header from "../components/Header.jsx";
import Category from "./pages/Category/Category.jsx";
import Products from "./pages/Products/Products.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Cart/CheckOut.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/User/Profile.jsx";
import Footer from "../components/Footer.jsx";
import SearchResults from "./pages/SearchResults/SearchResults.jsx";
import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./redux/slices/authSlice";
import { api } from "./lib/api";

export default function App() {

const dispatch = useDispatch();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return console.log("❌ Nessun token trovato");

  console.log("🟡 Token trovato, controllo profilo...");
  (async () => {
    try {
const res = await api.get("/api/auth/customer/me");
      console.log("✅ Profilo caricato:", res.data);
      dispatch(setCredentials({ user: res.data, token }));
    } catch (err) {
      console.error("❌ Errore durante verifica token:", err);
      localStorage.removeItem("token");
      dispatch(logout());
    }
  })();
}, [dispatch]);
  return (
    <BrowserRouter>
      <Header/>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<Category />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer/>
    </BrowserRouter>
  );
}

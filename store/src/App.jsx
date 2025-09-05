import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: 12 }}>TechStore</Link>
        <Link to="/products">Products</Link>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

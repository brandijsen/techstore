import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Health from "./pages/Health.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: 12 }}>Backoffice</Link>
        <Link to="/health">DB Health</Link>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

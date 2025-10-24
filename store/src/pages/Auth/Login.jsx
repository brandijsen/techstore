import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { startLoading, setCredentials, setError } from "../../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());

    try {
      const res = await api.post("/api/auth/customer/login", { email, password });

      // 🔹 Salviamo token e user nello store Redux
      dispatch(setCredentials({
        user: res.data.user,
        token: res.data.token
      }));

      // 🔹 Salviamo anche il token nel localStorage (così resta dopo refresh)
      localStorage.setItem("token", res.data.token);

      navigate("/"); // Redirect dopo login
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Errore di autenticazione"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Accedi</h1>

        {error && (
          <p className="bg-red-600 text-white text-sm p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md mt-2 transition disabled:opacity-50"
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Non hai un account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

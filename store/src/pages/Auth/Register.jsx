import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { setCredentials, startLoading, setError } from "../../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }

    dispatch(startLoading());

    try {
      const res = await api.post("/api/auth/customer/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      // salva nel Redux e nel localStorage
      localStorage.setItem("token", token);
      dispatch(setCredentials({ user, token }));

      toast.success("Registrazione completata!");
      navigate("/profile");
    } catch (err) {
      console.error("Errore registrazione:", err);
      dispatch(setError("Errore nella registrazione"));
      if (err.response?.data?.error)
        toast.error(err.response.data.error);
      else
        toast.error("Errore durante la registrazione");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Crea un account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            className="p-2 rounded bg-gray-700 text-white"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-2 rounded bg-gray-700 text-white"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-2 rounded bg-gray-700 text-white"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Conferma password"
            className="p-2 rounded bg-gray-700 text-white"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
          >
            Registrati
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Hai già un account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

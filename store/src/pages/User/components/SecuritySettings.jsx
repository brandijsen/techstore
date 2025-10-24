import React, { useState } from "react";
import { api } from "../../../lib/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

const SecuritySettings = ({ user }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
  });

  // 🔹 Cambio nome
  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/auth/customer/name", {
        name: formData.name,
      });
      toast.success(res.data?.message || "Nome aggiornato con successo!");
    } catch (err) {
      console.error("Errore cambio nome:", err);
      const msg =
        err.response?.data?.error || "Errore durante l’aggiornamento del nome";
      toast.error(msg);
    }
  };

  // 🔹 Cambio email
  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/auth/customer/email", {
        email: formData.email,
      });
      toast.success(res.data?.message || "Email aggiornata con successo!");
    // 🔄 Aggiorna profilo utente nel Redux store
const profile = await api.get("/api/auth/customer/me");
dispatch({ type: "auth/updateUser", payload: profile.data });
    } catch (err) {
      console.error("Errore cambio email:", err);
      const msg =
        err.response?.data?.error || "Errore durante l’aggiornamento dell’email";
      toast.error(msg);
    }
  };

  // 🔹 Cambio password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/auth/customer/password", {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success(res.data?.message || "Password aggiornata con successo!");

      // Logout automatico per sicurezza
      dispatch(logout());
      localStorage.removeItem("token");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err) {
      console.error("Errore cambio password:", err);
      const msg =
        err.response?.data?.error || "Errore durante il cambio password";
      toast.error(msg);
    }
  };

  // 🔹 Eliminazione account
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "⚠️ Sei sicuro di voler eliminare definitivamente il tuo account?"
      )
    )
      return;
    try {
      await api.delete("/api/auth/customer");
      toast.success("Account eliminato con successo");
      localStorage.removeItem("token");
      dispatch(logout());
      window.location.href = "/";
    } catch (err) {
      console.error("Errore eliminazione account:", err);
      toast.error("Errore durante l’eliminazione account");
    }
  };

  return (
    <div className="space-y-8 text-gray-200">

      {/* 🔹 Sezione cambio nome */}
      <form
        onSubmit={handleNameChange}
        className="bg-gray-700 p-5 rounded-lg shadow-md space-y-3"
      >
        <h2 className="text-xl font-semibold mb-3 text-blue-400">
          Cambia nome
        </h2>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nuovo nome"
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
        >
          Aggiorna nome
        </button>
      </form>

      {/* 🔹 Sezione cambio email */}
      <form
        onSubmit={handleEmailChange}
        className="bg-gray-700 p-5 rounded-lg shadow-md space-y-3"
      >
        <h2 className="text-xl font-semibold mb-3 text-blue-400">
          Cambia email
        </h2>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Nuova email"
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
        >
          Aggiorna email
        </button>
      </form>

      {/* 🔹 Sezione cambio password */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-gray-700 p-5 rounded-lg shadow-md space-y-3"
      >
        <h2 className="text-xl font-semibold mb-3 text-blue-400">
          Cambia password
        </h2>
        <input
          type="password"
          placeholder="Password attuale"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Nuova password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
        >
          Aggiorna password
        </button>
      </form>

      {/* 🔹 Sezione elimina account */}
      <div className="bg-gray-700 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-red-400">
          Elimina account
        </h2>
        <p className="text-gray-400 mb-4">
          Questa azione è irreversibile. Tutti i tuoi dati e indirizzi verranno
          rimossi.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
        >
          Elimina account
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;

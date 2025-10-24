import React, { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import toast from "react-hot-toast";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // stato per form/modale
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    province: "",
    country: "Italy",
    is_default: false,
  });

  // fetch indirizzi
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/addresses");
      setAddresses(res.data);
    } catch (err) {
      console.error("Errore nel caricamento indirizzi:", err);
      setError("Errore nel caricamento indirizzi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // gestisci apertura form
  const openForm = (address = null) => {
    if (address) setFormData(address);
    else
      setFormData({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        postal_code: "",
        province: "",
        country: "Italy",
        is_default: false,
      });
    setEditingAddress(address);
    setShowForm(true);
  };

  // invio form
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingAddress) {
      await api.put(`/api/addresses/${editingAddress.id}`, formData);
      toast.success("Indirizzo aggiornato con successo");
    } else {
      await api.post("/api/addresses", formData);
      toast.success("Nuovo indirizzo aggiunto");
    }
    setShowForm(false);
    setEditingAddress(null);
    await fetchAddresses(); // refresh automatico
  } catch (err) {
    console.error("Errore salvataggio indirizzo:", err);
    toast.error("Errore durante il salvataggio");
  }
};

  // elimina indirizzo
  const handleDelete = async (id) => {
  if (!confirm("Vuoi davvero eliminare questo indirizzo?")) return;
  try {
    await api.delete(`/api/addresses/${id}`);
    toast.success("Indirizzo eliminato");
    await fetchAddresses();
  } catch (err) {
    console.error("Errore eliminazione indirizzo:", err);
    toast.error("Errore durante l'eliminazione");
  }
};


  if (loading) return <p className="text-gray-400">Caricamento...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">📦 I miei indirizzi</h2>
        <button
          onClick={() => openForm()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded"
        >
          + Aggiungi
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-400">Nessun indirizzo salvato.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="border border-gray-700 rounded-lg p-4 text-gray-200 hover:bg-gray-700 transition"
            >
              <p className="font-semibold">{addr.full_name}</p>
              <p>{addr.address_line}</p>
              <p>
                {addr.postal_code} {addr.city} ({addr.province})
              </p>
              <p>{addr.country}</p>
              {addr.phone && <p>📞 {addr.phone}</p>}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openForm(addr)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* MODALE FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {editingAddress ? "Modifica indirizzo" : "Nuovo indirizzo"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome completo"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Telefono"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Indirizzo"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.address_line}
                onChange={(e) =>
                  setFormData({ ...formData, address_line: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Città"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="CAP"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Provincia"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Paese"
                className="p-2 rounded bg-gray-700 text-white"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                />
                Imposta come predefinito
              </label>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                {editingAddress ? "Salva modifiche" : "Aggiungi indirizzo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;

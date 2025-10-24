import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Addresses from "./components/Addresses";
import SecuritySettings from "./components/SecuritySettings";
import Orders from "./components/Orders";
import Payments from "./components/Payments";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("security");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Il tuo profilo
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6 border-b border-gray-700 pb-3">
          {[
            { id: "security", label: "Accesso e sicurezza" },
            { id: "addresses", label: "Indirizzi" },
            { id: "orders", label: "Ordini" },
            { id: "payments", label: "Metodi di pagamento" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenuto */}
        {activeTab === "security" && <SecuritySettings user={user} />}
        {activeTab === "addresses" && <Addresses />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "payments" && <Payments />}
      </div>
    </div>
  );
};

export default Profile;

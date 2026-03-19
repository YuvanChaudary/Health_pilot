import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const PharmacyAdminForm = () => {
  const navigate = useNavigate();
  const { adminCredentials } = useAdminAuth();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    medicine: "",
    price: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      username: adminCredentials.username,
      password: adminCredentials.password
    };

    try {
      const res = await fetch("http://localhost:5000/api/admin/pharmacy/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (res.status === 201) navigate("/pharmacies");
    } catch (err) {
      console.error("❌ Error adding pharmacy:", err);
      alert("Error adding pharmacy");
    }
  };

  return (
    <div className="pharmacy-admin-form">
      <h2>💊 Add Pharmacy</h2>
      <form onSubmit={handleSubmit}>
        {["name", "address", "city", "medicine", "price"].map((field) => (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Add Pharmacy</button>
      </form>
    </div>
  );
};

export default PharmacyAdminForm;

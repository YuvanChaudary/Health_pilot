import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pharmacyAdminForm.css";


const PharmacyAdminForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    e.preventDefault(); // ✅ prevent page reload
    try {
      const res = await fetch("http://localhost:5000/api/admin/pharmacy/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message || data.error);

      if (res.status === 201) {
        // ✅ Redirect to pharmacy list page after successful add
        navigate("/pharmacies");
      }
    } catch (err) {
      console.error("❌ Error adding pharmacy:", err);
      alert("Error adding pharmacy");
    }
  };

  return (
    <div className="pharmacy-admin-form">
      <h2>💊 Add Pharmacy</h2>
      <form onSubmit={handleSubmit}>
        {["username","password","name","address","city","medicine","price"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            autoComplete={field === "username" ? "username" : field === "password" ? "current-password" : "off"}
          />
        ))}
        <button type="submit">Add Pharmacy</button>
      </form>
    </div>
  );
};

export default PharmacyAdminForm;

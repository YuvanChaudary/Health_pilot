import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const HospitalAdminForm = () => {
  const navigate = useNavigate();
  const { adminCredentials } = useAdminAuth(); // contains { username, password }

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    specialty: "",
    website: "",
    mobile: "",
    map_link: ""
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
      const res = await fetch("http://localhost:5000/api/admin/hospital/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (res.status === 201) navigate("/hospitals");
    } catch (err) {
      console.error("❌ Error adding hospital:", err);
      alert("Error adding hospital");
    }
  };

  return (
    <div className="hospital-admin-form">
      <h2>🏥 Add Hospital</h2>
      <form onSubmit={handleSubmit}>
        {["name", "address", "city", "specialty", "website", "mobile", "map_link"].map((field) => (
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
        <button type="submit">Add Hospital</button>
      </form>
    </div>
  );
};

export default HospitalAdminForm;

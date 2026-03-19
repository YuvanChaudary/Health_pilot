import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/hospitalAdminForm.css";

const HospitalAdminForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    e.preventDefault(); // ✅ prevent page reload
    try {
      const res = await fetch("http://localhost:5000/api/admin/hospital/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message || data.error);

      if (res.status === 201) {
        // ✅ Redirect to hospital list page after successful add
        navigate("/hospitals");
      }
    } catch (err) {
      console.error("❌ Error adding hospital:", err);
      alert("Error adding hospital");
    }
  };

  return (
    <div className="hospital-admin-form">
      <h2>🏥 Add Hospital</h2>
      <form onSubmit={handleSubmit}>
        {[
          "username",
          "password",
          "name",
          "address",
          "city",
          "specialty",
          "website",
          "mobile",
          "map_link"
        ].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            autoComplete={
              field === "username"
                ? "username"
                : field === "password"
                ? "current-password"
                : "off"
            }
          />
        ))}
        <button type="submit">Add Hospital</button>
      </form>
    </div>
  );
};

export default HospitalAdminForm;

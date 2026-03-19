import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/adminLogin.css";


const AdminLoginPage = () => {
  const navigate = useNavigate();

  const goToHospitalLogin = () => {
    navigate("/admin/hospital/login");
  };

  const goToPharmacyLogin = () => {
    navigate("/admin/pharmacy/login");
  };

  return (
    <div className="admin-login-page">
      <h2>🔒 Admin Login</h2>
      <p>Select your admin type:</p>

      <div className="admin-buttons">
        <button onClick={goToHospitalLogin}>🏥 Hospital Admin</button>
        <button onClick={goToPharmacyLogin}>💊 Pharmacy Admin</button>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../../styles/hospitalAdminLogin.css";


const HospitalAdminLogin = () => {
  const { loginAsAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevent page reload
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const res = await loginAsAdmin(trimmedUsername, trimmedPassword, "hospital");
    console.log("🔍 Hospital login response:", res);

    if (res.success) {
      alert("Hospital admin login successful");
      navigate("/admin/hospital");
    } else {
      alert(res.error || "Login failed");
    }
  };

  return (
    <div className="hospital-admin-login">
      <h2>🏥 Hospital Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username" // ✅ added
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password" // ✅ added
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default HospitalAdminLogin;

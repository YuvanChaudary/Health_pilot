import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState(""); // 👈 changed from username to name
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }), // 👈 backend expects "name"
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Login successful!");

        // 🔐 Store token and name for session
        localStorage.setItem("authToken", data.token || "dev-token");
        localStorage.setItem("username", name); // frontend can still call it "username"

        onLogin(); // update login state
        setName("");
        setPassword("");
        navigate("/vault"); // or "/profile" if you prefer
      } else {
        setErrorMsg(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="username"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit">Login</button>
        </form>

        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <p className="register-link">
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>
        <p className="forgot-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

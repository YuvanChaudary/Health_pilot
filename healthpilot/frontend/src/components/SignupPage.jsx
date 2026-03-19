import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/signup.css"; // ✅ CSS includes background image

const SignupPage = () => {
  const [name, setName] = useState(""); // 👈 changed from username to name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      name,      // 👈 backend expects "name"
      email,
      password,
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert("✅ Registered successfully!");
        navigate("/login");
      } else {
        setErrorMsg(json.error || json.message || "Signup failed");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setErrorMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-overlay" />
      <div className="signup-box">
        <h2>Register</h2>
        <form onSubmit={handleSignup}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email (optional)</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>

        {errorMsg && <p className="signup-error">{errorMsg}</p>}

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

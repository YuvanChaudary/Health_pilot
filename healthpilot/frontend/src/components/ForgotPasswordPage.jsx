import React, { useState } from "react";
import "../../styles/forgot.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Password reset successful!");
        setEmail("");
        setNewPassword("");
      } else {
        alert(`❌ ${data.error || "Reset failed"}`);
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="forgot-wrapper">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;

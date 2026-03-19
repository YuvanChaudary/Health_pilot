import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const prefilledToken = location.state?.token || "";

  const [token, setToken] = useState(prefilledToken);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("❌ Error resetting password");
    }
  };

  return (
    <div className="reset-password-page">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🔁 Reset Password</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          placeholder="Enter reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="pharmacy-search-input mb-4"
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="pharmacy-search-input mb-4"
        />
        <button type="submit" className="pharmacy-search-input">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default ResetPassword;

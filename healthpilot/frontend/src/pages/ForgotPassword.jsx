import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (data.token) setToken(data.token);
    } catch (err) {
      setMessage("❌ Error sending reset link");
    }
  };

  const handleRedirect = () => {
    navigate("/reset-password", { state: { token } });
  };

  return (
    <div className="forgot-password-page">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🔑 Forgot Password</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pharmacy-search-input mb-4"
        />
        <button type="submit" className="pharmacy-search-input">
          Send Reset Link
        </button>
      </form>

      {message && <p className="mt-4 text-gray-700">{message}</p>}

      {token && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <p className="font-semibold text-green-700">🔐 Your reset token:</p>
          <code className="block break-all text-sm text-blue-700 mt-2">{token}</code>
          <button
            onClick={handleRedirect}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Reset Page
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

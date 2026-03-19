import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AddExpense.css";

const AddExpense = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
      setUsername(token);
    }
  }, [navigate]);

  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Doctor");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { date, category, amount, description, username };

    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      alert(result.message || "✅ Expense added successfully.");

      setDate("");
      setCategory("Doctor");
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("❌ Error submitting expense:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="expense-page">
      <h2 className="expense-title">💼 Add New Medical Expense</h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <label>Date *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="Doctor">Doctor</option>
          <option value="Medicine">Medicine</option>
          <option value="Lab Test">Lab Test</option>
          <option value="Hospital">Hospital</option>
        </select>

        {/* 💸 Amount field with label beside input */}
        <div className="expense-field-row">
          <label className="expense-inline-label">Amount *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <label>Description *</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">➕ Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;

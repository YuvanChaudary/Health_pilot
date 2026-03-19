import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "../../styles/ViewExpenses.css";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [barChartRef, setBarChartRef] = useState(null);
  const [pieChartRef, setPieChartRef] = useState(null);
  const [totalSpend, setTotalSpend] = useState(0);

  // ✅ Fetch expenses with filters
  const fetchExpenses = () => {
    const params = new URLSearchParams();
    const username = localStorage.getItem("authToken") || "dev-token"; // must match DB
    params.append("username", username);

    if (category) params.append("category", category);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    fetch(`http://localhost:5000/api/expenses?${params.toString()}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setExpenses(data);
        drawBarChart(data);
        drawPieChart(data);
        calculateTotal(data);
      })
      .catch(err => {
        console.error("❌ Fetch expenses error:", err);
        setExpenses([]);
      });
  };

  // 🗑️ Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    const username = localStorage.getItem("authToken") || "dev-token";
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}?username=${username}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message || "🗑️ Expense deleted.");
      fetchExpenses(); // refresh after delete
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Delete failed. Try again.");
    }
  };

  // ✅ Calculate total spend
  const calculateTotal = (data) => {
    const total = data.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    setTotalSpend(total.toFixed(2));
  };

  // ✅ Draw bar chart (monthly totals)
  const drawBarChart = (data) => {
    const totals = {};
    data.forEach(e => {
      const m = e.date.slice(0, 7); // YYYY-MM
      totals[m] = (totals[m] || 0) + parseFloat(e.amount);
    });

    const labels = Object.keys(totals).sort();
    const values = labels.map(l => totals[l]);

    if (barChartRef) barChartRef.destroy();

    const ctx = document.getElementById("expenseBarChart");
    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Monthly Expense ₹",
          data: values,
          backgroundColor: "#3b82f6"
        }]
      }
    });

    setBarChartRef(newChart);
  };

  // ✅ Draw pie chart (category totals)
  const drawPieChart = (data) => {
    const categoryTotals = {};
    data.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount);
    });

    const labels = Object.keys(categoryTotals);
    const values = labels.map(l => categoryTotals[l]);

    if (pieChartRef) pieChartRef.destroy();

    const ctx = document.getElementById("expensePieChart");
    const newChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          label: "Expense by Category",
          data: values,
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
        }]
      }
    });

    setPieChartRef(newChart);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="view-expense-page">
      <h2 className="view-expense-title">📊 Expense History</h2>

      <div className="filters">
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Doctor">Doctor</option>
          <option value="Medicine">Medicine</option>
          <option value="Lab Test">Lab Test</option>
          <option value="Hospital">Hospital</option>
        </select>
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        <input type="number" placeholder="Month (1-12)" value={month} onChange={e => setMonth(e.target.value)} />
        <button onClick={fetchExpenses}>🔍 Filter</button>
      </div>

      <div className="summary">
        <h3>Total Spend: ₹{totalSpend}</h3>
        <canvas id="expensePieChart" height="100"></canvas>
      </div>

      <canvas id="expenseBarChart" height="100"></canvas>

      <div className="expense-list">
        {expenses.map((e, i) => (
          <div key={i} className="expense-item">
            <strong>{e.date}</strong> — ₹{e.amount} ({e.category})<br />
            <span>{e.description}</span>
            <br />
            <button
              className="delete-button"
              onClick={() => handleDelete(e.id)}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewExpenses;

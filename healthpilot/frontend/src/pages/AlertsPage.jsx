import React, { useEffect, useState } from "react";
import Alerts from "../components/Alerts";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = () => {
    fetch("http://localhost:5000/api/alerts") // ✅ direct backend call
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Failed to fetch alerts:", err));
  };

  useEffect(() => {
    fetchAlerts(); // initial load
    const interval = setInterval(fetchAlerts, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alerts-page">
      <h2>🛡️ Health Alerts Dashboard</h2>
      <Alerts alerts={alerts} />
    </div>
  );
};

export default AlertsPage;

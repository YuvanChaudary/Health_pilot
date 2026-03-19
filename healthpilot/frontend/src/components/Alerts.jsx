import React from "react";
import "/styles/alerts.css"; // ✅ now valid with alias

const Alerts = ({ alerts }) => {
  return (
    <div className="alerts-grid">
      {alerts.map((alert) => (
        <div key={alert.id} className="alert-card">
          <img src={alert.image} alt="alert" className="alert-image" />
          <div className="alert-content">
            <span className={`badge badge-${alert.category?.toLowerCase() || "general"}`}>
              {alert.category}
            </span>
            <h3>{alert.title}</h3>
            <p>{alert.summary}</p>
            <div className="alert-actions">
              <a href={alert.url} target="_blank" rel="noopener noreferrer">
                🔗 Read full article
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(alert.title + " - " + alert.url)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📲 Share on WhatsApp
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(alert.url)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💼 Share on LinkedIn
              </a>
            </div>
            <span className="timestamp">{alert.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alerts;

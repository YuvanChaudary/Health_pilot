// D:\mini project 1\healthpilot\frontend\src\components\HospitalCard.jsx
import React from 'react';

const HospitalCard = ({ hospital }) => {
  const {
    name,
    address,
    city,
    specialty,
    logo,
    website,
    mobile,
    map
  } = hospital;

  const fallbackLogo = "https://logos.healthpilot.ai/default.png";
  const fallbackWebsite = "#";
  const fallbackMobile = "Not available";
  const fallbackMap = "#";

  return (
    <div className="hospital-card-item">
      <h3 className="hospital-name">🏥 {name || "Unnamed Hospital"}</h3>
      <p className="hospital-address">
        📍 <strong>{name || "Unnamed Hospital"}</strong><br />
        {address}, {city}
      </p>
      <p>🩺 Specialty: {specialty}</p>
      <p>📞 <a href={mobile ? `tel:${mobile}` : "#"}>{mobile || fallbackMobile}</a></p>
      <p>🌐 <a href={website || fallbackWebsite} target="_blank" rel="noopener noreferrer">
        {website ? "Visit Website" : "Website not available"}
      </a></p>
      <p>🗺️ <a href={map || fallbackMap} target="_blank" rel="noopener noreferrer">
        {map ? "View on Map" : "Map not available"}
      </a></p>
    </div>
  );
};

export default HospitalCard;

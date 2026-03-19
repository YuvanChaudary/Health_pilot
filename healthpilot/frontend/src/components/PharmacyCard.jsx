const PharmacyCard = ({ name, address, city, price, medicines = [] }) => (
  <div className="pharmacy-card">
    <h3 className="pharmacy-name">🏥 {name || "Unnamed Pharmacy"}</h3>
    <p className="pharmacy-address">📍 {address}{city ? `, ${city}` : ""}</p>

    {medicines.length > 0 ? (
      <p className="pharmacy-medicines">🧪 Medicines Available: {medicines.join(", ")}</p>
    ) : (
      <p className="pharmacy-medicines">🧪 Medicines: Not listed</p>
    )}

    {price !== undefined && price !== null ? (
      <p className="pharmacy-price">💰 Price: ₹{price}</p>
    ) : (
      <p className="pharmacy-price">💰 Price info not available</p>
    )}
  </div>
);

export default PharmacyCard;

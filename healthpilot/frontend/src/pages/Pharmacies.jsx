import React, { useState, useEffect } from "react";
import PharmacyCard from "../components/PharmacyCard";
import "../../styles/pharmacies.css";

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [medicineQuery, setMedicineQuery] = useState("");
  const [pharmacyQuery, setPharmacyQuery] = useState("");
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [pharmacySuggestions, setPharmacySuggestions] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  // 🔹 Load all pharmacies initially
  useEffect(() => {
    fetch("http://localhost:5000/api/pharmacies")
      .then(res => res.json())
      .then(data => setPharmacies(data))
      .catch(err => console.error("❌ Error loading pharmacies:", err));
  }, []);

  // 🔹 Debounced autocomplete for medicine
  useEffect(() => {
    const delay = setTimeout(() => {
      if (medicineQuery.length > 1) {
        fetch(`http://localhost:5000/api/pharmacies/suggest?field=medicine&query=${medicineQuery}`)
          .then(res => res.json())
          .then(data => setMedicineSuggestions(data.suggestions || []))
          .catch(err => console.error("❌ Medicine suggest error:", err));
      } else {
        setMedicineSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [medicineQuery]);

  // 🔹 Debounced autocomplete for pharmacy name
  useEffect(() => {
    const delay = setTimeout(() => {
      if (pharmacyQuery.length > 1) {
        fetch(`http://localhost:5000/api/pharmacies/suggest?field=name&query=${pharmacyQuery}`)
          .then(res => res.json())
          .then(data => setPharmacySuggestions(data.suggestions || []))
          .catch(err => console.error("❌ Pharmacy suggest error:", err));
      } else {
        setPharmacySuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [pharmacyQuery]);

  // 🔹 Search by medicine
  const handleMedicineSearch = (term) => {
    setMedicineQuery(term);
    fetch(`http://localhost:5000/api/pharmacies/search?medicine=${term}`)
      .then(res => res.json())
      .then(data => setPharmacies(data))
      .catch(err => console.error("❌ Medicine search error:", err));
  };

  // 🔹 Search by pharmacy name
  const handlePharmacySearch = (term) => {
    setPharmacyQuery(term);
    fetch(`http://localhost:5000/api/pharmacies/search?name=${term}`)
      .then(res => res.json())
      .then(data => setPharmacies(data))
      .catch(err => console.error("❌ Pharmacy search error:", err));
  };

  // 🔹 Sort by price
  const handleSortChange = (order) => {
    setSortOrder(order);
    fetch(`http://localhost:5000/api/pharmacies/search?sort=price&order=${order}`)
      .then(res => res.json())
      .then(data => setPharmacies(data))
      .catch(err => console.error("❌ Sort error:", err));
  };

  return (
    <div className="pharmacy-page">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">💊 Pharmacy Finder</h2>

      {/* 🔹 Search by medicine */}
      <div className="mb-6 max-w-md relative">
        <input
          type="text"
          value={medicineQuery}
          onChange={e => setMedicineQuery(e.target.value)}
          placeholder="Search by medicine..."
          className="pharmacy-search-input"
          autoComplete="off"
        />
        {medicineSuggestions.length > 0 && (
          <ul className="pharmacy-suggestions">
            {medicineSuggestions.map((s, i) => (
              <li
                key={i}
                className="pharmacy-suggestion-item"
                onClick={() => {
                  handleMedicineSearch(s);
                  setMedicineSuggestions([]);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Search by pharmacy name */}
      <div className="mb-6 max-w-md relative">
        <input
          type="text"
          value={pharmacyQuery}
          onChange={e => setPharmacyQuery(e.target.value)}
          placeholder="Search by pharmacy name..."
          className="pharmacy-search-input"
          autoComplete="off"
        />
        {pharmacySuggestions.length > 0 && (
          <ul className="pharmacy-suggestions">
            {pharmacySuggestions.map((s, i) => (
              <li
                key={i}
                className="pharmacy-suggestion-item"
                onClick={() => {
                  handlePharmacySearch(s);
                  setPharmacySuggestions([]);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Sort by price */}
      <div className="mb-6 max-w-md">
        <select
          className="pharmacy-search-input"
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">Sort by price</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      {/* 🔹 Pharmacy grid */}
      <div className="pharmacy-grid">
        {pharmacies.length > 0 ? (
          pharmacies.map((p, i) => (
            <PharmacyCard
              key={i}
              name={p.name}
              address={p.address}
              city={p.city}
              price={p.price}
              medicines={
                Array.isArray(p.medicines)
                  ? p.medicines
                  : p.medicine
                  ? [p.medicine]
                  : ["Not specified"]
              }
            />
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">🚫 No pharmacies found</p>
        )}
      </div>
    </div>
  );
};

export default Pharmacies;

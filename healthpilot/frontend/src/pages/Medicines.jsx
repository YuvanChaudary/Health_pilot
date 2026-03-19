import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../styles/medicines.css";

const MedicineCard = ({
  disease,
  medicine,
  cost,
  annual_cost,
  symptoms,
  side_effects,
  drug_interactions
}) => (
  <div className="medicine-card">
    <h3 className="medicine-name">💊 {medicine}</h3>
    <p className="medicine-disease">🦠 Disease: {disease}</p>
    <p className="medicine-cost">💰 Cost: ₹{cost} | Annual: ₹{annual_cost}</p>
    <p className="medicine-section">🧬 Symptoms: {symptoms.join(", ")}</p>
    <p className="medicine-section">⚠️ Side Effects: {side_effects.join(", ")}</p>
    <p className="medicine-section">🔗 Drug Interactions: {drug_interactions.join(", ")}</p>
  </div>
);

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [diseaseQuery, setDiseaseQuery] = useState("");
  const [medicineQuery, setMedicineQuery] = useState("");
  const [minAnnualCost, setMinAnnualCost] = useState("");
  const [maxAnnualCost, setMaxAnnualCost] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [sideEffectOptions, setSideEffectOptions] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedSideEffects, setSelectedSideEffects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/medicines")
      .then(res => res.json())
      .then(data => setMedicines(data));
  }, []);

  useEffect(() => {
    if (diseaseQuery.length > 1) {
      fetch(`http://localhost:5000/api/medicines/suggest?field=disease&query=${diseaseQuery}`)
        .then(res => res.json())
        .then(data => setDiseaseSuggestions(data.suggestions));
    } else {
      setDiseaseSuggestions([]);
    }
  }, [diseaseQuery]);

  useEffect(() => {
    if (medicineQuery.length > 1) {
      fetch(`http://localhost:5000/api/medicines/suggest?field=medicine&query=${medicineQuery}`)
        .then(res => res.json())
        .then(data => setMedicineSuggestions(data.suggestions));
    } else {
      setMedicineSuggestions([]);
    }
  }, [medicineQuery]);

  useEffect(() => {
    fetch("http://localhost:5000/api/medicines/suggest-tags?field=symptoms")
      .then(res => res.json())
      .then(data => setSymptomOptions(data.suggestions.map(s => ({ label: s, value: s }))));

    fetch("http://localhost:5000/api/medicines/suggest-tags?field=side_effects")
      .then(res => res.json())
      .then(data => setSideEffectOptions(data.suggestions.map(s => ({ label: s, value: s }))));
  }, []);

  const handleCombinedSearch = () => {
    const params = new URLSearchParams();
    if (diseaseQuery) params.append("disease", diseaseQuery);
    if (medicineQuery) params.append("medicine", medicineQuery);
    if (selectedSymptoms.length > 0) {
      selectedSymptoms.forEach(s => params.append("symptom", s.value));
    }
    if (selectedSideEffects.length > 0) {
      selectedSideEffects.forEach(s => params.append("side_effect", s.value));
    }
    if (minAnnualCost) params.append("min_annual", minAnnualCost);
    if (maxAnnualCost) params.append("max_annual", maxAnnualCost);
    if (sortOrder) {
      params.append("sort", "cost");
      params.append("order", sortOrder);
    }

    fetch(`http://localhost:5000/api/medicines/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => setMedicines(data));
  };

  return (
    <div className="medicine-page">
      <h2 className="medicine-explorer-title">💉 Medicine Explorer</h2>

      <div className="medicine-input-group">
        <input
          type="text"
          value={diseaseQuery}
          onChange={e => setDiseaseQuery(e.target.value)}
          placeholder="Search by disease..."
          className="medicine-search-input"
        />
        {diseaseSuggestions.length > 0 && (
          <ul className="medicine-suggestions">
            {diseaseSuggestions.map((s, i) => (
              <li key={i} className="medicine-suggestion-item" onClick={() => {
                setDiseaseQuery(s);
                setDiseaseSuggestions([]);
              }}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="medicine-input-group">
        <input
          type="text"
          value={medicineQuery}
          onChange={e => setMedicineQuery(e.target.value)}
          placeholder="Search by medicine..."
          className="medicine-search-input"
        />
        {medicineSuggestions.length > 0 && (
          <ul className="medicine-suggestions">
            {medicineSuggestions.map((s, i) => (
              <li key={i} className="medicine-suggestion-item" onClick={() => {
                setMedicineQuery(s);
                setMedicineSuggestions([]);
              }}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="medicine-input-group">
        <label className="medicine-filter-label">Filter by symptom:</label>
        <Select
          isMulti
          options={symptomOptions}
          value={selectedSymptoms}
          onChange={setSelectedSymptoms}
          placeholder="Select symptoms..."
        />
      </div>

      <div className="medicine-input-group">
        <label className="medicine-filter-label">Filter by side effect:</label>
        <Select
          isMulti
          options={sideEffectOptions}
          value={selectedSideEffects}
          onChange={setSelectedSideEffects}
          placeholder="Select side effects..."
        />
      </div>

      <div className="medicine-input-group">
        <input
          type="number"
          value={minAnnualCost}
          onChange={e => setMinAnnualCost(e.target.value)}
          placeholder="Min annual cost"
          className="medicine-search-input"
        />
      </div>

      <div className="medicine-input-group">
        <input
          type="number"
          value={maxAnnualCost}
          onChange={e => setMaxAnnualCost(e.target.value)}
          placeholder="Max annual cost"
          className="medicine-search-input"
        />
      </div>

      <div className="medicine-input-group">
        <select
          className="medicine-search-input"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by cost</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      <div className="medicine-input-group">
        <button className="medicine-search-button" onClick={handleCombinedSearch}>
          🔍 Apply Filters
        </button>
      </div>

      <div className="medicine-grid">
        {medicines.map((m, i) => (
          <MedicineCard
            key={i}
            disease={m.disease}
            medicine={m.medicine}
            cost={m.cost}
            annual_cost={m.annual_cost}
            symptoms={Array.isArray(m.symptoms) ? m.symptoms : []}
            side_effects={Array.isArray(m.side_effects) ? m.side_effects : []}
            drug_interactions={Array.isArray(m.drug_interactions) ? m.drug_interactions : []}
          />
        ))}
      </div>
    </div>
  );
};

export default Medicines;

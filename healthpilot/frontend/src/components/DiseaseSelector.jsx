import React, { useEffect, useState } from 'react';
import { fetchSuggestions } from '../api/healthpilot';

export default function DiseaseSelector({ onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Fetch disease + symptom suggestions
  useEffect(() => {
    fetchSuggestions()
      .then(data => {
        setSuggestions(data); // [{ disease, symptoms: [...] }]
        setFiltered(data);
        console.log("🧬 Suggestions fetched:", data);
      })
      .catch(err => console.error("Suggestion fetch error:", err));
  }, []);

  // 🔹 Filter by disease or symptom
  useEffect(() => {
    const q = query.toLowerCase();
    const matches = suggestions.filter(item =>
      item.disease.toLowerCase().includes(q) ||
      item.symptoms.some(sym => sym.toLowerCase().includes(q))
    );
    setFiltered(matches);
    setShowDropdown(true);
  }, [query, suggestions]);

  const handleSelect = (disease) => {
    setQuery(disease);
    setShowDropdown(false);
    onSelect(disease);
    console.log("🩺 Disease selected:", disease);
  };

  return (
    <div className="mb-6 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search Diseases or Symptoms
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Type disease or symptom..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
      />

      {/* 🔹 Dropdown only shows suggestions */}
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-y-auto shadow">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(item.disease)}
            >
              <p className="font-semibold text-blue-700">{item.disease}</p>
              <p className="text-sm text-gray-500">Symptoms: {item.symptoms.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}

      {/* 🔹 Spacer below dropdown to prevent overlap */}
      {showDropdown && <div className="h-16" />}
    </div>
  );
}

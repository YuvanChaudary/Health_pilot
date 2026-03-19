import React, { useState, useEffect } from 'react';
import './Hospitals.css';
import HospitalCard from '../components/HospitalCard';

function Hospitals() {
  const [specialty, setSpecialty] = useState('');
  const [search, setSearch] = useState('');
  const [disease, setDisease] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch hospitals based on filters
  const fetchHospitals = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (specialty) params.append('specialty', specialty);
    if (search) params.append('search', search);
    if (disease) params.append('disease', disease);

    try {
      const res = await fetch(`http://localhost:5000/api/hospitals/search?${params.toString()}`);
      const json = await res.json();
      setHospitals(json.hospitals || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch autocomplete suggestions
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) return setSuggestions([]);
    try {
      const res = await fetch(`http://localhost:5000/api/hospitals/suggest?query=${query}`);
      const json = await res.json();
      setSuggestions(json.suggestions || []);
    } catch (err) {
      console.error("❌ Suggestion error:", err);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [specialty, search, disease]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSuggestions(search);
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="hospital-wrapper">
      <div className="hospital-card">
        <h2>🏥 Hospital Discovery</h2>

        <input
          type="text"
          placeholder="🔍 Search by hospital name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          list="hospital-suggestions"
        />
        <datalist id="hospital-suggestions">
          {suggestions.map((s, i) => (
            <option key={i} value={s} />
          ))}
        </datalist>

        <select value={specialty} onChange={e => setSpecialty(e.target.value)}>
          <option value="">Filter by Specialty</option>
          <option value="cardiology">Cardiology</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="neurology">Neurology</option>
          <option value="oncology">Oncology</option>
          <option value="pediatrics">Pediatrics</option>
        </select>

        <select value={disease} onChange={e => setDisease(e.target.value)}>
          <option value="">Discover by Disease</option>
          <option value="diabetes">Diabetes</option>
          <option value="heart attack">Heart Attack</option>
          <option value="arthritis">Arthritis</option>
          <option value="cancer">Cancer</option>
          <option value="epilepsy">Epilepsy</option>
        </select>

        {loading ? (
          <div className="spinner">⏳ Loading hospitals...</div>
        ) : (
          <div className="hospital-list">
            {hospitals.length > 0 ? (
              hospitals.map((h, i) => (
                <HospitalCard key={i} hospital={h} />
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
                🚫 No hospitals found. Try adjusting your filters.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hospitals;

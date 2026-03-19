// src/api/healthpilot.js

export const fetchDiscovery = async (disease) => {
  try {
    const res = await fetch(`http://localhost:5000/api/discovery?disease=${encodeURIComponent(disease)}`);
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error("Error fetching discovery data:", error);
    return { data: null };
  }
};

export const fetchSuggestions = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/diseases');
    const data = await res.json();
    return data; // [{ disease: "Malaria", symptoms: [...] }, ...]
  } catch (error) {
    console.error("Error fetching disease suggestions:", error);
    return [];
  }
};

export const fetchPharmacies = async (medicine) => {
  try {
    const res = await fetch(`http://localhost:5000/api/pharmacies/search?medicine=${encodeURIComponent(medicine)}`);
    const data = await res.json();
    return data; // [{ name, address, price }, ...]
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return [];
  }
};

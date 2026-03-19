import React from "react";
import "../../styles/about.css";

const About = () => (
  <div className="about-page">
    <h1 className="about-title">🌐 About HealthPilot</h1>
    <p className="about-intro fade-in">
      HealthPilot is a unified health discovery platform built for accessibility, modularity, and real-world usability.
      Whether you're searching for affordable medicines, nearby pharmacies, or specialty hospitals — we bring it all together.
    </p>

    <div className="about-grid">
      <div className="about-card slide-up">
        <h2>🏥 Hospitals</h2>
        <p>Find hospitals by specialty, location, and services. We support real-time filtering and accessibility-first design.</p>
      </div>
      <div className="about-card slide-up">
        <h2>💊 Pharmacies</h2>
        <p>Discover pharmacies with medicine availability, fuzzy search, autocomplete, and sorting by price or city.</p>
      </div>
      <div className="about-card slide-up">
        <h2>🧪 Medicines</h2>
        <p>Explore medicines by disease, symptoms, side effects, and cost. Our filters support fuzzy matching and annual cost ranges.</p>
      </div>
      <div className="about-card slide-up">
        <h2>🚨 Alerts</h2>
        <p>Stay updated with real-time health alerts. Filter by category, keyword, and auto-refresh for dynamic updates.</p>
      </div>
      <div className="about-card slide-up">
        <h2>🔐 Vault</h2>
        <p>Securely store and manage health documents. Modular, admin-friendly, and built for reliability.</p>
      </div>
    </div>

    <div className="about-footer fade-in">
      <h3>🎯 Our Mission</h3>
      <p>
        HealthPilot empowers communities to make informed health decisions. Built by passionate developers and powered by real data,
        it’s your trusted health companion — from local neighborhoods to national scale.
      </p>
    </div>
  </div>
);

export default About;

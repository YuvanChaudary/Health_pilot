import React from "react";
import "./Home.css";
import doctorImg from "../../images/home page img 1.png"; // adjust path if needed

const Home = () => {
  return (
    <div className="home-bg">
      {/* Floating particles */}
      <div className="particles" aria-hidden="true">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Main content: image left, text right */}
      <div className="home-content">
        {/* Left: Image */}
        <img src={doctorImg} alt="HealthPilot" className="home-image" />

        {/* Right: Text + icons */}
        <div className="home-text">
          <h2>🏡 Welcome to HealthPilot</h2>
          <p>
            Your trusted gateway to verified healthcare resources across India.  
            Discover hospitals, pharmacies, medicines, and real-time alerts — all in one place.  
            Built for patients, professionals, and public health teams to navigate care with confidence.
          </p>

          <h3 className="subtitle">
            Empowering smarter health decisions through accessible, verified data.
          </h3>

          {/* Animated icons */}
          <div className="animated-icons">
            <span role="img" aria-label="hospital">🏥</span>
            <span role="img" aria-label="pill">💊</span>
            <span role="img" aria-label="pharmacy">🧪</span>
            <span role="img" aria-label="doctor">🩺</span>
            <svg className="svg-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#00c6ff" />
              <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

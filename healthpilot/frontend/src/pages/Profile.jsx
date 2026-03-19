import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: storedUsername }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.profile);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="profile-page"><p>⏳ Loading profile...</p></div>;
  }

  if (!user) {
    return <div className="profile-page"><p>⚠️ No profile found.</p></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>👤 Your Profile</h2>
        <p className="profile-subtext">Welcome to your discovery dashboard. More features coming soon!</p>

        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="profile-footer">
          <p>🔧 Settings, activity logs, and personalization coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

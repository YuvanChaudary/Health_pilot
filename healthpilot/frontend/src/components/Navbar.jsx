import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../../styles/navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const { adminRole, logoutAdmin } = useAdminAuth(); // ✅ make sure this is imported

  const handleLogout = () => {
    onLogout(); // for regular users
    navigate("/login");
  };

  const handleAdminLogout = () => {
    logoutAdmin(); // ✅ this clears adminRole and credentials
    navigate("/admin/login");
  };

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="nav-links" role="navigation">
        <Link to="/">Home</Link>
        <Link to="/hospitals">Hospitals</Link>
        <Link to="/pharmacies">Pharmacies</Link>
        <Link to="/medicines">Medicines</Link>
        <Link to="/alerts">Alerts</Link>
        <Link to="/about">About</Link>

        {isLoggedIn && (
          <>
            <Link to="/add-expense">Add Expense</Link>
            <Link to="/view-expenses">View Expenses</Link>
          </>
        )}
      </div>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/vault">Vault</Link>
            <Link to="/profile">Profile</Link>
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : adminRole ? (
          <button
            type="button"
            className="logout-btn"
            onClick={handleAdminLogout}
            aria-label="Admin Logout"
          >
            Admin Logout
          </button>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
            <Link to="/admin/login">Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

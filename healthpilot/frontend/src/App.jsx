import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Vault from "./Vault";
import Home from "./pages/Home";
import Hospitals from "./pages/Hospitals";
import AlertsPage from "./pages/AlertsPage";
import NotFound from "./pages/NotFound";
import Pharmacies from "./pages/Pharmacies";
import Medicines from "./pages/Medicines";
import About from "./pages/About";
import AddExpense from "./pages/AddExpense";
import ViewExpenses from "./pages/ViewExpenses";
import Profile from "./pages/Profile";
import AdminLoginPage from "./pages/AdminLoginPage";
import HospitalAdminLogin from "./pages/HospitalAdminLogin";
import PharmacyAdminLogin from "./pages/PharmacyAdminLogin";
import HospitalAdminForm from "./pages/HospitalAdminForm";
import PharmacyAdminForm from "./pages/PharmacyAdminForm";
import ForgotPassword from "./pages/ForgotPassword";   // ✅ new
import ResetPassword from "./pages/ResetPassword";     // ✅ new
import { useAdminAuth } from "./context/AdminAuthContext";

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { adminRole } = useAdminAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        {/* Public + User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />   {/* ✅ new */}
        <Route path="/reset-password" element={<ResetPassword />} />     {/* ✅ new */}
        <Route
          path="/vault"
          element={isLoggedIn ? <Vault /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/add-expense"
          element={isLoggedIn ? <AddExpense /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/view-expenses"
          element={isLoggedIn ? <ViewExpenses /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/about" element={<About />} />

        {/* Admin Role Selector */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Login Pages */}
        <Route path="/admin/hospital/login" element={<HospitalAdminLogin />} />
        <Route path="/admin/pharmacy/login" element={<PharmacyAdminLogin />} />

        {/* Secure Admin Form Routes */}
        <Route
          path="/admin/hospital"
          element={
            adminRole === "hospital" ? (
              <HospitalAdminForm />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/admin/pharmacy"
          element={
            adminRole === "pharmacy" ? (
              <PharmacyAdminForm />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;

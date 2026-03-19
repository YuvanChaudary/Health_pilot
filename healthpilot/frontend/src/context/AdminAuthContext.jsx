import React, { createContext, useState, useContext, useEffect } from "react";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminRole, setAdminRole] = useState(null);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });

  // 🔁 Load from localStorage on refresh
  useEffect(() => {
    const storedRole = localStorage.getItem("adminRole");
    const storedUsername = localStorage.getItem("adminUsername");
    const storedPassword = localStorage.getItem("adminPassword");

    if (storedRole && storedUsername && storedPassword) {
      setAdminRole(storedRole);
      setAdminCredentials({ username: storedUsername, password: storedPassword });
    }
  }, []);

  // 🔐 Login
  const loginAsAdmin = async (username, password, role) => {
    try {
      const endpoint =
        role === "hospital"
          ? "http://localhost:5000/api/admin/hospital/login"
          : "http://localhost:5000/api/admin/pharmacy/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("❌ Failed to parse JSON:", jsonErr);
      }

      console.log("🔍 Login response:", data);

      if (res.status === 200 && data.role) {
        setAdminRole(data.role);
        setAdminCredentials({ username: username.trim(), password: password.trim() });

        // ✅ Save to localStorage
        localStorage.setItem("adminRole", data.role);
        localStorage.setItem("adminUsername", username.trim());
        localStorage.setItem("adminPassword", password.trim());

        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      return { success: false, error: "Login failed" };
    }
  };

  // 🔓 Logout
  const logoutAdmin = () => {
    setAdminRole(null);
    setAdminCredentials({ username: "", password: "" });

    // ✅ Clear localStorage
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("adminPassword");
  };

  return (
    <AdminAuthContext.Provider
      value={{ adminRole, adminCredentials, loginAsAdmin, logoutAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

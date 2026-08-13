import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock, FiShield } from "react-icons/fi";

import api from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // ADMIN LOGIN
  // ========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        form
      );

      console.log(
        "Admin login response:",
        response.data
      );

      const token = response.data?.token;

      if (!token) {
        setError(
          "Login failed. Authentication token was not returned."
        );
        return;
      }

      // Store authentication token
      localStorage.setItem(
        "drinkit_token",
        token
      );

      // Tell Navbar/authenticated components
      window.dispatchEvent(
        new Event("authUpdated")
      );

      // Go to admin dashboard
      navigate("/admin");

    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        {/* ICON */}

        <div className="admin-login-icon">
          <FiShield />
        </div>

        {/* HEADER */}

        <p className="admin-login-label">
          DRINKIT
        </p>

        <h1>
          Admin Portal
        </h1>

        <p className="admin-login-subtitle">
          Sign in to manage DrinkIt
        </p>

        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="admin-login-field">

            <label>
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="admin-login-field">

            <label>
              Password
            </label>

            <div className="admin-password-wrapper">

              <FiLock />

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* BACK */}

        <button
          type="button"
          className="admin-back-btn"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Back to DrinkIt
        </button>

      </div>

    </main>
  );
}

export default AdminLogin;
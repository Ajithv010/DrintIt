import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Register.css";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  // REGISTER
  // ========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/users/register", form);

      setSuccess(
        "Account created successfully. Please login."
      );

      // ========================================
      // SUCCESS TOAST
      // ========================================

      showToast(
        "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      const validationErrors =
        err.response?.data?.errors;

      let errorMessage;

      if (validationErrors) {
        errorMessage =
          Object.values(validationErrors).join(" ");
      } else {
        errorMessage =
          err.response?.data?.message ||
          "Unable to create account.";
      }

      setError(errorMessage);

      // ========================================
      // ERROR TOAST
      // ========================================

      showToast(
        errorMessage,
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <main className="register-page">

      <div className="register-card">

        <div className="register-header">

          <p className="register-label">
            JOIN DRINKIT
          </p>

          <h1>
            Create your account
          </h1>

          <p>
            Sign up to discover and order
            your favourite drinks.
          </p>

        </div>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          {/* FIRST NAME */}

          <div className="register-field">

            <label>
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={form.firstName}
              onChange={handleChange}
              required
            />

          </div>

          {/* LAST NAME */}

          <div className="register-field">

            <label>
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={form.lastName}
              onChange={handleChange}
              required
            />

          </div>

          {/* EMAIL */}

          <div className="register-field">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PHONE */}

          <div className="register-field">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="register-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />

          </div>

          {/* ERROR */}

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          {/* SUCCESS */}

          {success && (
            <p className="register-success">
              {success}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <div className="register-login">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

      </div>

    </main>
  );
}

export default Register;
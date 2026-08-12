import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        form
      );

      console.log("Login response:", response.data);

      /*
       * Store token if backend returns one.
       */
if (response.data?.token) {
  localStorage.setItem(
    "drinkit_token",
    response.data.token
  );
}

window.dispatchEvent(
  new Event("authUpdated")
);

navigate("/");

    } catch (err) {
      console.error(
        "Login error:",
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
    <main className="login-page">

      <div className="login-card">

        <div className="login-header">

          <p className="login-label">
            WELCOME BACK
          </p>

          <h1 className="login-title">
            Login to <span>DrinkIt</span>
          </h1>

          <p className="login-description">
            Sign in to continue shopping your
            favourite drinks.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="login-field">

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
          <div className="login-register">
  Don't have an account?

  <button
    type="button"
    onClick={() => navigate("/register")}
  >
    Create account
  </button>
</div>

          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </main>
  );
}

export default Login;
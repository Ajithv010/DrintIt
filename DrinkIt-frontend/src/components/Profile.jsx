import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiLogOut } from "react-icons/fi";

import "./Profile.css";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Profile error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("drinkit_token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("drinkit_token");

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/");
  };

  if (loading) {
    return (
      <main className="profile-page">
        <h2>Loading profile...</h2>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        <FiArrowLeft />
        Back to Home
      </button>

      <div className="profile-header">
        <p className="section-label">
          MY ACCOUNT
        </p>

        <h1>My Profile</h1>
      </div>

      <div className="profile-card">

        <h2>
          {user?.firstName} {user?.lastName}
        </h2>

        <p>
          Email: {user?.email}
        </p>

        <p>
          Phone: {user?.phoneNumber}
        </p>

        {/* MY ORDERS */}

        <button
          type="button"
          onClick={() => navigate("/orders")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "25px",
            padding: "14px 22px",
            border: "none",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          <FiPackage />
          My Orders
        </button>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "12px",
            padding: "14px 22px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
            color: "#111",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          <FiLogOut />
          Logout
        </button>

      </div>

    </main>
  );
}

export default Profile;
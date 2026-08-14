import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiLogOut,
  FiMapPin,
} from "react-icons/fi";

import "./Profile.css";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function Profile() {
  const navigate = useNavigate();

  const { showToast } = useToast();

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
          localStorage.removeItem("drinkit_role");

          window.dispatchEvent(
            new Event("authUpdated")
          );

          showToast(
            "Session expired. Please login again.",
            "error"
          );

          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate, showToast]);

  const logout = () => {
    localStorage.removeItem("drinkit_token");
    localStorage.removeItem("drinkit_role");

    window.dispatchEvent(
      new Event("authUpdated")
    );

    showToast(
      "Logged out successfully!"
    );

    navigate("/");
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

      {/* BACK */}

   

      {/* HEADER */}

      <div className="profile-header">

        <p className="section-label">
          MY ACCOUNT
        </p>

        <h1>
          My Profile
        </h1>

        <p className="profile-subtitle">
          Manage your account and delivery
          information.
        </p>

      </div>

      {/* PROFILE CARD */}

      <div className="profile-card">

        <div className="profile-user-info">

          <div className="profile-avatar">
            {user?.firstName
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>
            <h2>
              {user?.firstName}{" "}
              {user?.lastName}
            </h2>

            <p>
              {user?.email}
            </p>
          </div>

        </div>

        <div className="profile-details">

          <div className="profile-detail">
            <span>First Name</span>

            <strong>
              {user?.firstName || "-"}
            </strong>
          </div>

          <div className="profile-detail">
            <span>Last Name</span>

            <strong>
              {user?.lastName || "-"}
            </strong>
          </div>

          <div className="profile-detail">
            <span>Email</span>

            <strong>
              {user?.email || "-"}
            </strong>
          </div>

          <div className="profile-detail">
            <span>Phone</span>

            <strong>
              {user?.phoneNumber || "-"}
            </strong>
          </div>

        </div>

        {/* ACTIONS */}

        <div className="profile-actions">

          {/* MY ORDERS */}

          <button
            type="button"
            className="profile-primary-btn"
            onClick={() =>
              navigate("/orders")
            }
          >
            <FiPackage />
            My Orders
          </button>

          {/* MY ADDRESSES */}

          <button
            type="button"
            className="profile-secondary-btn"
            onClick={() =>
              navigate("/addresses")
            }
          >
            <FiMapPin />
            My Addresses
          </button>

        </div>

      </div>

      {/* ACCOUNT */}

      <section className="profile-account-section">

        <p className="profile-section-label">
          ACCOUNT
        </p>

        <div className="profile-account-card">

          <div>
            <h3>
              Sign out
            </h3>

            <p>
              Sign out of your DrinkIt account
              on this device.
            </p>
          </div>

          <button
            type="button"
            className="profile-logout-btn"
            onClick={logout}
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </section>

    </main>
  );
}

export default Profile;
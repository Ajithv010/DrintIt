import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiArrowRight,
  FiLogOut,
} from "react-icons/fi";

import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/orders");

        setOrders(response.data || []);
      } catch (err) {
        console.error(
          "Error loading admin dashboard:",
          err
        );

        if (err.response?.status === 401) {
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const pendingOrders = orders.filter(
    (order) =>
      String(order.status).toUpperCase() ===
      "PENDING"
  ).length;

  const confirmedOrders = orders.filter(
    (order) =>
      String(order.status).toUpperCase() ===
      "CONFIRMED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      String(order.status).toUpperCase() ===
      "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      String(order.status).toUpperCase() ===
      "CANCELLED"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("drinkit_token");
    localStorage.removeItem("drinkit_role");

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/");
  };

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">

      {/* HEADER */}

      <header className="admin-dashboard-header">

        <div>
          <p className="admin-dashboard-label">
            DRINKIT ADMIN
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="admin-dashboard-subtitle">
            Manage your DrinkIt store.
          </p>
        </div>

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <FiLogOut />
          Logout
        </button>

      </header>

      {/* STATISTICS */}

      <section className="admin-stat-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FiShoppingBag />
          </div>

          <p>
            Total Orders
          </p>

          <h2>
            {orders.length}
          </h2>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FiPackage />
          </div>

          <p>
            Pending
          </p>

          <h2>
            {pendingOrders}
          </h2>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FiPackage />
          </div>

          <p>
            Confirmed
          </p>

          <h2>
            {confirmedOrders}
          </h2>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FiPackage />
          </div>

          <p>
            Delivered
          </p>

          <h2>
            {deliveredOrders}
          </h2>

        </div>

      </section>

      {/* QUICK ACTIONS */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>
            <p className="admin-section-label">
              MANAGEMENT
            </p>

            <h2>
              Quick Actions
            </h2>
          </div>

        </div>

        <div className="admin-action-grid">

          <button
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/orders")
            }
          >

            <div>
              <FiShoppingBag />

              <h3>
                Manage Orders
              </h3>

              <p>
                View and update customer orders.
              </p>
            </div>

            <FiArrowRight />

          </button>

          <button
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/products")
            }
          >

            <div>
              <FiPackage />

              <h3>
                Products
              </h3>

              <p>
                Manage drinks and product inventory.
              </p>
            </div>

            <FiArrowRight />

          </button>

          <button
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/users")
            }
          >

            <div>
              <FiUsers />

              <h3>
                Customers
              </h3>

              <p>
                View registered customers.
              </p>
            </div>

            <FiArrowRight />

          </button>

        </div>

      </section>

      {/* ORDER STATUS */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>
            <p className="admin-section-label">
              ORDERS
            </p>

            <h2>
              Order Overview
            </h2>
          </div>

          <button
            className="admin-view-btn"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            View All
            <FiArrowRight />
          </button>

        </div>

        <div className="admin-order-overview">

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingOrders}
            </strong>
          </div>

          <div>
            <span>
              Confirmed
            </span>

            <strong>
              {confirmedOrders}
            </strong>
          </div>

          <div>
            <span>
              Delivered
            </span>

            <strong>
              {deliveredOrders}
            </strong>
          </div>

          <div>
            <span>
              Cancelled
            </span>

            <strong>
              {cancelledOrders}
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;
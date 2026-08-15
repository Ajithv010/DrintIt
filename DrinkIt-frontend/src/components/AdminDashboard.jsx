import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiArrowRight,
  FiLogOut,
  FiLayers,
} from "react-icons/fi";

import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD ADMIN ORDERS
  // ========================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/orders/admin/all"
        );

        console.log(
          "ADMIN ORDERS:",
          response.data
        );

        setOrders(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {
        console.error(
          "Error loading admin orders:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          navigate("/admin/login");
        }

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);


  // ========================================
  // STATUS
  // ========================================

  const getStatus = (order) =>
    String(
      order?.status || "PENDING"
    ).toUpperCase();


  const pendingOrders =
    orders.filter(
      (order) =>
        getStatus(order) === "PENDING"
    ).length;


  const confirmedOrders =
    orders.filter(
      (order) =>
        getStatus(order) === "CONFIRMED"
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        getStatus(order) === "DELIVERED"
    ).length;


  const cancelledOrders =
    orders.filter(
      (order) =>
        getStatus(order) === "CANCELLED"
    ).length;


  // ========================================
  // HELPERS
  // ========================================

  const getOrderId = (order) =>
    order?.id ??
    order?.orderId ??
    "";


  const getTotal = (order) =>
    order?.totalAmount ??
    order?.total ??
    0;


  const getItems = (order) =>
    order?.items ??
    order?.orderItems ??
    [];


  const getCustomerName = (order) => {

    if (order?.customerName) {
      return order.customerName;
    }

    if (order?.userName) {
      return order.userName;
    }

    if (order?.customer?.name) {
      return order.customer.name;
    }

    if (order?.customer?.firstName) {
      return `${order.customer.firstName} ${
        order.customer.lastName || ""
      }`.trim();
    }

    if (order?.user?.firstName) {
      return `${order.user.firstName} ${
        order.user.lastName || ""
      }`.trim();
    }

    if (order?.user?.name) {
      return order.user.name;
    }

    if (order?.email) {
      return order.email;
    }

    if (order?.customerEmail) {
      return order.customerEmail;
    }

    return "Customer";
  };


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "drinkit_token"
    );

    localStorage.removeItem(
      "drinkit_role"
    );

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/admin/login");
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-dashboard-page">

        <div className="admin-dashboard-loading">
          Loading dashboard...
        </div>

      </main>
    );
  }


  // ========================================
  // RECENT ORDERS
  // ========================================

  const recentOrders =
    [...orders]
      .sort(
        (a, b) =>
          Number(
            getOrderId(b)
          ) -
          Number(
            getOrderId(a)
          )
      )
      .slice(0, 5);


  // ========================================
  // UI
  // ========================================

  return (
    <main className="admin-dashboard-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <header className="admin-dashboard-header">

        <div className="admin-dashboard-heading">

          <p className="admin-dashboard-label">
            STORE MANAGEMENT
          </p>

          <h1>
            DrinkIt Admin
          </h1>

          <p className="admin-dashboard-subtitle">
            Manage your drinks, orders, customers,
            and categories.
          </p>

        </div>


        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <FiLogOut />
          Logout
        </button>

      </header>


      {/* ====================================
          WELCOME SECTION
      ==================================== */}

      <section className="admin-welcome-section">

        <div className="admin-welcome-content">

          <p className="admin-section-label">
            WELCOME BACK
          </p>

          <h2>
            Manage your DrinkIt store
          </h2>

          <p>
            Keep your products, orders and
            customers running smoothly.
          </p>

        </div>

      </section>


      {/* ====================================
          STATISTICS
      ==================================== */}

      <section className="admin-stat-grid">


        {/* TOTAL ORDERS */}

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


        {/* PENDING */}

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


        {/* CONFIRMED */}

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


        {/* DELIVERED */}

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


      {/* ====================================
          MANAGEMENT
      ==================================== */}

      <section className="admin-section">


        <div className="admin-section-header">

          <div>

            <p className="admin-section-label">
              MANAGE YOUR STORE
            </p>

            <h2>
              Quick Actions
            </h2>

          </div>

        </div>


        <div className="admin-action-grid">


          {/* ORDERS */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/orders")
            }
          >

            <div>

              <div className="admin-action-icon">
                <FiShoppingBag />
              </div>

              <h3>
                Manage Orders
              </h3>

              <p>
                View and update customer orders.
              </p>

            </div>

            <FiArrowRight />

          </button>


          {/* PRODUCTS */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/products")
            }
          >

            <div>

              <div className="admin-action-icon">
                <FiPackage />
              </div>

              <h3>
                Products
              </h3>

              <p>
                Manage drinks and product inventory.
              </p>

            </div>

            <FiArrowRight />

          </button>


          {/* CATEGORIES */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/categories")
            }
          >

            <div>

              <div className="admin-action-icon">
                <FiLayers />
              </div>

              <h3>
                Categories
              </h3>

              <p>
                Organize your drinks into categories.
              </p>

            </div>

            <FiArrowRight />

          </button>


          {/* CUSTOMERS */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate("/admin/users")
            }
          >

            <div>

              <div className="admin-action-icon">
                <FiUsers />
              </div>

              <h3>
                Customers
              </h3>

              <p>
                View your registered customers.
              </p>

            </div>

            <FiArrowRight />

          </button>

        </div>

      </section>


      {/* ====================================
          ORDER OVERVIEW
      ==================================== */}

      <section className="admin-section">


        <div className="admin-section-header">

          <div>

            <p className="admin-section-label">
              ORDER ACTIVITY
            </p>

            <h2>
              Order Overview
            </h2>

          </div>


          <button
            type="button"
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


          <div className="admin-overview-item">

            <span>
              Pending
            </span>

            <strong>
              {pendingOrders}
            </strong>

          </div>


          <div className="admin-overview-item">

            <span>
              Confirmed
            </span>

            <strong>
              {confirmedOrders}
            </strong>

          </div>


          <div className="admin-overview-item">

            <span>
              Delivered
            </span>

            <strong>
              {deliveredOrders}
            </strong>

          </div>


          <div className="admin-overview-item">

            <span>
              Cancelled
            </span>

            <strong>
              {cancelledOrders}
            </strong>

          </div>

        </div>

      </section>


      {/* ====================================
          RECENT ORDERS
      ==================================== */}

      <section className="admin-section">


        <div className="admin-section-header">

          <div>

            <p className="admin-section-label">
              LATEST ACTIVITY
            </p>

            <h2>
              Recent Orders
            </h2>

          </div>


          <button
            type="button"
            className="admin-view-btn"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            View All
            <FiArrowRight />
          </button>

        </div>


        {recentOrders.length === 0 ? (

          <div className="admin-recent-empty">

            <FiShoppingBag />

            <h3>
              No orders yet
            </h3>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-recent-orders">

            {recentOrders.map(
              (order) => {

                const orderId =
                  getOrderId(order);

                const status =
                  getStatus(order);

                const items =
                  getItems(order);

                return (

                  <button
                    type="button"
                    className="admin-recent-order"
                    key={orderId}
                    onClick={() =>
                      navigate(
                        `/admin/orders/${orderId}`
                      )
                    }
                  >


                    {/* ORDER ICON */}

                    <div className="admin-recent-order-icon">

                      <FiPackage />

                    </div>


                    {/* ORDER INFORMATION */}

                    <div className="admin-recent-order-main">


                      <div className="admin-recent-order-title">

                        <strong>
                          Order #{orderId}
                        </strong>


                        <span
                          className={`admin-order-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                      </div>


                      <p>
                        {getCustomerName(order)}
                      </p>


                      <small>
                        {items.length}{" "}
                        {items.length === 1
                          ? "item"
                          : "items"}
                      </small>

                    </div>


                    {/* TOTAL */}

                    <div className="admin-recent-order-right">

                      <strong>
                        ₹{getTotal(order)}
                      </strong>

                      <FiArrowRight />

                    </div>

                  </button>

                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminDashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage } from "react-icons/fi";

import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ALL ORDERS
  // ========================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(response.data || []);
    } catch (err) {
      console.error("Error loading admin orders:", err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to access admin orders."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ========================================
  // UPDATE STATUS
  // ========================================

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { status }
      );

      await loadOrders();
    } catch (err) {
      console.error(
        "Error updating order status:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    }
  };

  // ========================================
  // STATUS BUTTONS
  // ========================================

  const handleStatusChange = (order) => {
    const status = String(
      order.status || "PENDING"
    ).toUpperCase();

    if (status === "PENDING") {
      updateStatus(order.id, "CONFIRMED");
      return;
    }

    if (status === "CONFIRMED") {
      updateStatus(order.id, "DELIVERED");
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-orders-page">
        <p>Loading orders...</p>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="admin-orders-page">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="admin-orders-error">
          <FiPackage />

          <h2>{error}</h2>

          <button
            className="shop-btn"
            onClick={loadOrders}
          >
            Try Again
          </button>
        </div>

      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="admin-orders-page">

      {/* HEADER */}

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="admin-orders-header">

        <div>
          <p className="section-label">
            ADMIN
          </p>

          <h1>
            Manage Orders
          </h1>
        </div>

        <span>
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </span>

      </div>

      {/* EMPTY */}

      {orders.length === 0 ? (

        <div className="admin-orders-empty">

          <FiPackage />

          <h2>
            No orders yet
          </h2>

          <p>
            Customer orders will appear here.
          </p>

        </div>

      ) : (

        <section className="admin-orders-list">

          {orders.map((order) => {

            const orderId =
              order.id ??
              order.orderId;

            const status =
              String(
                order.status ||
                  "PENDING"
              ).toUpperCase();

            const total =
              order.totalAmount ??
              order.total ??
              0;

            const items =
              order.items ||
              order.orderItems ||
              [];

            return (
              <article
                className="admin-order-card"
                key={orderId}
              >

                {/* ORDER HEADER */}

                <div className="admin-order-top">

                  <div>

                    <p className="admin-order-label">
                      ORDER
                    </p>

                    <h2>
                      #{orderId}
                    </h2>

                  </div>

                  <span
                    className={`admin-order-status ${status.toLowerCase()}`}
                  >
                    {status}
                  </span>

                </div>

                {/* ITEMS */}

                <div className="admin-order-items">

                  {items.length === 0 ? (

                    <p>
                      No items found.
                    </p>

                  ) : (

                    items.map(
                      (item, index) => {

                        const name =
                          item.productName ??
                          item.name ??
                          item.product?.name ??
                          "Drink";

                        const quantity =
                          item.quantity ??
                          1;

                        return (
                          <div
                            className="admin-order-item"
                            key={
                              item.id ??
                              item.productId ??
                              index
                            }
                          >

                            <span>
                              {name}
                            </span>

                            <span>
                              × {quantity}
                            </span>

                          </div>
                        );
                      }
                    )
                  )}

                </div>

                {/* FOOTER */}

                <div className="admin-order-footer">

                  <strong>
                    ₹{total}
                  </strong>

                  {status === "PENDING" && (
                    <button
                      className="admin-status-btn"
                      onClick={() =>
                        handleStatusChange(
                          order
                        )
                      }
                    >
                      Confirm Order
                    </button>
                  )}

                  {status === "CONFIRMED" && (
                    <button
                      className="admin-status-btn"
                      onClick={() =>
                        handleStatusChange(
                          order
                        )
                      }
                    >
                      Mark Delivered
                    </button>
                  )}

                  {status === "DELIVERED" && (
                    <span className="admin-completed">
                      Completed
                    </span>
                  )}

                  {status === "CANCELLED" && (
                    <span className="admin-cancelled">
                      Cancelled
                    </span>
                  )}

                </div>

              </article>
            );
          })}

        </section>
      )}

    </main>
  );
}

export default AdminOrders;
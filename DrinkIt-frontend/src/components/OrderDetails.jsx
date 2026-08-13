import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
} from "react-icons/fi";

import api from "../services/api";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ORDER
  // ========================================

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/orders/${id}`
        );

        setOrder(response.data);
      } catch (err) {
        console.error(
          "Error loading order:",
          err
        );

        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  // ========================================
  // CANCEL ORDER
  // ========================================

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const response = await api.put(
        `/orders/${id}/cancel`
      );

      setOrder(response.data);

      alert("Order cancelled successfully.");

    } catch (err) {
      console.error(
        "Error cancelling order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="order-details-page">
        <p>Loading order...</p>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !order) {
    return (
      <main className="order-details-page">

        <button
          className="back-btn"
          onClick={() => navigate("/orders")}
        >
          <FiArrowLeft />
          Back to Orders
        </button>

        <div className="order-details-error">
          <h2>
            {error || "Order not found."}
          </h2>
        </div>

      </main>
    );
  }

  // ========================================
  // ORDER DATA
  // ========================================

  const items =
    order.items ||
    order.orderItems ||
    [];

  const orderId =
    order.id ??
    order.orderId;

  const total =
    order.totalAmount ??
    order.total ??
    0;

  const status =
    order.status ||
    "PENDING";

  // ========================================
  // UI
  // ========================================

  return (
    <main className="order-details-page">

      {/* BACK */}

      <button
        className="back-btn"
        onClick={() => navigate("/orders")}
      >
        <FiArrowLeft />
        Back to Orders
      </button>

      {/* HEADER */}

      <div className="order-details-header">

        <div>

          <p className="section-label">
            ORDER DETAILS
          </p>

          <h1>
            Order #{orderId}
          </h1>

        </div>

        <span
          className={`order-details-status ${String(
            status
          ).toLowerCase()}`}
        >
          {status}
        </span>

      </div>

      {/* ERROR */}

      {error && (
        <p className="login-error">
          {error}
        </p>
      )}

      <div className="order-details-layout">

        {/* ====================================
            ORDER ITEMS
        ==================================== */}

        <section className="order-details-card">

          <h2>
            Ordered Drinks
          </h2>

          {items.length === 0 ? (

            <div className="no-order-items">

              <FiPackage />

              <p>
                No items found.
              </p>

            </div>

          ) : (

            <div className="order-detail-items">

              {items.map(
                (item, index) => {

                  const name =
                    item.productName ??
                    item.name ??
                    item.product?.name ??
                    "Drink";

                  const quantity =
                    item.quantity ?? 1;

                  const price =
                    item.price ??
                    item.unitPrice ??
                    0;

                  const subtotal =
                    item.subtotal ??
                    price * quantity;

                  return (
                    <div
                      className="order-detail-item"
                      key={
                        item.id ??
                        item.productId ??
                        index
                      }
                    >

                      <div>

                        <strong>
                          {name}
                        </strong>

                        <p>
                          ₹{price} × {quantity}
                        </p>

                      </div>

                      <strong>
                        ₹{subtotal}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ====================================
            ORDER SUMMARY
        ==================================== */}

        <aside className="order-details-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Status
            </span>

            <strong>
              {status}
            </strong>

          </div>

          <div className="summary-divider" />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{total}
            </strong>

          </div>

          {/* ==================================
              CANCEL ORDER
          ================================== */}

          {String(status).toUpperCase() ===
            "PENDING" && (

            <button
              type="button"
              className="cancel-order-btn"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>

          )}

        </aside>

      </div>

    </main>
  );
}

export default OrderDetails;
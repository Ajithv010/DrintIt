import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage } from "react-icons/fi";

import "./Orders.css";
import api from "../services/api";
import { useToast } from "../context/useToast";

function Orders() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ORDERS
  // ========================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/orders");

        const data = response.data;

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data?.content)) {
          setOrders(data.content);
        } else if (Array.isArray(data?.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }

      } catch (err) {
        console.error(
          "Error loading orders:",
          err
        );

        if (err.response?.status === 401) {
          localStorage.removeItem(
            "drinkit_token"
          );

          localStorage.removeItem(
            "drinkit_role"
          );

          window.dispatchEvent(
            new Event("authUpdated")
          );

          showToast(
            "Session expired. Please login again.",
            "error"
          );

          navigate("/login");
          return;
        }

        const errorMessage =
          err.response?.data?.message ||
          "Unable to load your orders.";

        setError(errorMessage);

        showToast(
          errorMessage,
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate, showToast]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="orders-page">

        <p>
          Loading orders...
        </p>

      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="orders-page">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/account")
          }
        >
          <FiArrowLeft />
          Back to Account
        </button>

        <div className="orders-message">

          <h2>
            {error}
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            Continue Shopping
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // EMPTY ORDERS
  // ========================================

  if (orders.length === 0) {
    return (
      <main className="orders-page">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/account")
          }
        >
          <FiArrowLeft />
          Back to Account
        </button>

        <div className="orders-header">

          <p className="section-label">
            ORDER HISTORY
          </p>

          <h1>
            My Orders
          </h1>

        </div>

        <div className="orders-empty">

          <FiPackage />

          <h2>
            No orders yet
          </h2>

          <p>
            Your completed orders will
            appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            Start Shopping
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // ORDERS
  // ========================================

  return (
    <main className="orders-page">

      {/* BACK TO ACCOUNT */}

      <button
        type="button"
        className="back-btn"
        onClick={() =>
          navigate("/account")
        }
      >
        <FiArrowLeft />
        Back to Account
      </button>

      {/* HEADER */}

      <div className="orders-header">

        <div>

          <p className="section-label">
            ORDER HISTORY
          </p>

          <h1>
            My Orders
          </h1>

        </div>

        <span>
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </span>

      </div>

      {/* ORDER LIST */}

      <section className="orders-list">

        {orders.map((order, index) => {

          const orderId =
            order.id ??
            order.orderId ??
            index + 1;

          const orderItems =
            order.items ??
            order.orderItems ??
            [];

          const total =
            order.totalAmount ??
            order.total ??
            order.grandTotal ??
            0;

          const status =
            order.status ??
            "PLACED";

          return (
            <button
              type="button"
              className="order-card"
              key={orderId}
              onClick={() =>
                navigate(
                  `/orders/${orderId}`
                )
              }
            >

              {/* ORDER TOP */}

              <div className="order-top">

                <div>

                  <span>
                    Order
                  </span>

                  <h2>
                    #{orderId}
                  </h2>

                </div>

                <span
                  className={`order-status ${String(
                    status
                  ).toLowerCase()}`}
                >
                  {status}
                </span>

              </div>

              <div className="order-divider" />

              {/* ORDER ITEMS */}

              <div className="order-items">

                {orderItems.length > 0 ? (

                  orderItems.map(
                    (item, itemIndex) => {

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

                      return (
                        <div
                          className="order-item"
                          key={
                            item.id ??
                            item.productId ??
                            itemIndex
                          }
                        >

                          <div>

                            <strong>
                              {name}
                            </strong>

                            <p>
                              Qty: {quantity}
                            </p>

                          </div>

                          <strong>
                            ₹
                            {price * quantity}
                          </strong>

                        </div>
                      );
                    }
                  )

                ) : (

                  <p className="no-order-items">
                    Order details unavailable.
                  </p>

                )}

              </div>

              <div className="order-divider" />

              {/* ORDER BOTTOM */}

              <div className="order-bottom">

                <span>
                  Total
                </span>

                <strong>
                  ₹{total}
                </strong>

              </div>

            </button>
          );
        })}

      </section>

    </main>
  );
}

export default Orders;
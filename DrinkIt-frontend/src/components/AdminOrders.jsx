import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiPackage,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";

import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ALL ORDERS
  // ========================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("ADMIN ORDERS: loading...");

        const response = await api.get(
          "/orders/admin/all"
        );

        console.log(
          "ADMIN ORDERS RESPONSE:",
          response.data
        );

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
          "ADMIN ORDERS ERROR:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          navigate("/admin/login");
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

    loadOrders();
  }, [navigate]);

  // ========================================
  // GET ORDER ID
  // ========================================

  const getOrderId = (order) => {
    return (
      order?.orderId ??
      order?.id ??
      null
    );
  };

  // ========================================
  // GET CUSTOMER NAME
  // ========================================

  const getCustomerName = (order) => {
    return (
      order?.customerName ||
      order?.customer?.name ||
      order?.customer?.firstName ||
      order?.userName ||
      order?.user?.name ||
      order?.user?.firstName ||
      "Customer"
    );
  };

  // ========================================
  // GET CUSTOMER EMAIL
  // ========================================

  const getCustomerEmail = (order) => {
    return (
      order?.customerEmail ||
      order?.customer?.email ||
      order?.user?.email ||
      order?.email ||
      "—"
    );
  };

  // ========================================
  // GET STATUS
  // ========================================

  const getStatus = (order) => {
    return String(
      order?.status || "PENDING"
    ).toUpperCase();
  };

  // ========================================
  // GET TOTAL
  // ========================================

  const getTotal = (order) => {
    return (
      order?.totalAmount ??
      order?.total ??
      order?.grandTotal ??
      0
    );
  };

  // ========================================
  // GET ITEMS
  // ========================================

  const getItems = (order) => {
    const items =
      order?.items ||
      order?.orderItems ||
      [];

    return Array.isArray(items)
      ? items
      : [];
  };

  // ========================================
  // FILTER ORDERS
  // ========================================

  const filteredOrders = orders.filter(
    (order) => {
      const searchValue =
        search.trim().toLowerCase();

      const orderId = String(
        getOrderId(order) || ""
      ).toLowerCase();

      const customer =
        getCustomerName(order)
          .toLowerCase();

      const email =
        getCustomerEmail(order)
          .toLowerCase();

      const status =
        getStatus(order);

      const matchesSearch =
        !searchValue ||
        orderId.includes(searchValue) ||
        customer.includes(searchValue) ||
        email.includes(searchValue) ||
        status
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // ========================================
  // STATUS COUNTS
  // ========================================

  const pendingCount =
    orders.filter(
      (order) =>
        getStatus(order) === "PENDING"
    ).length;

  const confirmedCount =
    orders.filter(
      (order) =>
        getStatus(order) === "CONFIRMED"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        getStatus(order) === "DELIVERED"
    ).length;

  const cancelledCount =
    orders.filter(
      (order) =>
        getStatus(order) === "CANCELLED"
    ).length;

  // ========================================
  // UPDATE ORDER STATUS
  // ========================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
        }
      );

      setOrders(
        (previousOrders) =>
          previousOrders.map(
            (order) => {
              if (
                String(
                  getOrderId(order)
                ) === String(orderId)
              ) {
                return {
                  ...order,
                  status: newStatus,
                };
              }

              return order;
            }
          )
      );
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
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-orders-page">

        <button
          type="button"
          className="admin-orders-back"
          onClick={() =>
            navigate("/admin")
          }
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        <div className="admin-orders-loading">

          <FiPackage />

          <h2>
            Loading orders...
          </h2>

          <p>
            Please wait while orders are loaded.
          </p>

        </div>

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
          type="button"
          className="admin-orders-back"
          onClick={() =>
            navigate("/admin")
          }
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        <div className="admin-orders-error">

          <FiPackage />

          <h2>
            {error}
          </h2>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
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

      {/* BACK */}

      <button
        type="button"
        className="admin-orders-back"
        onClick={() =>
          navigate("/admin")
        }
      >
        <FiArrowLeft />
        Back to Dashboard
      </button>


      {/* HEADER */}

      <header className="admin-orders-header">

        <div>

          <p className="admin-orders-label">
            DRINKIT ADMIN
          </p>

          <h1>
            Manage Orders
          </h1>

          <p className="admin-orders-subtitle">
            View and manage customer orders.
          </p>

        </div>

        <strong className="admin-orders-count">
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </strong>

      </header>


      {/* STATUS SUMMARY */}

      <section className="admin-order-status-grid">

        <button
          type="button"
          className={
            statusFilter === "PENDING"
              ? "admin-order-status-card selected"
              : "admin-order-status-card"
          }
          onClick={() =>
            setStatusFilter(
              statusFilter === "PENDING"
                ? "ALL"
                : "PENDING"
            )
          }
        >
          <span>
            Pending
          </span>

          <strong>
            {pendingCount}
          </strong>
        </button>


        <button
          type="button"
          className={
            statusFilter === "CONFIRMED"
              ? "admin-order-status-card selected"
              : "admin-order-status-card"
          }
          onClick={() =>
            setStatusFilter(
              statusFilter === "CONFIRMED"
                ? "ALL"
                : "CONFIRMED"
            )
          }
        >
          <span>
            Confirmed
          </span>

          <strong>
            {confirmedCount}
          </strong>
        </button>


        <button
          type="button"
          className={
            statusFilter === "DELIVERED"
              ? "admin-order-status-card selected"
              : "admin-order-status-card"
          }
          onClick={() =>
            setStatusFilter(
              statusFilter === "DELIVERED"
                ? "ALL"
                : "DELIVERED"
            )
          }
        >
          <span>
            Delivered
          </span>

          <strong>
            {deliveredCount}
          </strong>
        </button>


        <button
          type="button"
          className={
            statusFilter === "CANCELLED"
              ? "admin-order-status-card selected"
              : "admin-order-status-card"
          }
          onClick={() =>
            setStatusFilter(
              statusFilter === "CANCELLED"
                ? "ALL"
                : "CANCELLED"
            )
          }
        >
          <span>
            Cancelled
          </span>

          <strong>
            {cancelledCount}
          </strong>
        </button>

      </section>


      {/* SEARCH */}

      <section className="admin-orders-controls">

        <div className="admin-orders-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search order, customer or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          className="admin-orders-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="ALL">
            All Orders
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="CONFIRMED">
            Confirmed
          </option>

          <option value="DELIVERED">
            Delivered
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>

        </select>

      </section>


      {/* EMPTY */}

      {filteredOrders.length === 0 ? (

        <div className="admin-orders-empty">

          <FiPackage />

          <h2>
            {search ||
            statusFilter !== "ALL"
              ? "No orders found"
              : "No orders yet"}
          </h2>

          <p>
            {search ||
            statusFilter !== "ALL"
              ? "Try changing your search or filter."
              : "Customer orders will appear here."}
          </p>

        </div>

      ) : (

        /* ORDER LIST */

        <section className="admin-orders-list">

          {filteredOrders.map(
            (order) => {

              const orderId =
                getOrderId(order);

              const customerName =
                getCustomerName(order);

              const customerEmail =
                getCustomerEmail(order);

              const status =
                getStatus(order);

              const total =
                getTotal(order);

              const items =
                getItems(order);

              return (
                <article
                  className="admin-order-card"
                  key={orderId}
                >

                  {/* LEFT */}

                  <div className="admin-order-main">

                    <div className="admin-order-icon">
                      <FiPackage />
                    </div>

                    <div className="admin-order-info">

                      <div className="admin-order-title">

                        <strong>
                          Order #{orderId}
                        </strong>

                        <span
                          className={`admin-order-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                      </div>

                      <p className="admin-order-customer">
                        {customerName}
                      </p>

                      <p className="admin-order-email">
                        {customerEmail}
                      </p>

                      <p className="admin-order-items">

                        {items.length}{" "}
                        {items.length === 1
                          ? "item"
                          : "items"}

                      </p>

                    </div>

                  </div>


                  {/* RIGHT */}

                  <div className="admin-order-actions">

                    <strong className="admin-order-total">
                      ₹{total}
                    </strong>

                    <select
                      value={status}
                      onChange={(e) =>
                        handleStatusChange(
                          orderId,
                          e.target.value
                        )
                      }
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="CONFIRMED">
                        Confirmed
                      </option>

                      <option value="DELIVERED">
                        Delivered
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>

                    </select>


                    <button
                      type="button"
                      className="admin-order-view-btn"
                      onClick={() =>
                        navigate(
                          `/admin/orders/${orderId}`
                        )
                      }
                    >
                      View
                      <FiArrowRight />
                    </button>

                  </div>

                </article>
              );
            }
          )}

        </section>

      )}

    </main>
  );
}

export default AdminOrders;
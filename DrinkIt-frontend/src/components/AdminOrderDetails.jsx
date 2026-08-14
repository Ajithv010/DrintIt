import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiMapPin,
} from "react-icons/fi";

import api from "../services/api";
import "./AdminOrderDetails.css";

function AdminOrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/orders/admin/${orderId}`
        );

        console.log(
          "Admin order details:",
          response.data
        );

        setOrder(response.data);

      } catch (err) {
        console.error(
          "Error loading order:",
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
          "Unable to load order."
        );

      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, navigate]);


  if (loading) {
    return (
      <main className="admin-order-details-page">
        <p>Loading order...</p>
      </main>
    );
  }


  if (error || !order) {
    return (
      <main className="admin-order-details-page">

        <button
          type="button"
          className="admin-order-back"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <FiArrowLeft />
          Back to Orders
        </button>

        <div className="admin-order-details-error">
          <FiPackage />

          <h2>
            {error || "Order not found"}
          </h2>
        </div>

      </main>
    );
  }


  const id =
    order.id ??
    order.orderId ??
    orderId;

  const status =
    String(
      order.status || "PENDING"
    ).toUpperCase();

  const total =
    order.totalAmount ??
    order.total ??
    0;

  const items =
    order.items ??
    order.orderItems ??
    [];


  const customerName =
    order.customerName ||
    order.customer?.name ||
    order.customer?.firstName ||
    order.user?.name ||
    order.userName ||
    "Customer";


  const customerEmail =
    order.customerEmail ||
    order.customer?.email ||
    order.user?.email ||
    order.email ||
    "—";


  const customerPhone =
    order.customerPhone ||
    order.customer?.phoneNumber ||
    order.user?.phoneNumber ||
    order.phoneNumber ||
    order.phone ||
    "—";


  const address =
    order.address ||
    order.deliveryAddress ||
    null;


  return (
    <main className="admin-order-details-page">

      {/* BACK */}

      <button
        type="button"
        className="admin-order-back"
        onClick={() =>
          navigate("/admin/orders")
        }
      >
        <FiArrowLeft />
        Back to Orders
      </button>


      {/* HEADER */}

      <header className="admin-order-details-header">

        <div>

          <p className="admin-order-details-label">
            ORDER
          </p>

          <h1>
            Order #{id}
          </h1>

          <p>
            Review customer order details.
          </p>

        </div>

        <span
          className={`admin-order-details-status ${status.toLowerCase()}`}
        >
          {status}
        </span>

      </header>


      {/* DETAILS */}

      <div className="admin-order-details-grid">

        {/* CUSTOMER */}

        <section className="admin-order-details-card">

          <div className="admin-details-card-header">

            <FiUser />

            <h2>
              Customer
            </h2>

          </div>

          <div className="admin-customer-details">

            <strong>
              {customerName}
            </strong>

            <span>
              {customerEmail}
            </span>

            <span>
              {customerPhone}
            </span>

          </div>

        </section>


        {/* ADDRESS */}

        <section className="admin-order-details-card">

          <div className="admin-details-card-header">

            <FiMapPin />

            <h2>
              Delivery Address
            </h2>

          </div>

          <div className="admin-address-details">

            {address ? (

              typeof address === "string" ? (

                <p>
                  {address}
                </p>

              ) : (

                <>
                  <strong>
                    {address.fullName ||
                      address.name ||
                      ""}
                  </strong>

                  <span>
                    {address.addressLine1 ||
                      address.address ||
                      ""}
                  </span>

                  <span>
                    {address.addressLine2 ||
                      ""}
                  </span>

                  <span>
                    {address.city || ""}
                    {address.city &&
                    address.state
                      ? ", "
                      : ""}
                    {address.state || ""}
                  </span>

                  <span>
                    {address.pincode ||
                      address.zipCode ||
                      ""}
                  </span>
                </>

              )

            ) : (

              <p>
                Delivery address not available.
              </p>

            )}

          </div>

        </section>


        {/* ITEMS */}

        <section className="admin-order-details-card admin-items-card">

          <div className="admin-details-card-header">

            <FiPackage />

            <h2>
              Order Items
            </h2>

          </div>


          {items.length === 0 ? (

            <p className="admin-no-items">
              No items found.
            </p>

          ) : (

            <div className="admin-order-items-details">

              {items.map((item, index) => {

                const name =
                  item.productName ||
                  item.name ||
                  item.product?.name ||
                  "Drink";

                const quantity =
                  item.quantity ?? 1;

                const price =
                  item.price ??
                  item.unitPrice ??
                  item.product?.price ??
                  0;

                const itemTotal =
                  item.totalPrice ??
                  item.subtotal ??
                  Number(price) *
                    Number(quantity);

                return (
                  <div
                    className="admin-order-item-details"
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

                      <span>
                        ₹{price} × {quantity}
                      </span>

                    </div>

                    <strong>
                      ₹{itemTotal}
                    </strong>

                  </div>
                );

              })}

            </div>

          )}

        </section>


        {/* SUMMARY */}

        <section className="admin-order-details-card admin-summary-card">

          <h2>
            Order Summary
          </h2>

          <div className="admin-summary-row">

            <span>
              Items
            </span>

            <span>
              {items.length}
            </span>

          </div>

          <div className="admin-summary-row admin-summary-total">

            <strong>
              Total
            </strong>

            <strong>
              ₹{total}
            </strong>

          </div>

        </section>

      </div>

    </main>
  );
}

export default AdminOrderDetails;
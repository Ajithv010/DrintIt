import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import "./Checkout.css";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function Checkout() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ========================================
  // LOAD CART
  // ========================================

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await api.get("/cart");

        setCart(response.data);

      } catch (err) {
        console.error(
          "Error loading checkout cart:",
          err
        );

        if (err.response?.status === 401) {

          showToast(
            "Please login to continue.",
            "error"
          );

          navigate("/login");
          return;
        }

        const message =
          "Unable to load your cart.";

        setError(message);

        showToast(
          message,
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate, showToast]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // PLACE ORDER
  // ========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setPlacingOrder(true);
    setError("");

    try {
      // ------------------------------------
      // STEP 1: SAVE DELIVERY ADDRESS
      // ------------------------------------

      const addressResponse = await api.post(
        "/addresses",
        address
      );

      const addressId =
        addressResponse.data?.id ??
        addressResponse.data?.addressId;

      if (!addressId) {
        throw new Error(
          "Address ID was not returned by the server."
        );
      }

      console.log(
        "Address created:",
        addressResponse.data
      );

      // ------------------------------------
      // STEP 2: CREATE ORDER
      // ------------------------------------

      const orderResponse = await api.post(
        `/orders?addressId=${addressId}`
      );

      console.log(
        "Order created:",
        orderResponse.data
      );

      const orderId =
        orderResponse.data?.orderId;

      if (!orderId) {
        throw new Error(
          "Order ID was not returned by the server."
        );
      }

      // ========================================
      // SUCCESS TOAST
      // ========================================

      showToast(
        "Order placed successfully!"
      );

      // ------------------------------------
      // STEP 3: GO TO ORDER SUCCESS
      // ------------------------------------

      navigate("/order-success", {
        state: {
          orderId,
        },
      });

    } catch (err) {
      console.error(
        "Place order error:",
        err
      );

      const validationErrors =
        err.response?.data?.errors;

      let errorMessage;

      if (validationErrors) {
        errorMessage =
          Object.values(
            validationErrors
          ).join(" ");
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Unable to place order.";
      }

      setError(errorMessage);

      // ========================================
      // ERROR TOAST
      // ========================================

      showToast(
        errorMessage,
        "error"
      );

      setPlacingOrder(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="checkout-page">

        <p>
          Loading checkout...
        </p>

      </main>
    );
  }

  // ========================================
  // ERROR WITHOUT CART
  // ========================================

  if (error && !cart) {
    return (
      <main className="checkout-page">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/cart")
          }
        >
          <FiArrowLeft />
          Back to Cart
        </button>

        <div className="empty-cart">

          <h2>
            {error}
          </h2>

          <button
            type="button"
            className="shop-btn"
            onClick={() =>
              navigate("/cart")
            }
          >
            Back to Cart
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // CART DATA
  // ========================================

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  // ========================================
  // EMPTY CART
  // ========================================

  if (items.length === 0) {
    return (
      <main className="checkout-page">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/")
          }
        >
          <FiArrowLeft />
          Continue Shopping
        </button>

        <div className="empty-cart">

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some drinks before
            checking out.
          </p>

          <button
            type="button"
            className="shop-btn"
            onClick={() =>
              navigate("/")
            }
          >
            Start Shopping
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // CHECKOUT PAGE
  // ========================================

  return (
    <main className="checkout-page">

      {/* BACK */}

      <button
        type="button"
        className="back-btn"
        onClick={() =>
          navigate("/cart")
        }
      >
        <FiArrowLeft />
        Back to Cart
      </button>

      {/* HEADER */}

      <div className="checkout-header">

        <p className="section-label">
          CHECKOUT
        </p>

        <h1>
          Complete Your Order
        </h1>

      </div>

      <div className="checkout-layout">

        {/* ========================================
            DELIVERY DETAILS
        ======================================== */}

        <section className="checkout-form-card">

          <h2>
            Delivery Details
          </h2>

          <form onSubmit={handlePlaceOrder}>

            {/* FULL NAME */}

            <div className="checkout-field">

              <label htmlFor="checkout-fullName">
                Full Name
              </label>

              <input
                id="checkout-fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={address.fullName}
                onChange={handleChange}
                required
              />

            </div>

            {/* PHONE */}

            <div className="checkout-field">

              <label htmlFor="checkout-phoneNumber">
                Phone Number
              </label>

              <input
                id="checkout-phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="Enter 10-digit phone number"
                value={address.phoneNumber}
                onChange={handleChange}
                pattern="[6-9][0-9]{9}"
                maxLength="10"
                required
              />

            </div>

            {/* ADDRESS */}

            <div className="checkout-field">

              <label htmlFor="checkout-addressLine">
                Address
              </label>

              <textarea
                id="checkout-addressLine"
                name="addressLine"
                placeholder="House number, street, area..."
                value={address.addressLine}
                onChange={handleChange}
                maxLength="255"
                required
              />

            </div>

            {/* CITY + STATE */}

            <div className="checkout-row">

              <div className="checkout-field">

                <label htmlFor="checkout-city">
                  City
                </label>

                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="checkout-field">

                <label htmlFor="checkout-state">
                  State
                </label>

                <input
                  id="checkout-state"
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* PINCODE */}

            <div className="checkout-field">

              <label htmlFor="checkout-pincode">
                Pincode
              </label>

              <input
                id="checkout-pincode"
                type="text"
                name="pincode"
                placeholder="6-digit pincode"
                value={address.pincode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                maxLength="6"
                required
              />

            </div>

            {/* ERROR */}

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            {/* PLACE ORDER */}

            <button
              type="submit"
              className="checkout-place-btn"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

        </section>

        {/* ========================================
            ORDER SUMMARY
        ======================================== */}

        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          <div className="checkout-products">

            {items.map((item) => (

              <div
                className="checkout-product"
                key={item.productId}
              >

                <div className="checkout-product-image">

                  <img
                    src={
                      item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : `/images/${item.imageUrl}`
                    }
                    alt={item.productName}
                  />

                </div>

                <div>

                  <strong>
                    {item.productName}
                  </strong>

                  <p>
                    Qty: {item.quantity}
                  </p>

                </div>

                <strong>
                  ₹
                  {item.price * item.quantity}
                </strong>

              </div>

            ))}

          </div>

          <div className="summary-divider" />

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{subtotal}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              Free
            </span>

          </div>

          <div className="summary-divider" />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{subtotal}
            </strong>

          </div>

          {/* PAYMENT METHOD */}

          <div className="checkout-payment-method">

            <span>
              Payment Method
            </span>

            <strong>
              Cash on Delivery
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;
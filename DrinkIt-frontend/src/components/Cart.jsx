import { useEffect, useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { saveCart } from "../services/cartStorage";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // SYNC CART COUNT WITH NAVBAR
  // ========================================

  const syncCartCount = (cartData) => {
    const items = cartData?.items || [];

    const cartForStorage = items.map((item) => ({
      id: item.productId,
      name: item.productName,
      brand: item.brand,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    }));

    saveCart(cartForStorage);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // ========================================
  // LOAD CART
  // ========================================

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data);

      // Update navbar count
      syncCartCount(response.data);

    } catch (err) {
      console.error("Error loading cart:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your cart.");
      } else {
        setError("Unable to load cart.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ========================================
  // UPDATE QUANTITY
  // ========================================

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      const response = await api.put(
        `/cart/items/${productId}`,
        {
          quantity,
        }
      );

      setCart(response.data);

      // Update navbar count
      syncCartCount(response.data);

    } catch (err) {
      console.error(
        "Error updating cart:",
        err
      );

      alert("Unable to update quantity.");
    }
  };

  // ========================================
  // REMOVE ITEM
  // ========================================

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(
        `/cart/items/${productId}`
      );

      /*
       * DELETE normally returns 204,
       * so reload the cart from backend.
       */

      await loadCart();

    } catch (err) {
      console.error(
        "Error removing item:",
        err
      );

      alert("Unable to remove item.");
    }
  };

  // ========================================
  // CLEAR CART
  // ========================================

  const clearCart = async () => {
    try {
      await api.delete("/cart");

      await loadCart();

    } catch (err) {
      console.error(
        "Error clearing cart:",
        err
      );

      alert("Unable to clear cart.");
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="cart-page">
        <div className="product-page-message">
          Loading cart...
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="cart-page">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Continue Shopping
        </button>

        <div className="empty-cart">

          <h2>{error}</h2>

          <button
            onClick={() => navigate("/")}
            className="shop-btn"
          >
            Continue Shopping
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // CART DATA
  // ========================================

  const items = cart?.items || [];

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

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
      <main className="cart-page">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Continue Shopping
        </button>

        <div className="cart-header">

          <div>

            <p className="section-label">
              YOUR ORDER
            </p>

            <h1>Your Cart</h1>

          </div>

          <span>0 items</span>

        </div>

        <div className="empty-cart">

          <h2>
            Your cart is empty
          </h2>

          <p>
            Looks like you haven't added
            anything yet.
          </p>

          <button
            onClick={() => navigate("/")}
            className="shop-btn"
          >
            Start Shopping
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // CART PAGE
  // ========================================

  return (
    <main className="cart-page">

      {/* BACK */}

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        <FiArrowLeft />
        Continue Shopping
      </button>

      {/* HEADER */}

      <div className="cart-header">

        <div>

          <p className="section-label">
            YOUR ORDER
          </p>

          <h1>
            Your Cart
          </h1>

        </div>

        <span>
          {totalItems}{" "}
          {totalItems === 1
            ? "item"
            : "items"}
        </span>

      </div>

      {/* CART */}

      <div className="cart-layout">

        {/* CART ITEMS */}

        <section className="cart-items">

          {items.map((item) => (

            <div
              className="cart-item"
              key={item.productId}
            >

              {/* IMAGE */}

              <div className="cart-item-image">

                <img
                  src={`/images/${item.imageUrl}`}
                  alt={item.productName}
                />

              </div>

              {/* INFO */}

              <div className="cart-item-info">

                <p>
                  {item.brand}
                </p>

                <h3>
                  {item.productName}
                </h3>

                <strong>
                  ₹{item.price}
                </strong>

              </div>

              {/* ACTIONS */}

              <div className="cart-item-actions">

                <div className="quantity-selector">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity - 1
                      )
                    }
                    disabled={
                      item.quantity <= 1
                    }
                  >
                    <FiMinus />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity + 1
                      )
                    }
                  >
                    <FiPlus />
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(
                      item.productId
                    )
                  }
                >
                  <FiTrash2 />
                  Remove
                </button>

              </div>

              {/* ITEM TOTAL */}

              <strong className="cart-item-total">
                ₹
                {item.price *
                  item.quantity}
              </strong>

            </div>

          ))}

          {/* CLEAR CART */}

          <button
            className="remove-btn"
            onClick={clearCart}
          >
            <FiTrash2 />
            Clear Cart
          </button>

        </section>

        {/* ORDER SUMMARY */}

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>

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
              Calculated at checkout
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

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkout")
            }
          >
            Proceed to Checkout
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Cart;
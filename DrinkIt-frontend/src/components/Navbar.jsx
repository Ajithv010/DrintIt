import { useEffect, useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useToast } from "../context/ToastContext";

function Navbar() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  // ========================================
  // LOAD NAVBAR STATE
  // ========================================

  useEffect(() => {

    const updateNavbar = async () => {

      const token =
        localStorage.getItem("drinkit_token");

      setLoggedIn(Boolean(token));

      // ========================================
      // LOAD CART COUNT FROM BACKEND
      // ========================================

      if (!token) {
        setCartCount(0);
        return;
      }

      try {

        const response = await api.get("/cart");

        const items =
          response.data?.items || [];

        const totalItems = items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );

        setCartCount(totalItems);

      } catch (err) {

        console.error(
          "Error loading cart count:",
          err
        );

        // Don't show an error Toast here.
        // Navbar should remain quiet if cart
        // loading fails.

        setCartCount(0);
      }
    };

    updateNavbar();

    window.addEventListener(
      "cartUpdated",
      updateNavbar
    );

    window.addEventListener(
      "authUpdated",
      updateNavbar
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        updateNavbar
      );

      window.removeEventListener(
        "authUpdated",
        updateNavbar
      );

    };

  }, []);

  // ========================================
  // SEARCH
  // ========================================

  const handleSearch = (e) => {

    e.preventDefault();

    const keyword = search.trim();

    if (!keyword) {

      navigate("/products");

      return;
    }

    navigate(
      `/products?keyword=${encodeURIComponent(keyword)}`
    );
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

    setCartCount(0);

    window.dispatchEvent(
      new Event("authUpdated")
    );

    showToast(
      "Logged out successfully!"
    );

    navigate("/");
  };

  // ========================================
  // UI
  // ========================================

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <div
          className="logo"
          onClick={() =>
            navigate("/home")
          }
        >
          Drink<span>It</span>
        </div>

        {/* SEARCH */}

        <form
          className="search-box"
          onSubmit={handleSearch}
        >

          <FiSearch />

          <input
            type="text"
            placeholder="Search drinks, brands..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </form>

        {/* ACTIONS */}

        <div className="nav-actions">

          {!loggedIn ? (

            /* NOT LOGGED IN */

            <button
              className="login-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              <FiUser />
              <span>Login</span>
            </button>

          ) : (

            /* LOGGED IN */

            <>

              <button
                className="login-btn"
                onClick={() =>
                  navigate("/account")
                }
              >
                <FiUser />
                <span>Account</span>
              </button>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>

            </>

          )}

          {/* CART */}

          <button
            className="cart-btn"
            onClick={() =>
              navigate("/cart")
            }
          >

            <FiShoppingCart />

            <span>
              Cart
            </span>

            <small>
              {cartCount}
            </small>

          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
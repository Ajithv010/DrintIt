import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import CategoryCard from "./components/CategoryCard";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import Profile from "./components/Profile";
import Products from "./components/Products";
import { getProducts } from "./services/productService";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
// ========================================
// HOME PAGE
// ========================================

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // CATEGORIES
  // ========================================
const categories = [
  {
    id: 1,
    name: "Juices",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Soft Drinks",
    image:
      "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Energy Drinks",
    image:
      "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Water",
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Milkshakes",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Cold Coffee",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Lemonades & Coolers",
    image:
      "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Sports Drinks",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
  },
];

  // ========================================
  // LOAD PRODUCTS
  // ========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ========================================
  // HOME UI
  // ========================================

  return (
    <main>

      {/* HERO */}

      <section className="hero">
        <div className="hero-content">

          <p className="hero-label">
            FRESH DRINKS • DELIVERED
          </p>

          <h1>
            Your drink.
            <br />
            Your choice.
            <br />
            <span>Delivered.</span>
          </h1>

          <p className="hero-description">
            Discover juices, soft drinks, energy drinks
            and more, delivered straight to your door.
          </p>

          <button className="hero-btn">
            Explore Drinks
          </button>

        </div>
      </section>

      {/* CATEGORIES */}

      <section className="section">

        <div className="section-header">

          <div>
            <p className="section-label">
              EXPLORE DRINKS
            </p>

            <h2>
              Find Your Drink
            </h2>
          </div>

        </div>

        <div className="categories">

        {categories.map((category) => (
  <CategoryCard
    key={category.id}
    id={category.id}
    name={category.name}
    image={category.image}
  />
))}

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="section">

        <div className="section-header">

          <div>
            <p className="section-label">
              TRENDING NOW
            </p>

            <h2>
              Popular Drinks
            </h2>
          </div>

          <button className="view-all">
            View all →
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <p>Loading products...</p>
        )}

        {/* ERROR */}

        {!loading && error && (
          <p>{error}</p>
        )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="products">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          )}

        {/* NO PRODUCTS */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <p>No products available.</p>
          )}

      </section>

    </main>
  );
}

// ========================================
// MAIN APP
// ========================================

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* PRODUCT DETAILS */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* CART */}

        <Route
          path="/cart"
          element={<Cart />}
          
        />
        <Route
  path="/products"
  element={<Products />}
/>
<Route
  path="/login"
  element={<Login />}
/>
<Route
  path="/checkout"
  element={<Checkout />}
/>
<Route
  path="/register"
  element={<Register />}
/>
<Route
  path="/order-success"
  element={<OrderSuccess />}
/>
<Route
  path="/account"
  element={<Profile />}
/>
<Route
  path="/Orders"
  element={<Orders />}
/>
<Route
  path="/orders/:id"
  element={<OrderDetails />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
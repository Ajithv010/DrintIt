import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";

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
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import AdminOrders from "./components/AdminOrders";
import { getProducts } from "./services/productService";
import AdminLogin from "./components/AdminLogin";
// ========================================
import RoleSelection from "./components/RoleSelection";
import AdminDashboard from "./components/AdminDashboard";

// HOME PAGE
// ========================================

function Home() {

    const navigate = useNavigate();

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

                const data = await getProducts({
                    page: 0,
                    size: 8,
                });

                setProducts(data.content || []);

            } catch (err) {

                console.error(
                    "Error loading products:",
                    err
                );

                setError(
                    "Unable to load products."
                );

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

            {/* ========================================
                HERO
            ======================================== */}

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
                        Discover juices, soft drinks,
                        energy drinks and more,
                        delivered straight to your door.
                    </p>

                    <button
                        className="hero-btn"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Explore Drinks
                    </button>

                </div>

            </section>

            {/* ========================================
                CATEGORIES
            ======================================== */}

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

            {/* ========================================
                POPULAR PRODUCTS
            ======================================== */}

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

                    <button
                        className="view-all"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        View all →
                    </button>

                </div>

                {/* LOADING */}

                {loading && (

                    <p className="products-message">
                        Loading products...
                    </p>

                )}

                {/* ERROR */}

                {!loading && error && (

                    <p className="products-error">
                        {error}
                    </p>

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

                        <p className="products-message">
                            No products available.
                        </p>

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
  element={<RoleSelection />}
/>

<Route
  path="/home"
  element={<Home />}
/>

                {/* PRODUCTS */}

                <Route
                    path="/products"
                    element={<Products />}
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

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* REGISTER */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* CHECKOUT */}

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                {/* ORDER SUCCESS */}

                <Route
                    path="/order-success"
                    element={<OrderSuccess />}
                />

                {/* ACCOUNT */}

                <Route
                    path="/account"
                    element={<Profile />}
                />

                {/* ORDERS */}

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                {/* ORDER DETAILS */}

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />
                <Route
  path="/admin/login"
  element={<AdminLogin />}
/>
                <Route
  path="/admin/orders"
  element={<AdminOrders />}
/>
<Route
  path="/start"
  element={<RoleSelection />}
/>
<Route
  path="/admin"
  element={<AdminDashboard />}
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
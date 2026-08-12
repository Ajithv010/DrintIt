import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingCart,
} from "react-icons/fi";

import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // LOAD PRODUCT
  // ========================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = async () => {
  try {
    const response = await api.post("/cart/items", {
      productId: product.id,
      quantity: quantity,
    });

    console.log("Cart updated:", response.data);

    // Update navbar cart count
    const items = response.data?.items || [];

    const cartForStorage = items.map((item) => ({
      id: item.productId,
      name: item.productName,
      brand: item.brand,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    }));

    localStorage.setItem(
      "drinkit_cart",
      JSON.stringify(cartForStorage)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    alert(`${product.name} added to cart`);

  } catch (err) {
    console.error(
      "Error adding product to cart:",
      err
    );

    if (err.response?.status === 401) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    alert(
      err.response?.data?.message ||
      "Unable to add product to cart."
    );
  }
};

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="product-page-message">
        Loading product...
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !product) {
    return (
      <div className="product-page-message">
        {error || "Product not found."}
      </div>
    );
  }

  // ========================================
  // PRODUCT PAGE
  // ========================================

  return (
    <main className="product-details-page">

      {/* BACK BUTTON */}

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        <FiArrowLeft />
        Back to products
      </button>

      <div className="product-details">

        {/* ========================================
            PRODUCT IMAGE + CART
        ======================================== */}

        <div className="product-image-section">

          <div className="product-details-image">

            <img
              src={`/images/${product.imageUrl}`}
              alt={product.name}
            />

          </div>

          {/* CART CONTROLS */}

          {product.stock > 0 && (
            <div className="image-cart-section">

              <div className="quantity-selector">

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  disabled={adding}
                >
                  <FiMinus />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        product.stock,
                        q + 1
                      )
                    )
                  }
                  disabled={adding}
                >
                  <FiPlus />
                </button>

              </div>

              <button
                className="details-cart-btn"
                onClick={handleAddToCart}
                disabled={adding}
              >
                <FiShoppingCart />

                {adding
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

            </div>
          )}

        </div>

        {/* ========================================
            PRODUCT INFORMATION
        ======================================== */}

        <div className="product-details-info">

          <p className="product-category">
            {product.categoryName}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="details-brand">
            {product.brand}
          </p>

          <h2>
            ₹{product.price}
          </h2>

          <p className="details-description">
            {product.description}
          </p>

          <p className="stock">
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;
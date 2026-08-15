import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useToast } from "../context/useToast";

function ProductCard({ product }) {

    const navigate = useNavigate();

    const { showToast } = useToast();

    const [adding, setAdding] = useState(false);

    // ========================================
    // IMAGE URL
    // ========================================

    const getImageUrl = () => {

        if (!product.imageUrl) {
            return "/images/default-drink.png";
        }

        // If backend already returns a full URL
        if (
            product.imageUrl.startsWith("http://") ||
            product.imageUrl.startsWith("https://")
        ) {
            return product.imageUrl;
        }

        // If imageUrl is only a filename
        return `/images/${product.imageUrl}`;
    };

    // ========================================
    // OPEN PRODUCT
    // ========================================

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    // ========================================
    // ADD TO CART
    // ========================================

    const handleAddToCart = async (event) => {

        event.stopPropagation();

        if (adding) {
            return;
        }

        try {

            setAdding(true);

            await api.post("/cart/items", {
                productId: product.id,
                quantity: 1,
            });

            // Update Navbar cart count
            window.dispatchEvent(
                new Event("cartUpdated")
            );

            // Success Toast
            showToast(
                `${product.name} added to cart!`
            );

        } catch (err) {

            console.error(
                "Error adding product to cart:",
                err
            );

            // Handle unauthorized user
            if (err.response?.status === 401) {

                showToast(
                    "Please login to add items to your cart.",
                    "error"
                );

                return;
            }

            // Backend error message
            const message =
                err.response?.data?.message ||
                "Unable to add product to cart.";

            showToast(
                message,
                "error"
            );

        } finally {

            setAdding(false);

        }
    };

    // ========================================
    // UI
    // ========================================

    return (

        <button
            className="product-card"
            onClick={handleCardClick}
            type="button"
        >

            {/* IMAGE */}

            <div className="product-image">

                <img
                    src={getImageUrl()}
                    alt={product.name}
                    onError={(event) => {
                        event.currentTarget.src =
                            "/images/default-drink.png";
                    }}
                />

            </div>

            {/* INFORMATION */}

            <div className="product-info">

                <p className="product-brand">
                    {product.brand}
                </p>

                <h3>
                    {product.name}
                </h3>

                <div className="product-bottom">

                    <strong>
                        ₹{product.price}
                    </strong>

                    <button
                        type="button"
                        className="add-btn"
                        onClick={handleAddToCart}
                        disabled={adding}
                    >
                        <FiPlus size={15} />

                        <span>
                            {adding
                                ? "Adding..."
                                : "Add"}
                        </span>
                    </button>

                </div>

            </div>

        </button>
    );
}

export default ProductCard;
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

    const navigate = useNavigate();

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

    const handleAddToCart = (event) => {

        event.stopPropagation();

        // We will connect this to your existing
        // cart functionality after the UI is finished.

        console.log(
            "Add to cart:",
            product.name
        );
    };

    // ========================================
    // UI
    // ========================================

    return (

        <article
            className="product-card"
            onClick={handleCardClick}
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
                    >
                        <FiPlus size={15} />
                        <span>Add</span>
                    </button>

                </div>

            </div>

        </article>
    );
}

export default ProductCard;
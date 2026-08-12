import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
    >

      <div className="product-image">
        <img
          src={`/images/${product.imageUrl}`}
          alt={product.name}
        />
      </div>

      <div className="product-info">

        <p className="product-brand">
          {product.brand}
        </p>

        <h3>{product.name}</h3>

        <div className="product-bottom">

          <strong>
            ₹{product.price}
          </strong>

          <button
            className="add-btn"
            onClick={(event) => event.stopPropagation()}
          >
            <FiPlus />
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;
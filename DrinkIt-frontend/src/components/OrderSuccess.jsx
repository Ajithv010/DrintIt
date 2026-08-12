import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import "./OrderSuccess.css";
function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <main className="order-success">

      <div className="success-card">

        <div className="success-icon">
          <FiCheck />
        </div>

        <p className="section-label">
          ORDER CONFIRMED
        </p>

        <h1>
          Order placed successfully!
        </h1>

        <p>
          Thank you for shopping with DrinkIt.
          Your drinks will be delivered soon.
        </p>

        <button
          className="shop-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>

    </main>
  );
}

export default OrderSuccess;
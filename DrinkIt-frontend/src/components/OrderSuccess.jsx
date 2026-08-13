import { useNavigate, useLocation } from "react-router-dom";
import {
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId =
    location.state?.orderId;

  return (
    <main className="order-success-page">

      <div className="order-success-card">

        {/* SUCCESS ICON */}

        <div className="order-success-icon">
          <FiCheck />
        </div>

        {/* MESSAGE */}

        <p className="order-success-label">
          ORDER CONFIRMED
        </p>

        <h1>
          Thank you for your order!
        </h1>

        <p className="order-success-message">
          Your order has been placed
          successfully.
        </p>

        {/* ORDER ID */}

        {orderId && (
          <div className="order-success-number">

            <span>
              Order Number
            </span>

            <strong>
              #{orderId}
            </strong>

          </div>
        )}

        {/* ACTIONS */}

        <div className="order-success-actions">

          <button
            type="button"
            className="order-success-primary"
            onClick={() =>
              navigate("/orders")
            }
          >
            View My Orders
            <FiArrowRight />
          </button>

          <button
            type="button"
            className="order-success-secondary"
            onClick={() =>
              navigate("/home")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;
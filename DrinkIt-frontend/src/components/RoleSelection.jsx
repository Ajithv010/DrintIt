import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

import "./RoleSelection.css";

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <main className="role-selection-page">

      <div className="role-selection-container">

        <p className="role-selection-label">
          WELCOME TO DRINKIT
        </p>

        <h1>
          How do you want to
          <br />
          continue?
        </h1>

        <p className="role-selection-description">
          Choose your account type to continue.
        </p>

        <div className="role-cards">

          {/* CUSTOMER */}

          <button
            className="role-card"
            onClick={() => navigate("/login")}
          >

            <div className="role-icon">
              <FiUser />
            </div>

            <div className="role-card-content">

              <h2>
                Customer
              </h2>

              <p>
                Shop drinks, manage your cart,
                checkout and track your orders.
              </p>

            </div>

            <FiArrowRight className="role-arrow" />

          </button>

          {/* ADMIN */}

          <button
            className="role-card admin-role-card"
            onClick={() =>
              navigate("/admin/login")
            }
          >

            <div className="role-icon">
              <FiShield />
            </div>

            <div className="role-card-content">

              <h2>
                Admin
              </h2>

              <p>
                Manage orders, products,
                inventory and customers.
              </p>

            </div>

            <FiArrowRight className="role-arrow" />

          </button>

        </div>

        <button
          className="back-home-btn"
         onClick={() => navigate("/home")}
        >
          Continue as guest
        </button>

      </div>

    </main>
  );
}

export default RoleSelection;
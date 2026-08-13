import { useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";

import "./Toast.css";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>

      <div className="toast-icon">
        {type === "success" ? (
          <FiCheck />
        ) : (
          <FiX />
        )}
      </div>

      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>

    </div>
  );
}

export default Toast;
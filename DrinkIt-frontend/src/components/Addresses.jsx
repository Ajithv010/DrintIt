import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiX,
} from "react-icons/fi";

import "./Addresses.css";
import api from "../services/api";
import { useToast } from "../context/useToast";

function Addresses() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const emptyForm = {
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  };

  const [form, setForm] = useState(emptyForm);

  // ========================================
  // LOAD ADDRESSES
  // ========================================

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/addresses");

      setAddresses(response.data || []);

    } catch (err) {
      console.error(
        "Error loading addresses:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem(
          "drinkit_token"
        );

        localStorage.removeItem(
          "drinkit_role"
        );

        window.dispatchEvent(
          new Event("authUpdated")
        );

        showToast(
          "Session expired. Please login again.",
          "error"
        );

        navigate("/login");
        return;
      }

      const errorMessage =
        "Unable to load your addresses.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // OPEN ADD FORM
  // ========================================

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);

    setError("");
    setMessage("");

    setShowForm(true);
  };

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const openEditForm = (address) => {
    setForm({
      fullName:
        address.fullName || "",

      phoneNumber:
        address.phoneNumber || "",

      addressLine:
        address.addressLine || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || "",
    });

    setEditingId(address.id);

    setError("");
    setMessage("");

    setShowForm(true);
  };

  // ========================================
  // CLOSE FORM
  // ========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ========================================
  // VALIDATE
  // ========================================

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Full name is required.";
    }

    if (
      !/^[6-9][0-9]{9}$/.test(
        form.phoneNumber
      )
    ) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (!form.addressLine.trim()) {
      return "Address line is required.";
    }

    if (!form.city.trim()) {
      return "City is required.";
    }

    if (!form.state.trim()) {
      return "State is required.";
    }

    if (!/^[0-9]{6}$/.test(form.pincode)) {
      return "Pincode must be exactly 6 digits.";
    }

    return "";
  };

  // ========================================
  // SAVE ADDRESS
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);

      showToast(
        validationError,
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        fullName:
          form.fullName.trim(),

        phoneNumber:
          form.phoneNumber.trim(),

        addressLine:
          form.addressLine.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        pincode:
          form.pincode.trim(),
      };

      let response;

      if (editingId) {
        response = await api.put(
          `/addresses/${editingId}`,
          payload
        );
      } else {
        response = await api.post(
          "/addresses",
          payload
        );
      }

      if (editingId) {
        setAddresses((previous) =>
          previous.map((address) =>
            address.id === editingId
              ? response.data
              : address
          )
        );

        setMessage(
          "Address updated successfully."
        );

        showToast(
          "Address updated successfully!"
        );

      } else {
        setAddresses((previous) => [
          ...previous,
          response.data,
        ]);

        setMessage(
          "Address added successfully."
        );

        showToast(
          "Address added successfully!"
        );
      }

      closeForm();

    } catch (err) {
      console.error(
        "Address save error:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        "Unable to save address.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE ADDRESS
  // ========================================

  const deleteAddress = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.delete(
        `/addresses/${id}`
      );

      setAddresses((previous) =>
        previous.filter(
          (address) =>
            address.id !== id
        )
      );

      setMessage(
        "Address deleted successfully."
      );

      showToast(
        "Address deleted successfully!"
      );

    } catch (err) {
      console.error(
        "Delete address error:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        "Unable to delete address.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="addresses-page">

        <div className="addresses-loading">

          <div className="addresses-spinner" />

          <p>
            Loading addresses...
          </p>

        </div>

      </main>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  const saveLabel = saving
    ? "Saving..."
    : editingId
    ? "Update Address"
    : "Save Address";

  return (
    <main className="addresses-page">

      {/* HEADER */}

      <div className="addresses-header">

        <div>

          <button
            type="button"
            className="addresses-back-btn"
            onClick={() =>
              navigate("/profile")
            }
          >
            <FiArrowLeft />
            Back to Profile
          </button>

          <p className="addresses-label">
            MY ACCOUNT
          </p>

          <h1>
            My Addresses
          </h1>

          <p className="addresses-subtitle">
            Manage your saved delivery
            addresses.
          </p>

        </div>

        {!showForm && (
          <button
            type="button"
            className="addresses-add-btn"
            onClick={openAddForm}
          >
            <FiPlus />
            Add Address
          </button>
        )}

      </div>

      {/* MESSAGE */}

      {message && (
        <div className="addresses-success">
          {message}
        </div>
      )}

      {error && (
        <div className="addresses-error">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (

        <section className="address-form-card">

          <div className="address-form-header">

            <div>

              <p className="address-form-label">
                {editingId
                  ? "EDIT ADDRESS"
                  : "NEW ADDRESS"}
              </p>

              <h2>
                {editingId
                  ? "Edit Address"
                  : "Add New Address"}
              </h2>

            </div>

            <button
              type="button"
              className="address-close-btn"
              onClick={closeForm}
            >
              <FiX />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="address-form"
          >

            <div className="address-form-grid">

              {/* FULL NAME */}

              <div className="address-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Enter full name"
                />

              </div>

              {/* PHONE */}

              <div className="address-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                />

              </div>

              {/* ADDRESS */}

              <div className="address-field address-field-full">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="House no, street, area"
                />

              </div>

              {/* CITY */}

              <div className="address-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="City"
                />

              </div>

              {/* STATE */}

              <div className="address-field">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="State"
                />

              </div>

              {/* PINCODE */}

              <div className="address-field">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="6-digit pincode"
                />

              </div>

            </div>

            <div className="address-form-actions">

              <button
                type="submit"
                className="address-save-btn"
                disabled={saving}
              >
                {saveLabel}
              </button>

              <button
                type="button"
                className="address-cancel-btn"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ADDRESS LIST */}

      {!showForm &&
        addresses.length > 0 && (

          <section className="addresses-list">

            {addresses.map((address) => (

              <article
                className="address-card"
                key={address.id}
              >

                <div className="address-card-icon">
                  <FiMapPin />
                </div>

                <div className="address-card-content">

                  <h3>
                    {address.fullName}
                  </h3>

                  <p className="address-phone">
                    {address.phoneNumber}
                  </p>

                  <p>
                    {address.addressLine}
                  </p>

                  <p>
                    {address.city},{" "}
                    {address.state}{" "}
                    -{" "}
                    {address.pincode}
                  </p>

                </div>

                <div className="address-card-actions">

                  <button
                    type="button"
                    className="address-edit-btn"
                    onClick={() =>
                      openEditForm(
                        address
                      )
                    }
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="address-delete-btn"
                    disabled={
                      deletingId ===
                      address.id
                    }
                    onClick={() =>
                      deleteAddress(
                        address.id
                      )
                    }
                  >
                    <FiTrash2 />

                    {deletingId ===
                    address.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </article>

            ))}

          </section>
        )}

      {/* EMPTY */}

      {!showForm &&
        addresses.length === 0 && (

          <section className="addresses-empty">

            <div className="addresses-empty-icon">
              <FiMapPin />
            </div>

            <h2>
              No saved addresses
            </h2>

            <p>
              Add an address to make
              checkout faster.
            </p>

            <button
              type="button"
              className="addresses-empty-btn"
              onClick={openAddForm}
            >
              <FiPlus />
              Add Your First Address
            </button>

          </section>
        )}

    </main>
  );
}

export default Addresses;
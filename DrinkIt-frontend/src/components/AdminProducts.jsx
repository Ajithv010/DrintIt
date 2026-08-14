import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiPackage,
  FiUpload,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import "./AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // ========================================
  // EMPTY FORM
  // ========================================

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    imageUrl: "",
    active: true,
    categoryId: "",
  };

  // ========================================
  // STATE
  // ========================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ========================================
  // STOCK STATUS
  // ========================================

  const getStockStatus = (stock) => {
    const quantity = Number(stock ?? 0);

    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className: "stock-out",
      };
    }

    if (quantity <= 5) {
      return {
        label: "Low Stock",
        className: "stock-low",
      };
    }

    return {
      label: "In Stock",
      className: "stock-normal",
    };
  };

  // ========================================
  // LOAD CATEGORIES
  // ========================================

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await api.get("/categories");

      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data?.content)) {
        setCategories(data.content);
      } else if (Array.isArray(data?.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(
        "Error loading categories:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        "Unable to load categories.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // ========================================
  // LOAD PRODUCTS
  // ========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data?.content)) {
        setProducts(data.content);
      } else if (Array.isArray(data?.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(
        "Error loading admin products:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("drinkit_token");
        localStorage.removeItem("drinkit_role");

        window.dispatchEvent(
          new Event("authUpdated")
        );

        showToast(
          "Session expired. Please login again.",
          "error"
        );

        navigate("/admin/login");

        return;
      }

      if (err.response?.status === 403) {
        const errorMessage =
          "You do not have permission to manage products.";

        setError(errorMessage);

        showToast(
          errorMessage,
          "error"
        );

        return;
      }

      const errorMessage =
        err.response?.data?.message ||
        "Unable to load products.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      const errorMessage =
        "Only JPG, PNG and WEBP images are allowed.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMessage =
        "Image size must be less than 5 MB.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      e.target.value = "";
      return;
    }

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(preview);
    setError("");
  };

  // ========================================
  // REMOVE SELECTED IMAGE
  // ========================================

  const removeSelectedImage = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);

    setImagePreview(
      form.imageUrl
        ? `/images/${form.imageUrl}`
        : ""
    );

    const input =
      document.getElementById(
        "product-image"
      );

    if (input) {
      input.value = "";
    }
  };

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setSelectedImage(null);
    setImagePreview("");
    setError("");

    const input =
      document.getElementById(
        "product-image"
      );

    if (input) {
      input.value = "";
    }
  };

  // ========================================
  // EDIT PRODUCT
  // ========================================

  const handleEdit = (product) => {
    setEditingId(product.id);
    setSelectedImage(null);

    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      brand: product.brand ?? "",
      imageUrl: product.imageUrl ?? "",
      active: product.active !== false,
      categoryId:
        product.categoryId ??
        product.category?.id ??
        "",
    });

    if (product.imageUrl) {
      setImagePreview(
        `/images/${product.imageUrl}`
      );
    } else {
      setImagePreview("");
    }

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // SAVE PRODUCT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // ====================================
      // VALIDATION
      // ====================================

      const productName =
        form.name.trim();

      const description =
        form.description.trim();

      const brand =
        form.brand.trim();

      const price =
        Number(form.price);

      const stock =
        Number(form.stock);

      const categoryId =
        Number(form.categoryId);

      if (!productName) {
        const errorMessage =
          "Product name is required.";

        setError(errorMessage);

        showToast(
          errorMessage,
          "error"
        );

        return;
      }

      if (
        Number.isNaN(price) ||
        price <= 0
      ) {
        const errorMessage =
          "Enter a valid product price.";

        setError(errorMessage);

        showToast(
          errorMessage,
          "error"
        );

        return;
      }

      if (
        Number.isNaN(stock) ||
        stock < 0
      ) {
        const errorMessage =
          "Enter a valid stock quantity.";

        setError(errorMessage);

        showToast(
          errorMessage,
          "error"
        );

        return;
      }

      if (
        Number.isNaN(categoryId) ||
        categoryId <= 0
      ) {
        const errorMessage =
          "Please select a category.";

        setError(errorMessage);

        showToast(
          errorMessage,
          "error"
        );

        return;
      }

      // ====================================
      // UPDATE PRODUCT
      // ====================================

      if (editingId !== null) {
        const payload = {
          name: productName,
          description: description,
          price: price,
          stock: stock,
          brand: brand,
          imageUrl: form.imageUrl.trim(),
          active: Boolean(form.active),
          categoryId: categoryId,
        };

        await api.put(
          `/products/${editingId}`,
          payload
        );

        resetForm();

        await loadProducts();

        showToast(
          "Product updated successfully!"
        );

        return;
      }

      // ====================================
      // CREATE PRODUCT WITH IMAGE
      // ====================================

      const productData = {
        name: productName,
        description: description,
        price: price,
        stock: stock,
        brand: brand,
        active: Boolean(form.active),
        categoryId: categoryId,
      };

      const formData =
        new FormData();

      // ------------------------------------
      // PRODUCT JSON
      // ------------------------------------

      const productBlob =
        new Blob(
          [JSON.stringify(productData)],
          {
            type: "application/json",
          }
        );

      formData.append(
        "product",
        productBlob
      );

      // ------------------------------------
      // IMAGE
      // ------------------------------------

      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }

      console.log(
        "Creating product with multipart/form-data"
      );

      console.log(
        "Product:",
        productData
      );

      console.log(
        "Image:",
        selectedImage
      );

      // ------------------------------------
      // CREATE REQUEST
      // ------------------------------------

      await api.post(
        "/products",
        formData
      );

      // ====================================
      // SUCCESS
      // ====================================

      resetForm();

      await loadProducts();

      showToast(
        "Product added successfully!"
      );

    } catch (err) {
      console.error(
        "Error saving product:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to save product.";

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
  // DELETE PRODUCT
  // ========================================

  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/products/${productId}`
      );

      await loadProducts();

      showToast(
        "Product deleted successfully!"
      );

    } catch (err) {
      console.error(
        "Error deleting product:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        "Unable to delete product.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    }
  };

  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    products.filter((product) => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      const productName =
        String(
          product.name || ""
        ).toLowerCase();

      const brand =
        String(
          product.brand || ""
        ).toLowerCase();

      const matchesSearch =
        !keyword ||
        productName.includes(
          keyword
        ) ||
        brand.includes(
          keyword
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        (
          statusFilter === "ACTIVE" &&
          product.active === true
        ) ||
        (
          statusFilter === "INACTIVE" &&
          product.active === false
        );

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-products-page">

        <p>
          Loading products...
        </p>

      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  const submitLabel = saving
    ? "Saving..."
    : editingId !== null
    ? "Update Product"
    : "Add Product";

  return (
    <main className="admin-products-page">

      {/* ====================================
          BACK
      ==================================== */}

      <button
        type="button"
        className="admin-products-back"
        onClick={() =>
          navigate("/admin")
        }
      >
        <FiArrowLeft />
        Back to Dashboard
      </button>

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="admin-products-header">

        <div>

          <p className="admin-products-label">
            DRINKIT ADMIN
          </p>

          <h1>
            Product Management
          </h1>

          <p>
            Add, edit and manage your drinks.
          </p>

        </div>

        <div className="admin-products-count">

          {products.length}{" "}

          {products.length === 1
            ? "product"
            : "products"}

        </div>

      </div>

      {/* ====================================
          ERROR
      ==================================== */}

      {error && (
        <div className="admin-products-error">
          {error}
        </div>
      )}

      {/* ====================================
          PRODUCT FORM
      ==================================== */}

      <section className="admin-product-form-card">

        <div className="admin-product-form-header">

          <div>

            <p className="admin-products-label">

              {editingId !== null
                ? "EDIT PRODUCT"
                : "NEW PRODUCT"}

            </p>

            <h2>

              {editingId !== null
                ? "Update Product"
                : "Add Product"}

            </h2>

          </div>

          {editingId !== null && (
            <button
              type="button"
              className="admin-cancel-edit"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}

          <div className="admin-form-field">

            <label htmlFor="product-name">
              Product Name
            </label>

            <input
              id="product-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Heineken"
              required
            />

          </div>

          {/* BRAND */}

          <div className="admin-form-field">

            <label htmlFor="product-brand">
              Brand
            </label>

            <input
              id="product-brand"
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Heineken"
              required
            />

          </div>

          {/* PRICE */}

          <div className="admin-form-field">

            <label htmlFor="product-price">
              Price
            </label>

            <input
              id="product-price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />

          </div>

          {/* STOCK */}

          <div className="admin-form-field">

            <label htmlFor="product-stock">
              Stock
            </label>

            <input
              id="product-stock"
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
            />

            {form.stock !== "" && (
              <small
                className={`admin-form-stock-status ${
                  getStockStatus(
                    form.stock
                  ).className
                }`}
              >
                {
                  getStockStatus(
                    form.stock
                  ).label
                }
              </small>
            )}

          </div>

          {/* CATEGORY */}

          <div className="admin-form-field">

            <label htmlFor="product-category">
              Category
            </label>

            <select
              id="product-category"
              className="admin-category-select"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              disabled={categoryLoading}
            >

              <option value="">
                {categoryLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}

            </select>

            {!categoryLoading &&
              categories.length === 0 && (
                <small className="admin-category-warning">
                  No categories available.
                </small>
              )}

          </div>

          {/* ==================================
              PRODUCT IMAGE
          ================================== */}

          <div className="admin-form-field">

            <label>
              Product Image
            </label>

            <div className="admin-image-upload">

              {imagePreview ? (
                <div className="admin-image-preview">

                  <img
                    src={imagePreview}
                    alt="Product preview"
                  />

                  <button
                    type="button"
                    className="admin-image-remove"
                    onClick={
                      removeSelectedImage
                    }
                  >
                    <FiX />
                  </button>

                </div>
              ) : (
                <div className="admin-image-placeholder">

                  <FiPackage />

                  <span>
                    No image selected
                  </span>

                </div>
              )}

              <label
                htmlFor="product-image"
                className="admin-image-upload-btn"
              >
                <FiUpload />

                {selectedImage
                  ? "Change Image"
                  : "Choose Image"}
              </label>

              <input
                id="product-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
                hidden
              />

              {selectedImage && (
                <small className="admin-image-file-name">
                  {selectedImage.name}
                </small>
              )}

              {!selectedImage &&
                form.imageUrl && (
                  <small className="admin-image-file-name">
                    Current image:{" "}
                    {form.imageUrl}
                  </small>
                )}

              <small className="admin-image-help">
                JPG, PNG or WEBP • Maximum 5 MB
              </small>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="admin-form-field admin-form-full">

            <label htmlFor="product-description">
              Description
            </label>

            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product..."
              rows="4"
            />

          </div>

          {/* ACTIVE */}

          <label className="admin-active-checkbox">

            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />

            <span>
              Product is active
            </span>

          </label>

          {/* BUTTONS */}

          <div className="admin-product-form-actions">

            <button
              type="submit"
              className="admin-save-product-btn"
              disabled={saving}
            >

              {submitLabel}

            </button>

            {editingId !== null && (
              <button
                type="button"
                className="admin-reset-btn"
                onClick={resetForm}
              >
                Clear
              </button>
            )}

          </div>

        </form>

      </section>

      {/* ====================================
          PRODUCT LIST
      ==================================== */}

      <section className="admin-product-list-section">

        <div className="admin-product-list-header">

          <div>

            <p className="admin-products-label">
              INVENTORY
            </p>

            <h2>
              All Products
            </h2>

          </div>

          <button
            type="button"
            className="admin-add-product-small"
            onClick={resetForm}
          >
            <FiPlus />
            Add Product
          </button>

        </div>

        {/* SEARCH + FILTER */}

        <div className="admin-product-filters">

          <input
            type="text"
            placeholder="Search products or brands..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Products
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

          </select>

        </div>

        {/* TABLE */}

        {filteredProducts.length === 0 ? (

          <div className="admin-products-empty">

            <FiPackage />

            <h2>
              No products found
            </h2>

            <p>

              {products.length === 0
                ? "Add your first product above."
                : "Try changing your search or filter."}

            </p>

          </div>

        ) : (

          <div className="admin-products-table-wrapper">

            <table className="admin-products-table">

              <thead>

                <tr>

                  <th>
                    PRODUCT
                  </th>

                  <th>
                    BRAND
                  </th>

                  <th>
                    PRICE
                  </th>

                  <th>
                    STOCK
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                    >

                      <td>

                        <div className="admin-product-name">

                          {product.imageUrl ? (

                            <img
                              src={`/images/${product.imageUrl}`}
                              alt={product.name}
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="admin-product-placeholder">

                              <FiPackage />

                            </div>

                          )}

                          <strong>
                            {product.name}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {product.brand || "-"}
                      </td>

                      <td>
                        ₹{product.price ?? 0}
                      </td>

                      <td>

                        <div className="admin-stock-cell">

                          <strong>
                            {product.stock ?? 0}
                          </strong>

                          <span
                            className={
                              getStockStatus(
                                product.stock
                              ).className
                            }
                          >
                            {
                              getStockStatus(
                                product.stock
                              ).label
                            }
                          </span>

                        </div>

                      </td>

                      <td>

                        <span
                          className={
                            product.active
                              ? "product-active"
                              : "product-inactive"
                          }
                        >

                          {product.active
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      <td>

                        <div className="admin-product-actions">

                          <button
                            type="button"
                            className="admin-edit-btn"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                          >
                            <FiEdit2 />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-btn"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                          >
                            <FiTrash2 />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminProducts;
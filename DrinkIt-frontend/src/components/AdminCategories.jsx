import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiLayers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./AdminCategories.css";

function AdminCategories() {
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    description: "",
    imageUrl: "",
    active: true,
  };

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ========================================
  // LOAD CATEGORIES
  // ========================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

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

      if (err.response?.status === 401) {
        navigate("/admin/login");
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to manage categories."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
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
  // RESET
  // ========================================

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
  };

  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name ?? "",
      description:
        category.description ?? "",
      imageUrl:
        category.imageUrl ?? "",
      active:
        category.active !== false,
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // SAVE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const name = form.name.trim();
      const description =
        form.description.trim();
      const imageUrl =
        form.imageUrl.trim();

      if (!name) {
        setError(
          "Category name is required."
        );
        return;
      }

      const payload = {
        name,
        description,
        imageUrl,
        active: Boolean(form.active),
      };

      console.log(
        "Saving category:",
        payload
      );

      if (editingId !== null) {
        await api.put(
          `/categories/${editingId}`,
          payload
        );
      } else {
        await api.post(
          "/categories",
          payload
        );
      }

      resetForm();

      await loadCategories();

    } catch (err) {
      console.error(
        "Error saving category:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (categoryId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/categories/${categoryId}`
      );

      await loadCategories();

    } catch (err) {
      console.error(
        "Error deleting category:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete category. It may contain products."
      );
    }
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredCategories =
    categories.filter(
      (category) => {
        const keyword =
          search.trim().toLowerCase();

        if (!keyword) {
          return true;
        }

        const name =
          String(
            category.name || ""
          ).toLowerCase();

        const description =
          String(
            category.description || ""
          ).toLowerCase();

        return (
          name.includes(keyword) ||
          description.includes(keyword)
        );
      }
    );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-categories-page">
        <p>
          Loading categories...
        </p>
      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="admin-categories-page">

      {/* ==================================
          BACK
      ================================== */}

      <button
        type="button"
        className="admin-categories-back"
        onClick={() =>
          navigate("/admin")
        }
      >
        <FiArrowLeft />
        Back to Dashboard
      </button>

      {/* ==================================
          HEADER
      ================================== */}

      <header className="admin-categories-header">

        <div>

          <p className="admin-categories-label">
            DRINKIT ADMIN
          </p>

          <h1>
            Category Management
          </h1>

          <p>
            Create and manage product categories.
          </p>

        </div>

        <strong className="admin-categories-count">
          {categories.length}{" "}
          {categories.length === 1
            ? "category"
            : "categories"}
        </strong>

      </header>

      {/* ==================================
          ERROR
      ================================== */}

      {error && (
        <div className="admin-categories-error">
          {error}
        </div>
      )}

      {/* ==================================
          FORM
      ================================== */}

      <section className="admin-category-form-card">

        <div className="admin-category-form-header">

          <div>

            <p className="admin-categories-label">
              {editingId !== null
                ? "EDIT CATEGORY"
                : "NEW CATEGORY"}
            </p>

            <h2>
              {editingId !== null
                ? "Update Category"
                : "Add Category"}
            </h2>

          </div>

          {editingId !== null && (
            <button
              type="button"
              className="admin-category-cancel"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          className="admin-category-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="admin-category-field">

            <label>
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Beer"
              required
            />

          </div>

          {/* IMAGE */}

          <div className="admin-category-field">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="beer.jpg"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="admin-category-field admin-category-full">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this category..."
              rows="4"
            />

          </div>

          {/* ACTIVE */}

          <label className="admin-category-active">

            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />

            <span>
              Category is active
            </span>

          </label>

          {/* ACTIONS */}

          <div className="admin-category-actions">

            <button
              type="submit"
              className="admin-category-save"
              disabled={saving}
            >
              <FiPlus />

              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Category"
                : "Add Category"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="admin-category-reset"
                onClick={resetForm}
              >
                Clear
              </button>
            )}

          </div>

        </form>

      </section>

      {/* ==================================
          CATEGORY LIST
      ================================== */}

      <section className="admin-category-list-section">

        <div className="admin-category-list-header">

          <div>

            <p className="admin-categories-label">
              CATEGORIES
            </p>

            <h2>
              All Categories
            </h2>

          </div>

        </div>

        {/* SEARCH */}

        <div className="admin-category-search">

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* EMPTY */}

        {filteredCategories.length === 0 ? (

          <div className="admin-category-empty">

            <FiLayers />

            <h2>
              {search
                ? "No categories found"
                : "No categories yet"}
            </h2>

            <p>
              {search
                ? "Try a different search."
                : "Create your first category above."}
            </p>

          </div>

        ) : (

          <div className="admin-category-table-wrapper">

            <table className="admin-category-table">

              <thead>

                <tr>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    DESCRIPTION
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

                {filteredCategories.map(
                  (category) => {

                    return (
                      <tr
                        key={category.id}
                      >

                        {/* CATEGORY */}

                        <td>

                          <div className="admin-category-name">

                            {category.imageUrl ? (

                              <img
                                src={
                                  category.imageUrl.startsWith(
                                    "http"
                                  )
                                    ? category.imageUrl
                                    : `/images/${category.imageUrl}`
                                }
                                alt={category.name}
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";

                                  const placeholder =
                                    e.currentTarget
                                      .nextElementSibling;

                                  if (
                                    placeholder
                                  ) {
                                    placeholder.style.display =
                                      "flex";
                                  }
                                }}
                              />

                            ) : null}

                            <div
                              className="admin-category-placeholder"
                              style={{
                                display:
                                  category.imageUrl
                                    ? "none"
                                    : "flex",
                              }}
                            >
                              <FiLayers />
                            </div>

                            <strong>
                              {category.name}
                            </strong>

                          </div>

                        </td>

                        {/* DESCRIPTION */}

                        <td>
                          {category.description ||
                            "—"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              category.active
                                ? "category-active"
                                : "category-inactive"
                            }
                          >
                            {category.active
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-category-row-actions">

                            <button
                              type="button"
                              className="admin-category-edit"
                              onClick={() =>
                                handleEdit(
                                  category
                                )
                              }
                            >
                              <FiEdit2 />
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-category-delete"
                              onClick={() =>
                                handleDelete(
                                  category.id
                                )
                              }
                            >
                              <FiTrash2 />
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminCategories;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiSearch,
} from "react-icons/fi";

import api from "../services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD USERS
  // ========================================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users");

        console.log(
          "Admin users response:",
          response.data
        );

        const data = response.data;

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (
          Array.isArray(data?.content)
        ) {
          setUsers(data.content);
        } else if (
          Array.isArray(data?.users)
        ) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }

      } catch (err) {
        console.error(
          "Error loading customers:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          navigate("/admin/login");
          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load customers."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  // ========================================
  // GET ROLE FROM USER
  // ========================================

  const getUserRole = (user) => {
    // ----------------------------------------
    // Direct role name
    // ----------------------------------------

    if (user.roleName) {
      return String(
        user.roleName
      ).toUpperCase();
    }

    // ----------------------------------------
    // Direct role
    // ----------------------------------------

    if (
      typeof user.role === "string"
    ) {
      return user.role.toUpperCase();
    }

    // ----------------------------------------
    // role object
    // ----------------------------------------

    if (user.role) {

      if (
        user.role.roleName
      ) {
        return String(
          user.role.roleName
        ).toUpperCase();
      }

      if (
        user.role.name
      ) {
        return String(
          user.role.name
        ).toUpperCase();
      }
    }

    // ----------------------------------------
    // roles array
    // ----------------------------------------

    if (
      Array.isArray(user.roles)
    ) {

      for (const role of user.roles) {

        if (
          typeof role === "string"
        ) {
          return role.toUpperCase();
        }

        if (
          role?.roleName
        ) {
          return String(
            role.roleName
          ).toUpperCase();
        }

        if (
          role?.name
        ) {
          return String(
            role.name
          ).toUpperCase();
        }
      }
    }

    // ----------------------------------------
    // authorities
    // ----------------------------------------

    if (
      Array.isArray(
        user.authorities
      )
    ) {

      for (
        const authority
        of user.authorities
      ) {

        const value =
          authority?.authority ||
          authority?.roleName ||
          authority?.name ||
          authority;

        if (value) {
          return String(
            value
          )
            .replace(
              "ROLE_",
              ""
            )
            .toUpperCase();
        }
      }
    }

    return "";
  };

  // ========================================
  // CHECK WHETHER ROLE INFORMATION EXISTS
  // ========================================

  const hasRoleInformation =
    users.some((user) => {
      return Boolean(
        getUserRole(user) ||
        user.roleId ||
        user.role_id ||
        user.role?.id
      );
    });

  // ========================================
  // CUSTOMER LIST
  // ========================================

  const customerUsers =
    hasRoleInformation
      ? users.filter((user) => {

          const role =
            getUserRole(user);

          const roleId =
            user.roleId ||
            user.role_id ||
            user.role?.id;

          return (
            role === "CUSTOMER" ||
            role === "ROLE_CUSTOMER" ||
            Number(roleId) === 1
          );
        })
      : users;

  // ========================================
  // SEARCH CUSTOMERS
  // ========================================

  const filteredUsers =
    customerUsers.filter(
      (user) => {

        const firstName =
          user.firstName ||
          "";

        const lastName =
          user.lastName ||
          "";

        const name =
          `${firstName} ${lastName}`
            .trim()
            .toLowerCase();

        const email =
          String(
            user.email || ""
          ).toLowerCase();

        const phone =
          String(
            user.phoneNumber ||
            user.phone ||
            ""
          ).toLowerCase();

        const searchValue =
          search
            .toLowerCase()
            .trim();

        return (
          name.includes(
            searchValue
          ) ||
          email.includes(
            searchValue
          ) ||
          phone.includes(
            searchValue
          )
        );
      }
    );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-users-page">

        <p>
          Loading customers...
        </p>

      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="admin-users-page">

        <button
          type="button"
          className="admin-users-back"
          onClick={() =>
            navigate("/admin")
          }
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        <div className="admin-users-error">

          <FiUsers />

          <h2>
            {error}
          </h2>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="admin-users-page">

      {/* ====================================
          BACK
      ==================================== */}

      <button
        type="button"
        className="admin-users-back"
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

      <header className="admin-users-header">

        <div>

          <p className="admin-users-label">
            DRINKIT ADMIN
          </p>

          <h1>
            Customers
          </h1>

          <p>
            View and manage registered
            DrinkIt customers.
          </p>

        </div>

        <strong className="admin-users-count">

          {customerUsers.length}{" "}

          {customerUsers.length === 1
            ? "customer"
            : "customers"}

        </strong>

      </header>

      {/* ====================================
          SEARCH
      ==================================== */}

      <div className="admin-users-search">

        <FiSearch />

        <input
          type="text"
          placeholder="Search customers by name, email or phone..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ====================================
          EMPTY
      ==================================== */}

      {filteredUsers.length === 0 ? (

        <div className="admin-users-empty">

          <FiUsers />

          <h2>
            {search
              ? "No customers found"
              : "No customers yet"}
          </h2>

          <p>
            {search
              ? "Try a different search."
              : "Registered customers will appear here."}
          </p>

        </div>

      ) : (

        <section className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>

              <tr>

                <th>
                  CUSTOMER
                </th>

                <th>
                  EMAIL
                </th>

                <th>
                  PHONE
                </th>

                <th>
                  STATUS
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.map(
                (user, index) => {

                  const firstName =
                    user.firstName ||
                    "";

                  const lastName =
                    user.lastName ||
                    "";

                  const fullName =
                    `${firstName} ${lastName}`
                      .trim() ||
                    "Customer";

                  const email =
                    user.email ||
                    "—";

                  const phone =
                    user.phoneNumber ||
                    user.phone ||
                    "—";

                  const enabled =
                    user.enabled !== false;

                  return (
                    <tr
                      key={
                        user.id ||
                        user.userId ||
                        index
                      }
                    >

                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-user-name">

                          <div className="admin-user-avatar">

                            {fullName
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <strong>
                            {fullName}
                          </strong>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td>
                        {email}
                      </td>

                      {/* PHONE */}

                      <td>
                        {phone}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            enabled
                              ? "user-active"
                              : "user-inactive"
                          }
                        >
                          {enabled
                            ? "Active"
                            : "Disabled"}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </section>

      )}

    </main>
  );
}

export default AdminUsers;
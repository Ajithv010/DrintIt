import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token =
    localStorage.getItem("drinkit_token");

  const role =
    localStorage.getItem("drinkit_role");

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  const normalizedRole =
    String(role || "")
      .trim()
      .toUpperCase();

  if (
    normalizedRole !== "ADMIN" &&
    normalizedRole !== "ROLE_ADMIN"
  ) {
    return (
      <Navigate
        to="/start"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
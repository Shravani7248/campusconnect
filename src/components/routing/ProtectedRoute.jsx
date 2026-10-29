import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Route guard component ensuring user is logged in and possesses required role
 */
function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { token, user: reduxUser } = useSelector((state) => state.auth);

  const storedToken = token || localStorage.getItem("campusconnect_token");

  if (!storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    let user = reduxUser;
    if (!user) {
      try {
        const storedUser = localStorage.getItem("campusconnect_user");
        user = storedUser ? JSON.parse(storedUser) : null;
      } catch {
        user = null;
      }
    }

    const role = user?.role || "student";
    const normalizedRole = role === "administrator" ? "admin" : role;
    const normalizedAllowed = allowedRoles.map((r) =>
      r === "administrator" ? "admin" : r
    );

    if (!normalizedAllowed.includes(normalizedRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ allowedRole }) {
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
  const role = decodedAccessToken?.RoleID;
  if (!accessToken) {
    toast.warn("Please login to access this feature", { autoClose: 1500 });
    return <Navigate to="/signin" />;
  }
  return allowedRole == role ? (
    <Outlet />
  ) : role == "STAFF" ? (
    <Navigate to="/staff" />
  ) : role == "ADMIN" ? (
    <Navigate to="/admin" />
  ) : role == "MEMBER" ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/signin" />
  );

  // if (role === "ADMIN") {
  //   return <Outlet />;
  // } else if (role === "STAFF") {
  //   return <Outlet />;
  // } else if (role === "MEMBER") {
  //   return <Navigate to="/" />;
  // } else {
  //   return <Navigate to="/login" />;
  // }
}

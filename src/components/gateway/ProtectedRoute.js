import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const role = decodedAccessToken?.RoleID;
  return allowedRole == role ? (
    <Outlet />
  ) : role == "STAFF" ? (
    <Navigate to="/staff" />
  ) : role == "ADMIN" ? (
    <Navigate to="/admin" />
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

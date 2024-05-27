import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const role = decodedAccessToken?.RoleID;

  if (role === "ADMIN") {
    return <Outlet />;
  } else if (role === "STAFF") {
    return <Outlet />;
  } else if (role === "MEMBER") {
    return <Navigate to="/" />;
  } else {
    return <Navigate to="/login" />;
  }
}

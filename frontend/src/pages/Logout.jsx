import { Navigate } from "react-router-dom";

function Logout() {
  // TODO: remove access tokens
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return <Navigate to="/login" replace={true} />;
}

export default Logout;

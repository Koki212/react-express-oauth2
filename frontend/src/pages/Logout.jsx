import { Navigate } from "react-router-dom";

function Logout() {
  // TODO: remove access tokens
  return (
    <Navigate to="/login" replace={true} />
  );
}

export default Logout;

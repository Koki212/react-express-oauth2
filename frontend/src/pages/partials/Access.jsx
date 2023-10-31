import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isTokenValid } from "../../helpers/token";

function Access({ children }) {
  // TODO: remove access tokens
  if (isTokenValid(true)) {
    return <>{children}</>;
  }
  return <Navigate to="/login" replace={true} />;
}

Access.propTypes = {
  children: PropTypes.node,
};

export default Access;

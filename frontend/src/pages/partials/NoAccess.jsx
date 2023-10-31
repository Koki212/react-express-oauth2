import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isTokenValid } from "../../helpers/token";

function NoAccess({ children }) {
  // TODO: remove access tokens
  if (!isTokenValid(true)) {
    return <>{children}</>;
  }
  return <Navigate to="/" replace={true} />;
}

NoAccess.propTypes = {
  children: PropTypes.node,
};

export default NoAccess;

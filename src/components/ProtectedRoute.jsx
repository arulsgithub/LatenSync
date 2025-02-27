import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If the user is not authenticated, redirect to the SignIn page
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the children components
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
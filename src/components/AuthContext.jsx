import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => {
    try {
      if (userData?.userName && userData?.userType) {
        // Store user info
        const sanitizedUser = {
          userName: userData.userName,
          userType: userData.userType,
        };
        setUser(sanitizedUser);
        sessionStorage.setItem("user", JSON.stringify(sanitizedUser));

        // Store encoded credentials for API calls
        const encodedCredentials = btoa(`${userData.userName}:${userData.password}`);
        setCredentials(encodedCredentials);
        sessionStorage.setItem("credentials", encodedCredentials);
      } else {
        console.error("Invalid user data provided");
      }
    } catch (error) {
      console.error("Failed to store user data in sessionStorage:", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setCredentials(null);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("credentials");
      navigate("/");
    } catch (error) {
      console.error("Failed to remove user data from sessionStorage:", error);
    }
  };

  const isAuthenticated = () => user !== null && credentials !== null;

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedCredentials = sessionStorage.getItem("credentials");
      if (storedUser && storedCredentials && !user) {
        setUser(JSON.parse(storedUser));
        setCredentials(storedCredentials);
      }
    } catch (error) {
      console.error("Failed to retrieve user data from sessionStorage:", error);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, credentials, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/home" />;
  }

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login({
          userName: username,
          userType: data.userType || "user", // Default to "user" if userType is not provided
          password: password, // Include password for credentials
        });
        navigate("/home");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred");
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password || !userRole) {
      setError("All fields are required");
      return;
    }

    // Validate userRole
    const validRoles = ["admin", "user", "manager"];
    if (!validRoles.includes(userRole)) {
      setError("Invalid user role");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username, // Change "username" to "user_name"
          password: password,
          user_type: userRole, // Change "userRole" to "user_type"
        }),
      });

      if (response.ok) {
        setIsLogin(true); // Switch to login view
        setError("Registration successful! Please login.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fff] text-white flex flex-col justify-center items-center">
      <div className="flex justify-center mt-10">
        <div
          className="relative w-60 h-16 bg-gray-700 rounded-full flex items-center p-1 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          <div
            className={`absolute top-1 left-1 h-14 w-28 bg-[#3C5B6F] rounded-full transition-all duration-300 ${
              isLogin ? "translate-x-0" : "translate-x-full"
            }`}
          />
          <div className="w-28 text-center font-semibold z-10">Login</div>
          <div className="w-28 text-center font-semibold z-10">Sign Up</div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="Form-table pr-30 pb-15">
          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="Form-container bg-[#3C5B6F]"
          >
            <h3 className="Form-head">{isLogin ? "Login" : "Sign Up"}</h3>
            <div className="Form">
              <label className="Form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="Form-input"
                required
              />

              <label className="Form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="Form-input"
                required
              />

              {!isLogin && (
                <>
                  <label className="Form-label">User Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="Form-input"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </>
              )}

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <button type="submit" className="Form-button bg-[#948979]">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

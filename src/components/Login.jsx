import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../css/DeviceForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    const loginData = { username, password };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Login response:", responseData);

        login({
          userName: username,
          password: password,
          userType: responseData.userType || "",
        });

        navigate("/metrics");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(
          errorData.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please retry.");
    }
  };

  return (
    <div className="Form-table bg-[#153448] min-h-screen text-white poppins-bold flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="Form-container bg-[#3C5B6F] p-6 rounded-lg shadow-lg"
      >
        <h3 className="Form-head text-center">Login</h3>
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button type="submit" className="Form-button bg-[#948979] w-full mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userRole: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password || !formData.userRole) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful
        console.log("Registration successful");
        navigate("/"); // Redirect to login page
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred. Please retry.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="Form-table bg-[#153448] min-h-screen text-white poppins-bold">
      <form onSubmit={handleSubmit} className="Form-container bg-[#3C5B6F]">
        <h3 className="Form-head">Sign Up</h3>
        <div className="Form">
          <label className="Form-label">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Username"
            className="Form-input"
            required
          />
          <label className="Form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="Form-input"
            required
          />
          <label className="Form-label">User Role</label>
          <input
            type="text"
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
            placeholder="Enter User Role"
            className="Form-input"
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button type="submit" className="Form-button bg-[#948979]">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;

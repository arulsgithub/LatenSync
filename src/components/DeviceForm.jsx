import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // Import the useAuth hook
import "../css/DeviceForm.css";

const DeviceForm = () => {
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    device_id: "",
    device_name: "",
    device_type: "",
    ip_addr: "",
    mac_addr: "",
    location: "",
    user_name: "", // Add user_name to the form data
  });
  const [message, setMessage] = useState(""); // For displaying error/success messages

  const { credentials, isAuthenticated } = useAuth(); // Get credentials and authentication status

  // Fetch all devices
  useEffect(() => {
    if (!isAuthenticated()) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    axios
      .get("http://localhost:8080/api/devices", {
        headers: {
          Authorization: authHeader, // Include the Authorization header
        },
      })
      .then((response) => {
        console.log("Devices fetched successfully:", response.data);
        setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        if (error.response && error.response.status === 401) {
          setMessage("Authentication failed. Please log in again.");
        } else {
          setMessage("Failed to fetch devices. Please try again.");
        }
      });
  }, [credentials, isAuthenticated]); // Add credentials and isAuthenticated to the dependency array

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    // Validate required fields
    if (!formData.device_id || !formData.device_name || !formData.user_name) {
      setMessage("Device ID, Device Name, and User Name are required.");
      return;
    }

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    axios
      .post("http://localhost:8080/api/devices/add", formData, {
        headers: {
          Authorization: authHeader, // Include the Authorization header
        },
      })
      .then((response) => {
        setMessage("Device added successfully!");
        setDevices([...devices, response.data]); // Update the devices list
        setFormData({
          device_id: "",
          device_name: "",
          device_type: "",
          ip_addr: "",
          mac_addr: "",
          location: "",
          user_name: "", // Reset user_name
        });
      })
      .catch((error) => {
        console.error("Error adding device:", error);
        if (error.response) {
          // Display the error message from the backend
          setMessage(
            `Error: ${error.response.data.error || "Failed to add device"}`
          );
        } else {
          setMessage("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div>
      <div className="Form-table bg-[#fff] grid grid-cols-3 gap-4 p-4">
        <form className="Form-container" onSubmit={handleSubmit}>
          <h3 className="Form-head"></h3>
          <div className="Form-grid">
            {Object.keys(formData).map((key, index) => (
              <div key={key} className="Form">
                <label className="Form-label">{key.replace("_", " ")}:</label>
                <input
                  type="text"
                  name={key}
                  placeholder={`Enter ${key.replace("_", " ")}`}
                  value={formData[key]}
                  onChange={handleChange}
                  className="Form-input"
                  required={
                    key === "device_id" ||
                    key === "device_name" ||
                    key === "user_name"
                  } // Make required fields mandatory
                />
              </div>
            ))}
          </div>
          <button type="submit" className="Form-button">
            Submit
          </button>
          {message && <p className="Form-message">{message}</p>}{" "}
          {/* Display error/success message */}
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;

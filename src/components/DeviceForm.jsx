import { useEffect, useState } from "react";
import axios from "axios";
import "../css/DeviceForm.css";

const DeviceForm = () => {
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    device_id: "",
    device_name: "",
    device_type: "",
    ip_addr: "",
    mac_addr: "",
    device_status: "",
  });

  // Fetch all devices
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/devices")
      .then((response) => setDevices(response.data))
      .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/devices/add", formData)
      .then((response) => {
        alert("Device added successfully!");
        setDevices([...devices, response.data]);
        setFormData({
          device_id: "",
          device_name: "",
          device_type: "",
          ip_addr: "",
          mac_addr: "",
          device_status: "",
        });
      })
      .catch((error) => console.error("Error adding device:", error));
  };

  return (
    <div className="Form-table">
      <form className="Form-container" onSubmit={handleSubmit}>
        <h3 className="Form-head">Device Management</h3>
        {Object.keys(formData).map((key) => (
          <div key={key} className="Form">
            <label className="Form-label">
              {key.replace("_", " ").toUpperCase()}:
            </label>
            <input
              type="text"
              name={key}
              placeholder={`Enter ${key.replace("_", " ")}`}
              value={formData[key]}
              onChange={handleChange}
              className="Form-input"
            />
          </div>
        ))}
        <button type="submit" className="Form-button">
          Add Device
        </button>
      </form>
    </div>
  );
};

export default DeviceForm;

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // Import the useAuth hook
import "../css/DeviceForm.css";
import img from "../assets/img.png";

const UploadDevice = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { credentials, isAuthenticated } = useAuth(); // Get credentials and authentication status

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    try {
      const response = await axios.post(
        "http://localhost:8080/api/devices/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authHeader, // Include the Authorization header
          },
        }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage(
        "Error uploading file: " + (error.response?.data || error.message)
      );
      if (error.response && error.response.status === 401) {
        console.error("Authentication failed. Please log in again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="Form-table bg-[#fff] p-4">
        <form className="Form-container" onSubmit={handleUpload}>
          <h3 className="Form-head">Upload Device</h3>
          <div className="Form-grid">
            <div className="Form">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="Form-input"
              />
            </div>
          </div>

          <button type="submit" className="Form-button">
            Upload
          </button>

          {message && <p className="Form-label">{message}</p>}
          <div className="Form flex flex-col items-center">
            <p className="text-white pt-5">
              Upload file only in xls or xlsx format
            </p>
            <p className="text-white pt-10">Keep the same excel format</p>
            <img className="pb-5 pl-2 mt-7 w-120 h-10" src={img} alt="img" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDevice;

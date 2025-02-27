import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth } from "../components/AuthContext";

const DownloadMetrics = ({ selectedDevice }) => {
  // State for the component
  const [deviceId, setDeviceId] = useState(selectedDevice || "");
  const [limit, setLimit] = useState(10);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get authentication context
  const { credentials, isAuthenticated } = useAuth();

  // Update deviceId when selectedDevice prop changes
  useState(() => {
    if (selectedDevice) {
      setDeviceId(selectedDevice);
    }
  }, [selectedDevice]);

  const handleDownload = async (format) => {
    // Check authentication first
    if (!isAuthenticated()) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Preparing download...");

      // Create auth header using the stored credentials
      const authHeader = `Basic ${credentials}`;

      console.log(
        `Downloading ${format} for device ${deviceId} (${limit} records)`
      );

      // Make authenticated request for download
      const response = await axios.get(
        `http://localhost:8080/api/metrics/download/${deviceId}/${limit}?format=${format}`,
        {
          responseType: "blob", // Treat response as a file
          headers: {
            Authorization: authHeader,
          },
        }
      );

      // Create file name based on device ID and format
      const fileName = `metrics_${deviceId}_${
        new Date().toISOString().split("T")[0]
      }.${format}`;

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      link.remove();

      setMessage(`Download complete! File: ${fileName}`);
    } catch (error) {
      console.error("Error downloading metrics:", error);

      // Handle different error scenarios
      if (error.response && error.response.status === 401) {
        setMessage("Authentication failed. Please log in again.");
      } else if (error.response && error.response.status === 404) {
        setMessage(`No data found for device ${deviceId}.`);
      } else {
        setMessage("Failed to download metrics. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#3C5B6F] p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Download Metrics</h2>

      <div className="mb-4">
        <label className="block mb-2">Device ID:</label>
        <input
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="Enter device ID"
          className="w-full p-2 rounded text-black"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Number of Records:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
          min="1"
          max="1000"
          className="w-full p-2 rounded text-black"
          disabled={loading}
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleDownload("csv")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
          disabled={!deviceId || loading}
        >
          Download as CSV
        </button>
        <button
          onClick={() => handleDownload("xlsx")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          disabled={!deviceId || loading}
        >
          Download as Excel
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("complete")
              ? "bg-green-800"
              : message.includes("failed")
              ? "bg-red-800"
              : "bg-blue-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

DownloadMetrics.propTypes = {
  selectedDevice: PropTypes.string,
};

export default DownloadMetrics;

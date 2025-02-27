import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth } from "../components/AuthContext";
import MetricsGraph from "./MetricsGraph";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MetricsTable({
  setSelectedDevice,
  setSelectedMetric,
  selectedDevice,
  selectedMetric,
}) {
  const [metrics, setMetrics] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { credentials, isAuthenticated } = useAuth();

  // Function to show critical alert
  const showCriticalAlert = (deviceId, latency, packetLoss) => {
    toast.error(
      <div>
        <h3 className="font-bold">Critical Alert!</h3>
        <p>Device ID: {deviceId}</p>
        <p>Latency: {latency} ms</p>
        <p>Packet Loss: {packetLoss}%</p>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4",
        bodyClassName: "text-sm",
      }
    );
  };

  // Fetch available devices when component mounts and user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) return;

    setLoading(true);
    const authHeader = `Basic ${credentials}`;

    axios
      .get("http://localhost:8080/api/devices", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        console.log("Devices fetched:", response.data);
        // Directly set the device IDs from the response
        setDeviceIds(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching devices:", err);
        setError("Failed to load devices. Please try again.");
        setLoading(false);
      });
  }, [isAuthenticated, credentials]);

  // Start streaming and collect data
  useEffect(() => {
    if (deviceIds.length === 0 || !isAuthenticated()) return;

    console.log("Starting data streams for devices:", deviceIds);

    // Create a controller for each device stream
    const controllers = deviceIds.map((deviceId) => {
      const authHeader = `Basic ${credentials}`;

      // Start streaming for this device
      axios
        .post(
          `http://localhost:8080/api/metrics/start/${deviceId}`,
          {},
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
        .then(() => console.log(`Started stream for ${deviceId}`))
        .catch((error) => {
          console.error(`Error starting stream for ${deviceId}:`, error);
        });

      // Custom SSE implementation using fetch
      const controller = new AbortController();

      fetch(`http://localhost:8080/api/metrics/stream/${deviceId}`, {
        headers: {
          Authorization: authHeader,
        },
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          function readStream() {
            reader
              .read()
              .then(({ value, done }) => {
                if (done) {
                  console.log(`Stream closed for ${deviceId}`);
                  return;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                lines.forEach((line) => {
                  if (line.startsWith("data:")) {
                    const jsonData = line.slice(5).trim();
                    try {
                      const data = JSON.parse(jsonData);
                      console.log(`Received Data for ${deviceId}:`, data);

                      // Check if the status is critical
                      if (data.status === "Critical") {
                        console.log(
                          "Critical alert triggered for",
                          data.deviceId,
                          data
                        );
                        showCriticalAlert(
                          data.deviceId,
                          data.latency,
                          data.packet_loss
                        );
                      }

                      setMetrics((prevMetrics) => {
                        const updated = [...prevMetrics];
                        const index = updated.findIndex(
                          (m) => m.deviceId === data.deviceId
                        );

                        if (index !== -1) {
                          updated[index] = data;
                        } else {
                          updated.push(data);
                        }
                        return updated;
                      });
                    } catch (error) {
                      console.error(
                        `Error parsing SSE data for ${deviceId}:`,
                        error
                      );
                    }
                  }
                });

                readStream();
              })
              .catch((error) => {
                if (error.name !== "AbortError") {
                  console.error(`SSE Error for ${deviceId}:`, error);
                }
              });
          }

          readStream();
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error(`Failed to connect to SSE for ${deviceId}:`, error);
          }
        });

      return controller;
    });

    // Cleanup function to abort all controllers when component unmounts
    return () => {
      console.log("Cleaning up stream controllers");
      controllers.forEach((controller) => {
        controller.abort();
      });
    };
  }, [deviceIds, credentials, isAuthenticated]);

  return (
    <div className="bg-[#3C5B6F] p-4 rounded-lg shadow-lg">
      <ToastContainer />

      {/* Error message display */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <p className="text-gray-400 text-center">Loading devices...</p>
      )}

      <table className="w-full border-collapse text-white">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-3">Device ID</th>
            <th className="p-3">Latency</th>
            <th className="p-3">Packet Loss</th>
            <th className="p-3">Throughput</th>
            <th className="p-3">Jitter</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {metrics.length > 0 ? (
            metrics.map((m) => (
              <tr
                key={m.deviceId}
                className={`cursor-pointer hover:bg-gray-700 text-white ${
                  selectedDevice === m.deviceId ? "bg-gray-600" : ""
                }`}
                onClick={() => {
                  console.log("Row clicked, setting device:", m.deviceId);
                  setSelectedDevice(m.deviceId);
                  setSelectedMetric(null);
                }}
              >
                <td className="p-3">{m.deviceId}</td>
                {["latency", "packet_loss", "throughput", "jitter"].map(
                  (metric) => (
                    <td
                      key={metric}
                      className={`p-3 cursor-pointer hover:bg-gray-600 ${
                        selectedDevice === m.deviceId &&
                        selectedMetric === metric
                          ? "bg-gray-500"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        console.log("Metric cell clicked:", {
                          device: m.deviceId,
                          metric,
                        });
                        setSelectedDevice(m.deviceId);
                        setSelectedMetric(metric);
                      }}
                    >
                      {m[metric]}
                    </td>
                  )
                )}
                <td className="p-3">{m.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-white" colSpan="6">
                {deviceIds.length > 0
                  ? "Waiting for metrics data..."
                  : "No devices available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Show deviceDetails when a device is selected and details are available */}
      {selectedDevice && deviceDetails && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">
            Device Details - {selectedDevice}
          </h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <p>
              <strong>ID:</strong> {deviceDetails.device_id || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {deviceDetails.device_name || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {deviceDetails.device_type || "N/A"}
            </p>
            <p>
              <strong>IP Address:</strong> {deviceDetails.ip_addr || "N/A"}
            </p>
            <p>
              <strong>MAC Address:</strong> {deviceDetails.mac_addr || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {deviceDetails.location || "N/A"}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {deviceDetails.user_name || deviceDetails.user || "N/A"}
            </p>
          </div>

          {/* Only render MetricsGraph if a metric is selected */}
          {selectedMetric && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">
                {selectedMetric.charAt(0).toUpperCase() +
                  selectedMetric.slice(1).replace("_", " ")}{" "}
                Graph
              </h4>
              <div className="w-full h-64">
                <MetricsGraph
                  deviceId={selectedDevice}
                  metric={selectedMetric}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

MetricsTable.propTypes = {
  setSelectedDevice: PropTypes.func.isRequired,
  setSelectedMetric: PropTypes.func.isRequired,
  selectedDevice: PropTypes.string,
  selectedMetric: PropTypes.string,
};

import { useState, useEffect } from "react";
import axios from "axios";
import { Line, Radar, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { MdImportantDevices } from "react-icons/md";
import { MdOutlineRouter } from "react-icons/md";
import { IoIosGlobe } from "react-icons/io";
import { AiFillApi } from "react-icons/ai";
import { useAuth } from "../components/AuthContext";

export default function DeviceMetrics() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceIds, setDeviceIds] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState({
    device_id: "",
    device_name: "",
    device_type: "",
    ip_addr: "",
    mac_addr: "",
    location: null,
    user: null,
    user_name: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { credentials, isAuthenticated } = useAuth();

  // Fetch available device IDs and automatically select first device
  useEffect(() => {
    if (!isAuthenticated()) {
      setError("Authentication required. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    const authHeader = `Basic ${credentials}`;

    axios
      .get("http://localhost:8080/api/devices", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        setDeviceIds(response.data);
        // Automatically select the first device if none is selected
        if (response.data.length > 0 && !selectedDevice) {
          setSelectedDevice(response.data[0]);
        }
        setError(null);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          console.error("Error fetching device IDs:", error);
          setError("Failed to fetch device IDs. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [credentials, isAuthenticated, selectedDevice]);

  // Start streams for all devices as soon as we have device IDs
  useEffect(() => {
    if (deviceIds.length === 0 || !isAuthenticated()) return;

    const authHeader = `Basic ${credentials}`;

    // Start streams for all devices immediately
    const startPromises = deviceIds.map((deviceId) => {
      return axios
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
    });

    // Wait for all streams to start
    Promise.all(startPromises)
      .then(() => console.log("All streams started"))
      .catch((error) => console.error("Error starting streams:", error));
  }, [deviceIds, credentials, isAuthenticated]);

  // Fetch device details when a device is selected
  useEffect(() => {
    if (!selectedDevice || !isAuthenticated()) return;

    const authHeader = `Basic ${credentials}`;

    axios
      .get(`http://localhost:8080/api/devices/${selectedDevice}`, {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => setDeviceDetails(response.data))
      .catch((error) => console.error("Error fetching device details:", error));
  }, [selectedDevice, credentials, isAuthenticated]);

  // Fetch real-time data for selected device
  useEffect(() => {
    if (!selectedDevice || !isAuthenticated()) return;

    const authHeader = `Basic ${credentials}`;
    const controller = new AbortController();

    // Reset metrics for new device
    setMetrics([]);

    fetch(`http://localhost:8080/api/metrics/stream/${selectedDevice}`, {
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
                console.log(`Stream closed for ${selectedDevice}`);
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n\n");
              buffer = lines.pop() || "";

              lines.forEach((line) => {
                if (line.startsWith("data:")) {
                  const jsonData = line.slice(5).trim();
                  try {
                    const newData = JSON.parse(jsonData);
                    setMetrics((prev) => {
                      const updated = [...prev, newData].slice(-20); // Keep only last 50 values
                      return updated;
                    });
                  } catch (error) {
                    console.error("Error parsing streaming data:", error);
                  }
                }
              });

              readStream();
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                console.error(`SSE Error for ${selectedDevice}:`, error);
              }
            });
        }

        readStream();
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(
            `Failed to connect to SSE for ${selectedDevice}:`,
            error
          );
        }
      });

    return () => {
      controller.abort();
    };
  }, [selectedDevice, credentials, isAuthenticated]);

  const timestamps = metrics.map((_, index, array) => {
    return (index - (array.length - 1)) * 5;
  });

  // Then update your chart labels for better readability
  const formatTimestamp = (value) => {
    // Convert relative timestamp to a more friendly format
    // For example, you could show "5s ago", "10s ago", etc.
    if (value === 0) return "0";
    return `${Math.abs(value)}`;
  };
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {
        ticks: {
          callback: formatTimestamp,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10, // Limit number of ticks for readability
        },
        grid: {
          display: true,
        },
      },
    },
    decimation: {
      enabled: true,
      algorithm: "lttb",
      samples: 10,
    },
  };

  // Create a specific options object for the radar chart
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(255, 255, 255, 0.3)" },
        grid: { color: "rgba(255, 255, 255, 0.3)" },
        pointLabels: { color: "white" },
        ticks: { backdropColor: "transparent", color: "white" },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  // Then in your JSX, use the radarOptions for the radar chart:

  // Latency (Radar Chart)
  const latencyData = {
    labels: timestamps,
    datasets: [
      {
        label: "Latency (ms)",
        data: metrics.map((m) =>
          Math.min(350, Math.max(0, Math.round(m.latency / 10) * 50))
        ),
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgb(255, 99, 132)",
        pointRadius: 3, // Reduce point size
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  // Packet Loss (Bar Chart)
  const packetLossData = {
    labels: timestamps,
    datasets: [
      {
        label: "Packet Loss (%)",
        data: metrics.map((m) => m.packet_loss),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  // Jitter (Line Chart)
  const jitterData = {
    labels: timestamps,
    datasets: [
      {
        label: "Jitter (ms)",
        data: metrics.map((m) => m.jitter),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  // Throughput (Line Chart)
  const throughputData = {
    labels: timestamps,
    datasets: [
      {
        label: "Throughput (Mbps)",
        data: metrics.map((m) => m.throughput),
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.3)",
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center p-5 bg-[#fff] text-[#3C5B6F] min-h-screen">
      <h2 className="text-2xl mb-4">Network Metrics Dashboard</h2>
      <select
        className="p-2 mb-5 bg-[#fff] text-[#3C5B6F] rounded"
        onChange={(e) => setSelectedDevice(e.target.value)}
        value={selectedDevice || ""}
        disabled={loading || deviceIds.length === 0}
      >
        <option value="">Select a Device</option>
        {deviceIds.map((id) => (
          <option key={id} value={id}>
            Device {id}
          </option>
        ))}
      </select>

      {loading && <p className="text-gray-400">Loading devices...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {selectedDevice && (
        <div className="grid grid-cols-4 gap-10 w-full max-w-5xl text-white text-center mb-10">
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-[15]">Device Name</h3>
              <MdImportantDevices className="text-5xl mt-5" />
            </div>
            <p className="text-center text-[20px] mt-5">
              {deviceDetails.device_name || "N/A"}
            </p>
          </div>
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-2">Device Type</h3>
              <MdOutlineRouter className="text-5xl ml-2 mt-3" />
            </div>
            <p className="text-center text-[20px] mt-5">
              {deviceDetails.device_type || "N/A"}
            </p>
          </div>
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-2">IP Address</h3>
              <IoIosGlobe className="text-5xl mt-3" />
            </div>
            <p className="text-center text-[20px] mt-5">
              {deviceDetails.ip_addr || "N/A"}
            </p>
          </div>
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-2">MAC Address</h3>
              <AiFillApi className="text-5xl mt-3" />
            </div>
            <p className="text-center text-[20px] mt-5">
              {deviceDetails.mac_addr || "N/A"}
            </p>
          </div>
        </div>
      )}

      {selectedDevice && metrics.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 w-full max-w-5xl">
          {/* Latency (Radar Chart) */}
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <h3 className="text-lg mb-2 text-white">Latency</h3>
            <div className="w-full h-64 flex justify-center">
              <Radar data={latencyData} options={radarOptions} />
            </div>
          </div>

          {/* Packet Loss (Bar Chart) */}
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <h3 className="text-lg mb-2 text-white">Packet Loss</h3>
            <div className="w-full h-64 flex justify-center">
              <Bar data={packetLossData} options={commonOptions} />
            </div>
          </div>

          {/* Jitter (Line Chart) */}
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <h3 className="text-lg mb-2 text-white">Jitter</h3>
            <div className="w-full h-64 flex justify-center">
              <Line data={jitterData} options={commonOptions} />
            </div>
          </div>

          {/* Throughput (Line Chart) */}
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <h3 className="text-lg mb-2 text-white">Throughput</h3>
            <div className="w-full h-64 flex justify-center">
              <Line data={throughputData} options={commonOptions} />
            </div>
          </div>
        </div>
      ) : selectedDevice ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">
            Loading metrics data...
          </div>
        </div>
      ) : (
        <div className="bg-[#3C5B6F] p-6 rounded-lg text-center text-white">
          <p>
            {deviceIds.length > 0
              ? "Please select a device to view detailed metrics"
              : "No devices available. Please check your connection."}
          </p>
        </div>
      )}
    </div>
  );
}

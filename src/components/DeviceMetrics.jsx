import { useState, useEffect } from "react";
import axios from "axios";
import { Line, Radar, Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function DeviceMetrics() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceIds, setDeviceIds] = useState([]);
  const [metrics, setMetrics] = useState([]);

  // Fetch available device IDs
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/devices")
      .then((response) => setDeviceIds(response.data))
      .catch((error) => console.error("Error fetching device IDs:", error));
  }, []);

  // Fetch real-time data for selected device
  useEffect(() => {
    if (!selectedDevice) return;

    const eventSource = new EventSource(
      `http://localhost:8080/api/metrics/stream/${selectedDevice}`
    );

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setMetrics((prev) => {
          const updated = [...prev, newData].slice(-50); // Keep only last 20 values
          return updated;
        });
      } catch (error) {
        console.error("Error parsing streaming data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Streaming error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [selectedDevice]);

  // Prepare Chart Data
  const timestamps = metrics.map((_, index) => index * 5); // Keep X-Axis as 0, 5, 10, 15...

  const latencyData = {
    labels: timestamps,
    datasets: [
      {
        label: "Latency",
        data: metrics.map((m) => m.latency),
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const packetLossData = {
    labels: timestamps,
    datasets: [
      {
        label: "Packet Loss",
        data: metrics.map((m) => m.packet_loss),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const jitterData = {
    labels: timestamps,
    datasets: [
      {
        label: "Jitter",
        data: metrics.map((m) => m.jitter),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const throughputData = {
    labels: timestamps,
    datasets: [
      {
        label: "Throughput",
        data: metrics.map((m) => m.throughput),
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.3)",
        fill: true,
      },
    ],
  };

  return (
    <div className="flex-1 p-5 bg-gray-900 poppins-semibold text-white">
      <h2 className="text-2xl mb-4">Select Device</h2>
      <select
        className="p-2 mb-5 bg-gray-800 text-white rounded"
        onChange={(e) => setSelectedDevice(e.target.value)}
        value={selectedDevice || ""}
      >
        <option value="">Select a Device</option>
        {deviceIds.map((id) => (
          <option key={id} value={id}>
            Device {id}
          </option>
        ))}
      </select>

      {selectedDevice && metrics.length > 0 ? (
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg mb-2">Latency (Radar Chart)</h3>
            <Radar data={latencyData} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg mb-2">Packet Loss (Bar Chart)</h3>
            <Bar data={packetLossData} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg mb-2">Jitter (Line Chart with Area)</h3>
            <Line data={jitterData} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg mb-2">Throughput (Line Chart with Area)</h3>
            <Line data={throughputData} />
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading data...</p>
      )}
    </div>
  );
}

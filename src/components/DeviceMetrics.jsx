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
        setTimeout(() => {
          setMetrics((prev) => [...prev, newData].slice(-20)); // Keep last 20 values
        }, 5000); // Keep last 50 values
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

  // Reset metrics when a new device is selected
  useEffect(() => {
    setMetrics([]);
  }, [selectedDevice]);

  // Increase the gap between data points
  const timestamps = metrics.map((_, index) => index * 5); // Adjusted interval for better spacing

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },

    decimation: {
      enabled: true,
      algorithm: "lttb", // Or 'min-max', or leave undefined for no decimation
      samples: 10, // Optional: specify the number of samples for LTTB
    },
  };

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
      <h2 className="text-2xl mb-4">Select Device</h2>
      <select
        className="p-2 mb-5 bg-[#fff] text-[#3C5B6F] rounded"
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

      <div className="grid grid-cols-4 gap-5">
        <div className="grid grid-cols-2 gap-2 bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2 w-50 h-50"></h3>
        </div>
        <div className="bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2"></h3>
        </div>
        <div className="bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2"></h3>
        </div>
        <div className="bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2"></h3>
        </div>
      </div>

      {selectedDevice && metrics.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 w-full max-w-5xl">
          {/* Latency (Radar Chart) */}
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <h3 className="text-lg mb-2 text-white">Latency</h3>
            <div className="w-full h-64 flex justify-center">
              <Radar data={latencyData} options={commonOptions} />
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
      ) : (
        <p className="text-black mt-5">Loading data...</p>
      )}
    </div>
  );
}

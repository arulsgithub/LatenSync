import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useAuth } from "../components/AuthContext"; // Import the useAuth hook

export default function MetricsGraph({ deviceId, metric }) {
  const [graphData, setGraphData] = useState({ labels: [], data: [] });
  const { credentials } = useAuth(); // Get credentials from the AuthContext

  useEffect(() => {
    const fetchMetrics = () => {
      // Include the Authorization header with the credentials
      fetch(`http://localhost:8080/api/metrics/device/${deviceId}`, {
        headers: {
          Authorization: `Basic ${credentials}`, // Add the Basic Auth header
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((metrics) => {
          const recentMetrics = metrics.slice(-20); // Get the last 20 metrics
          const labels = recentMetrics.map((_, index) => index * 5); // Generate labels

          const metricData = recentMetrics.map((m) => m[metric]); // Extract the selected metric data

          setGraphData({
            labels,
            data: metricData,
          });
        })
        .catch((error) => {
          console.error("Error fetching metrics:", error);
        });
    };

    fetchMetrics(); // Fetch metrics immediately
    const interval = setInterval(fetchMetrics, 15000); // Fetch metrics every 15 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [deviceId, metric, credentials]); // Add credentials to the dependency array

  return (
    <div className="bg-[#3C5B6F] pb-15 w-100 h-80 rounded-lg shadow-lg mt-10">
      <h2 className="text-center text-xl font-semibold mb-4">
        {metric.charAt(0).toUpperCase() + metric.slice(1)} for Device:{" "}
        {deviceId}
      </h2>
      <Line
        data={{
          labels: graphData.labels,
          datasets: [
            {
              label: metric.charAt(0).toUpperCase() + metric.slice(1),
              data: graphData.data,
              borderColor: "yellow",
              backgroundColor: "rgba(186, 190, 74, 0.3)",
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

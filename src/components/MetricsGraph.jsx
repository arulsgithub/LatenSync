import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function MetricsGraph({ deviceId, metric }) {
  const [graphData, setGraphData] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetch(`http://localhost:8080/api/metrics/device/${deviceId}`)
      .then((res) => res.json())
      .then((metrics) => {
        const labels = metrics.map((m) =>
          new Date(m.timestamp).toLocaleTimeString()
        );

        const metricData = metrics.map((m) => m[metric]);

        setGraphData({
          labels,
          data: metricData,
        });
      });
  }, [deviceId, metric]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
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
              borderColor: "red",
              fill: false,
            },
          ],
        }}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function MetricsGraph({ deviceId, metric }) {
  const [graphData, setGraphData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`http://localhost:8080/api/metrics/device/${deviceId}`)
        .then((res) => res.json())
        .then((metrics) => {
          const recentMetrics = metrics.slice(-20);
          const labels = recentMetrics.map((_, index) => index * 5);

          const metricData = metrics.map((m) => m[metric]);

          setGraphData({
            labels,
            data: metricData,
          });
        });
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);

    return () => clearInterval(interval);
  }, [deviceId, metric]);

  return (
    <div className="bg-[#3C5B6F] p-6 w-100 h-80 rounded-lg shadow-lg mt-6">
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

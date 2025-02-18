import { useState } from "react";
import MetricsTable from "../components/MetricsTable";
import MetricsGraph from "../components/MetricsGraph";

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Network Metrics Dashboard
      </h1>
      <MetricsTable
        setSelectedDevice={setSelectedDevice}
        setSelectedMetric={setSelectedMetric}
      />
      {selectedDevice && selectedMetric && (
        <MetricsGraph deviceId={selectedDevice} metric={selectedMetric} />
      )}
    </div>
  );
}

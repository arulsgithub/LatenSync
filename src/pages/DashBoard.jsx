import { useState } from "react";
import MetricsTable from "../components/MetricsTable";
import MetricsGraph from "../components/MetricsGraph";
import DownloadMetrics from "../components/DownloadMetrics";
import NavBar from "../components/NavBar";

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  return (
    <div className="bg-[#fff] min-h-screen pl-20 pr-5 text-white">
      <NavBar />
      <h1 className="text-3xl font-bold text-center mb-6 text-[#3C5B6F]">
        Network Metrics Dashboard
      </h1>

      {/* Metrics Table */}
      <MetricsTable
        setSelectedDevice={setSelectedDevice}
        setSelectedMetric={setSelectedMetric}
      />

      {/* Graph and Download Metrics Section */}
      <div className="grid grid-cols-2  gap-10 ">
        {/* Left Side: Metrics Graph */}
        <div className="flex-1 items-centre bg-[#fff] p-6  mb-10 pb-2">
          {selectedDevice && selectedMetric && (
            <MetricsGraph deviceId={selectedDevice} metric={selectedMetric} />
          )}
        </div>

        {/* Right Side: Download Metrics */}
        <div className="bg-[#fff] p-6 mt-10">
          <DownloadMetrics />
        </div>
      </div>
    </div>
  );
}

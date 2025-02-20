import DeviceMetrics from "../components/DeviceMetrics";

export default function DevicePage() {
  return (
    <div className="flex-1 p-5 ml-16 bg-[#153448] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Device Metrics Dashboard</h1>
      <DeviceMetrics />
    </div>
  );
}

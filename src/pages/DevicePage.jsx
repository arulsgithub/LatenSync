import DeviceMetrics from "../components/DeviceMetrics";
import NavBar from "../components/NavBar";

export default function DevicePage() {
  return (
    <div className="flex-1 p-5 ml-16 bg-[#fff] text-[#3C5B6F] min-h-screen">
      <NavBar />
      <h1 className="text-3xl font-bold mb-4">Device Metrics Dashboard</h1>

      <DeviceMetrics />
    </div>
  );
}

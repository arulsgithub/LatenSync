export default function DeviceCard({ device }) {
  return (
    <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg text-center w-1/3 mx-auto">
      <div className="absolute top-0 left-0 right-0 h-4 bg-red-500 rounded-t-lg"></div>
      <h2 className="text-2xl font-semibold">{device.deviceName}</h2>
      <p className="text-gray-400">Model: {device.model}</p>
      <p className="text-gray-400">Status: {device.status}</p>
      <p className="text-gray-400">IP Address: {device.ipAddress}</p>
    </div>
  );
}

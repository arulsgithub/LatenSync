import { useEffect, useState } from "react";
import axios from "axios";
import DeviceForm from "../components/DeviceForm";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    device_id: "",
    device_name: "",
    device_type: "",
    ip_addr: "",
    mac_addr: "",
    device_status: "",
  });

  // Fetch all devices
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/devices")
      .then((response) => setDevices(response.data))
      .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  // Add a new device
  const addDevice = () => {
    axios
      .post("http://localhost:8080/api/devices/add", newDevice)
      .then(() => {
        alert("Device added successfully!");
        setDevices([...devices, newDevice]);
        setNewDevice({
          device_id: "",
          device_name: "",
          device_type: "",
          ip_addr: "",
          mac_addr: "",
          device_status: "",
        });
      })
      .catch((error) => console.error("Error adding device:", error));
  };

  // Delete a device
  const deleteDevice = (id) => {
    axios
      .delete(`http://localhost:8080/api/devices/${id}`)
      .then(() => {
        alert("Device deleted!");
        setDevices(devices.filter((device) => device.device_id !== id));
      })
      .catch((error) => console.error("Error deleting device:", error));
  };

  return (
    <div>
      <DeviceForm></DeviceForm>

      {/*<div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Device List</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">IP Address</th>
              <th className="border p-2">MAC Address</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.device_id} className="text-center">
                <td className="border p-2">{device.device_id}</td>
                <td className="border p-2">{device.device_name}</td>
                <td className="border p-2">{device.device_type}</td>
                <td className="border p-2">{device.ip_addr}</td>
                <td className="border p-2">{device.mac_addr}</td>
                <td className="border p-2">{device.device_status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteDevice(device.device_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Devices;

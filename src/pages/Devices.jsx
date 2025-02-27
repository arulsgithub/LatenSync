import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // Import the useAuth hook
import DeviceForm from "../components/DeviceForm";
import NavBar from "../components/NavBar";
import UploadDevice from "../components/UploadDevice";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    device_id: "",
    device_name: "",
    device_type: "",
    ip_addr: "",
    mac_addr: "",
    location: "",

    user_name: "",
  });

  const { credentials, isAuthenticated } = useAuth(); // Get credentials and authentication status

  // Fetch all devices
  useEffect(() => {
    if (!isAuthenticated()) {
      console.error("Authentication required. Please log in.");
      return;
    }

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    axios
      .get("http://localhost:8080/api/devices", {
        headers: {
          Authorization: authHeader, // Include the Authorization header
        },
      })
      .then((response) => {
        console.log("Devices fetched successfully:", response.data);
        setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        if (error.response && error.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
      });
  }, [credentials, isAuthenticated]); // Add credentials and isAuthenticated to the dependency array

  // Add a new device
  const addDevice = () => {
    if (!isAuthenticated()) {
      console.error("Authentication required. Please log in.");
      return;
    }

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    axios
      .post("http://localhost:8080/api/devices/add", newDevice, {
        headers: {
          Authorization: authHeader, // Include the Authorization header
        },
      })
      .then(() => {
        alert("Device added successfully!");
        setDevices([...devices, newDevice]);
        setNewDevice({
          device_id: "",
          device_name: "",
          device_type: "",
          ip_addr: "",
          mac_addr: "",
          location: "",
          user_name: "",
        });
      })
      .catch((error) => {
        console.error("Error adding device:", error);
        if (error.response && error.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
      });
  };

  // Delete a device
  const deleteDevice = (id) => {
    if (!isAuthenticated()) {
      console.error("Authentication required. Please log in.");
      return;
    }

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    axios
      .delete(`http://localhost:8080/api/devices/${id}`, {
        headers: {
          Authorization: authHeader, // Include the Authorization header
        },
      })
      .then(() => {
        alert("Device deleted!");
        setDevices(devices.filter((device) => device.device_id !== id));
      })
      .catch((error) => {
        console.error("Error deleting device:", error);
        if (error.response && error.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
      });
  };

  return (
    <div>
      <NavBar />
      <h1 className="text-center text-[#3C5B6F] bg-[#fff] pt-10 poppins-bold text-[25px]">
        Device management
      </h1>
      <div className="flex flex-row items-center justify-between bg-[#fff]">
        <div className="ml-20">
          <DeviceForm />
        </div>
        <div className="mr-20">
          <UploadDevice />
        </div>
      </div>
      {/* Uncomment this section if you want to display the device list */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
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

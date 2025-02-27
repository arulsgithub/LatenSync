import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { TiDeviceDesktop, TiUser } from "react-icons/ti";
import { IoIosAddCircle } from "react-icons/io";
import { FaTrash } from "react-icons/fa"; // Import trash bin icon
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const [devicesCount, setDevicesCount] = useState(null);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const { credentials, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.error("Authentication required. Please log in.");
      return;
    }

    const authHeader = `Basic ${credentials}`;

    axios
      .get("http://localhost:8080/api/devices/count", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        setDevicesCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices count:", error);
      });

    axios
      .get("http://localhost:8080/currentUser", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        setUserType(response.data.user_type);
        setCurrentUsername(response.data.user_name);
      })
      .catch((error) => {
        console.error("Error fetching current user data:", error);
      });
  }, [credentials, isAuthenticated]);

  const fetchDeviceDetails = () => {
    const authHeader = `Basic ${credentials}`;

    axios
      .get("http://localhost:8080/api/devices/all", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching device details:", error);
      });
  };

  const fetchUsersAndDevices = () => {
    const authHeader = `Basic ${credentials}`;

    axios
      .get("http://localhost:8080/get", {
        headers: {
          Authorization: authHeader,
        },
      })
      .then((response) => {
        const usersData = response.data;

        const fetchDevicesPromises = usersData.map((user) => {
          return axios
            .get(`http://localhost:8080/api/devices/user/${user.user_name}`, {
              headers: {
                Authorization: authHeader,
              },
            })
            .then((userResponse) => {
              return {
                ...user,
                devices: userResponse.data || [],
              };
            })
            .catch((error) => {
              console.error(
                `Error fetching devices for user ${user.user_name}:`,
                error
              );
              return user;
            });
        });

        Promise.all(fetchDevicesPromises).then((usersWithDevices) => {
          setUsers(usersWithDevices);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const removeUser = (userName) => {
    const authHeader = `Basic ${credentials}`;

    axios
      .delete(`http://localhost:8080/${userName}`, {
        headers: {
          Authorization: authHeader,
        },
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_name !== userName)
        );
      })
      .catch((error) => {
        console.error("Error removing user:", error);
      });
  };

  const removeDevice = (deviceId) => {
    const authHeader = `Basic ${credentials}`;

    axios
      .delete(`http://localhost:8080/api/devices/${deviceId}`, {
        headers: {
          Authorization: authHeader,
        },
      })
      .then(() => {
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.device_id !== deviceId)
        );
      })
      .catch((error) => {
        console.error("Error removing device:", error);
      });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-[#fff] min-h-screen text-white">
      <NavBar />
      <div className="flex justify-end p-5 pb-5">
        <div className="flex items-center space-x-4">
          <span className="poppins-semibold">Welcome, {currentUsername}</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-4 gap-10 w-full max-w-6xl text-white text-center mb-10">
          <div
            className="bg-[#3C5B6F] p-4 rounded-lg cursor-pointer"
            onClick={fetchDeviceDetails}
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg">Devices</h3>
              <TiDeviceDesktop className="text-5xl mt-5" />
            </div>
            <p className="text-center text-[20px] mt-5">
              {devicesCount || "N/A"} devices
            </p>
          </div>
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-2">Add device</h3>
              <button
                className="text-center text-[20px] mt-5 bg-[#3C5B6F] p-2 rounded-lg"
                onClick={() => alert("Add Device")}
              >
                <IoIosAddCircle className="text-5xl" />
              </button>
            </div>
          </div>
          {userType === "admin" && (
            <div
              className="bg-[#3C5B6F] p-4 rounded-lg cursor-pointer"
              onClick={fetchUsersAndDevices}
            >
              <div className="flex flex-col items-center">
                <h3 className="text-lg">Users</h3>
                <TiUser className="text-5xl mt-5" />
              </div>
            </div>
          )}
        </div>
        {devices.length > 0 && (
          <div className="w-full max-w-6xl px-10 mt-10">
            <table className="w-full bg-[#3C5B6F] rounded-lg text-white">
              <thead>
                <tr className="w-full bg-[#3C5B6F] rounded-lg text-white">
                  <th className="p-3">Device ID</th>
                  <th className="p-3">Device Name</th>
                  <th className="p-3">Device Type</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">MAC Address</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr
                    key={device.device_id}
                    className="bg-white border-solid text-black"
                  >
                    <td className="p-3 text-center">{device.device_id}</td>
                    <td className="p-3 text-center">{device.device_name}</td>
                    <td className="p-3 text-center">{device.device_type}</td>
                    <td className="p-3 text-center">{device.ip_addr}</td>
                    <td className="p-3 text-center">{device.mac_addr}</td>
                    <td className="p-3 text-center">{device.location}</td>
                    <td className="p-3 text-center">{device.user_name}</td>
                    <td className="p-3 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeDevice(device.device_id)}
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {users && users.length > 0 && (
          <div className="w-full max-w-6xl px-10 mt-10">
            <table className="w-full bg-[#3C5B6F] rounded-lg text-white">
              <thead>
                <tr className="w-full bg-[#3C5B6F] rounded-lg text-white">
                  <th className="p-3">Username</th>
                  <th className="p-3">User Type</th>
                  <th className="p-3">Devices</th>
                  <th className="p-3">Actions</th>{" "}
                  {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.user_name}
                    className="bg-white border-solid text-black"
                  >
                    <td className="p-3 text-center">{user.user_name}</td>
                    <td className="p-3 text-center">{user.user_type}</td>
                    <td className="p-3 text-center">
                      {user.devices && user.devices.length > 0
                        ? user.devices
                            .map((device) => device.device_name)
                            .join(", ")
                        : "No devices"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeUser(user.user_name)} // Call removeUser on click
                      >
                        <FaTrash className="text-xl" /> {/* Delete icon */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

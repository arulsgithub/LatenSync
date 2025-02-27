import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { TiDeviceDesktop } from "react-icons/ti";
import { IoIosAddCircle } from "react-icons/io";
import { useAuth } from "../components/AuthContext"; // Import the useAuth hook
function Home() {
  const [devicesCount, setDevicesCount] = useState(null);
  const { credentials, isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated()) {
      console.error("Authentication required. Please log in.");
      return;
    }

    const authHeader = `Basic ${credentials}`; // Prepare the Authorization header

    axios
      .get("http://localhost:8080/api/devices/count", {
        headers: {
          Authorization: authHeader, // Include the Authorization header
        },
      })
      .then((response) => {
        console.log("Devices count received:", response.data);
        setDevicesCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices count:", error);
        if (error.response && error.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
      });
  }, [credentials, isAuthenticated]); // Add credentials and isAuthenticated to the dependency array

  return (
    <div className="bg-[#fff] min-h-screen pl-20 pr-5 text-white">
      <NavBar />

      {/* Flex container to align text to the right */}
      <div className="flex justify-end p-5 pb-25">
        <h1 className="poppins-semibold">Hello world</h1>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-4 gap-10 w-250 h-40 text-white text-cente  mb-10">
          <div className="bg-[#3C5B6F]  p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-[15]">Devices</h3>
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
                <IoIosAddCircle className="text-9xl pb-15 " />
              </button>
            </div>
          </div>
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-2">IP Address</h3>
              {/* <IoIosGlobe className="text-5xl mt-3" /> */}
            </div>
            {/* <p className="text-center text-[20px] mt-5">
                {deviceDetails.ip_addr || "N/A"}
              </p> */}
          </div>
          <div className="bg-[#3C5B6F] p-4 rounded-lg">
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-2">MAC Address</h3>
              {/* <AiFillApi className="text-5xl mt-3" /> */}
            </div>
            {/* <p className="text-center text-[20px] mt-5">
                {deviceDetails.mac_addr || "N/A"}
              </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

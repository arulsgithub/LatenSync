import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import router from "../assets/router.svg";

function Home() {
  const [devicesCount, setDevicesCount] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/devices/count")
      .then((response) => setDevicesCount(response.data))
      .catch((error) => console.error("Error fetching devices:", error));
  }, []); // Dependency array should be [] (not "")

  return (
    <div className="bg-[#fff] min-h-screen pl-20 pr-5 text-white">
      <NavBar />

      {/* Flex container to align text to the right */}
      <div className="flex justify-end p-5 pb-25">
        <h1 className="poppins-semibold">Hello world</h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-5">
        <div className="grid grid-cols-2 gap-2 bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2 w-50 h-50">
            Your Devices {devicesCount !== null ? devicesCount : "Loading..."}
          </h3>
          <img src={router} alt="router" className="w-50 h-50 color-white" />
        </div>
        <div className="bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2"></h3>
        </div>
        <div className="bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2"></h3>
        </div>
        <div className="bg-[#3C5B6F] p-4 rounded-lg">
          <h3 className="text-lg mb-2"></h3>
        </div>
      </div>
    </div>
  );
}

export default Home;

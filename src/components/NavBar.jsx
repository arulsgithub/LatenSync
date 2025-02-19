import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { TiCloudStorage, TiChartPie } from "react-icons/ti";
import { TbAlertCircle } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io"; // Importing icons
import "../css/navbar.css"; // Ensure you style accordingly

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-[#3C5B6F] text-white h-screen p-5 fixed top-0 left-0 transform ${
          isOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          className="text-white mb-5 pr-2 pb-20 focus:outline-none space-y-15"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoMdArrowRoundBack size={24} /> : <FaBars size={24} />}
        </button>

        {/* Sidebar Links */}
        <div className="flex flex-col absolute left-2 pl-1 space-x-5 space-y-15 poppins-bold">
          <Link to="/" className="nav-link p-20 ">
            {isOpen ? (
              <div className="flex flex-row">
                <FaHome size={24} />
                <p className="pl-2 pt-1">Home</p>
              </div>
            ) : (
              <FaHome size={24} />
            )}
          </Link>
          <Link to="/devices" className="nav-link">
            {isOpen ? (
              <div className="flex flex-row">
                <TiCloudStorage size={24} />
                <p className="pl-2 ">Device</p>
              </div>
            ) : (
              <TiCloudStorage size={24} />
            )}
          </Link>
          <Link to="/alerts" className="nav-link">
            {isOpen ? (
              <div className="flex flex-row">
                <TbAlertCircle size={24} />
                <p className="pl-2 pl-2">Alerts</p>
              </div>
            ) : (
              <TbAlertCircle size={24} />
            )}
          </Link>
          <Link to="/dashboard" className="nav-link">
            {isOpen ? (
              <div className="flex flex-row">
                <TiChartPie size={24} />
                <p className="pl-2 pl-2">Dashboard</p>
              </div>
            ) : (
              <TiChartPie size={24} />
            )}
          </Link>
        </div>
      </div>

      {/* Main Content Placeholder */}
      <div className="flex-1 p-5 ml-16">
        <h1 className="text-2xl">Main Content</h1>
      </div>
    </div>
  );
}

export default NavBar;

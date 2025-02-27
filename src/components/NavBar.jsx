import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaSignOutAlt } from "react-icons/fa";
import { TiCloudStorage, TiChartPie } from "react-icons/ti";
import { TbAlertCircle } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";
import "../css/navbar.css";
import { LuChartNoAxesCombined } from "react-icons/lu";

import { useAuth } from "../components/AuthContext";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        <div className="flex flex-col space-y-4">
          {" "}
          {/* Reduced space-y from space-y-15 to space-y-4 */}
          <Link to="/" className="nav-link">
            {isOpen ? (
              <div className="flex items-center gap-3">
                {" "}
                {/* Reduced gap between icon and text */}
                <FaHome size={24} /> {/* Reduced icon size */}
                <p>Home</p>
              </div>
            ) : (
              <FaHome size={24} />
            )}
          </Link>
          <Link to="/device/:id" className="nav-link">
            {isOpen ? (
              <div className="flex items-center gap-3">
                <LuChartNoAxesCombined size={24} />
                <p>Performance</p>
              </div>
            ) : (
              <LuChartNoAxesCombined size={24} />
            )}
          </Link>
          <Link to="/devices" className="nav-link">
            {isOpen ? (
              <div className="flex items-center gap-3">
                <TiCloudStorage size={24} />
                <p>Device</p>
              </div>
            ) : (
              <TiCloudStorage size={24} />
            )}
          </Link>
          <Link to="/alerts" className="nav-link">
            {isOpen ? (
              <div className="flex items-center gap-3">
                <TbAlertCircle size={24} />
                <p>Alerts</p>
              </div>
            ) : (
              <TbAlertCircle size={24} />
            )}
          </Link>
          <Link to="/dashboard" className="nav-link">
            {isOpen ? (
              <div className="flex items-center gap-3">
                <TiChartPie size={24} />
                <p>Dashboard</p>
              </div>
            ) : (
              <TiChartPie size={24} />
            )}
          </Link>
          {/* Logout Button */}
          <button className="nav-link text-left w-full" onClick={handleLogout}>
            {isOpen ? (
              <div className="flex items-center gap-3">
                <FaSignOutAlt size={24} />
                <p>Logout</p>
              </div>
            ) : (
              <FaSignOutAlt size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

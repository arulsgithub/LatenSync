import "./css/App.css";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Alert from "./pages/Alert";
import DashBoard from "./pages/DashBoard";
import DevicePage from "./pages/DevicePage";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />
      <main className="poppins-semibold bg-[#153448]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/alerts" element={<Alert />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/devicepage" element={<DevicePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

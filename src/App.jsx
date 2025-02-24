import "./css/App.css";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Alert from "./pages/Alert";
import DashBoard from "./pages/DashBoard";
import DevicePage from "./pages/Devicepage";
import SignIn from "./pages/SignIn";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <main className="poppins-semibold bg-[#153448]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/alerts" element={<Alert />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/devicepage" element={<DevicePage />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import "./css/App.css";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Alert from "./pages/Alert";
import DashBoard from "./pages/DashBoard";
import DevicePage from "./pages/DevicePage";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DeviceMetrics from "./components/DeviceMetrics";
import SignIn from "./pages/SignIn";
import NavBar from "./components/NavBar";

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* Only show NavBar if user is authenticated */}
      {user && <NavBar />}

      <Routes>
        <Route path="/" element={<SignIn />} />
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/metrics"
          element={
            <ProtectedRoute>
              <DeviceMetrics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Devices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alert />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/device/:id"
          element={
            <ProtectedRoute>
              <DevicePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

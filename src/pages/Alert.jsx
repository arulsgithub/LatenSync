import React from "react";
// import useWebSocket from "../components/websocket";
import NavBar from "../components/NavBar";

const Alert = () => {
  const alerts = useWebSocket();

  return (
    <div className="flex-1 p-5 ml-16 bg-[#fff] text-[#3C5B6F] min-h-screen">
      <NavBar />
      <h2>Notifications</h2>
      {/* <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Alert;

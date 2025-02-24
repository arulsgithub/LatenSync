import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const useWebSocket = () => {
  const [alerts, setAlerts] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to all alerts
        client.subscribe("/topic/alerts", (message) => {
          setAlerts((prev) => [...prev, message.body]);
        });

        // Subscribe to private alerts for specific devices
        const deviceId = "DEVICE_ID"; // Replace with actual device ID from user
        client.subscribe(`/user/${deviceId}/alerts`, (message) => {
          setAlerts((prev) => [...prev, message.body]);
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return alerts;
};

export default useWebSocket;

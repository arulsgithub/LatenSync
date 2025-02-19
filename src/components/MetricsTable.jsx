import { useState, useEffect } from "react";
import axios from "axios";

export default function MetricsTable({ setSelectedDevice, setSelectedMetric }) {
  const [metrics, setMetrics] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]);

  // Fetch all device IDs
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/devices")
      .then((response) => {
        console.log("Device IDs:", response.data);
        setDeviceIds(response.data);
      })
      .catch((error) => console.error("Error fetching device IDs:", error));
  }, []);

  // Start streaming and collect data
  useEffect(() => {
    if (deviceIds.length === 0) return;

    const eventSources = deviceIds.map((deviceId) => {
      axios
        .post(`http://localhost:8080/api/metrics/start/${deviceId}`)
        .then(() => console.log(`Started stream for ${deviceId}`))
        .catch((error) =>
          console.error(`Error starting stream for ${deviceId}:`, error)
        );

      const eventSource = new EventSource(
        `http://localhost:8080/api/metrics/stream/${deviceId}`
      );

      eventSource.onmessage = (event) => {
        console.log(`Received Data for ${deviceId}:`, event.data);
        try {
          const data = JSON.parse(event.data);
          setMetrics((prevMetrics) => {
            const updated = [...prevMetrics];
            const index = updated.findIndex(
              (m) => m.deviceId === data.deviceId
            );

            if (index !== -1) {
              updated[index] = data;
            } else {
              updated.push(data);
            }
            return updated;
          });
        } catch (error) {
          console.error(`Error parsing SSE data for ${deviceId}:`, error);
        }
      };

      eventSource.onerror = (error) => {
        console.error(`SSE Error for ${deviceId}:`, error);
        eventSource.close();
      };

      return eventSource;
    });

    return () => {
      eventSources.forEach((source) => source.close());
    };
  }, [deviceIds]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg ">
      <table className=" w-full border-collapse text-white">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-3">Device ID</th>
            <th className="p-3">Latency</th>
            <th className="p-3">Packet Loss</th>
            <th className="p-3">Throughput</th>
            <th className="p-3">Jitter</th>
          </tr>
        </thead>
        <tbody>
          {metrics.length > 0 ? (
            metrics.map((m) => (
              <tr
                key={m.deviceId}
                className="cursor-pointer hover:bg-gray-700 text-white"
              >
                <td
                  className="p-3"
                  onClick={() => {
                    setSelectedDevice(m.deviceId);
                    setSelectedMetric(null);
                  }}
                >
                  {m.deviceId}
                </td>
                <td
                  className="p-3 cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setSelectedDevice(m.deviceId);
                    setSelectedMetric("latency");
                  }}
                >
                  {m.latency}
                </td>
                <td
                  className="p-3 cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setSelectedDevice(m.deviceId);
                    setSelectedMetric("packet_loss");
                  }}
                >
                  {m.packet_loss}
                </td>
                <td
                  className="p-3 cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setSelectedDevice(m.deviceId);
                    setSelectedMetric("throughput");
                  }}
                >
                  {m.throughput}
                </td>
                <td
                  className="p-3 cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setSelectedDevice(m.deviceId);
                    setSelectedMetric("jitter");
                  }}
                >
                  {m.jitter}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-white" colSpan="5">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("ambulance-alert", msg =>
      addAlert("ambulance", msg.message)
    );

    socket.on("accident-alert", msg =>
      addAlert("accident", msg.message)
    );
  }, []);

  const addAlert = (type, message) => {
    setAlerts(prev => [
      {
        id: Date.now(),
        type,
        message,
        time: new Date().toLocaleTimeString(),
        level: type === "accident" ? "HIGH" :
               type === "ambulance" ? "CRITICAL" : "MEDIUM"
      },
      ...prev
    ]);
  };

  const getColor = (type) => {
    if (type === "ambulance") return "#ff3b3b";
    if (type === "accident") return "#ffcc00";
    return "#00d9ff";
  };

  return (
    <div className="card" style={{ padding: "20px" }}>
      <h3>🚨 Real-Time Alerts</h3>

      {alerts.length === 0 && (
        <p style={{ opacity: 0.6 }}>No alerts yet.</p>
      )}

      <div style={{ marginTop: "10px", maxHeight: "350px", overflowY: "auto" }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderLeft: `6px solid ${getColor(alert.type)}`,
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "10px",
              position: "relative",
              boxShadow: "0 0 12px rgba(255,0,0,0.15)"
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "15px" }}>
              {alert.type === "ambulance" ? "🚑 Ambulance Alert" :
               alert.type === "accident" ? "💥 Accident Detected" :
               "⚠ General Alert"}
            </div>

            <div
              style={{
                opacity: 0.8,
                marginTop: "5px",
                marginBottom: "5px"
              }}
            >
              {alert.message}
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.5,
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>{alert.time}</span>
              <span
                style={{
                  background: getColor(alert.type),
                  color: "#000",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "700"
                }}
              >
                {alert.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

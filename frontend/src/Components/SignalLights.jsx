import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function SignalLights() {
  const [signals, setSignals] = useState({
    lane1: "RED",
    lane2: "RED",
    lane3: "RED",
    lane4: "RED"
  });

  useEffect(() => {
    socket.on("signal-update", (data) => setSignals(data));
  }, []);

  const getColor = (val) =>
    val === "GREEN" ? "#00ff88" :
    val === "YELLOW" ? "#ffcc00" : "#ff4444";

  return (
    <div className="card">
      <h3>🚦 Signal Status</h3>

      {Object.entries(signals).map(([lane, color]) => (
        <div key={lane} style={{ marginTop: 10, marginBottom: 15 }}>
          <strong>{lane.toUpperCase()}:</strong>

          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              borderRadius: "50%",
              marginLeft: 10,
              background: getColor(color),
              boxShadow: `0 0 8px ${getColor(color)}`
            }}
          ></span>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import LiveFeed from "../pages/LiveFeed";     // ✅ FIXED
import SignalLights from "../components/SignalLights";
import AlertsPanel from "../components/AlertsPanel";
import LaneGraph from "../components/LaneGraph";
import TrafficChart from "../components/TrafficChart";

const socket = io("http://localhost:3000");

export default function Dashboard() {
  const [lanes, setLanes] = useState({
    lane1: 0,
    lane2: 0,
    lane3: 0,
    lane4: 0
  });

  useEffect(() => {
    socket.on("lane-data-update", (data) => setLanes(data));
  }, []);

  return (
    <div className="content">
      <LiveFeed />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        <SignalLights />
        <LaneGraph lanes={lanes} />
        <AlertsPanel />
      </div>

      <TrafficChart />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function TrafficGraph() {
  const [trafficData, setTrafficData] = useState([]);

  // Receive live updates
  useEffect(() => {
    socket.on("traffic-update", (payload) => {
      const { timestamp, vehicleCount } = payload;

      const point = {
        time: new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        vehicles: vehicleCount
      };

      setTrafficData(prev => [...prev.slice(-29), point]);
    });

    return () => socket.off("traffic-update");
  }, []);

  const average =
    trafficData.length > 0
      ? trafficData.reduce((s, d) => s + d.vehicles, 0) / trafficData.length
      : 0;

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={trafficData}>
          <defs>
            <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffa500" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffa500" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#2c2f3c" />
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="vehicles"
            stroke="#ffa500"
            fill="url(#colorVehicles)"
            strokeWidth={3}
          />

          <ReferenceLine
            y={average}
            stroke="#facc15"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ color: "#facc15", textAlign: "center" }}>
        🚦 Real-time Traffic Flow
      </div>
    </div>
  );
}

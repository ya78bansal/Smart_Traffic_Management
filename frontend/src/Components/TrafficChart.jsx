import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

export default function TrafficChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("traffic-update", (payload) => {
      const point = {
        time: payload.timestamp,
        vehicles: payload.vehicleCount
      };
      setData(prev => [...prev.slice(-29), point]);
    });
  }, []);

  const avg = data.length
    ? data.reduce((s, d) => s + d.vehicles, 0) / data.length
    : 0;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>

        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffa500" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffa500" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="time" stroke="#fff" />
        <YAxis stroke="#fff" domain={[0, "dataMax + 5"]} />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="vehicles"
          stroke="#ffa500"
          fill="url(#color)"
          strokeWidth={3}
        />

        <ReferenceLine y={avg} stroke="#facc15" strokeDasharray="4 4" />

      </AreaChart>
    </ResponsiveContainer>
  );
}

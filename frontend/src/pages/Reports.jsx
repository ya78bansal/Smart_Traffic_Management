import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer
} from "recharts";

const socket = io("http://localhost:3000");

export default function Reports() {
  const [trafficData, setTrafficData] = useState([]);
  const [latestCounts, setLatestCounts] = useState({
    car: 0, bus: 0, bike: 0, person: 0
  });

  useEffect(() => {
    socket.on("traffic-update", (data) => {
      setLatestCounts(data.raw);

      setTrafficData((prev) => [
        ...prev.slice(-19),
        { time: new Date().toLocaleTimeString(), count: data.vehicleCount }
      ]);
    });
  }, []);

  const pieData = [
    { name: "Cars", value: latestCounts.car },
    { name: "Buses", value: latestCounts.bus },
    { name: "Bikes", value: latestCounts.bike },
    { name: "Pedestrians", value: latestCounts.person }
  ];

  const COLORS = ["#00ff88", "#ffcc00", "#00d9ff", "#ff4444"];

  // Fake coordinates for heatmap pins (can connect real GPS data later)
  const heatmapPoints = [
    { lat: 28.6139, lng: 77.2090, level: 80 },  // Delhi
    { lat: 19.0760, lng: 72.8777, level: 50 },  // Mumbai
    { lat: 12.9716, lng: 77.5946, level: 65 },  // Bangalore
    { lat: 22.5726, lng: 88.3639, level: 40 }   // Kolkata
  ];

  return (
    <div className="content">
      <h2>📊 Traffic Analytics & Reports</h2>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
        marginTop: 20
      }}>
        <div className="card">
          <h3>Total Vehicles</h3>
          <h1>{latestCounts.car + latestCounts.bus + latestCounts.bike + latestCounts.person}</h1>
        </div>

        <div className="card">
          <h3>Cars</h3>
          <h1 style={{ color: "#00ff88" }}>{latestCounts.car}</h1>
        </div>

        <div className="card">
          <h3>Buses</h3>
          <h1 style={{ color: "#ffcc00" }}>{latestCounts.bus}</h1>
        </div>

        <div className="card">
          <h3>Bikes / Pedestrians</h3>
          <h1 style={{ color: "#00d9ff" }}>
            {latestCounts.bike + latestCounts.person}
          </h1>
        </div>
      </div>

      {/* Line Chart */}
      <div className="card" style={{ marginTop: 30 }}>
        <h3>📈 Traffic Flow Over Time</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trafficData}>
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis stroke="#fff" />
            <ReTooltip />
            <Line type="monotone" dataKey="count" stroke="#00ff88" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie + Bar Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        
        <div className="card">
          <h3>🚗 Vehicle Type Ratio</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>📊 Lane Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { lane: "Cars", count: latestCounts.car },
              { lane: "Buses", count: latestCounts.bus },
              { lane: "Bikes", count: latestCounts.bike },
              { lane: "Pedestrians", count: latestCounts.person }
            ]}>
              <XAxis dataKey="lane" stroke="#fff" />
              <YAxis stroke="#fff" />
              <ReTooltip />
              <Bar dataKey="count" fill="#00d9ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Heatmap Section */}
      <div className="card" style={{ marginTop: 30 }}>
        <h3>🗺 Traffic Intensity Heatmap</h3>

        <MapContainer
          center={[23.2599, 77.4126]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "300px", borderRadius: "10px", marginTop: "15px" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {heatmapPoints.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lng]}
              radius={p.level / 10}
              pathOptions={{
                color: p.level > 60 ? "red" : p.level > 40 ? "orange" : "green"
              }}
            >
              <Tooltip>
                Traffic Level: {p.level}%
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}

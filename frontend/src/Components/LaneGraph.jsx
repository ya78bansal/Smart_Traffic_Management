import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function LaneGraph({ lanes }) {
  const data = [
    { lane: "Cars", value: lanes.lane1 },
    { lane: "Buses", value: lanes.lane2 },
    { lane: "Bikes", value: lanes.lane3 },
    { lane: "Pedestrians", value: lanes.lane4 }
  ];

  return (
    <div className="card">
      <h3>📈 Lane Traffic</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="lane" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="value" fill="#00ff88" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

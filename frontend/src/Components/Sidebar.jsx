import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>GarunEye</h2>  {/* ✅ Updated name */}

      <NavLink to="/">🏠 Dashboard</NavLink>
      <NavLink to="/live">🎥 Live Feed</NavLink>
      <NavLink to="/reports">📊 Reports</NavLink>
      <NavLink to="/alerts">⚠ Alerts</NavLink>
      <NavLink to="/settings">⚙ Settings</NavLink>
    </div>
  );
}

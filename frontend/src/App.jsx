import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LiveFeed from "./pages/LiveFeed";   // ✅ FIXED PATH

export default function App() {
  return (
    <BrowserRouter>
      <div className="traffic-dashboard">
        <Sidebar />
        <div className="main">
          <Navbar />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/live" element={<LiveFeed />} />   {/* also FIXED */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

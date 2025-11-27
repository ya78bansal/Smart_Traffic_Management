import { useEffect, useState } from "react";

export default function Settings() {
  // Load saved settings or default values
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem("trafficSettings")) || {
      carThreshold: 20,
      busThreshold: 10,
      bikeThreshold: 15,
      alertSound: true,
      animations: true,
      theme: "dark",
      backendUrl: "http://localhost:3000",
      cameraSource: "CAM-001",
      cameraResolution: "1080p",
      cameraFPS: 30
    };
  });

  // Save to Local Storage when updated
  useEffect(() => {
    localStorage.setItem("trafficSettings", JSON.stringify(settings));
  }, [settings]);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="content">
      <h2>⚙ Smart Traffic System Settings</h2>

      {/* TRAFFIC THRESHOLDS */}
      <div className="card">
        <h3>🚦 Traffic Signal Thresholds</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          
          {/* Cars */}
          <div>
            <label>Car Threshold</label>
            <input
              type="number"
              value={settings.carThreshold}
              onChange={(e) => update("carThreshold", Number(e.target.value))}
              className="settings-input"
            />
          </div>

          {/* Buses */}
          <div>
            <label>Bus Threshold</label>
            <input
              type="number"
              value={settings.busThreshold}
              onChange={(e) => update("busThreshold", Number(e.target.value))}
              className="settings-input"
            />
          </div>

          {/* Bikes */}
          <div>
            <label>Bike Threshold</label>
            <input
              type="number"
              value={settings.bikeThreshold}
              onChange={(e) => update("bikeThreshold", Number(e.target.value))}
              className="settings-input"
            />
          </div>
        </div>
      </div>

      {/* SYSTEM PREFERENCES */}
      <div className="card">
        <h3>🖥 System Preferences</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

          {/* Theme */}
          <div>
            <label>Theme Mode</label>
            <select
              value={settings.theme}
              onChange={(e) => update("theme", e.target.value)}
              className="settings-input"
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>

          {/* Alert Sound */}
          <div>
            <label>Alert Sound</label>
            <select
              value={settings.alertSound}
              onChange={(e) => update("alertSound", e.target.value === "true")}
              className="settings-input"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          {/* Animation */}
          <div>
            <label>Animations</label>
            <select
              value={settings.animations}
              onChange={(e) => update("animations", e.target.value === "true")}
              className="settings-input"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* CAMERA SETTINGS */}
      <div className="card">
        <h3>🎥 Camera Settings</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

          {/* Camera Source */}
          <div>
            <label>Camera Source</label>
            <select
              value={settings.cameraSource}
              onChange={(e) => update("cameraSource", e.target.value)}
              className="settings-input"
            >
              <option value="CAM-001">CAM-001 (Main Road)</option>
              <option value="CAM-002">CAM-002 (Sector 7)</option>
              <option value="CAM-003">CAM-003 (Highway Turn)</option>
            </select>
          </div>

          {/* Resolution */}
          <div>
            <label>Resolution</label>
            <select
              value={settings.cameraResolution}
              onChange={(e) => update("cameraResolution", e.target.value)}
              className="settings-input"
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4K">4K</option>
            </select>
          </div>

          {/* FPS */}
          <div>
            <label>Frame Rate (FPS)</label>
            <input
              type="number"
              value={settings.cameraFPS}
              onChange={(e) => update("cameraFPS", Number(e.target.value))}
              className="settings-input"
            />
          </div>
        </div>
      </div>

      {/* BACKEND SETTINGS */}
      <div className="card">
        <h3>🔌 Backend Configuration</h3>

        <label>Backend URL</label>
        <input
          type="text"
          value={settings.backendUrl}
          onChange={(e) => update("backendUrl", e.target.value)}
          className="settings-input"
        />

        <button
          className="btn"
          style={{ marginTop: "15px" }}
          onClick={() => {
            fetch(settings.backendUrl)
              .then(() => alert("Backend is reachable ✔"))
              .catch(() => alert("❌ Backend not reachable"));
          }}
        >
          Test Connection
        </button>
      </div>

      {/* SAVE BUTTON */}
      <div className="card" style={{ textAlign: "center" }}>
        <button className="btn" style={{ width: "200px" }}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

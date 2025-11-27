
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");


function getSignalColor(count) {
  if (count >= 20) return "GREEN";
  if (count >= 10) return "YELLOW";
  return "RED";
}

const app = express();
const server = http.createServer(app);


const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "http://localhost:5174"] }
});

app.use(cors());
app.use(express.json());

// ==========================
// SERVE VIDEO FILE
// ==========================
app.use("/video", express.static(path.join(__dirname, "../data")));

// ==========================
// EXPORT CSV REPORT
// ==========================
app.get("/api/export/csv", (req, res) => {
  const filePath = path.join(__dirname, "../data/traffic_total.json");
  if (fs.existsSync(filePath)) {
    res.download(filePath, "traffic_report.csv");
  } else {
    res.status(404).send("No report found.");
  }
});

// ==========================
// BROADCAST TRAFFIC DATA
// ==========================
function broadcastLatestTraffic() {
  const jsonFile = path.join(__dirname, "../data/traffic_total.json");
  if (!fs.existsSync(jsonFile)) return;

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(jsonFile, "utf8"))[0];
  } catch (e) {
    console.log("JSON ERROR", e);
    return;
  }

  const { car, bus, bike, person, timestamp, ambulance, accident } = raw;
  const total = car + bus + bike + person;

  const lanes = {
    lane1: car,
    lane2: bus,
    lane3: bike,
    lane4: person
  };

  const signals = {
    lane1: getSignalColor(lanes.lane1),
    lane2: getSignalColor(lanes.lane2),
    lane3: getSignalColor(lanes.lane3),
    lane4: getSignalColor(lanes.lane4)
  };

  // 🚑 Ambulance override
  if (ambulance === true) {
    signals.lane1 = "GREEN";
    signals.lane2 = "RED";
    signals.lane3 = "RED";
    signals.lane4 = "RED";

    io.emit("ambulance-alert", {
      message: "🚑 Ambulance detected — Lane 1 turned GREEN!"
    });
  }

  // ⚠ Accident Alert
  if (accident === true) {
    io.emit("accident-alert", {
      message: "⚠ Accident detected — Police notified!"
    });
  }

  // Send traffic updates
  io.emit("traffic-update", {
    timestamp,
    vehicleCount: total,
    lanes,
    signals,
    raw
  });

  io.emit("signal-update", signals);
  io.emit("lane-data-update", lanes);
}

// ==========================
// FIXED YOLO RUN FUNCTION
// ==========================
function runYOLO() {
  console.log("Starting YOLO...");

  const ROOT = path.join(__dirname, ".."); // project root

  const videoPath = path.join(ROOT, "data/traffic11.mp4");

  // Run Python as a module to fix import errors
  const python = spawn("python", [
    "-m",
    "src.detect_video",
    videoPath
  ], {
    cwd: ROOT, // run from project root
    env: {
      ...process.env,
      PYTHONPATH: ROOT // allow src.sort import
    }
  });

  python.stdout.on("data", (data) => {
    console.log("[YOLO]", data.toString());
  });

  python.stderr.on("data", (data) => {
    console.error("[YOLO ERROR]", data.toString());
  });

  python.on("close", (code) => {
    console.log("YOLO stopped with code", code);
  });
}

// Start YOLO
runYOLO();

// Broadcast traffic update every second
setInterval(broadcastLatestTraffic, 1000);

// ==========================
// START SERVER
// ==========================
server.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});

// backend/controllers/trafficController.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// GET /api/traffic-data
// Used by frontend (initial load for graph)
exports.getTrafficData = (req, res) => {
  const trafficPath = path.join(__dirname, '../../data/traffic_total.json');

  fs.readFile(trafficPath, 'utf8', (err, raw) => {
    if (err) {
      console.error('Error reading traffic_total.json:', err);
      return res.status(500).json({ error: 'Could not read traffic_total.json' });
    }

    try {
      const parsed = JSON.parse(raw);
      const counts = Array.isArray(parsed) ? parsed[0] : parsed;

      const total =
        (counts.car || 0) +
        (counts.bus || 0) +
        (counts.bike || 0) +
        (counts.person || 0);

      const payload = [
        {
          timestamp: new Date().toISOString(),
          vehicleCount: total
        }
      ];

      res.json(payload);
    } catch (e) {
      console.error('Invalid JSON in traffic_total.json:', e);
      res.status(500).json({ error: 'Invalid JSON in traffic_total.json' });
    }
  });
};

// POST /api/traffic-data/signal-decision
exports.postSignalDecision = (req, res) => {
  const inputData = JSON.stringify({
    lanes: req.body.lanes,
    emergency_flags: req.body.emergency_flags,
    current_green_index: req.body.current_green_index
  });

  const formulaPath = path.join(__dirname, '../../Logic/formula.py');
  const python = spawn('python', [formulaPath, inputData]);

  let result = '';
  let error = '';

  python.stdout.on('data', data => result += data.toString());
  python.stderr.on('data', data => error += data.toString());

  python.on('close', code => {
    if (error) console.error("Python error:", error);

    if (code !== 0 || error) {
      return res.status(500).json({ error: error || "Python process exited with code " + code });
    }
    try {
      res.json(JSON.parse(result));
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON from Python', details: result });
    }
  });
};

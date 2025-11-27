// backend/routes/trafficData.js
const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// Returns latest traffic snapshot for initial graph
router.get('/', trafficController.getTrafficData);

// Already existing
router.post('/signal-decision', trafficController.postSignalDecision);

module.exports = router;

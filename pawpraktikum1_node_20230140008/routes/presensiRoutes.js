const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const reportController = require('../controllers/reportController'); // Pastikan ini ada
const authMiddleware = require('../middleware/authMiddleware');

// Route Check-In & Check-Out
router.post('/check-in', authMiddleware, presensiController.checkIn);
router.post('/check-out', authMiddleware, presensiController.checkOut);

// Route Report
router.get('/report', authMiddleware, reportController.getDailyReport);

module.exports = router;
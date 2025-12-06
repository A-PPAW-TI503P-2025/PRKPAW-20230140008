const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const reportController = require('../controllers/reportController'); 
const authMiddleware = require('../middleware/authMiddleware'); // Kita pakai nama ini

// --- ROUTE CHECK-IN ---
router.post('/check-in', 
    authMiddleware, // Sesuai import di atas
    presensiController.upload.single('image'), // Middleware Multer
    presensiController.checkIn // Sesuai nama fungsi di controller (huruf kecil)
);

// --- ROUTE CHECK-OUT ---
router.post('/check-out', authMiddleware, presensiController.checkOut);

// --- ROUTE REPORT ---
router.get('/report', authMiddleware, reportController.getDailyReport);

module.exports = router;
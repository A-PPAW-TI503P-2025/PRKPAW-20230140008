// File: routes/presensi.js

const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { addUserData } = require("../middleware/permissionMiddleware");

const { body } = require("express-validator");


const validateUpdate = [
  body("checkIn")
    .optional()
    .isISO8601() 
    .withMessage("Format tanggal checkIn tidak valid (gunakan ISO8601)"),
  body("checkOut")
    .optional()
    .isISO8601()
    .withMessage("Format tanggal checkOut tidak valid (gunakan ISO8601)"),
];

router.use(addUserData);

router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

// Rute Hapus
router.delete("/:id", presensiController.deletePresensi);

// Rute Update (PERHATIKAN, KITA TAMBAHKAN 'validateUpdate' DI SINI)
router.put(
  "/:id",
  validateUpdate, // Aturan validasi dijalankan sebelum controller
  presensiController.updatePresensi
);

module.exports = router;
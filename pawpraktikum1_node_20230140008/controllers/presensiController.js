const { Presensi } = require('../models');
const multer = require('multer'); // [cite: 67]
const path = require('path');     // [cite: 68]

// --- KONFIGURASI MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder penyimpanan [cite: 71]
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.ext [cite: 74-75]
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Validasi hanya file gambar [cite: 78-83]
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Export middleware upload agar bisa dipakai di Route [cite: 85]
exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// --- FUNGSI CHECK-IN BARU ---
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body; 
    
    // Ambil path foto dari req.file (jika ada upload) [cite: 91]
    const buktiFoto = req.file ? req.file.path : null;

    // --- DEBUGGING ---
    console.log("------------------------------------------------");
    console.log("MENCIEK CHECK-IN BARU:");
    console.log("User ID:", userId);
    console.log("File Foto:", buktiFoto); // Cek apakah foto terbaca
    console.log("------------------------------------------------");

    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Data lokasi wajib diisi!" });
    }

    const presensi = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto // Simpan path foto ke database [cite: 98]
    });

    res.status(200).json({ message: "Berhasil Check-In!", data: presensi });

  } catch (error) {
    console.error("Error Check-In:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const presensi = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
      order: [['checkIn', 'DESC']]
    });

    if (!presensi) return res.status(404).json({ message: "Belum Check-In." });

    presensi.checkOut = new Date();
    await presensi.save();

    res.status(200).json({ message: "Berhasil Check-Out!", data: presensi });
  } catch (error) {
    res.status(500).json({ message: "Error server" });
  }
};
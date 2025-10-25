const { Presensi } = require('../models');

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body; 

    // --- DEBUGGING: Cek di Terminal Backend apakah data sampai ---
    console.log("------------------------------------------------");
    console.log("MENCIEK CHECK-IN BARU:");
    console.log("User ID:", userId);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("------------------------------------------------");

    if (!latitude || !longitude) {
        console.log("⚠️ PERINGATAN: Data lokasi null/kosong dari Frontend!");
    }

    const presensi = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude,
      longitude: longitude
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
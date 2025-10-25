const { Presensi, User } = require('../models');
const { Op } = require('sequelize');

exports.getDailyReport = async (req, res) => {
  try {
    // Ambil semua data presensi, urutkan dari yang terbaru
    const reports = await Presensi.findAll({
      include: [
        {
          model: User,
          as: 'User', // <--- INI PERBAIKANNYA (Wajib pakai 'as')
          attributes: ['nama', 'email'] 
        }
      ],
      order: [['checkIn', 'DESC']]
    });

    res.status(200).json({
      message: "Data laporan berhasil diambil",
      data: reports
    });

  } catch (error) {
    console.error("Error ambil laporan:", error);
    res.status(500).json({ message: "Gagal mengambil data laporan" });
  }
};
// File: controllers/reportController.js
// OPSI B (Array) - KOMPATIBEL DENGAN KODE KITA
// SAYA REKOMENDASIKAN PAKAI INI

const presensiRecords = require("../Data/presensiData"); // Ambil data dari array

exports.getDailyReport = (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let recordsToDisplay = presensiRecords;

    console.log(
      `Controller: Mengambil laporan. Filter: Nama=${
        nama || "N/A"
      }, Mulai=${tanggalMulai || "N/A"}, Selesai=${tanggalSelesai || "N/A"}`
    );

    // 1. Filter Nama (seperti sebelumnya)
    if (nama) {
      recordsToDisplay = recordsToDisplay.filter((record) =>
        record.nama.toLowerCase().includes(nama.toLowerCase())
      );
    }

    // 2. Filter Tanggal Mulai (jika ada query tanggalMulai)
    if (tanggalMulai) {
      const startDate = new Date(tanggalMulai); // Parse string jadi object Date
      startDate.setHours(0, 0, 0, 0); // Set ke awal hari

      recordsToDisplay = recordsToDisplay.filter((record) => {
        const recordDate = new Date(record.checkIn); // 'record.checkIn' adalah object Date
        return recordDate >= startDate;
      });
    }

    // 3. Filter Tanggal Selesai (jika ada query tanggalSelesai)
    if (tanggalSelesai) {
      const endDate = new Date(tanggalSelesai); // Parse string jadi object Date
      endDate.setHours(23, 59, 59, 999); // Set ke akhir hari

      recordsToDisplay = recordsToDisplay.filter((record) => {
        const recordDate = new Date(record.checkIn);
        return recordDate <= endDate;
      });
    }

    // Kirim data array yang sudah difilter
    res.json({
      reportDate: new Date().toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
      }),
      totalData: recordsToDisplay.length,
      data: recordsToDisplay,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
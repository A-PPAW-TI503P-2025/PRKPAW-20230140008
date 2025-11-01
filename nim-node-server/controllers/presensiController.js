// File: controllers/presensiController.js

const presensiRecords = require("../Data/presensiData"); // Data array kita
const { format } = require("date-fns-tz");
const { validationResult } = require("express-validator"); // <-- Import untuk validasi

const timeZone = "Asia/Jakarta";

// Helper untuk ID unik (biar gampang)
let nextId = 1;

exports.CheckIn = (req, res) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();

  const existingRecord = presensiRecords.find(
    (record) => record.userId === userId && record.checkOut === null
  );
  if (existingRecord) {
    return res
      .status(400)
      .json({ message: "Anda sudah melakukan check-in hari ini." });
  }

  const newRecord = {
    id: nextId++, // <-- Tambah ID unik untuk rekor ini
    userId,
    nama: userName,
    checkIn: waktuSekarang,
    checkOut: null,
  };
  presensiRecords.push(newRecord);

  const formattedData = {
    ...newRecord,
    checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
  };

  console.log(
    `DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-in.`
  );

  res.status(201).json({
    message: `Halo ${userName}, check-in berhasil pukul ${format(
      waktuSekarang,
      "HH:mm:ss",
      { timeZone }
    )} WIB`,
    data: formattedData,
  });
};

exports.CheckOut = (req, res) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();

  const recordToUpdate = presensiRecords.find(
    (record) => record.userId === userId && record.checkOut === null
  );

  if (!recordToUpdate) {
    return res.status(404).json({
      message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
    });
  }

  recordToUpdate.checkOut = waktuSekarang;

  const formattedData = {
    ...recordToUpdate,
    checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone,
    }),
    checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone,
    }),
  };

  console.log(
    `DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-out.`
  );

  res.json({
    message: `Selamat jalan ${userName}, check-out berhasil pukul ${format(
      waktuSekarang,
      "HH:mm:ss",
      { timeZone }
    )} WIB`,
    data: formattedData,
  });
};

exports.deletePresensi = (req, res) => {
  try {
    const { id: currentUserId, role: currentUserRole } = req.user;
    const presensiId = parseInt(req.params.id, 10);

    const recordIndex = presensiRecords.findIndex(
      (record) => record.id === presensiId
    );

    if (recordIndex === -1) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    const recordToDelete = presensiRecords[recordIndex];

    if (recordToDelete.userId !== currentUserId && currentUserRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    const [deletedRecord] = presensiRecords.splice(recordIndex, 1);

    console.log("DATA BERHASIL DIHAPUS:", deletedRecord);

    res
      .status(200)
      .json({ message: "Data presensi berhasil dihapus", data: deletedRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- FUNGSI UPDATE DENGAN VALIDASI ---
exports.updatePresensi = (req, res) => {
  // ----- TAMBAHAN KODE VALIDASI -----
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Jika ada error validasi, kirim balasan 400
    return res.status(400).json({ errors: errors.array() });
  }
  // ------------------------------------

  try {
    const presensiId = parseInt(req.params.id, 10);
    const { checkIn, checkOut, nama } = req.body;

    // Validasi input body (tetap diperlukan) <-- TANDA KUTIP HILANG (FIXED)
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid (checkIn, checkOut, atau nama).",
      });
    }

    const recordToUpdate = presensiRecords.find(
      (record) => record.id === presensiId
    );

    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Lakukan update
    if (nama !== undefined) {
      recordToUpdate.nama = nama;
    }
    if (checkIn !== undefined) {
      // Data sudah tervalidasi sebagai ISO8601
      recordToUpdate.checkIn = checkIn;
    }
    if (checkOut !== undefined) {
      // Data sudah tervalidasi sebagai ISO8601
      recordToUpdate.checkOut = checkOut;
    }

    console.log("DATA BERHASIL DI-UPDATE (dari array):", recordToUpdate);

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
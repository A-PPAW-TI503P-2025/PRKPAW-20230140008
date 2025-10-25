const presensiRecords = require("../Data/presensiData");

exports.getDailyReport = (req, res) => {
  console.log("Controller: Mengambil data laporan harian dari array...");
  res.json({
    reportDate: new Date().toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" }),
    data: presensiRecords
  });
};

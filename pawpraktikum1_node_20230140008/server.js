const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); 

// Import Routes yang sudah ada
const authRoutes = require('./routes/authRoutes');
const presensiRoutes = require('./routes/presensiRoutes');

// --- [BARU] Import Route IoT ---
// Pastikan file routes/iot.js sudah dibuat sesuai langkah sebelumnya
const iotRoutes = require('./routes/iot'); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json()); // Ini penting agar bisa baca JSON dari ESP32
app.use(bodyParser.urlencoded({ extended: true }));

// Folder uploads dijadikan statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Lama
app.use('/api/auth', authRoutes);
app.use('/api/presensi', presensiRoutes);

// --- [BARU] Gunakan Route IoT ---
// Endpoint nanti jadi: http://IP_LAPTOP:3000/api/iot/ping
app.use('/api/iot', iotRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
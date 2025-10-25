const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const presensiRoutes = require('./routes/presensiRoutes');

const app = express();
const PORT = 3000; // KITA GUNAKAN PORT 3000

app.use(cors());
app.use(bodyParser.json());

// --- DEFINISI ROUTE ---
// Semua request ke auth akan diawali /api/auth
app.use('/api/auth', authRoutes);

// Semua request ke presensi akan diawali /api/presensi
app.use('/api/presensi', presensiRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
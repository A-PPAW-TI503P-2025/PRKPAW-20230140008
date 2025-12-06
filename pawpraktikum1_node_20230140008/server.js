const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); 

const authRoutes = require('./routes/authRoutes');
const presensiRoutes = require('./routes/presensiRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
// Agar bisa membaca body dari form-data (penting untuk upload file)
app.use(bodyParser.urlencoded({ extended: true }));

// Folder uploads dijadikan statis agar bisa diakses via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/presensi', presensiRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Import router dari books.js
const booksRouter = require('./books');

// Middleware
app.use(cors());
app.use(express.json());

// Middleware Logging (Tugas 2)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routing utama
app.get('/', (req, res) => {
  res.send('Home Page for API Perpustakaan');
});

// Gunakan router untuk endpoint /api/books
app.use('/api/books', booksRouter);

// Error Handling (Tugas 3)
// Middleware untuk menangani 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Middleware Global Error Handler (ditempatkan paling akhir)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error ke konsol
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});


// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}/`);
});
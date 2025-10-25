const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Import router dari books.js
const booksRouter = require('./books');

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routing utama
app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Gunakan router untuk endpoint /api/books
app.use('/api/books', booksRouter);

// Error handling (opsional)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/`);
});

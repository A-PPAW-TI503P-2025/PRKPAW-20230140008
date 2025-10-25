const express = require('express');
const router = express.Router();

let books = [
  {id: 1, title: 'Laskar Pelangi', author: 'Andrea Hirata'},
  {id: 2, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer'}
];

// READ: Mendapatkan semua buku
router.get('/', (req, res) => {
  res.json(books);
});

// READ: Mendapatkan buku berdasarkan ID
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json(book);
});

// CREATE: Menambahkan buku baru
router.post('/', (req, res) => {
  const { title, author } = req.body;
  // Validasi input
  if (!title || !author) {
      return res.status(400).json({ message: 'Title dan Author harus diisi' });
  }
  const book = {
    id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1, // ID unik
    title,
    author
  };
  books.push(book);
  res.status(201).json(book);
});

// UPDATE: Mengubah data buku berdasarkan ID
router.put('/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });

    const { title, author } = req.body;
    // Validasi input
    if (!title || !author) {
        return res.status(400).json({ message: 'Title dan Author harus diisi' });
    }

    book.title = title;
    book.author = author;
    res.json(book);
});

// DELETE: Menghapus buku berdasarkan ID
router.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ message: 'Buku tidak ditemukan' });

    // Hapus buku dari array
    books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Buku berhasil dihapus' });
});

module.exports = router;
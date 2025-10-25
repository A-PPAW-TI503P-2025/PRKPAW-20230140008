const express = require("express");
const router = express.Router();

let books = [
  { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata" },
  { id: 2, title: "Bumi Manusia", author: "Pramoedya Ananta Toer" }
];

// READ all
router.get("/", (req, res) => res.json(books));

// READ by ID
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
  res.json(book);
});

// CREATE
router.post("/", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author)
    return res.status(400).json({ message: "Title dan Author harus diisi" });

  const book = {
    id: books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1,
    title,
    author
  };
  books.push(book);
  res.status(201).json(book);
});

// UPDATE
router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

  const { title, author } = req.body;
  if (!title || !author)
    return res.status(400).json({ message: "Title dan Author harus diisi" });

  book.title = title;
  book.author = author;
  res.json(book);
});

// DELETE
router.delete("/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Buku tidak ditemukan" });

  books.splice(index, 1);
  res.json({ message: "Buku berhasil dihapus" });
});

module.exports = router;

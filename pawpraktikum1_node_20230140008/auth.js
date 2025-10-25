const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./models'); 

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    // Ambil 'name' dari frontend (RegisterPage.js)
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      
      // --- PERBAIKAN 1 ---
      nama: name, // Simpan 'name' dari frontend ke kolom 'nama' di DB
      // -------------------
      
      email: email,
      password: hash,
      role: role
    });

    res.json({
      success: true,
      message: "Registrasi berhasil",
      userId: newUser.id
    });

  } catch (err) {
    console.error('--- ERROR REGISTRASI ---', err); 
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar." });
    }
    res.status(500).json({
      success: false,
      message: "Gagal registrasi",
      error: err.message
    });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Model sekarang akan mencari user (dan otomatis mengambil 'nama')
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(404).json({ message: "Email tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 

        // --- PERBAIKAN 2 ---
        name: user.nama // Baca 'user.nama' dari DB, masukkan ke token sbg 'name'
        // -------------------
      }, 
      'RAHASIA_SUPER_AMAN_ANDA', 
      { expiresIn: '1h' }
    );

    res.json({ 
      success: true, 
      message: "Login berhasil",
      token: token
    });

  } catch (err) {
    console.error('--- ERROR LOGIN ---', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
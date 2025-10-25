const jwt = require('jsonwebtoken');
// KUNCI RAHASIA (Harus sama dengan yang ada di authController.js)
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; 

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak tersedia." });
  }

  try {
    const token = tokenHeader.split(" ")[1]; // Mengambil token setelah kata "Bearer"
    if (!token) {
      return res.status(401).json({ message: "Format token salah." });
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token tidak valid." });
  }
};

module.exports = authMiddleware;
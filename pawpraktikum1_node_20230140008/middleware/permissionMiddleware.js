const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara"; // Samakan dengan .env

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Ambil token setelah 'Bearer'

  if (token == null) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak ada." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid." });
    }
    // Simpan data user asli dari token ke request
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Hanya admin yang boleh akses." });
  }
};
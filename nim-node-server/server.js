const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

// Middleware global
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Log manual
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes import
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const booksRoutes = require("./routes/books");

// Rute dasar
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

app.use("/api/books", booksRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

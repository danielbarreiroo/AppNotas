const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
console.log("Dotenv loaded. JWT_SECRET:", process.env.JWT_SECRET);
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const categoriesRoutes = require("./routes/categories");
const publicRoutes = require("./routes/public");
require("./config/database-sqlite");
const app = express();
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "tu-dominio.com"
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/public", publicRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Error del servidor",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Error interno",
  });
});
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:5173`);
  console.log(`API: http://localhost:${PORT}/api`);
});

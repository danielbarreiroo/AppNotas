const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesControllers");
const { authenticateToken } = require("../middlewares/auth");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/images";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "note-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
const noteValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("El título es requerido y debe tener máximo 255 caracteres"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("El contenido es requerido"),
  body("category_id")
    .optional({ nullable: true })
    .isInt()
    .withMessage("ID de categoría debe ser un número"),
  body("is_public")
    .optional()
    .isBoolean()
    .withMessage("is_public debe ser verdadero o falso"),
];
router.use(authenticateToken);
router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", upload.single("image"), noteValidation, createNote);
router.put("/:id", upload.single("image"), noteValidation, updateNote);
router.delete("/:id", deleteNote);
module.exports = router;

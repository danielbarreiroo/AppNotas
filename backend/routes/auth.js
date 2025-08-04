const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  verifyToken,
} = require("../controllers/authControllers");
const { authenticateToken } = require("../middlewares/auth");
const router = express.Router();
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email válido requerido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email válido requerido"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
];
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/verify", authenticateToken, verifyToken);
module.exports = router;

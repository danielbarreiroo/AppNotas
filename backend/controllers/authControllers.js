const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { dbAsync } = require("../config/database-sqlite");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await dbAsync.get("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (user) {
      return res.status(400).json({ message: "El email ya existe" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await dbAsync.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "Usuario registrado",
      token,
      user: {
        id: result.id,
        email,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await dbAsync.get(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    res.json({
      message: "Token válido",
      user: req.user,
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
};

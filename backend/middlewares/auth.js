const jwt = require("jsonwebtoken");
const { dbAsync } = require("../config/database-sqlite");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token de acceso requerido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario existe
    const user = await dbAsync.get("SELECT id, email FROM users WHERE id = ?", [
      decoded.userId,
    ]);

    if (!user) {
      return res.status(401).json({ message: "Usuario no válido" });
    }

    req.user = { id: decoded.userId, email: user.email };
    next();
  } catch (error) {
    console.error("Error en autenticación:", error);
    return res.status(403).json({ message: "Token no válido" });
  }
};

module.exports = { authenticateToken };

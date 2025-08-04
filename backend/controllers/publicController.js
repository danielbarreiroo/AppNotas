const { dbAsync } = require("../config/database-sqlite");

// Obtener nota pública por ID
const getPublicNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await dbAsync.get(
      `SELECT n.id, n.title, n.content, n.image_path, n.created_at, n.updated_at,
               c.name as category_name, u.email as user_email
       FROM notes n
       LEFT JOIN categories c ON n.category_id = c.id
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ? AND n.is_public = TRUE`,
      [id]
    );

    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error obteniendo nota pública:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getPublicNote,
};

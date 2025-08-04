const { validationResult } = require("express-validator");
const { dbAsync } = require("../config/database-sqlite");

const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await dbAsync.all(
      "SELECT * FROM categories WHERE created_by IS NULL OR created_by = ? ORDER BY name",
      [userId]
    );
    res.json(categories);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      });
    }

    const { name } = req.body;
    const userId = req.user.id;

    const category = await dbAsync.get(
      "SELECT id FROM categories WHERE name = ? AND (created_by = ? OR created_by IS NULL)",
      [name, userId]
    );

    if (category) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const result = await dbAsync.run(
      "INSERT INTO categories (name, created_by) VALUES (?, ?)",
      [name, userId]
    );

    const newCategory = await dbAsync.get(
      "SELECT * FROM categories WHERE id = ?",
      [result.id]
    );

    res.status(201).json({
      message: "Categoría creada",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creando categoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const category = await dbAsync.get(
      "SELECT id FROM categories WHERE id = ? AND created_by = ?",
      [id, userId]
    );

    if (!category) {
      return res.status(404).json({
        message: "No encontrada o sin permisos",
      });
    }

    await dbAsync.run(
      "UPDATE categories SET name = ? WHERE id = ? AND created_by = ?",
      [name, id, userId]
    );

    const updated = await dbAsync.get("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);

    res.json({
      message: "Categoría actualizada",
      category: updated,
    });
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = await dbAsync.get(
      "SELECT id FROM categories WHERE id = ? AND created_by = ?",
      [id, userId]
    );

    if (!category) {
      return res.status(404).json({
        message: "No encontrada o sin permisos",
      });
    }

    await dbAsync.run(
      "UPDATE notes SET category_id = NULL WHERE category_id = ?",
      [id]
    );

    await dbAsync.run(
      "DELETE FROM categories WHERE id = ? AND created_by = ?",
      [id, userId]
    );

    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

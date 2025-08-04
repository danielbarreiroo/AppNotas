const { validationResult } = require("express-validator");
const multer = require("multer");
const { dbAsync } = require("../config/database-sqlite");
const fs = require("fs").promises;
const path = require("path");

const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await dbAsync.all(
      `SELECT n.id, n.title, n.content, n.is_public, n.image_path, n.created_at, n.updated_at,
               c.name as category_name, c.id as category_id
       FROM notes n
       LEFT JOIN categories c ON n.category_id = c.id
       WHERE n.user_id = ?
       ORDER BY n.updated_at DESC`,
      [userId]
    );
    res.json(notes);
  } catch (error) {
    console.error("Error obteniendo notas:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await dbAsync.get(
      `SELECT n.id, n.title, n.content, n.is_public, n.image_path, n.created_at, n.updated_at,
               c.name as category_name, c.id as category_id, u.email as user_email
       FROM notes n
       LEFT JOIN categories c ON n.category_id = c.id
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ? AND n.user_id = ?`,
      [id, userId]
    );

    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error obteniendo nota:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const createNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      });
    }

    const { title, content, category_id, is_public = false } = req.body;
    const userId = req.user.id;
    const imagePath = req.file ? req.file.path : null;

    const isPublicValue =
      is_public === true || is_public === "true" || is_public === 1 ? 1 : 0;

    const result = await dbAsync.run(
      "INSERT INTO notes (title, content, category_id, user_id, is_public, image_path) VALUES (?, ?, ?, ?, ?, ?)",
      [title, content, category_id || null, userId, isPublicValue, imagePath]
    );

    const note = await dbAsync.get(
      `SELECT n.id, n.title, n.content, n.is_public, n.image_path, n.created_at, n.updated_at,
               c.name as category_name, c.id as category_id
       FROM notes n
       LEFT JOIN categories c ON n.category_id = c.id
       WHERE n.id = ?`,
      [result.id]
    );

    res.status(201).json({
      message: "Nota creada",
      note: note,
    });
  } catch (error) {
    console.error("Error creando nota:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const updateNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { title, content, category_id, is_public } = req.body;
    const userId = req.user.id;

    const note = await dbAsync.get(
      "SELECT id, image_path FROM notes WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    let imagePath = note.image_path;

    if (req.file) {
      if (imagePath) {
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          console.log("Error eliminando imagen:", err);
        }
      }
      imagePath = req.file.path;
    }

    const isPublicValue =
      is_public === true || is_public === "true" || is_public === 1 ? 1 : 0;

    await dbAsync.run(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, is_public = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
      [
        title,
        content,
        category_id || null,
        isPublicValue,
        imagePath,
        id,
        userId,
      ]
    );

    const updated = await dbAsync.get(
      `SELECT n.id, n.title, n.content, n.is_public, n.image_path, n.created_at, n.updated_at,
               c.name as category_name, c.id as category_id
       FROM notes n
       LEFT JOIN categories c ON n.category_id = c.id
       WHERE n.id = ?`,
      [id]
    );

    res.json({
      message: "Nota actualizada",
      note: updated,
    });
  } catch (error) {
    console.error("Error actualizando nota:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await dbAsync.get(
      "SELECT image_path FROM notes WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    if (note.image_path) {
      try {
        await fs.unlink(note.image_path);
      } catch (err) {
        console.log("Error eliminando imagen:", err);
      }
    }

    await dbAsync.run("DELETE FROM notes WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    res.json({ message: "Nota eliminada" });
  } catch (error) {
    console.error("Error eliminando nota:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};

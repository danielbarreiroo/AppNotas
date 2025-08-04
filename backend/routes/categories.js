const express = require("express");
const { body } = require("express-validator");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");
const { authenticateToken } = require("../middlewares/auth");
const router = express.Router();
const categoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "El nombre de la categoría es requerido y debe tener máximo 100 caracteres"
    ),
];
router.use(authenticateToken);
router.get("/", getCategories);
router.post("/", categoryValidation, createCategory);
router.put("/:id", categoryValidation, updateCategory);
router.delete("/:id", deleteCategory);
module.exports = router;

const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const promisePool = pool.promise();
const initDatabase = async () => {
  try {
    // Crear base de datos si no existe
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    const promiseConnection = connection.promise();
    await promiseConnection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    await promiseConnection.end();
    // Crear tablas
    await createTables();
    console.log("✅ Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error);
  }
};
const createTables = async () => {
  try {
    // Tabla usuarios
    await promisePool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    // Tabla categorías
    await promisePool.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                UNIQUE KEY unique_category_user (name, created_by)
            )
        `);
    // Tabla notas
    await promisePool.execute(`
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                category_id INT,
                user_id INT NOT NULL,
                is_public BOOLEAN DEFAULT FALSE,
                image_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    // Insertar categorías por defecto
    await insertDefaultCategories();
    console.log("✅ Tablas creadas correctamente");
  } catch (error) {
    console.error("❌ Error creando tablas:", error);
  }
};
const insertDefaultCategories = async () => {
  try {
    const defaultCategories = [
      "Personal",
      "Trabajo",
      "Estudios",
      "Ideas",
      "Recordatorios",
      "Proyectos",
    ];
    for (const category of defaultCategories) {
      await promisePool.execute(
        "INSERT IGNORE INTO categories (name, created_by) VALUES (?, NULL)",
        [category]
      );
    }
  } catch (error) {
    console.error("Error insertando categorías por defecto:", error);
  }
};
initDatabase();
module.exports = promisePool;

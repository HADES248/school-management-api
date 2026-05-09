const mysql = require("mysql2/promise");

require("dotenv").config();

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }, // Required for Railway/PlanetScale
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

module.exports = getPool;
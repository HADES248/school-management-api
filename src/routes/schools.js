const express = require("express");
const router = express.Router();
const getPool = require("../db.js");
const validateSchool = require("../validators/schools.js");

// Haversine formula to calculate distance in km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const toRad = (val) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /addSchool
router.post("/addSchool", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate
    const errors = validateSchool({ name, address, latitude, longitude });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const pool = getPool();

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `);

    const [result] = await pool.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully.",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  } catch (error) {
    console.error("addSchool error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// GET /listSchools?latitude=xx&longitude=yy
router.get("/listSchools", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || userLat < -90 || userLat > 90) {
      return res.status(400).json({
        success: false,
        message: "Query param 'latitude' must be a valid number between -90 and 90.",
      });
    }

    if (isNaN(userLon) || userLon < -180 || userLon > 180) {
      return res.status(400).json({
        success: false,
        message: "Query param 'longitude' must be a valid number between -180 and 180.",
      });
    }

    const pool = getPool();

    // Create table if it doesn't exist (safety net)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `);

    const [rows] = await pool.query("SELECT * FROM schools");

    const sorted = rows
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          haversineDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      count: sorted.length,
      user_location: { latitude: userLat, longitude: userLon },
      data: sorted,
    });
  } catch (error) {
    console.error("listSchools error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const schoolRoutes = require("../src/routes/schools.js");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "School Management API is running." });
});

// Routes
app.use("/", schoolRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Listen locally (skipped by Vercel since it imports this as a module)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
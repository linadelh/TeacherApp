
// fichier : routes/moduleRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // connexion MySQL

router.get('/modules', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM modules");
    res.json(rows); // Envoie tous les modules
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

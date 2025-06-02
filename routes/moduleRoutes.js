
// fichier : routes/moduleRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // connexion MySQL

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM modules");
    res.json(rows); // Envoie tous les modules
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
router.get('/fiche', async (req, res) => {
  try {
    //console.log(req.user.enseignantId);
    const userId = req.user?.id; // Assuming authentication middleware sets req.user
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Get the latest voeu for the user (you can customize this logic)
    const [voeuxRows] = await pool.query(
      `SELECT id FROM voeux WHERE utilisateur_id = ? ORDER BY date_soumission DESC LIMIT 1`,
      [userId]
    );

    if (voeuxRows.length === 0) {
      return res.status(404).json({ message: "Aucun voeu trouvé pour cet utilisateur" });
    }

    const voeuId = voeuxRows[0].id;

    // Get all modules linked to that voeu
    const [modulesRows] = await pool.query(
      `
      SELECT m.*, mv.type_enseignement 
      FROM modules_voeux mv
      JOIN modules m ON mv.module_id = m.id
      WHERE mv.voeu_id = ?
      `,
      [voeuId]
    );

    res.json(modulesRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
module.exports = router;

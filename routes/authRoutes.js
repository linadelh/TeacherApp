const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { Utilisateur } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");


// Route d'inscription
router.post("/register", register);

// Route de connexion
router.post("/login", login);

router.get("/profile", authMiddleware, async (req, res) => {
    try {
      // req.user.id est injecté par authMiddleware
      const utilisateur = await Utilisateur.findByPk(req.user.id, {
        attributes: { exclude: ["password"] }
      });
  
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Renvoyer object complet (id, nom, prenom, grade, email, etc.)
      return res.json({ user: utilisateur });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  module.exports = router;

module.exports = router;

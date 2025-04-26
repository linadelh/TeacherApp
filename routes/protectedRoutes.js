const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { Utilisateur } = require("../models"); // 🔁 Import du modèle

// ✅ Accessible uniquement au chef de département
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("chef_departement"),
  (req, res) => {
    res.json({ message: "Bienvenue chef de département !" });
  }
);

// ✅ Accessible uniquement à l'enseignant
router.get(
  "/enseignant",
  authMiddleware,
  authorizeRoles("enseignant"),
  (req, res) => {
    res.json({ message: "Bienvenue enseignant !" });
  }
);

// ✅ Accessible à tout utilisateur authentifié - avec profil complet
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // ⚠️ on ne veut jamais renvoyer le mot de passe !
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Voici votre profil",
      user: utilisateur,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

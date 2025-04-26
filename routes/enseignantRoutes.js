const express = require('express');
const router = express.Router();
const { Enseignant, Utilisateur } = require('../models'); // Importer les modèles


// ✅ GET /api/enseignants : récupérer tous les enseignants
router.get('/', async (req, res) => {
  try {
    const enseignants = await Enseignant.findAll({
      attributes: ['utilisateur_id', 'grade', 'departement', 'faculte', 'statut']  // ✅ Correspond aux colonnes réelles
    });
    res.json(enseignants);
  } catch (error) {
    console.error('❌ Erreur récupération enseignants :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ POST /api/enseignants : ajouter un enseignant
router.post('/', async (req, res) => {
  try {
    console.log("🔍 Corps reçu :", req.body); // Debugging

    const { utilisateur_id, grade, departement, faculte, statut } = req.body;

    // Vérification des champs obligatoires
    if (!utilisateur_id || !grade || !departement || !faculte || !statut) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérifier si l'utilisateur existe dans la table Utilisateurs
    const utilisateurExiste = await Utilisateur.findByPk(utilisateur_id);
    if (!utilisateurExiste) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Création de l'enseignant
    const nouvelEnseignant = await Enseignant.create({ utilisateur_id, grade, departement, faculte, statut });
    
    res.status(201).json(nouvelEnseignant);
  } catch (error) {
    console.error('❌ Erreur ajout enseignant :', error);

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: "Clé étrangère invalide : l'utilisateur n'existe pas" });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;

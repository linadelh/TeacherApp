const express = require('express');
const router = express.Router();
const { Enseignant, Utilisateur, Voeu } = require('../models'); // Importer les modèles
const authenticateToken = require('../middlewares/authMiddleware'); // Adjust if named differently


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


router.get('/check-voeu', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const voeu = await Voeu.findOne({
            where: { utilisateur_id: userId }
        });
        res.json({ hasVoeu: !!voeu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/info', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await Utilisateur.findByPk(userId, {
            attributes: ['nom', 'prenom', 'faculte']  // ✅ include faculte here
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erreur info utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


module.exports = router;

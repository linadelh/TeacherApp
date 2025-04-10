const Enseignant = require('../models/Enseignant');  // Importer le modèle Enseignant

// Fonction pour obtenir tous les enseignants
const getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.findAll();  // Récupérer tous les enseignants
    res.json(enseignants);  // Envoyer la réponse en JSON
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour ajouter un enseignant
const addEnseignant = async (req, res) => {
  const { nom, email } = req.body;

  try {
    const enseignant = await Enseignant.create({ nom, email });
    res.status(201).json(enseignant);  // Retourner l'enseignant ajouté
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout" });
  }
};

module.exports = { getAllEnseignants, addEnseignant };

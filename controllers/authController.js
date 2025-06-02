const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Utilisateur, Enseignant } = require("../models");



// ✅ INSCRIPTION
const register = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    password,
    grade,
    faculte,
    departement,
    role // envoyé en dur depuis le frontend (ex : "enseignant")
  } = req.body;

  // Validation des champs obligatoires
  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: "Les champs obligatoires sont manquants." });
  }
  

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const user = await Utilisateur.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      grade,
      faculte,
      departement
    });
    if (role === 'enseignant') {
      await Enseignant.create({
        utilisateur_id: user.id, // Associe l'ID de l'utilisateur
        grade,
        faculte,
        departement,
        statut: 'actif' // Tu peux aussi ajouter un statut par défaut
      });
    }
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

// ✅ CONNEXION 
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Recherche de l'utilisateur avec jointure
    const user = await Utilisateur.findOne({
      where: { email },
      include: [{
        model: Enseignant,
        required: false // Mettez à true si tous les users sont enseignants
      }]
    });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }

    // 2. Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    // 3. Génération du token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        nom: user.nom,  // Informations ajoutées dans le token
        enseignantId: user.Enseignant?.utilisateur_id,
        prenom: user.prenom,
        grade: user.grade,
        email: user.email,
        matricule: `ENS-${user.id.toString().padStart(4, '0')}`,
        faculte: user.faculte,
        departement: user.departement
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Préparation des données pour la fiche de vœux
    const userDataForFiche = {
      identite: `${user.nom} ${user.prenom}`,
      grade: user.grade || user.Enseignant?.grade,
      email: user.email,
      matricule: `ENS-${user.id.toString().padStart(4, '0')}`, // Format personnalisé
      faculte: user.faculte || user.Enseignant?.faculte,
      departement: user.departement || user.Enseignant?.departement,
      anneeUniversitaire: "2024/2025" // À adapter selon votre logique métier
    };
    const redirectTo = user.role === 'enseignant' ? '/voeu.html' : '/chef';

    // 5. Réponse avec toutes les données nécessaires
    res.json({
      message: "Connexion réussie.",
      token,
      user: userDataForFiche,
      redirectTo // Indication pour le frontend
    });

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la connexion.",
      error: error.message // Optionnel : pour le débogage
    });
  }
};

module.exports = { register, login };

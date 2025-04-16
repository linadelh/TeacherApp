const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const Utilisateur = require("./models/Utilisateur"); // adapte le chemin si nécessaire

// Pour s'assurer que la DB est bien connectée (si besoin)
require("./config/database"); // adapte ce chemin selon ton projet

const addChef = async () => {
  try {
    const hashedPassword = await bcrypt.hash("chef1234", 10); // mot de passe du chef

    await Utilisateur.create({
      nom: "Fatima",
      prenom: "Bensalem",
      email: "fatima.chef@example.com",
      password: hashedPassword,
      role: "chef_departement",
      grade: "Professeur",
      matricule: "CH001",
      faculte: "Informatique",
      departement: "AI"
    });

    console.log("✅ Chef de département ajouté avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout du chef :", err);
  }
};

addChef();

// config/database.js

const { Sequelize } = require('sequelize');

// Création de la connexion avec la base de données
const sequelize = new Sequelize('gestion_voeux', 'root', 'yasmine1234', {
  host: 'localhost',
  dialect: 'mysql', // Utilisation du dialecte MySQL
});

// Vérifier la connexion
sequelize.authenticate()
  .then(() => console.log("✅ Connexion réussie à la base de données !"))
  .catch((err) => console.error("❌ Erreur de connexion à la base :", err));

// Exporter la connexion pour l'utiliser ailleurs dans l'application
module.exports = sequelize;

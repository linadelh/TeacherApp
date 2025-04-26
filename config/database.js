// config/database.js
const { Sequelize } = require('sequelize');

// Configuration de la base de données
const sequelize = new Sequelize('gestion_voeux', 'root', '0101', {
  host: 'localhost',
  dialect: 'mysql', // Ou 'postgres', 'sqlite', etc. selon ta base de données
});

module.exports = sequelize;


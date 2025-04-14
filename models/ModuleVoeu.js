
// models/ModuleVoeu.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModuleVoeu = sequelize.define('ModuleVoeu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type_enseignement: {
    type: DataTypes.ENUM('Cours', 'TD', 'TP'),
    allowNull: false
  }
}, {
  tableName: 'module_voeux', // Pour explicitement lier à la table 'module_voeux'
  timestamps: false // Désactive les champs createdAt/updatedAt
});

module.exports = ModuleVoeu;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModuleVoeu = sequelize.define('ModuleVoeu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  voeu_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
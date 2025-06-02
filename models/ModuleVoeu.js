
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
  ordre: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1
},
  type_enseignement: {
    type: DataTypes.ENUM('Cours', 'TD', 'TP'),
    allowNull: false
  }
}, {
  tableName: 'module_voeux', // Pour explicitement lier à la table 'module_voeux'
  timestamps: false // Désactive les champs createdAt/updatedAt
});
ModuleVoeu.associate = (models) => {
  ModuleVoeu.belongsTo(models.Module, { foreignKey: 'module_id', as: 'Module' });
  ModuleVoeu.belongsTo(models.Voeu, { foreignKey: 'voeu_id', as: 'Voeu' });
};

module.exports = ModuleVoeu;
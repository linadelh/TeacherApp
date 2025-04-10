const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Connexion à ta BDD
const Utilisateur = require('./Utilisateur'); // Import du modèle Utilisateur

const Enseignant = sequelize.define('Enseignant', {
  utilisateur_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Utilisateur, // Référence au modèle Utilisateur
      key: 'id',
    },
    onDelete: 'CASCADE', // Si un utilisateur est supprimé, l'enseignant l'est aussi
    onUpdate: 'CASCADE', // Si l'ID change, il est mis à jour ici aussi
  },
  grade: {
    type: DataTypes.ENUM('MAB', 'MAA', 'MCB', 'MCA', 'PROF'),
    allowNull: false,
  },
  departement: {
    type: DataTypes.ENUM('SIQ', 'AI', 'SD'),
    allowNull: true,
  },
  faculte: {
    type: DataTypes.ENUM('Mathématique', 'Informatique', 'Génie Civil', 'Physique', 'Électronique'),
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif'),
    allowNull: true,
    defaultValue: 'actif',
  },
}, {
  tableName: 'Enseignants', // Force Sequelize à utiliser ce nom de table
  timestamps: false, // Désactiver createdAt et updatedAt
});

// Association avec Utilisateur
Enseignant.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

module.exports = Enseignant;

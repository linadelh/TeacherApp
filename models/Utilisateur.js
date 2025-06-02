const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'unique_email_idx' // Add this explicit index name
    },
    validate: {
      isEmail: true,
    },
  },
  matricule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  faculte: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  departement: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('enseignant', 'chef_departement'),
    allowNull: false,
    defaultValue: 'enseignant',
  },
  statut: {
    type: DataTypes.ENUM('titulaire', 'vacataire', 'doctorant', 'autre_faculte'),
    allowNull: true,
  },
  bureau: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  heures_supplementaires: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  date_inscription: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Utilisateurs',
  timestamps: false,
});


module.exports = Utilisateur;

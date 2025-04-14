
// models/Module.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  niveau: {
    type: DataTypes.ENUM('L1', 'L2', 'L3', 'M1', 'M2'),
    allowNull: false
  },
  specialite: {
    type: DataTypes.ENUM('TRONC_COMMUN','ACAD', 'ISIL', 'GTR', 'BIOINFO', 'SII', 'IV', 'BIGDATA', 'HPC', 'IL', 'SSI', 'RSD'),
    allowNull: false
  },
  semestre: {
    type: DataTypes.ENUM('S1', 'S2'),
    allowNull: false
  },
  nom_module: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  heures_cours: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  heures_td: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },
  heures_tp: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 1.5
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['niveau', 'specialite', 'semestre', 'nom_module']
    }
  ]
});

module.exports = Module;
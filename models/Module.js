
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
    type: DataTypes.ENUM('L1', 'L2', 'L3', 'M1', 'M2', 'ING1', 'ING2', 'ING3'),
    allowNull: false
  },
  specialite: {
     type: DataTypes.ENUM(
    'TRONC_COMMUN', 'ACAD', 'ISIL', 'GTR',
    'BIOINFO', 'SII', 'IV', 'BIGDATA',
    'HPC', 'IL', 'SSI', 'RSD',
    'SOFTWARE_ENGINEERING', 'CYBER_SECURITE'
  ),
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
  faculte: {
    type: DataTypes.STRING(200),
    allowNull: true, 
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
  tableName: 'Modules', 
  indexes: [
    {
      unique: true,
      fields: ['niveau', 'specialite', 'semestre', 'nom_module']
    }
  ]
});

module.exports = Module;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type_notification: {
    type: DataTypes.ENUM('voeu accepté', 'négociation', 'nouveau voeu'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('non lu', 'lu'),
    allowNull: true,
    defaultValue: 'non lu'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: false
});

module.exports = Notification;
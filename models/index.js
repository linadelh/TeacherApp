
const Utilisateur = require('./Utilisateur');
const Enseignant = require('./Enseignant');
const Module = require('./Module');
const Voeu = require('./Voeu');
const ModuleVoeu = require('./ModuleVoeu');

// Association Utilisateur-Enseignant (one-to-one)
Enseignant.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });
Utilisateur.hasOne(Enseignant, { foreignKey: 'utilisateur_id' });

// Associations pour Voeu
Voeu.belongsTo(Enseignant, { foreignKey: 'utilisateur_id' });
Enseignant.hasMany(Voeu, { foreignKey: 'utilisateur_id' });

// Associations pour ModuleVoeu
ModuleVoeu.belongsTo(Voeu, { 
  foreignKey: 'voeu_id',
  onDelete: 'CASCADE',  // Change to CASCADE pour correspondre à la définition NOT NULL
  onUpdate: 'CASCADE'
});
Voeu.hasMany(ModuleVoeu, { 
  foreignKey: 'voeu_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

ModuleVoeu.belongsTo(Module, { 
  foreignKey: 'module_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE' 
});
Module.hasMany(ModuleVoeu, { 
  foreignKey: 'module_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = {
  Utilisateur,
  Enseignant,
  Module,
  Voeu,
  ModuleVoeu
};

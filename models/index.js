const Utilisateur = require('./Utilisateur');  
const Enseignant = require('./Enseignant');

// Définition des associations
Enseignant.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });
Utilisateur.hasOne(Enseignant, { foreignKey: 'utilisateur_id' });

module.exports = {
  Utilisateur,
  Enseignant
};

const express = require('express');
const router = express.Router();

const { Notification, Utilisateur, Negociations, Voeu, ModuleVoeu, Module } = require('../models');

// GET /modules/utilisateur/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Step 1: Get the accepted voeu for the user
    const voeux = await Voeu.findOne({
      where: { utilisateur_id: userId },
      order: [['date_soumission', 'DESC']]
    });
    if (!voeux) return res.status(404).json({ message: 'Aucun vœu trouvé pour cet utilisateur' });

    // Step 2: Get modules from module_voeux linked to this voeu
    const moduleVoeux = await ModuleVoeu.findAll({
      where: { voeu_id: voeux.id },
      include: [{
        model: Module,
        as: 'Module',
        attributes: ['id', 'nom_module', 'semestre', 'heures_cours', 'heures_td', 'heures_tp', 'niveau', 'specialite']
      }]
    });

    // Step 3: Format data per semester
    const semester1 = [];
    const semester2 = [];

    moduleVoeux.forEach(item => {
      const mod = item.Module;
      let heures = 0;
      if (item.type_enseignement === 'Cours') heures = mod.heures_cours;
      else if (item.type_enseignement === 'TD') heures = mod.heures_td;
      else if (item.type_enseignement === 'TP') heures = mod.heures_tp;

      const formatted = {
        id: mod.id,
        nom: mod.nom_module,
        type: item.type_enseignement,
        heures: `${heures}h`,
        semestre: mod.semestre,
        niveau: mod.niveau,
        specialite: mod.specialite
      };

      (mod.semestre === 'S1' ? semester1 : semester2).push(formatted);
    });
    const Vstatus = voeux.status;
    res.json({ semester1, semester2 ,Vstatus});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

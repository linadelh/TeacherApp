
const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const requireAuth = require('../middlewares/authMiddleware'); 



router.use(requireAuth);

// Récupérer toutes les notifications du chef
router.get('/', async (req, res) => {
  const notifications = await Notification.findAll({
    where: { utilisateur_id: req.user.id },
    order: [['created_at', 'DESC']]
  });
  res.json(notifications);
});

router.put('/read/all', async (req, res) => {
  await Notification.update(
    { statut: 'lu' },
    { where: { utilisateur_id: req.user.id, statut: 'non lu' } }
  );
  res.json({ success: true });
});


// Marquer une notification comme lue
router.put('/:id/read', async (req, res) => {
  await Notification.update(
    { statut: 'lu' },
    { where: { id: req.params.id, utilisateur_id: req.user.id } }
  );
  res.json({ success: true });
});

module.exports = router;

const { Notification } = require('../models');

await Notification.create({
  utilisateur_id: chefId, // l'id du chef à notifier
  type_notification: 'négociation',
  message: 'Un enseignant a lancé une négociation.',
  statut: 'non lu'
});

const notifications = await Notification.findAll({
  where: { utilisateur_id: req.user.id }, // ou chefId
  order: [['created_at', 'DESC']]
});
res.json(notifications);

await Notification.update(
  { statut: 'lu' },
  { where: { id: req.params.id, utilisateur_id: req.user.id } }
);


const { Message, Utilisateur , Notification } = require('../models');

exports.getMessages = async (req, res) => {
  const userId = req.user?.id;
  const messages = await Message.findAll({
    order: [['created_at', 'ASC']],
  });

  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const { content, receiver_id, notification_id } = req.body; // notification_id envoyé par le front
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Message content is required' });
  }
  const senderId = req.user.id;
  const message = await Message.create({
    sender_id: senderId,
    receiver_id: receiver_id,
    content: content.trim(),
  });
  try {
    const sender = await Utilisateur.findByPk(senderId);
    const receiver = await Utilisateur.findByPk(receiver_id);

    // Si le chef répond à l'enseignant, on marque la notification comme lue
    if (
      sender && receiver &&
      sender.role === 'chef_departement' &&
      receiver.role === 'enseignant' &&
      notification_id // il faut l'envoyer depuis le front !
    ) {
      await Notification.update(
        { statut: 'lu' },
        { where: { id: notification_id } }
      );
    }

    // (Garde ici la création de notification si enseignant répond au chef)
    if (
      sender && receiver &&
      sender.role === 'enseignant' &&
      receiver.role === 'chef_departement'
    ) {
      await Notification.create({
        utilisateur_id: receiver.id,
        type_notification: 'négociation',
        message: `${sender.prenom} ${sender.nom} a répondu à votre négociation.`,
        statut: 'non lu'
      });
    }
  } catch (err) {
    console.error("Erreur lors de la création/mise à jour de la notification:", err);
  }

  res.json(message);
};

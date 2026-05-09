const prisma = require('../models/db');
const webpush = require('web-push');

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const subscribe = async (req, res, next) => {
  try {
    const subscription = req.body;
    const userId = req.user?.id;

    // Guardar o actualizar suscripción
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId
      }
    });

    res.status(201).json({ message: 'Suscripción guardada exitosamente' });
  } catch (error) {
    next(error);
  }
};

const sendNotification = async (payload) => {
  try {
    const subscriptions = await prisma.pushSubscription.findMany();
    
    const notifications = subscriptions.map(sub => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      return webpush.sendNotification(pushConfig, JSON.stringify(payload))
        .catch(err => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Eliminar suscripciones expiradas o inválidas
            return prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
          console.error('Error enviando push:', err);
        });
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error('Error en sendNotification:', error);
  }
};

module.exports = {
  subscribe,
  sendNotification
};

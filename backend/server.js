require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const errorHandler = require('./src/middleware/errorHandler');
const footballService = require('./src/services/football.service');
const cacheService = require('./src/services/cache.service');

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const partidosRoutes = require('./src/routes/partidos.routes');
const prediccionesRoutes = require('./src/routes/predicciones.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const torneoRoutes = require('./src/routes/torneo.routes');
const ligasRoutes = require('./src/routes/ligas.routes');
const pushRoutes = require('./src/routes/push.routes');
const albumRoutes = require('./src/routes/album.routes');
const prediccionesService = require('./src/services/predicciones.service');
const pushController = require('./src/controllers/push.controller');
const telegramService = require('./src/services/telegram.service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // En producción, especificar el dominio del frontend
    methods: ["GET", "POST"]
  }
});
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/predicciones', prediccionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ligas', ligasRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/album', albumRoutes);
app.use('/api', torneoRoutes);

// Middleware de Socket.IO para Autenticación
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
  
  if (!token) {
    // Permitir conexiones anónimas pero sin acceso a ciertas funciones si se desea
    // O bloquearlas completamente: return next(new Error('Authentication error'));
    return next();
  }

  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Sistema de Rooms y Eventos Socket
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id} ${socket.user ? `(User: ${socket.user.userId})` : '(Anónimo)'}`);

  // Unirse a sala global por defecto
  socket.join('global');

  // Unirse a su sala personal si está autenticado
  if (socket.user && socket.user.userId) {
    socket.join(`user-${socket.user.userId}`);
  }

  socket.on('join:partido', ({ partidoId }) => {
    const room = `partido-${partidoId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} se unió a ${room}`);
  });

  socket.on('leave:partido', ({ partidoId }) => {
    const room = `partido-${partidoId}`;
    socket.leave(room);
    console.log(`Socket ${socket.id} salió de ${room}`);
  });

  socket.on('chat:mensaje', ({ partidoId, texto }) => {
    const room = `partido-${partidoId}`;
    // Broadcast a todos en la sala incluyendo al emisor
    io.to(room).emit('chat:nuevo-mensaje', {
      userId: socket.user?.userId || 'anónimo',
      texto,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Cron Job: Actualización de Partidos Live (Cada 30 segundos)
cron.schedule('*/30 * * * * *', async () => {
  try {
    const matches = await footballService.getPartidosLive();
    
    for (const match of matches) {
      const cacheKey = `live_state_${match.id}`;
      const prevState = await cacheService.get(cacheKey);
      
      const currentState = {
        score: match.score.fullTime,
        status: match.status,
        minute: match.minute
      };

      // Si no hay estado previo, guardar y continuar
      if (!prevState) {
        await cacheService.set(cacheKey, currentState, 3600);
        continue;
      }

      const prevData = prevState.data;

      // 1. Detectar Goles
      if (currentState.score.home !== prevData.score.home || currentState.score.away !== prevData.score.away) {
        const equipo = currentState.score.home !== prevData.score.home ? 'home' : 'away';
        
        io.to(`partido-${match.id}`).emit('partido:gol', {
          partidoId: match.id,
          equipo,
          marcador: currentState.score,
          minuto: currentState.minute
        });

        // Enviar Notificación Push
        pushController.sendNotification({
          title: '⚽ ¡GOL!',
          body: `${equipo === 'home' ? match.homeTeam.name : match.awayTeam.name} marcó un gol. Marcador: ${currentState.score.home}-${currentState.score.away} · min ${currentState.minute}`,
          icon: '/pwa-192x192.png',
          data: { url: `/partidos/${match.id}` }
        });

        // Enviar a Telegram (Canal principal)
        telegramService.broadcastToTelegram(
          `⚽ <b>¡GOL!</b>\n\n${equipo === 'home' ? match.homeTeam.name : match.awayTeam.name} marcó.\nMarcador: ${currentState.score.home}-${currentState.score.away}\nMinuto: ${currentState.minute}'`
        );
        
        console.log(`¡GOL en partido ${match.id}! Nuevo marcador: ${currentState.score.home}-${currentState.score.away}`);
      }

      // 2. Detectar cambios de estado o minuto
      if (currentState.status !== prevData.status || currentState.minute !== prevData.minute) {
        io.to(`partido-${match.id}`).emit('partido:update', {
          partidoId: match.id,
          marcador: currentState.score,
          minuto: currentState.minute,
          estado: currentState.status
        });
      }

      // 3. Detectar inicio/fin (simplificado)
      if (currentState.status === 'IN_PLAY' && prevData.status === 'TIMED') {
        io.to(`partido-${match.id}`).emit('partido:inicio', { partidoId: match.id });
      } else if (currentState.status === 'FINISHED' && prevData.status !== 'FINISHED') {
        io.to(`partido-${match.id}`).emit('partido:final', { 
          partidoId: match.id, 
          resultado: currentState.score 
        });
        
        // Procesar puntos para todas las predicciones de este partido
        await prediccionesService.procesarPuntosPartido(match.id, currentState.score, io);
      }

      // Actualizar estado en cache
      await cacheService.set(cacheKey, currentState, 3600);
    }
  } catch (error) {
    console.error('Error en Cron Job de Sockets:', error.message);
  }
});

// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Socket.IO listo para conexiones`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const errorHandler = require('./src/middleware/errorHandler');

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const partidosRoutes = require('./src/routes/partidos.routes');
const prediccionesRoutes = require('./src/routes/predicciones.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const torneoRoutes = require('./src/routes/torneo.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/predicciones', prediccionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api', torneoRoutes);

// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

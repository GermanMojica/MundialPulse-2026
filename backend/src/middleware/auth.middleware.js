const jwt = require('jsonwebtoken');
const prisma = require('../models/db');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó token o el formato es inválido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar usuario a la request
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, avatar: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado o token inválido' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado' });
    }
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = { verifyToken };

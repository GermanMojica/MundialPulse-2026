const express = require('express');
const router = express.Router();
const { register, login, me, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, me);

module.exports = router;

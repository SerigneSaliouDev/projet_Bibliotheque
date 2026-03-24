const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

// ─── Routes publiques (pas besoin de token) ───────────────────
router.post('/register', register);
router.post('/login', login);

// ─── Routes protégées (token obligatoire) ─────────────────────
router.get('/profile', verifyToken, profile);

module.exports = router;
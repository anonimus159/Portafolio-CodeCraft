const express = require('express');
const router = express.Router();
const { login, register, verifyToken, updatePassword } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');
const { authValidation } = require('../middleware/validation');

router.post('/login', authValidation.login, login);
router.post('/register', authValidation.register, register);
router.get('/verify', authMiddleware, verifyToken);
router.post('/password', authMiddleware, updatePassword);

module.exports = router;
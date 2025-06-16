const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Use register only once to create an admin user
router.post('/register', register);  // Optional for production
router.post('/login', login);

module.exports = router;
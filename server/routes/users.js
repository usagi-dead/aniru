const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/favorites', authMiddleware, userController.getUserFavorites);
router.post('/favorites', authMiddleware, userController.addToFavorites);

module.exports = router;

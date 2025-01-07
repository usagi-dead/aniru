const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const avatarUpload = require('../middlewares/uploadMiddleware')

// Получение профиля пользователя
router.get('/profile', authMiddleware, userController.getUserProfile)

// Получение избранного пользователя
router.get('/favorites', authMiddleware, userController.getUserFavorites)

// Добавление в избранное
router.post('/favorites', authMiddleware, userController.addToFavorites)

// Удаление из избранного
router.delete('/favorites', authMiddleware, userController.removeFromFavorites)

// Получение отзывов пользователя
router.get('/reviews', authMiddleware, userController.getUserReviews)

// Обновление профиля пользователя (с аватаром)
router.put(
    '/profile',
    authMiddleware,
    avatarUpload,
    userController.updateUserProfile
)

module.exports = router

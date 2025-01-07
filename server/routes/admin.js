// routes/admin.js
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

// ==================== Anime ====================
router.get(
    '/anime',
    authMiddleware,
    adminMiddleware,
    adminController.getAnimeList
)
router.post('/anime', authMiddleware, adminMiddleware, adminController.addAnime)
router.put(
    '/anime/:id',
    authMiddleware,
    adminMiddleware,
    adminController.updateAnime
)
router.delete(
    '/anime/:id',
    authMiddleware,
    adminMiddleware,
    adminController.deleteAnime
)

// ==================== AnimeReviews ====================
router.get(
    '/reviews',
    authMiddleware,
    adminMiddleware,
    adminController.getReviews
)
router.post(
    '/reviews',
    authMiddleware,
    adminMiddleware,
    adminController.addReview
)
router.put(
    '/reviews/:id',
    authMiddleware,
    adminMiddleware,
    adminController.updateReview
)
router.delete(
    '/reviews/:id',
    authMiddleware,
    adminMiddleware,
    adminController.deleteReview
)

// ==================== Users ====================
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers)
router.put(
    '/users/:id',
    authMiddleware,
    adminMiddleware,
    adminController.updateUser
)
router.delete(
    '/users/:id',
    authMiddleware,
    adminMiddleware,
    adminController.deleteUser
)

// ==================== Genres ====================
router.get(
    '/genres',
    authMiddleware,
    adminMiddleware,
    adminController.getGenres
)
router.post(
    '/genres',
    authMiddleware,
    adminMiddleware,
    adminController.addGenre
)
router.put(
    '/genres/:id',
    authMiddleware,
    adminMiddleware,
    adminController.updateGenre
)
router.delete(
    '/genres/:id',
    authMiddleware,
    adminMiddleware,
    adminController.deleteGenre
)

// ==================== AnimeGenres ====================
router.post(
    '/anime-genres',
    authMiddleware,
    adminMiddleware,
    adminController.addAnimeGenre
)
router.delete(
    '/anime-genres/:anime_id/:genre_id',
    authMiddleware,
    adminMiddleware,
    adminController.deleteAnimeGenre
)
router.get(
    '/anime/:anime_id/genres',
    authMiddleware,
    adminMiddleware,
    adminController.getGenresByAnimeId
)
router.get(
    '/genre/:genre_id/anime',
    authMiddleware,
    adminMiddleware,
    adminController.getAnimeByGenreId
)
router.get(
    '/anime-genres',
    authMiddleware,
    adminMiddleware,
    adminController.getAllAnimeGenres
)

module.exports = router

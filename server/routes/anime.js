const express = require('express')
const {
    getAnimeList,
    searchAnime,
    getAnimeById,
    addReview,
    getGenres,
    getReviewsByAnimeId,
} = require('../controllers/animeController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// Список аниме
router.get('/', getAnimeList)

// Поиск аниме
router.get('/search', searchAnime)

// Получение жанров
router.get('/genres', getGenres)

// Получение аниме по ID
router.get('/:id', getAnimeById)

// Добавление отзыва
router.post('/:id/reviews', authMiddleware, addReview)

// Получение отзывов
router.get('/:id/reviews', getReviewsByAnimeId)

module.exports = router

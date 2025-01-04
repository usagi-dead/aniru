const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', animeController.getAnimeList);
router.get('/search', animeController.searchAnime);
router.post('/:id/review', authMiddleware, animeController.addReview);

module.exports = router;

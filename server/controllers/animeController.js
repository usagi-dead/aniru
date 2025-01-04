const db = require('../utils/db');

const getAnimeList = (req, res) => {
    const query = 'SELECT * FROM Anime';
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const searchAnime = (req, res) => {
    const { title } = req.query;
    const query = 'SELECT * FROM Anime WHERE title LIKE ?';
    db.all(query, [`%${title}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const addReview = (req, res) => {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const query = 'INSERT INTO AnimeReviews (user_id, anime_id, rating, review) VALUES (?, ?, ?, ?)';
    db.run(query, [userId, id, rating, review], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Review added', reviewId: this.lastID });
    });
};

module.exports = { getAnimeList, searchAnime, addReview };

const db = require('../utils/db');

const getUserProfile = (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT username, avatar, description FROM Users WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
};

const getUserFavorites = (req, res) => {
    const userId = req.user.id;
    const query = `SELECT Anime.* FROM UserFavorites 
                 JOIN Anime ON UserFavorites.anime_id = Anime.id WHERE user_id = ?`;

    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const addToFavorites = (req, res) => {
    const userId = req.user.id;
    const { animeId } = req.body;

    const query = 'INSERT INTO UserFavorites (user_id, anime_id) VALUES (?, ?)';
    db.run(query, [userId, animeId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Anime added to favorites' });
    });
};

module.exports = { getUserProfile, getUserFavorites, addToFavorites };

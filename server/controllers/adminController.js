// controllers/adminController.js
const db = require('../utils/db')

// ==================== Anime ====================

// Получение всех аниме (GET)
const getAnimeList = (req, res) => {
    const query = `
        SELECT * FROM Anime
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Добавление аниме (POST)
const addAnime = (req, res) => {
    const { title, description, release_year, image_url } = req.body
    const query = `
        INSERT INTO Anime (title, description, release_year, image_url)
        VALUES (?, ?, ?, ?)
    `
    db.run(
        query,
        [title, description, release_year, image_url],
        function (err) {
            if (err) return res.status(500).json({ error: err.message })
            res.status(201).json({ id: this.lastID })
        }
    )
}

// Редактирование аниме (PUT)
const updateAnime = (req, res) => {
    const { id } = req.params
    const { title, description, release_year, image_url } = req.body
    const query = `
        UPDATE Anime
        SET title = ?, description = ?, release_year = ?, image_url = ?
        WHERE id = ?
    `
    db.run(
        query,
        [title, description, release_year, image_url, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message })
            res.json({ message: 'Anime updated' })
        }
    )
}

// Удаление аниме (DELETE)
const deleteAnime = (req, res) => {
    const { id } = req.params
    const query = `
        DELETE FROM Anime WHERE id = ?
    `
    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'Anime deleted' })
    })
}

// ==================== AnimeReviews ====================

// Получение всех отзывов (GET)
const getReviews = (req, res) => {
    const query = `
        SELECT * FROM AnimeReviews
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Добавление отзыва (POST)
const addReview = (req, res) => {
    const { user_id, anime_id, rating, review } = req.body
    const query = `
        INSERT INTO AnimeReviews (user_id, anime_id, rating, review)
        VALUES (?, ?, ?, ?)
    `
    db.run(query, [user_id, anime_id, rating, review], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ id: this.lastID })
    })
}

// Редактирование отзыва (PUT)
const updateReview = (req, res) => {
    const { id } = req.params
    const { rating, review } = req.body
    const query = `
        UPDATE AnimeReviews
        SET rating = ?, review = ?
        WHERE id = ?
    `
    db.run(query, [rating, review, id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'Review updated' })
    })
}

// Удаление отзыва (DELETE)
const deleteReview = (req, res) => {
    const { id } = req.params
    const query = `
        DELETE FROM AnimeReviews WHERE id = ?
    `
    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'Review deleted' })
    })
}

// ==================== Users ====================

// Получение всех пользователей (GET)
const getUsers = (req, res) => {
    const query = `
        SELECT id, username, role FROM Users
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Редактирование пользователя (PUT)
const updateUser = (req, res) => {
    const { id } = req.params
    const { username, role } = req.body
    const query = `
        UPDATE Users
        SET username = ?, role = ?
        WHERE id = ?
    `
    db.run(query, [username, role, id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'User updated' })
    })
}

// Удаление пользователя (DELETE)
const deleteUser = (req, res) => {
    const { id } = req.params
    const query = `
        DELETE FROM Users WHERE id = ?
    `
    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'User deleted' })
    })
}

// ==================== Genres ====================

// Получение всех жанров (GET)
const getGenres = (req, res) => {
    const query = `
        SELECT * FROM Genres
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Добавление жанра (POST)
const addGenre = (req, res) => {
    const { name } = req.body
    const query = `
        INSERT INTO Genres (name)
        VALUES (?)
    `
    db.run(query, [name], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ id: this.lastID })
    })
}

// Редактирование жанра (PUT)
const updateGenre = (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const query = `
        UPDATE Genres
        SET name = ?
        WHERE id = ?
    `
    db.run(query, [name, id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'Genre updated' })
    })
}

// Удаление жанра (DELETE)
const deleteGenre = (req, res) => {
    const { id } = req.params
    const query = `
        DELETE FROM Genres WHERE id = ?
    `
    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'Genre deleted' })
    })
}

// ==================== AnimeGenres ====================

// Добавление связи между аниме и жанром (POST)
const addAnimeGenre = (req, res) => {
    const { anime_id, genre_id } = req.body
    const query = `
        INSERT INTO AnimeGenres (anime_id, genre_id)
        VALUES (?, ?)
    `
    db.run(query, [anime_id, genre_id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ message: 'Anime-Genre link added' })
    })
}

// Удаление связи между аниме и жанром (DELETE)
const deleteAnimeGenre = (req, res) => {
    const { anime_id, genre_id } = req.params
    const query = `
        DELETE FROM AnimeGenres
        WHERE anime_id = ? AND genre_id = ?
    `
    db.run(query, [anime_id, genre_id], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: 'Anime-Genre link deleted' })
    })
}

// Получение всех жанров для конкретного аниме (GET)
const getGenresByAnimeId = (req, res) => {
    const { anime_id } = req.params
    const query = `
        SELECT Genres.id, Genres.name
        FROM AnimeGenres
        JOIN Genres ON AnimeGenres.genre_id = Genres.id
        WHERE AnimeGenres.anime_id = ?
    `
    db.all(query, [anime_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Получение всех аниме для конкретного жанра (GET)
const getAnimeByGenreId = (req, res) => {
    const { genre_id } = req.params
    const query = `
        SELECT Anime.id, Anime.title, Anime.description, Anime.release_year, Anime.image_url
        FROM AnimeGenres
        JOIN Anime ON AnimeGenres.anime_id = Anime.id
        WHERE AnimeGenres.genre_id = ?
    `
    db.all(query, [genre_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Получение всех связей между аниме и жанрами (GET)
const getAllAnimeGenres = (req, res) => {
    const query = `
        SELECT AnimeGenres.anime_id, AnimeGenres.genre_id, Anime.title AS anime_title, Genres.name AS genre_name
        FROM AnimeGenres
        JOIN Anime ON AnimeGenres.anime_id = Anime.id
        JOIN Genres ON AnimeGenres.genre_id = Genres.id
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

module.exports = {
    // Anime
    getAnimeList,
    addAnime,
    updateAnime,
    deleteAnime,

    // AnimeReviews
    getReviews,
    addReview,
    updateReview,
    deleteReview,

    // Users
    getUsers,
    updateUser,
    deleteUser,

    // Genres
    getGenres,
    addGenre,
    updateGenre,
    deleteGenre,

    // AnimeGenres
    addAnimeGenre,
    deleteAnimeGenre,
    getGenresByAnimeId,
    getAnimeByGenreId,
    getAllAnimeGenres,
}

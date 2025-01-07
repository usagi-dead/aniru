const db = require('../utils/db')

// Получение списка аниме
const getAnimeList = (req, res) => {
    const query = `
        SELECT 
            Anime.id, 
            Anime.title, 
            Anime.description, 
            Anime.release_year, 
            Anime.image_url,
            ROUND(IFNULL(AVG(AnimeReviews.rating), 0), 1) AS average_rating,
            GROUP_CONCAT(DISTINCT Genres.name) AS genres
        FROM Anime
        LEFT JOIN AnimeReviews ON Anime.id = AnimeReviews.anime_id
        LEFT JOIN AnimeGenres ON Anime.id = AnimeGenres.anime_id
        LEFT JOIN Genres ON AnimeGenres.genre_id = Genres.id
        GROUP BY Anime.id
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })

        // Обработка жанров: добавление запятой с пробелом
        const formattedRows = rows.map((row) => ({
            ...row,
            genres: row.genres ? row.genres.split(',').join(', ') : '',
        }))

        res.json(formattedRows)
    })
}

// Поиск аниме
const searchAnime = (req, res) => {
    const { title } = req.query

    // Приводим введенное title к нижнему регистру
    const lowerCaseTitle = title.toLowerCase()

    const query = `
        SELECT 
            Anime.id, 
            Anime.title, 
            Anime.description, 
            Anime.release_year, 
            Anime.image_url,
            ROUND(IFNULL(AVG(AnimeReviews.rating), 0), 1) AS average_rating,
            GROUP_CONCAT(DISTINCT Genres.name) AS genres
        FROM Anime
        LEFT JOIN AnimeReviews ON Anime.id = AnimeReviews.anime_id
        LEFT JOIN AnimeGenres ON Anime.id = AnimeGenres.anime_id
        LEFT JOIN Genres ON AnimeGenres.genre_id = Genres.id
        GROUP BY Anime.id
    `

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })

        // Фильтрация результатов в JavaScript, игнорируя регистр
        const filteredRows = rows
            .filter((row) => row.title.toLowerCase().includes(lowerCaseTitle))
            .sort((a, b) => {
                // Сортируем результаты так, чтобы те, которые начинаются с title, были первыми
                const aStartsWithTitle = a.title
                    .toLowerCase()
                    .startsWith(lowerCaseTitle)
                const bStartsWithTitle = b.title
                    .toLowerCase()
                    .startsWith(lowerCaseTitle)
                if (aStartsWithTitle && !bStartsWithTitle) return -1
                if (!aStartsWithTitle && bStartsWithTitle) return 1
                return 0
            })

        // Обработка жанров: добавление запятой с пробелом
        const formattedRows = filteredRows.map((row) => ({
            ...row,
            genres: row.genres ? row.genres.split(',').join(', ') : '',
        }))

        res.json(formattedRows)
    })
}

// Получение аниме по ID
const getAnimeById = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT 
            Anime.id, 
            Anime.title, 
            Anime.description, 
            Anime.release_year, 
            Anime.image_url,
            ROUND(IFNULL(AVG(AnimeReviews.rating), 0), 1) AS average_rating,
            GROUP_CONCAT(DISTINCT Genres.name) AS genres
        FROM Anime
        LEFT JOIN AnimeReviews ON Anime.id = AnimeReviews.anime_id
        LEFT JOIN AnimeGenres ON Anime.id = AnimeGenres.anime_id
        LEFT JOIN Genres ON AnimeGenres.genre_id = Genres.id
        WHERE Anime.id = ?
        GROUP BY Anime.id
    `
    db.get(query, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message })
        if (!row) return res.status(404).json({ error: 'Anime not found' })

        // Обработка жанров: добавление запятой с пробелом
        const formattedRow = {
            ...row,
            genres: row.genres ? row.genres.split(',').join(', ') : '',
        }

        res.json(formattedRow)
    })
}

// Получение всех жанров аниме
const getGenres = (req, res) => {
    const query = `
        SELECT name
        FROM Genres
    `
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })

        const genresArray = rows.map((row) => row.name)
        res.json(genresArray)
    })
}

// Добавление отзыва
const addReview = (req, res) => {
    const { id } = req.params
    const { rating, review } = req.body
    const userId = req.user.id

    const query =
        'INSERT INTO AnimeReviews (user_id, anime_id, rating, review) VALUES (?, ?, ?, ?)'
    db.run(query, [userId, id, rating, review], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ message: 'Review added', reviewId: this.lastID })
    })
}

// Получение отзывов
const getReviewsByAnimeId = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT 
            AnimeReviews.id, 
            AnimeReviews.rating, 
            AnimeReviews.review, 
            AnimeReviews.created_at, 
            Users.username, 
            Users.avatar
        FROM AnimeReviews
        JOIN Users ON AnimeReviews.user_id = Users.id
        WHERE AnimeReviews.anime_id = ?
        ORDER BY AnimeReviews.created_at DESC
    `
    db.all(query, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(rows)
    })
}

module.exports = {
    getAnimeList,
    searchAnime,
    getAnimeById,
    getGenres,
    addReview,
    getReviewsByAnimeId,
}

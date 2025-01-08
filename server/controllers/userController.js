const db = require('../utils/db')

// Получение профиля пользователя
const getUserProfile = (req, res) => {
    const userId = req.user.id
    const query =
        'SELECT username, avatar, description, role FROM Users WHERE id = ?'

    db.get(query, [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(row)
    })
}

// Получение избранного пользователя
const getUserFavorites = (req, res) => {
    const userId = req.user.id
    const query = `
        SELECT 
            Anime.id, 
            Anime.title, 
            Anime.description, 
            Anime.release_year, 
            Anime.image_url,
            ROUND(IFNULL(AVG(AnimeReviews.rating), 0), 1) AS average_rating,
            GROUP_CONCAT(DISTINCT Genres.name) AS genres
        FROM UserFavorites
        JOIN Anime ON UserFavorites.anime_id = Anime.id
        LEFT JOIN AnimeReviews ON Anime.id = AnimeReviews.anime_id
        LEFT JOIN AnimeGenres ON Anime.id = AnimeGenres.anime_id
        LEFT JOIN Genres ON AnimeGenres.genre_id = Genres.id
        WHERE UserFavorites.user_id = ?
        GROUP BY Anime.id
    `

    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })

        // Обработка жанров: добавление запятой с пробелом
        const formattedRows = rows.map((row) => ({
            ...row,
            genres: row.genres ? row.genres.split(',').join(', ') : '',
        }))

        res.json(formattedRows)
    })
}

// Добавление в избранное
const addToFavorites = (req, res) => {
    const userId = req.user.id
    const { animeId } = req.body

    const query = 'INSERT INTO UserFavorites (user_id, anime_id) VALUES (?, ?)'
    db.run(query, [userId, animeId], function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ message: 'Anime added to favorites' })
    })
}

// Удаление из избранного
const removeFromFavorites = (req, res) => {
    const userId = req.user.id
    const { animeId } = req.body

    const query = 'DELETE FROM UserFavorites WHERE user_id = ? AND anime_id = ?'
    db.run(query, [userId, animeId], function (err) {
        if (err) return res.status(500).json({ error: err.message })

        if (this.changes === 0) {
            return res
                .status(404)
                .json({ error: 'Anime not found in favorites' })
        }

        res.status(200).json({ message: 'Anime removed from favorites' })
    })
}

// Получение отзывов пользователя
const getUserReviews = (req, res) => {
    const userId = req.user.id
    const query = `
        SELECT Anime.title, AnimeReviews.review, AnimeReviews.rating
        FROM AnimeReviews
        JOIN Anime ON AnimeReviews.anime_id = Anime.id
        WHERE AnimeReviews.user_id = ?
    `

    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
}

// Обновление профиля пользователя
const updateUserProfile = (req, res) => {
    try {
        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' })
        }

        const { username, description } = req.body
        let avatar = null

        // Если файл загружен, сохраняем только имя файла
        if (req.file) {
            avatar = req.file.filename
        }

        const query = `
            UPDATE Users
            SET username = ?, description = ?, avatar = ?
            WHERE id = ?
        `

        db.run(query, [username, description, avatar, userId], function (err) {
            if (err) {
                console.error('Database error:', err.message)
                return res.status(500).json({ error: 'Database error' })
            }

            res.status(200).json({
                message: 'Profile updated successfully',
                avatarUrl: avatar, // Возвращаем только имя файла
            })
        })
    } catch (err) {
        console.error('Unexpected error:', err)
        res.status(500).json({ error: 'Unexpected server error' })
    }
}

module.exports = {
    getUserProfile,
    getUserFavorites,
    addToFavorites,
    removeFromFavorites,
    getUserReviews,
    updateUserProfile,
}

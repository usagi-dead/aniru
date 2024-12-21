import express from 'express'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 5000

const secretKey = crypto.randomBytes(64).toString('hex')

const dbPath = path.join(__dirname, 'public', 'anime.db')
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message)
    } else {
        console.log('База данных подключена.')
    }
})

// Middleware
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    })
)

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    )
    next()
})

// Заглушка для favicon
app.get('/favicon.ico', (req, res) => {
    res.status(204).send()
})

// Роут для корня
app.get('/', (req, res) => {
    res.send(
        "<!DOCTYPE html><html lang='en'><head><title>Anime API</title></head><body><h1>Добро пожаловать на сервер Anime API!</h1></body></html>"
    )
})

// API для аниме
app.get('/api/anime', (req, res) => {
    const query = `
        SELECT 
            a.id, 
            a.title, 
            a.description, 
            a.release_year, 
            a.image_url,
            GROUP_CONCAT(g.name, ', ') AS genres,
            COALESCE(ROUND(AVG(r.rating), 1), 1) AS average_rating
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        LEFT JOIN AnimeReviews r ON a.id = r.anime_id
        GROUP BY a.id
    `

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }

        rows.forEach((row) => {
            if (row.genres) {
                const genresArray = row.genres.split(', ')
                const uniqueGenres = Array.from(new Set(genresArray)) // Убираем дубликаты
                row.genres = uniqueGenres.join(', ') // Собираем обратно в строку
            }
        })

        res.json(rows)
    })
})

app.get('/api/anime/:id', (req, res) => {
    const query = `
        SELECT 
            a.id, 
            a.title, 
            a.description, 
            a.release_year, 
            a.image_url,
            GROUP_CONCAT(g.name, ', ') AS genres,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        LEFT JOIN AnimeReviews r ON a.id = r.anime_id
        WHERE a.id = ?
        GROUP BY a.id
    `
    const params = [req.params.id]
    db.get(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        if (!row) {
            return res.status(404).json({ error: 'Аниме не найдено.' })
        }

        if (row.genres) {
            const genresArray = row.genres.split(', ')
            const uniqueGenres = Array.from(new Set(genresArray)) // Убираем дубликаты
            row.genres = uniqueGenres.join(', ') // Собираем обратно в строку
        }

        res.json(row)
    })
})

app.get('/api/genres', (req, res) => {
    const query = 'SELECT name FROM Genres'
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            const genres = rows.map((row) => row.name)
            res.json(genres)
        }
    })
})

app.get('/api/search', (req, res) => {
    const query = `
        SELECT
            a.id,
            a.title,
            a.description,
            a.release_year,
            a.image_url,
            GROUP_CONCAT(g.name, ', ') AS genres,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        LEFT JOIN AnimeReviews r ON a.id = r.anime_id
        GROUP BY a.id
    `

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            const searchTerm = req.query.q ? req.query.q.toLowerCase() : ''
            const filteredRows = rows.filter((row) =>
                row.title.toLowerCase().includes(searchTerm)
            )

            filteredRows.sort((a, b) => {
                if (a.title.toLowerCase().startsWith(searchTerm)) {
                    return -1
                } else if (b.title.toLowerCase().startsWith(searchTerm)) {
                    return 1
                } else {
                    return 0
                }
            })

            res.json(filteredRows)
        }
    })
})

// Регистрация
app.post('/api/register', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Все поля обязательны.' })
    }

    const hash = bcrypt.hashSync(password, 10)
    const query = 'INSERT INTO Users (username, password_hash) VALUES (?, ?)'

    db.run(query, [username, hash], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint')) {
                return res
                    .status(400)
                    .json({ error: 'Пользователь уже существует.' })
            }
            return res.status(500).json({ error: err.message })
        }
        res.status(201).json({ message: 'Пользователь зарегистрирован.' })
    })
})

// Авторизация
app.post('/api/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Все поля обязательны.' })
    }

    const query = 'SELECT id, password_hash FROM Users WHERE username = ?'
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        if (!user) {
            return res.status(401).json({ error: 'Неверный логин или пароль.' })
        }

        const isValid = bcrypt.compareSync(password, user.password_hash)
        if (!isValid) {
            return res.status(401).json({ error: 'Неверный логин или пароль.' })
        }

        const token = jwt.sign({ id: user.id, username }, secretKey, {
            expiresIn: '1h',
        })
        res.json({ token })
    })
})

// Добавление отзыва и рейтинга для аниме
app.post('/api/review', (req, res) => {
    const { user_id, anime_id, rating, review } = req.body

    if (!user_id || !anime_id || !rating) {
        return res
            .status(400)
            .json({ error: 'Поля user_id, anime_id и rating обязательны.' })
    }

    const query =
        'INSERT INTO AnimeReviews (user_id, anime_id, rating, review) VALUES (?, ?, ?, ?)'
    db.run(query, [user_id, anime_id, rating, review], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(201).json({ message: 'Отзыв добавлен.' })
    })
})

// Получение всех отзывов для конкретного аниме
app.get('/api/anime/:id/reviews', (req, res) => {
    const query = `
        SELECT r.rating, r.review, u.username, r.created_at
        FROM AnimeReviews r
        JOIN Users u ON r.user_id = u.id
        WHERE r.anime_id = ?
        ORDER BY r.created_at DESC
    `
    const params = [req.params.id]
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(rows)
    })
})

// Получение среднего рейтинга аниме
app.get('/api/anime/:id/average-rating', (req, res) => {
    const query = `
        SELECT ROUND(AVG(rating), 1) AS average_rating
        FROM AnimeReviews
        WHERE anime_id = ?
    `
    const params = [req.params.id]
    db.get(query, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        const averageRating = row.average_rating || 0
        res.json({ average_rating: averageRating })
    })
})

// Добавление аниме в избранное
app.post('/api/favorites', (req, res) => {
    const { user_id, anime_id } = req.body

    if (!user_id || !anime_id) {
        return res
            .status(400)
            .json({ error: 'Поля user_id и anime_id обязательны.' })
    }

    const query = 'INSERT INTO UserFavorites (user_id, anime_id) VALUES (?, ?)'
    db.run(query, [user_id, anime_id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(201).json({ message: 'Аниме добавлено в избранное.' })
    })
})

// Получение всех отзывов пользователя
app.get('/api/user/:userId/reviews', (req, res) => {
    const query = `
        SELECT r.rating, r.review, a.title AS anime_title, a.id AS anime_id, r.created_at
        FROM AnimeReviews r
        JOIN Anime a ON r.anime_id = a.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    `
    const params = [req.params.userId]
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(rows)
    })
})

// Получение списка избранных аниме пользователя
app.get('/api/user/:userId/favorites', (req, res) => {
    const query = `
        SELECT a.id, a.title, a.image_url
        FROM UserFavorites uf
        JOIN Anime a ON uf.anime_id = a.id
        WHERE uf.user_id = ?
    `
    const params = [req.params.userId]
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        if (rows.length === 0) {
            return res.json({ message: 'У вас нет избранных аниме.' })
        }
        res.json(rows)
    })
})

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})

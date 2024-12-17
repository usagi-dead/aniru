import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 5000

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
            a.rating, 
            a.image_url,
            GROUP_CONCAT(g.name, ', ') AS genres
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        GROUP BY a.id
    `

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.json(rows)
        }
    })
})

app.get('/api/anime/:id', (req, res) => {
    const query = `
        SELECT 
            a.id, 
            a.title, 
            a.description, 
            a.release_year, 
            a.rating, 
            a.image_url,
            GROUP_CONCAT(g.name, ', ') AS genres
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        WHERE a.id = ?
        GROUP BY a.id
    `
    const params = [req.params.id]
    db.get(query, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else if (!row) {
            res.status(404).json({ error: 'Аниме не найдено.' })
        } else {
            res.json(row)
        }
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

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})

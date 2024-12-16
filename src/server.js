const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Initialize database
const db = new sqlite3.Database('./anime.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message)
    } else {
        console.log('Connected to the SQLite database.')
    }
})

// Helper to execute SQL queries
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

// Routes

// Get all anime
app.get('/anime', async (req, res) => {
    try {
        const query = `
            SELECT a.id, a.title, a.description, a.release_year, a.rating, a.image_url, 
                   GROUP_CONCAT(g.name, ', ') AS genres
            FROM Anime a
            LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
            LEFT JOIN Genres g ON ag.genre_id = g.id
            GROUP BY a.id;
        `
        const anime = await executeQuery(query)
        res.json(anime)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get anime by ID
app.get('/anime/:id', async (req, res) => {
    try {
        const query = `
            SELECT a.id, a.title, a.description, a.release_year, a.rating, a.image_url, 
                   GROUP_CONCAT(g.name, ', ') AS genres
            FROM Anime a
            LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
            LEFT JOIN Genres g ON ag.genre_id = g.id
            WHERE a.id = ?
            GROUP BY a.id;
        `
        const anime = await executeQuery(query, [req.params.id])
        if (anime.length > 0) {
            res.json(anime[0])
        } else {
            res.status(404).json({ message: 'Anime not found' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get genres
app.get('/genres', async (req, res) => {
    try {
        const query = `SELECT id, name FROM Genres;`
        const genres = await executeQuery(query)
        res.json(genres)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Filter anime
app.post('/anime/filter', async (req, res) => {
    const { selectedGenres, yearRange, rating } = req.body

    try {
        let filters = []
        let params = []

        if (selectedGenres && selectedGenres.length > 0) {
            filters.push(
                `g.name IN (${selectedGenres.map(() => '?').join(', ')})`
            )
            params.push(...selectedGenres)
        }

        if (yearRange) {
            filters.push('a.release_year BETWEEN ? AND ?')
            params.push(yearRange[0], yearRange[1])
        }

        if (rating) {
            filters.push('a.rating >= ?')
            params.push(rating)
        }

        const whereClause =
            filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''

        const query = `
            SELECT a.id, a.title, a.description, a.release_year, a.rating, a.image_url, 
                   GROUP_CONCAT(g.name, ', ') AS genres
            FROM Anime a
            LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
            LEFT JOIN Genres g ON ag.genre_id = g.id
            ${whereClause}
            GROUP BY a.id;
        `

        const filteredAnime = await executeQuery(query, params)
        res.json(filteredAnime)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

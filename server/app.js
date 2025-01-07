const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

// Импорт маршрутов
const animeRoutes = require('./routes/anime')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Настройка CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // URL фронтенда
        credentials: true,
    })
)

// CSP через Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'"],
            },
        },
    })
)

// Заголовок Cross-Origin-Resource-Policy
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    next()
})

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    '/favicon.ico',
    express.static(path.join(__dirname, 'public/favicon.ico'))
)

// Обслуживание аватарок
app.use(
    '/uploads/avatars',
    express.static(path.join(__dirname, 'uploads/avatars'))
)

// Маршруты
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Anime Catalog API')
})

app.use('/api/anime', animeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Обработка неизвестных маршрутов
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' })
})

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
})

module.exports = app

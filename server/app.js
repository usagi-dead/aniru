const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

// Импорт маршрутов
const animeRoutes = require('./routes/anime')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const allowedOrigins = [
    'http://localhost:5173', // Для локальной разработки
    'https://aniru-catalog.netlify.app', // Для продакшн-версии
]

// Настройка CORS
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
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
                imgSrc: [
                    "'self'",
                    'data:',
                    'https://anime-catalog-7kii.onrender.com',
                ], // Разрешаем загрузку изображений с вашего сервера
                connectSrc: [
                    "'self'",
                    'https://anime-catalog-7kii.onrender.com',
                ], // Разрешаем запросы к вашему серверу
            },
        },
    })
)

// Заголовок Cross-Origin-Resource-Policy
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin') // Разрешаем доступ с других доменов
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
    express.static(path.join(__dirname, 'uploads/avatars'), {
        setHeaders: (res) => {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin') // Разрешаем доступ к аватаркам с других доменов
        },
    })
)

// Маршруты
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Anime Catalog API')
})

app.use('/api/anime', animeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)

// Обработка неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
})

module.exports = app

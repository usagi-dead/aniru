const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Создаем папку для загрузки аватарок, если она не существует
const uploadPath = path.join(__dirname, '../uploads/avatars')
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

// Настройка Multer для загрузки аватарок
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath) // Путь для сохранения
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const filename = `${Date.now()}${ext}` // Уникальное имя файла
        cb(null, filename)
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла (5MB)
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(
                new Error('Only .jpg, .jpeg, .png files are allowed'),
                false
            )
        }
        cb(null, true)
    },
})

// Экспортируем middleware
const avatarUpload = upload.single('avatar')
module.exports = avatarUpload

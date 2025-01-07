const db = require('../utils/db')

module.exports = async (req, res, next) => {
    const userId = req.user?.id // Получаем ID пользователя из токена

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        // Запрос к базе данных для получения роли пользователя
        const query = 'SELECT role FROM Users WHERE id = ?'
        db.get(query, [userId], (err, user) => {
            if (err || !user) {
                return res.status(500).json({ error: 'Database error' })
            }

            if (user.role !== 'admin') {
                return res
                    .status(403)
                    .json({ error: 'Forbidden: Access denied' })
            }

            next() // Продолжаем, если пользователь администратор
        })
    } catch (error) {
        console.error('Error checking user role:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

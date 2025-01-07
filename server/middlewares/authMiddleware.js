const jwt = require('../utils/jwt')

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        req.user = jwt.verifyToken(token)
        next()
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' })
    }
}

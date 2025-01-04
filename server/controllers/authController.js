const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const db = require('../utils/db');

const register = (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO Users (username, password_hash) VALUES (?, ?)';
    db.run(query, [username, hash], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered', userId: this.lastID });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE username = ?';

    db.get(query, [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

        const isValid = bcrypt.compareSync(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.generateToken({ id: user.id, username: user.username });
        res.json({ token });
    });
};

module.exports = { register, login };

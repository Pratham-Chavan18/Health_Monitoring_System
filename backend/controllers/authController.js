const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');

const signup = async (req, res, next) => {
    try {
        const users = getDB().collection('users');
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const exists = await users.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        await users.insertOne({ email, password: hash });
        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const users = getDB().collection('users');
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

module.exports = { signup, login };

const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser
} = require('../controllers/users-controller');

// create a new user
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        res.status(400).send({ message: 'Name, username, and password are required' });
        return;
    }

    const result = await registerUser({ name, username, password });
    switch (result.status) {
        case 'success':
            res.status(201).send({ message: result.message });
            break;
        default:
            res.status(500).send({ message: result.message });
    }
});

// login a new user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({ message: 'Username and password are required' });
        return;
    }

    const result = await loginUser({ username, password });
    switch (result.status) {
        case 'success':
            res.status(200).send({ message: result.message, token: result.token });
            break;
        case 'not found':
            res.status(404).send({ message: result.message, token: result.token });
            break;
        case 'invalid password':
            res.status(401).send({ message: result.message, token: result.token });
            break;
        default:
            res.status(500).send({ message: result.message, token: result.token });
    }
});

module.exports = router;
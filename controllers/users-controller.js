const users = require('../models/userModels');
const bcrypt = require('bcrypt');
const SALT_ROUND = 5;
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const registerUser = async (user) => {
    try {
        const newUser = new users(user);
        await newUser.validate();

        user.password = await bcrypt.hash(user.password, SALT_ROUND);
        const dbUser = await users.create(user);
        return { status: 'success', message:'User create Successfully!', user: dbUser };
    } catch (error) {
        return { status: 'error', message: 'Error creating user', user: null };
    }
}

const loginUser = async (user) => {
    try {
        const { username, password } = user;
        const dbUser = await users.findOne({ username });
        if (!dbUser) {
            return { status: 'not found', message: 'User not found', token: null };
        }
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordValid) {
            return { status: 'invalid password', message: 'Invalid password', token: null };
        }
        const token = jwt.sign({ id: dbUser._id, name: dbUser.name, username: dbUser.username }, JWT_SECRET_KEY, { expiresIn: '1h' });
        return { status: 'success', message: 'User logged in successfully', token };
    }
    catch (error) {
        return { status: 'error', message: 'Error logging in user', token: null };
    }
}

module.exports = {
    registerUser,
    loginUser
}
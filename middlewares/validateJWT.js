const jwtwebtoken = require('jsonwebtoken');
const jwt_secret_key = process.env.JWT_SECRET_KEY;

const validateJWT = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        res.status(401).send({ message: 'User not authorized' });
        return;
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    
    try {
        const user = jwtwebtoken.verify(token, jwt_secret_key);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid token' });
    }
}

module.exports = validateJWT;
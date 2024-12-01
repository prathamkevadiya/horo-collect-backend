const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token =
        req.cookies?.token || // Check cookies
        req.headers['authorization']?.split(' ')[1]; // Check Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID from token payload to the request
        req.userId = decoded.id;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token', error: err.message });
    }
};

module.exports = auth;
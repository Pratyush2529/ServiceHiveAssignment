const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {


        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }


        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }


        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
};

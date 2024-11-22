const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (token) {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            await User.findById(user.userId)
                .then((user) => {
                    req.user = user;
                    next();
                })
                .catch((error) => {
                    console.log(error);
                    res.status(401).json({ message: 'Invalid token' });
                });

        } else {
            res.status(401).json({ message: "Authentication failed" });

        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Authentication failed" });
    }
};
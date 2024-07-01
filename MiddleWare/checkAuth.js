
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method == 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            console.log("no access");
            throw new Error("Authentication failure ")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        console.log(decodedToken);
        req.userData = { userID: decodedToken.userID };
        console.log("bruh 2")
        next();
    } catch (err) {
        console.log("get lost");
        res.status(401).json({ message: err.message });
    }
};

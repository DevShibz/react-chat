const { decodeJWT } = require("../utils");

// Middleware function
const globalMiddleWare = (req, res, next) => {
    
    res.locals.user = decodeJWT(req.headers.authorization);
    next();
};

module.exports = globalMiddleWare;
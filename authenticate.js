const jwt = require('jsonwebtoken');
 
exports.verifyUser = (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: "You are not authorized to view this content"});
        return;
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "Invalid Session"});
            return;
        }

        const { _id } = payload;
        if (_id !== process.env.PASSWORD) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "Invalid User"});
            return;
        }
        
        req.isUserVerified = true;
        next();
    });
}


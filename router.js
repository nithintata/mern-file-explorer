const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authenticate = require('./authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    res.send("Welcome Nithin");
});

router.get('/check', authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.send("Protected Route Working")
});

router.post('/auth/signIn', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: "Please fill all the fields!"});
        return;
    }

    if (username !== process.env.USER_HANDLE || password !== process.env.PASSWORD) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: "Incorrect Credentials!"});
        return;
    }

    const token = jwt.sign({_id: password}, process.env.JWT_KEY);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({token});
});

module.exports = router;
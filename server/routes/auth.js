const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const jwt = require("jsonwebtoken");


router
.post('/register', async function (req, res, next){
    try {
        const user = await auth.registerUser(req.body);
        if(!user){
            return res.json({message: 'Failed to create a user'})
        }

        const token = jwt.sign(
            JSON.stringify({username: user.first_name, id:user.id}), process.env.JWT_SECRET
        )

        user.token = token;
        user.user.token = token;

        res.cookie('user', user)
        res.json(user)

    } catch (err) {
        console.error('Error while registering user', err.message);
        next(err);
    }
})

.post('/login', async function (req, res, next){
    try {
        const user = await auth.userByEmail(req.body);
        await auth.matchPass(req.body);

        const token = jwt.sign(
            JSON.stringify({username: user.first_name, id:user.id}), process.env.JWT_SECRET
        )

        user.token = token;
        user.user.token = token;


        res.cookie('user', user)
        res.json(user);
    } catch (err) {
        console.error('Error while logging in', err.message);
        next(err);
    }
})

module.exports = router;
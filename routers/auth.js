const express = require('express')
const AuthRoute = express.Router()
const passport = require('passport')


const authCheck = (req, res, next) => {
    if (!req.user) {
        //if user is not log in
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "PUT, DELETE");
        res.redirect('/auth/google')
    } else {
        //if login
        next();
    }
}

AuthRoute.get('/login', authCheck, (req, res) => {
    res.send('Login page ne ' + req.user);
})

AuthRoute.get('/profile', authCheck, (req, res) => {
    res.send('Your are loggin in ' + req.user.username)
})

AuthRoute.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})
//auth logout
AuthRoute.get('/logout', (req, res) => {
    //handle with passport 
    res.send('log out');
})
//auth with google
AuthRoute.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

//handle redirect
AuthRoute.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/auth/profile');
})
module.exports = AuthRoute;
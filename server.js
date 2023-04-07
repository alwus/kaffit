require("dotenv").config();

const express = require('express');
const app = express()
const userApi = require('./userStatements')
const PORT = process.env.PORT || 80;
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

const initPassport = require('./passportConfig');
initPassport(passport);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'html');
app.use(express.urlencoded({ extended : false }));

app.get('/feed', checkNotAuthenticated, (req, res) => {
    res.sendFile('feed.html', {root: 'views'})
});

app.get('/login', checkAuthenticated, (req, res) => {
    res.sendFile('login.html', {root: 'views'})
});

app.post('/login', passport.authenticate("local", {
    successRedirect: '/feed',
    failureRedirect: '/login',
    failureFlash: false
}));

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/feed");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
require("dotenv").config();

const express = require('express');
const app = express()
const userApi = require('./userStatements')
const contentApi = require('./contentStatements')
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

app.use('/gui', express.static(__dirname + '/gui'));

app.get('/feed', checkNotAuthenticated, (req, res) => {
    /*for(media in theAlgorithm.getLatestPosts()) {
        
    }*/
    res.sendFile('feed.html', {root: 'views'});
});

app.get('/createpost', checkNotAuthenticated, (req, res) => {
    res.sendFile('createpost.html', {root: 'views'});
});

app.post('/createpost', checkNotAuthenticated, (req, res) => {
    console.log(req.user.uuid);
    console.log(req.body.text);
    (async () => {
        await contentApi.createPost(req.user.uuid, req.body.text);
    })();
    return res.redirect("/feed");
});

app.get('/api/feed', checkNotAuthenticated, (req, res) => {
    (async () => {
        rows = await contentApi.getLatestPosts();
        res.send(rows)
    })();
    //res.send( { uuid: 9999999, text: "Hallo welt " });
});

app.get('/api/user/:handle', checkNotAuthenticated, (req, res) => {
    (async () => {
        row = await userApi.getUser(req.params.handle);
        res.send(row)
    })();
});

app.get('/images/:file', checkNotAuthenticated, (req, res) => {
    let file = req.params.file;
    res.sendFile(file, {root: 'media/images'});
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
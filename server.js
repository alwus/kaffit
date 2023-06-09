require("dotenv").config();

const express = require('express');
const app = express()
const userApi = require('./userStatements')
const contentApi = require('./contentStatements')
const PORT = process.env.PORT || 10000;
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const fileUpload = require('express-fileupload');

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

app.use(
    fileUpload({
        limits: {
            fileSize: 2000000, // Around 10MB
        },
        abortOnLimit: true,
    })
);

app.use('/gui', express.static(__dirname + '/gui'));

app.get('/', checkNotAuthenticated, (req, res) => {
    res.redirect('/feed');
});

app.get('/feed', checkNotAuthenticated, (req, res) => {
    /*for(media in theAlgorithm.getLatestPosts()) {
        
    }*/
    res.sendFile('feed.html', {root: 'views'});
});

app.get('/createpost', checkNotAuthenticated, (req, res) => {
    res.sendFile('createpost.html', {root: 'views'});
});

app.post('/createpost', checkNotAuthenticated, (req, res) => {
    let imagelink = null;
    try {
        console.log(req.user.uuid);
        console.log(req.body.textArea);
        const { image } = req.files;
        console.log(image);
        if(image && image.mimetype.split('/')[0] === "image") {
            const format = image.mimetype.split('/')[1]; //select after the / of e.g. image/png
            const checksum = image.md5;
            imagelink = `${checksum}.${format}`;
            console.log(imagelink);
            image.mv(__dirname + '/media/images/' + imagelink)
        
        } else {
            const image = null;
        }
    } catch(error) {
    }
    (async () => {
        await contentApi.createPost(req.user.uuid, req.body.textArea, imagelink);
    })();
    return res.redirect("/feed");
});

app.post('/comment/:post', checkNotAuthenticated, (req, res) => {
    (async () => {
        contentApi.createComment(req.user.uuid, req.params.post, req.body.textArea);
    })()
    res.redirect(`/post?id=${req.params.post}`);
});

app.get('/api/feed', checkNotAuthenticated, (req, res) => {
    (async () => {
        rows = await contentApi.getLatestPosts();
        res.send(rows)
    })();
    //res.send( { uuid: 9999999, text: "Hallo welt " });
});

app.get('/api/user/:handle', checkNotAuthenticated, (req, res) => {
    try {
        (async () => {
            row = await userApi.getUser(req.params.handle);
            res.send(row)
        })();
    } catch(error) {
        res.sendStatus(404);
    }
});

app.get('/api/post/:id', checkNotAuthenticated, (req, res) => {
    try {
        (async () => {
            row = await contentApi.getPost(req.params.id);
            res.send(row)
        })();
    } catch(error) {
        res.sendStatus(404);
    }
});

app.get('/api/comments/:post', checkNotAuthenticated, (req, res) => {
    try {
        (async () => {
            row = await contentApi.getComments(req.params.post);
            res.send(row)
        })();
    } catch(error) {
        res.sendStatus(404);
    }
});

app.get('/api/me', checkNotAuthenticated, (req, res) => {
    res.send(req.user.handle);
});

app.get('/image/:file', checkNotAuthenticated, (req, res) => {
    try {
        let file = req.params.file;
        res.sendFile(file, {root: 'media/images'});
    } catch(error) {
        res.sendStatus(404);
    }
});

app.get('/profilepictures/:handle', checkNotAuthenticated, (req, res) => {
    (async () => {
        try {
            let user = await userApi.getUserByHandle(req.params.handle);
            console.log(user.uuid);
            try {
                res.sendFile(`${user.uuid}`, {root: 'media/profilepictures'});
            } catch(error) {
                res.sendFile('ppdefault.png', {root: 'media/profilepictures'});
            }
        } catch(error) {
            res.sendStatus(404);
        }
    })();
});

app.get('/editprofile', checkNotAuthenticated, (req, res) => {
    res.sendFile('editprofile.html', {root: 'views'})
});

app.post('/editprofile', checkNotAuthenticated, (req, res) => {  
    try {
        const { image } = req.files;
        if(image) {
            image.mv(__dirname + '/media/profilepictures/' + req.user.uuid);
        }
        res.redirect("/editprofile");
    } catch(error) {
        res.redirect("/editprofile");
    }
});

app.get('/post', checkNotAuthenticated, (req, res) => {
    res.sendFile('post.html', {root: 'views'})
});

app.get('/login', checkAuthenticated, (req, res) => {
    res.sendFile('login.html', {root: 'views'})
});

app.get('/register', checkAuthenticated, (req, res) => {
    res.sendFile('register.html', {root: 'views'});
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
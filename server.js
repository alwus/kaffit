const express = require('express');
const app = express()
const userApi = require('./userStatements')
const PORT = process.env.PORT || 80;

app.set('view engine', 'html');
app.use(express.urlencoded({ extended : false }));

app.get('/feed', (req, res) => {
    res.sendFile('feed.html', {root: 'views'})
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', {root: 'views'})
});


app.post('/login', (req, res) => {
    let { handle, password} = req.body;

    console.log({
        handle, password
    });

    (async () => {
        if(await userApi.loginSuccess(handle, password)) {
            res.send('<p>Login succesful</p>');
        } else {
            res.send('<p>Try again<\p>');
        }
    })()
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
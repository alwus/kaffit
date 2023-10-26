const LocalStrategy = require("passport-local").Strategy;
const { db } = require('./dbConfig');
const userApi = require('./userStatements');
const bcyrpt = require("bcrypt");

function initialize (passport) {
    const authenticateUser = (handle, password, done) => {
        (async () => {
            const user = await userApi.loginSuccess.get(handle, password);
            console.log(user);
            if(user) {
                console.log("Authentication worked");
                return done(null, user);
            } else {
                console.log("Authentication didnt work");
                return done(null, false, { message: "Login not successful" });
            }
        })()
    }

    passport.use(
        new LocalStrategy({
            usernameField: "handle",
            passwordField: "password"
        },
        authenticateUser
    ));

    passport.serializeUser((user, done) => done(null, user.uuid));

    passport.deserializeUser((id, done) => {
        (async () => {
            const user = await userApi.getUserByUuid.get(id);
            return done(null, user);
        })()
    });
}

module.exports = initialize;
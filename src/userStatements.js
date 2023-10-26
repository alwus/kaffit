const { db } = require('./dbConfig');

const loginSuccess = db.prepare(
    `SELECT * FROM users
    WHERE handle = ?
    AND password = ?`,
);

const getUserByUuid = db.prepare(
    `SELECT * FROM users WHERE uuid = ?`,
);

const getUserByHandle = db.prepare(
    `SELECT * FROM users WHERE handle = ?`,
);

module.exports = { loginSuccess, getUserByUuid, getUserByHandle };
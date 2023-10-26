const { db } = require('./dbConfig');

const latestPosts = db.prepare(
    `SELECT p.uuid, handle, text, timestamp, image
    FROM posts p
    JOIN users u
    ON p.user = u.uuid
    ORDER BY timestamp DESC
    LIMIT 5
    OFFSET ((?-1)*5)`
);

const post = db.prepare(
    `SELECT p.uuid, handle, text, timestamp, image
    FROM posts p
    JOIN users u
    ON p.user = u.uuid
    WHERE p.uuid = ?`
);

const comments = db.prepare(
    `SELECT handle, text, timestamp
    FROM comments c
    JOIN users u
    ON c.user = u.uuid
    WHERE post = ?
    ORDER BY timestamp DESC`
);

const createComment = db.prepare(
    `INSERT INTO comments ("user", "post", "text") 
    VALUES (?, ?, ?)`
);

const createPost = db.prepare(
    `INSERT INTO posts("uuid", "user", "text", "image")
    VALUES (?, ?, ?, ?)`
);

module.exports = { latestPosts, post, comments, createComment, createPost }
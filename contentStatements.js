const { pool } = require('./dbConfig');

async function getLatestPosts() {
    try {
        const res = await pool.query(
            `SELECT p.uuid, handle, text, timestamp, image
            FROM kaffit_app.posts p
            JOIN kaffit_app.users u
            ON p.user = u.uuid
            ORDER BY timestamp DESC`

        )
        if(res.rows.length > 0) {
            console.log(res.rows);
            return res.rows;
        } else {
            console.log('no rows');
            return false;
        }
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function getPost(uuid) {
    try {
        const res = await pool.query(
            `SELECT p.uuid, handle, text, timestamp, image
            FROM kaffit_app.posts p
            JOIN kaffit_app.users u
            ON p.user = u.uuid
            WHERE p.uuid = $1`,
            [uuid],
        )
        return res.rows[0];
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function getComments(post) {
    try {
        const res = await pool.query(
            `SELECT handle, text, timestamp
            FROM kaffit_app.comments c
            JOIN kaffit_app.users u
            ON c.user = u.uuid
            WHERE post = $1
            ORDER BY timestamp DESC`,
            [post],
        )
        console.log(res.rows);
        return res.rows;
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function createComment(user, post, text) {
    try {
        const res = await pool.query(
            `INSERT INTO kaffit_app.comments ("user", "post", "text")
            VALUES ($1, $2, $3)`,
            [user, post, text],
        )
        return res.rows[0];
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function getPpFormat(handle) {
    try {
        const res = await pool.query(
            `SELECT uuid, ppformat FROM kaffit_app.users WHERE handle = $1`,
            [handle],
        )
        return res.rows[0];
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function createPost(user, text, image) {
    try {
        await pool.query(
            `INSERT INTO kaffit_app.posts("user", "text", "image")
            VALUES ($1, $2, $3)`,
            [user, text, image]
        );
    } catch(err) {
        console.log(err);
        return false;
    }
}

module.exports.createComment = createComment;
module.exports.getPost = getPost;
module.exports.createPost = createPost;
module.exports.getLatestPosts = getLatestPosts;
module.exports.getPost = getPost;
module.exports.getPpFormat = getPpFormat;
module.exports.getComments = getComments;
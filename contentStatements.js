const { pool } = require('./dbConfig');

async function getLatestPosts() {
    try {
        const res = await pool.query(
            `SELECT handle, p.user AS creator, text, timestamp, ppformat
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
            `SELECT * FROM kaffit_app.posts WHERE uuid = $1`,
            [uuid],
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

async function createImage() {
    try {
        const res = await pool.query(
            `INSERT INTO kaffit_app.posts (text, image)
            VALUES ()`,
            [text],
        )
        return res.rows[0];
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function createPost(user, text, ...image) {
    try {
        await pool.query(
            `INSERT INTO kaffit_app.posts("user", "text")
            VALUES ($1, $2)`,
            [user, text]
        );
    } catch(err) {
        console.log(err);
        return false;
    }
}

module.exports.createPost = createPost;
module.exports.getLatestPosts = getLatestPosts;
module.exports.getPost = getPost;
module.exports.getPpFormat = getPpFormat;
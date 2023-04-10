const { pool } = require('./dbConfig');

async function getLatestPosts() {
    try {
        const res = await pool.query(
            `SELECT handle AS creator, text 
            FROM kaffit_app.posts p
            JOIN kaffit_app.users u
            ON p.user = u.uuid`
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

module.exports.getLatestPosts = getLatestPosts;
module.exports.getPost = getPost;
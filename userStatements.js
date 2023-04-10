const { pool } = require('./dbConfig');

async function loginSuccess(handle, password) {
    try {
        const res = await pool.query(
            `SELECT * FROM kaffit_app.users
            WHERE handle = $1
            AND password = $2`,
            [handle, password]
        )
        if(res.rows.length > 0) {
            console.log(res.rows[0]);
            return res.rows[0];
        } else {
            console.log('no rows');
            return false;
        }
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function getUserByUuid(uuid) {
    try {
        const res = await pool.query(
            `SELECT * FROM kaffit_app.users WHERE uuid = $1`,
            [uuid],
        )
        return res.rows[0];
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function getUserByHandle(handle) {
    try {
        const res = await pool.query(
            `SELECT * FROM kaffit_app.users WHERE handle = $1`,
            [handle],
        )
        return res.rows[0];
    } catch(err) {
        console.log(err);
        return false;
    }
}

module.exports.loginSuccess = loginSuccess;
module.exports.getUserByUuid = getUserByUuid;
module.exports.getUserByHandle = getUserByHandle;
const { user } = require('pg/lib/defaults');
const { pool } = require('./dbConfig');

async function loginSuccess (handle, password) {
    try {
        const res = await pool.query(
            `SELECT * FROM kaffit_app.users
            WHERE handle = $1
            AND password = $2
            `,
            [handle, password]
        )
        if(res.rows.length > 0) {
            console.log(res.rows[0]);
            return true;
        } else {
            console.log('no rows');
            return false;
        }
    } catch(err) {
        console.log('error');
        return false;
    }
}

module.exports.loginSuccess = loginSuccess;
const pool = require('../config/database');

class User {

    static async finyByAuth0Id( auth0Id ) {
        let res = await pool.query(`SELECT * FROM users WHERE auth0_id = ${auth0Id}`)
        return res.rows[0];
    }

    static async insertUser( auth0Id, email ){
        let res = await pool.query(`INSERT INTO users (email, auth0_id) VALUES (${email}, ${auth0Id})`);
        return res.rows[0];
    }

}

module.exports = User;
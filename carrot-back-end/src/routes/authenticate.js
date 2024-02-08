const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', (req, res) => {
    res.json({ message: 'You accessed a protected endpoint!' });
});

router.post('/', async(req, res) => {

    try {
        let q = await pool.query(`SELECT EXISTS(SELECT auth0_id FROM users WHERE auth0_id = '${req.body.userId}')`);
        let exists = q.rows[0].exists;

        if(!exists) {
            pool.query(`INSERT INTO users (auth0_id, email) VALUES ('${req.body.userId}', '${req.body.email}')`);
            res.json({ newUser: true });
        }

        res.json({ newUser: false });

    } catch (e) {
        console.error(e);
    }

})
  
module.exports = router;
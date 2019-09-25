'use strict';

const express   = require('express');
const router    = express.Router();

const passport  = require('../../services/passport');
const cUsers    = require('../../controllers/users');

/**
 * Check if user exist
 *
 * @example GET /users/check?email=
 */
router.get('/check', async (req, res, next) => {
    try {
        let email = req.query.email;
        if (!email)
            return res.status(404).json({ error: "User does not exist" });

        let user = await cUsers.getByEmail(email);

        if (!user)
            return res.status(404).json({ error: "User does not exist" });

        res.json({ message: 'User exists' })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
'use strict';

const express       = require('express');
const router        = express.Router();
const cAuth         = require('../../controllers/authentication');
const cUsers        = require('../../controllers/users');


/**
 * Handle register request
 *
 * @example POST /auth/register
 */
router.post('/register', async (req, res, next) => {
    try {
        let userData = await cAuth.register(req.body);

        if (userData.error)
            return res.status(400).json( { error: "User with such email exists" } );

        res.json({
            message: "Successfully signed up.",
            data: userData.tokens
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});



/**
 * Generate access and refresh tokens by code
 *
 *
 * @example POST /auth/login
 */
router.post('/login', async (req, res, next) => {
    try {
        let userData = await cAuth.login(req.body);

        if (userData.error)
            return res.status(400).json( { error: "User with such email and password does not exist." } );

        return res.json({
            message: "Successfully signed in",
            data: userData.tokens
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});



/**
 * Remove refresh token from DB
 *
 *
 * @example POST /auth/logout
 */
router.post('/logout', async (req, res, next) => {
    try {
        await cAuth.logout(req.query);

        return res.json({
            message: "Successfully logged out"
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
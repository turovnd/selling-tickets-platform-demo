'use strict';

const express   = require('express');
const router    = express.Router();
const cParks    = require('../../controllers/parks');

const path = require('path');
const COURSES_FILE = path.join(__dirname, "..", "..", "_source", "courses.json");

/**
 * Get all parks with minimal price
 *
 * @example GET /parks
 */
router.get('/', async (req, res, next) => {
    try {
        let parks = await cParks.getAll();

        if (!parks)
            return res.status(404).json( { error: "Parks do not found." } );

        res.json({
            message: "Parks were received successfully.",
            data: parks,
            courseJSON: require(COURSES_FILE)
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get full park description with tickets
 *
 * @example GET /parks/:link
 */
router.get('/:link', async (req, res, next) => {
    try {
        let park = await cParks.getOneByLink(req.params.link);

        if (!park)
            return res.status(404).json( { error: "Park does not found." } );

        res.json({
            message: "Park was received successfully.",
            data: park
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;
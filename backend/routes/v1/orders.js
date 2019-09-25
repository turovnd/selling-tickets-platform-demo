'use strict';

const express   = require('express');
const router    = express.Router();
const cOrders   = require('../../controllers/orders');
const cPayments = require('../../controllers/payments');
const passport  = require('../../services/passport');


/**
 * Create order request
 *
 * @example POST /orders
 */
router.post('/', async (req, res, next) => {
    try {
        // Handle errors
        if (!req.body.ticketId)
            return res.status(400).json( { error: "Missed ticket ID." } );

        if (!req.body.visitDate)
            return res.status(400).json( { error: "Visit date has not specified." } );

        let order = "invalid-order";
        if (req.body.orderId)
            order = await cOrders.updateOrder(req.body.orderId, req.body);

        if (!order._id || !req.body.orderId)
            order = await cOrders.createOrder(req.body);

        if (typeof order === "string") {
            switch (order) {
                case "invalid-ticket": return res.status(400).json( { error: "Invalid ticket. It does not found." } );
                case "invalid-park": return res.status(400).json( { error: "Invalid park. It does not found." } );
                case "invalid-order": return res.status(500).json( { error: "Something goes wrong. Try again later." } );
            }
        }

        let result = await cPayments.makePayment({
            orderId: order._id,
            requestFrom: req.headers.referer,
            ipAddress: req.ip,
            cardHolder: req.body.paymentDetails.paymentCardHolder,
            packet: req.body.paymentDetails.paymentPacket
        });

        if (typeof result === 'string') {
            switch (result) {
                case 'no-order': return res.status(404).json( { error: "Order does not found." } );
                case 'already-paid': return res.status(400).json( { error: "Order has already been paid." } );
                case 'no-ticket': return res.status(404).json( { error: "Ticket does not found." } );
                case 'payment-creation': return res.status(500).json( { error: "The request for payment canceled. Try again later." } );
            }
        }

        res.json({
            message: "Order was created successfully.",
            data: {
                orderId: order._id,
                transaction: result
            }
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});

/**
 * Get order details by secret
 *
 * @example POST /orders/details
 */
router.post('/details', async (req, res, next) => {
    try {
        let details = await cOrders.getOrder(req.body.id, req.body.secret);

        if (details === "not-found")
            return res.status(404).json( { error: "Order does not found." } );
        else if (details === "incorrect-secret")
            return res.status(400).json( { error: "Incorrect leader traveler first and last names." } );

        res.json({
            message: "Order was received successfully.",
            data: details
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get order by ID
 *
 * @requires JWT
 * @example GET /orders/:id
 */
router.get('/:id', passport().authenticateJWT(), async (req, res, next) => {
    try {
        let details = await cOrders.getOrder(req.params.id);

        if (details === "not-found")
            return res.status(404).json( { error: "Order does not found." } );

        res.json({
            message: "Order was received successfully.",
            data: details
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Cancel order by ID
 *
 * @requires JWT
 * @example PUT /orders/:id/cancel
 */
router.put('/:id/cancel', passport().authenticateJWT(), async (req, res, next) => {
    try {
        if (!(req.user.isAdmin || await cOrders.checkOrderUser(req.params.id, req.user.id)))
            return res.status(403).json({ error: 'Access deny' });

        let order = await cOrders.cancelOrder(req.params.id);

        if (order === "not-found")
            return res.status(404).json( { error: "Order does not found." } );
        else if (order === "order-charged")
            return res.status(400).json( { error: "Order was charged." } );
        else if (order === "order-refunded")
            return res.status(400).json( { error: "Order was refunded." } );
        else if (order === "order-canceled")
            return res.status(400).json( { error: "Order was canceled." } );
        else if (order === "payment-error")
            return res.status(400).json( { error: "An error occurred while cancelling the payment. Contact with the administrator of the site to cancel the order." } );

        res.json({
            message: "Order was canceled successfully."
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;
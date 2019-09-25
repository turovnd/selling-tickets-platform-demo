'use strict';

const path          = require('path');
const fs            = require('fs');
const crypto        = require('crypto');

const Models        = require('../models');
const mandrill      = require('../services/mandrill');
const CloudPayments = require('../services/cloudpayments');

/**
 * Get status string
 *
 * @param status
 * @private
 */
let getStatusSting_ = (status) => {
    switch (status) {
        case 0: return "Created";
        case 1: return "Pending";
        case 2: return "Confirmed";
        case 3: return "Charged";
        case 4: return "Rebounded";
        case 5: return "Canceled";
        default: return "Error";
    }
};


/**
 * Check if user has order
 *
 * @param orderId
 * @param userId
 * @return {Promise}
 * @private
 */
let checkOrderUser_ = async (orderId, userId) => {
    return Models.Order.findOne({
        _id: orderId,
        userId: userId
    })
};


/**
 * Get order by ID
 *
 * @param id - order ID
 * @param secret {string} = `LastnameFirstname` of the leader,
 *               {null} for JWT
 * @returns {*}
 * @private
 */
let getOrder_ = async (id, secret) => {
    let order = await Models.Order.findById(id, {
        _id: true,
        realId: true,
        guests: true,
        status: true,
        ticketId: true,
        parkAlias: true,
        parkPrefix: true,
        totalPrice: true,
        tickets: true,
        discount: true,
        contactInfo: true,
        startDate: true,
        createdAt: true
    });

    if (!order) return "not-found";

    order = order.toJSON();

    if (secret) {
        let leader = order.guests.find(item => item.isLead);
        if (secret.toLowerCase() !== (leader.lastName + leader.firstName).toLowerCase()) {
            return "incorrect-secret"
        }
    }

    let ticket = await Models.Ticket.findById(order.ticketId, {
        _id: true,
        title: true,
        days: true,
        adultPrice: true,
        childrenPrice: true
    });

    let park = await Models.Park.findOne({
        prefix: order.parkPrefix
    },{
        prefix: true,
        alias: true,
        name: true,
        location: true,
        logo: true,
        image: true
    });

    park.logo = process.env.API_URL + park.logo;
    park.image = process.env.API_URL + park.image;

    // Not allow to show all files in UI
    delete order.tickets;

    // Logic for allow cancel order by user
    order.canCancel = (
        new Date(+order.startDate - 24 * 60 * 60 * 1000) >= new Date() &&
        order.status <= 1
    );

    return {
        order: order,
        ticket: ticket,
        park: park
    }
};


/**
 * Get real order ID or create id not exist
 *
 * @return {Promise<number>}
 */
const getRealOrderId = async () => {
    let realId = await Models.Counter.findOneAndUpdate(
        { _id: 'orderId' },
        { $inc: { value: 1 } }
    );
    // Create if not exist
    if (!realId) {
        realId = new Models.Counter({
            _id: 'orderId'
        });
        realId = await realId.save();
    }
    return parseInt(realId.value) + 1;
};


/**
 * Create order from site
 *
 * @param data
 * @returns {*}
 * @private
 */
let createOrder_ = async (data) => {

    // Check if ticket is valid
    let ticket = await Models.Ticket.findById(data.ticketId, {
        _id: true,
        days: true,
        title: true,
        adultPrice: true,
        childrenPrice: true
    });

    if (!ticket)
        return "invalid-ticket";

    let park = await Models.Park.findOne({
        alias: data.parkAlias
    },{
        prefix: true,
        alias: true,
        name: true,
        image: true,
        logo: true
    });

    if (!park)
        return "invalid-park";

    let realId = await getRealOrderId();

    let user = await Models.User.findOne({
        email: data.user.email
    }, {
        _id: true,
        email: true,
        firstName: true,
        lastName: true
    });

    let adultLead = data.guests.filter(item => item.isLead === true)[0];

    if (!user) {
        user = new Models.User({
            email: data.user.email,
            lastName: adultLead.lastName,
            firstName: adultLead.firstName,
            password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.user.password.trim()).digest('hex')
        });
        await user.save()
    }

    let adultsNum = data.guests.filter(item => item.isAdult);
    let childrenNum = data.guests.filter(item => !item.isAdult);
    let discount = parseFloat(data.discount) || 0;

    let totalPrice = (
        Math.ceil(ticket.adultPrice * (1 - discount)) * adultsNum.length +
        Math.ceil(ticket.childrenPrice * (1 - discount)) * childrenNum.length
    );

    let endDate = new Date(data.visitDate);
    endDate.setDate(endDate.getDate() + ticket.days);

    let order = new Models.Order({
        realId: realId,
        parkPrefix: park.prefix,
        parkAlias: park.alias,
        ticketId: ticket._id,
        userId: user._id,
        createdFrom: 'site',
        locale: data.locale,
        totalPrice: totalPrice,
        discount: discount,
        startDate: data.visitDate,
        endDate: endDate,
        guests: data.guests,
        status: 0,
        paymentDetails: data.paymentDetails,
        contactInfo: data.contactInfo
    });

    await order.save();

    await mandrill.sendPendingEmail({
        locale: order.locale,
        email: user.email,
        name: user.firstName + " " + user.lastName,
        vars: {
            ORDER_NUMBER: order.parkPrefix + "-" + order.realId,
            PARK_NAME: park.name[order.locale],
            PARK_IMAGE: process.env.API_URL + park.image,
            PARK_LOGO: process.env.API_URL + park.logo,
            TICKET_PRICE: '$' + order.totalPrice,
            TICKET_TITLE: ticket.title[order.locale],
            TICKET_DATE: order.startDate,
            TICKET_GUESTS: order.guests.length,
            DETAILS_LINK: process.env.HOMEPAGE + `/order/${order._id}`,
            CURRENT_YEAR: new Date().getFullYear()
        }
    });

    return order;
};


/**
 * Update order
 *
 * @param id
 * @param data
 * @return {*}
 * @private
 */
let updateOrder_ = async (id, data) => {
    let order = await Models.Order.findById(id, {
        createdFrom: false,
        locale: false,
        parkAlias: false,
        paymentDetails: false,
        updatedAt: false,
        __v: false
    });

    if (!order) return;

    order.guests = data.guests || order.guests;

    if (data.contactInfo) {
        order.contactInfo.email = data.contactInfo.email || order.contactInfo.email;
        order.contactInfo.phone = data.contactInfo.phone || order.contactInfo.phone;
    }

    await order.save();

    let park = await Models.Park.findOne({
        prefix: order.parkPrefix
    },{
        name: true,
        location: true,
        prefix: true
    });

    let ticket = await Models.Ticket.findById(order.ticketId,{
        _id: true,
        title: true,
        adultPrice: true,
        childrenPrice: true
    });

    return Object.assign({
        park: park,
        ticket: ticket
    }, order.toJSON());
};


/**
 * Cancel order
 *
 * @param id
 * @return {*}
 * @private
 */
let cancelOrder_ = async (id) => {
    let order = await Models.Order.findById(id);
    if (!order) return "not-found";

    // If order was charged
    if (order.status === 3) return "order-charged";
    // If order was refunded
    if (order.status === 4) return "order-refunded";
    // If order was canceled
    if (order.status === 5) return "order-canceled";

    order.status = 5;

    let status = await CloudPayments.cancelPayment(order.paymentDetails.transactionId);

    // If payment system returns some error
    if (!status || status && !status.Success) return "payment-error";

    await order.save();

    // Send cancellation email
    if (order.contactInfo && order.contactInfo.email) {
        let leadGuest = order.guests.find(item => item.isLead) || {};
        let user = {
            firstName: leadGuest.firstName || (order.locale === "ru" ? "Гость" : "Guest"),
            lastName: leadGuest.lastName || ""
        };
        await mandrill.sendUnsuccessfulEmail({
            locale: order.locale,
            email: order.contactInfo.email,
            name: user.firstName + " " + user.lastName,
            vars: {
                ORDER_NUMBER: order.parkPrefix + "-" + order.realId,
                CURRENT_YEAR: new Date().getFullYear()
            }
        });
    }

    await sendOrderStatusToAdmin_(order);

    return 'ok'
};


/**
 * Add file to the order
 *
 * @param id
 * @param file
 * @return {*}
 * @private
 */
let addFile_ = async (id, file) => {
    let order = await Models.Order.findById(id);
    if (!order) return "no-order";

    let format = null;
    switch (file.mimetype) {
        case "image/png": format = "png"; break;
        case "image/jpeg": format = "jpeg"; break;
        case "image/jpg": format = "jpg"; break;
        case "application/pdf": format = "pdf"; break;
    }

    if (!format) return "invalid-format";

    let hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(file.name + +new Date()).digest('hex');
    let data = {
        name: file.name,
        mimetype: file.mimetype,
        path: hash + "." + format,
        current: false
    };

    let dirPath = path.resolve(process.env.FILES_STORAGE + "/" + order._id);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    await file.mv(
        path.resolve(dirPath + "/" + data.path)
    );

    order.tickets.push(data);

    await order.save();

    return data;

};


module.exports = {
    checkOrderUser: checkOrderUser_,
    getOrder: getOrder_,
    createOrder: createOrder_,
    // getStatistics: getStatistics_,
    // getAllOrders: getAllOrders_,
    updateOrder: updateOrder_,
    cancelOrder: cancelOrder_,
    // chargeOrder: chargeOrder_,
    // refundOrder: refundOrder_,
    addFile: addFile_,
    // deleteFile: deleteFile_,
    // sendTickets: sendTickets_,
    // getMyOrders: getMyOrders_,
    // getOrderTicket: getOrderTicket_
};
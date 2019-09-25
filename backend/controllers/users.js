'use strict';

const fs            = require('fs');
const path          = require('path');

const crypto        = require('crypto');
const Models        = require('../models');

const avatarURL     = process.env.API_URL + "/avatars/";
const avatarPath    = path.join(__dirname, '..', 'static', 'avatars');

/**
 * Get user by email
 *
 * @param email
 * @returns {Promise}
 * @private
 */
let getByEmail_ = async (email) => {
    return Models.User.findOne({
        email: email
    },{
        password: false
    })
        .then(doc => {
            return {
                email: doc.email
            }
        })
        .catch(err => null)
};


/**
 * Get user by ID
 *
 * @param id
 * @returns {Promise}
 * @private
 */
let getById_ = async (id) => {
    return Models.User.findOne({
        _id: id,
        isActivated: true
    },{
        password: false
    })
        .then(doc => {
            return {
                email: doc.email,
                firstName: doc.firstName,
                lastName: doc.lastName,
                avatar: avatarURL + doc.avatar,
                emailSubscription: doc.emailSubscription,
                isActivated: doc.isActivated,
                emailConfirmed: doc.emailConfirmed
            }
        })
        .catch(err => null)
};


/**
 * Update user
 *
 * @param id
 * @param data
 * @return {Promise}
 * @private
 */
let update_ = async (id, data) => {
    let doc = await Models.User.findById(id, {
        password: false
    });

    if (!doc)
        return "not-found";

    if (data.email !== doc.email) {
        let existEmail = await getByEmail_(data.email);
        if (existEmail)
            return "duplicate-email";
        doc.email = data.email;
    }
    doc.firstName = data.firstName;
    doc.lastName = data.lastName;
    await doc.save();
    return {
        email: doc.email,
        firstName: doc.firstName,
        lastName: doc.lastName,
        avatar: avatarURL + doc.avatar,
        emailSubscription: doc.emailSubscription,
        isActivated: doc.isActivated,
        emailConfirmed: doc.emailConfirmed
    }
};


module.exports = {
    getByEmail: getByEmail_,
    getById: getById_,
    update: update_,
    // changePassword: changePassword_,
    // deactivate: deactivate_,
    // unsubscribe: unsubscribe_,
    // changeAvatar: changeAvatar_
};
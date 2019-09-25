'use strict';

const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');

const Models    = require('../models');
const mandrill  = require('../services/mandrill');


/**
 * Register new user
 *
 * @param data
 * @returns {Promise}
 * @private
 */
let register_ = async (data) => {
    let password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password.trim()).digest('hex');
    let msg = new Models.User({
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        password: password
    },{
        password: false
    });

    return msg.save()
        .then(async user => {
            // Generate link
            let hash = await createConfirmationLink_(user);
            // Send email with confirmation link

            return {
                user: user,
                tokens: {
                    accessToken: await generateToken_('access', user),
                    refreshToken: await generateToken_('refresh', user)
                }
            }
        })
        .catch(err => {
            return { error: err.errmsg }
        })
};


/**
 * Login - create tokens
 *
 * @param data
 * @returns {*}
 * @private
 */
let login_ = async (data) => {
    let user = await Models.User.findOne({
        email: data.email,
        isActivated: true,
        password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password.trim()).digest('hex')
    },{
        password: false
    });

    if (!user)
        return { error: "Not found" };

    return {
        user: user,
        tokens: {
            accessToken: await generateToken_('access', user),
            refreshToken: await generateToken_('refresh', user)
        }
    }
};


/**
 * Handle logout event. Delete refresh token
 *
 * @param data
 * @return {*}
 * @private
 */
let logout_ = async (data) => {
    if (data.refreshToken) {
        await Models.Token.findOneAndRemove({
            type: 'jwt',
            token: data.refreshToken
        });
    }
};


/**
 * Create token by type.
 *
 * @param type - access|refresh
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let generateToken_ = async (type, user) => {

    let token = null;

    if (type === "refresh") {
        token = await jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_REFRESH_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_REFRESH_EXPIRE
        });
        let msg = new Models.Token({
            type: 'jwt',
            userId: user._id,
            token: token
        });
        msg.save();
    }

    if (type === "access") {
        token = await jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_ACCESS_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_ACCESS_EXPIRE
        });
    }

    return token;
};


module.exports = {
    register: register_,
    login: login_,
    logout: logout_,
    // refreshTokens: refreshTokens_,
    // resetPassword: resetPassword_,
    // confirmEmail: confirmEmail_,
    // recoveryAccess: recoveryAccess_
};
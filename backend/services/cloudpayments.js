'use strict';

const axios     = require('axios');

const APIHost       = 'https://api.cloudpayments.ru';
const publicKey     = process.env.CLOUDPAYMENTS_PUBLIC_KEY;
const privateKey    = process.env.CLOUDPAYMENTS_PRIVATE_KEY;

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Basic ' + Buffer.from(publicKey + ":" + privateKey).toString('base64');


/**
 * Get culture name based on locale
 *
 * @param locale
 * @return {string}
 * @private
 */
const getCultureName_ = (locale) => {
    switch (locale) {
        case 'ru':
            return 'ru-RU';
        case 'en':
        default:
            return 'en-US';

    }
};


/**
 * Send authorize cryptogram payment request
 *
 * @param data
 * @return {*}
 * @private
 */
let authorizeCryptogramPayment_ = (data) => {
    return axios.post(APIHost + "/payments/cards/auth", {
        CultureName             : getCultureName_(data.locale),
        Amount                  : data.amount,              //  Numeric	    Сумма платежа
        Currency                : 'USD',                    //	String	    Валюта: RUB/USD/EUR/GBP (см. справочник)
        IpAddress               : data.ipAddress,           //	String	    IP адрес плательщика
        Name                    : data.cardHolder,          //  String      Имя держателя карты в латинице
        CardCryptogramPacket    : data.packet,              //  String	    Криптограмма платежных данных
        InvoiceId               : data.orderId || null,     //	String	    Необязательный	Номер счета или заказа
        Description             : data.description || null, //	String	    Описание оплаты в свободной форме
        AccountId               : data.userId || null,      //  String	    Идентификатор пользователя
        Email                   : data.email || null,       //	String	    E-mail плательщика на который будет отправлена квитанция об оплате
        JsonData                : data.json || {}           //  Json	    Любые другие данные, которые будут связаны с транзакцией
    }, {
        headers: {
            'X-Request-ID': data.orderId + " " + data.amount
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.error("Cloudpayment error", err);
            return null
        })
};


/**
 * Check auth credentials
 *
 * @return {*}
 * @private
 */
let init_ = () => {
    return axios.post(APIHost + "/test")
        .then(res => {
            if (res.data.Success) {
                console.log("Cloudpayment has initialized");
            }
        })
        .catch(err => {
            console.error('Cloudpayment error', err);
        })
};


module.exports = {
    init: init_,
    authorizeCryptogramPayment: authorizeCryptogramPayment_,
    // confirm3DSPayment: confirm3DSPayment_,
    // cancelPayment: cancelPayment_,
    // confirmPayment: confirmPayment_,
    // refundPayment: refundPayment_
};
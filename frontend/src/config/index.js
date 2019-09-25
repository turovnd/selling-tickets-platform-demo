const location = window.location.hostname;
let API = '';
let maxDiscount = 0.2; // Value between [0...1]
let paymentPublicKey = '';

switch (location) {
    case 'localhost':
        API = 'http://localhost:3100';
        maxDiscount = 0.2;
        break;
    case '.io':
        API = 'https://.io/api';
        maxDiscount = 0.2;
        break;
    case '144.202.115.64':
        API = 'http://144.202.115.64/api';
        maxDiscount = 0.2;
        break;
    default:
        console.log('Base URL not set up.');
        break;
}

/**
 * Return course from
 *
 * @param currency
 */
let getCourse_ = currency => {
    let course = JSON.parse(localStorage.getItem('courseJSON')) || {};

    switch (currency) {
        case 'RUB':
            return parseFloat(course['RUB']) || 63;
    }
};

export default {
    API: API,
    maxDiscount: maxDiscount,
    getCourse: getCourse_,
    paymentPublicKey: paymentPublicKey
};

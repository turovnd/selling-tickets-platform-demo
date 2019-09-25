'use strict';

module.exports = {
    prefix: "DL",
    alias: 'disneyland',
    logo: '/images/disneyland/logo.png',
    image: '/images/disneyland/background.png',
    name: {
        en: 'Disneyland Park',
        ru: 'Диснейленд Парк'
    },
    location: {
        en: 'Anaheim, CA',
        ru: 'Anaheim, CA'
    },
    description: {
        en: '',
        ru: ''
    },
    features: [
        {
            name: {
                en: 'Dining options available',
                ru: 'Dining options available'
            },
            icon: '/images/icons/dining.svg'
        }
    ],
    images: [
        '/images/disneyland/image1.png',
        '/images/disneyland/image2.png',
        '/images/disneyland/image3.png'
    ],
    daysSelection: true,
    included: [
        {
            title: null,
            list: [
                {
                    isInclude: false,
                    text: {
                        en: 'Food and drinks',
                        ru: 'Food and drinks'
                    }
                }
            ]
        }
    ],
    departure: {
        point: {
            en: 'Disneyland Resort',
            ru: 'Disneyland Resort'
        },
        time: {
            en: 'Hours vary by season',
            ru: 'Hours vary by season'
        },
        note: {
            en: 'Please note: Tickets are only valid on selected date of travel.',
            ru: 'Please note: Tickets are only valid on selected date of travel.'
        }

    },
    additional: {
        en: '<ul>' +
        '<li>Confirmation will be received within 48 hours of booking, subject to availability</li>' +
        '<li>...</li></ul>',
        ru: '<ul>' +
        '<li>Confirmation will be received within 48 hours of booking, subject to availability</li>' +
        '<li>...</li></ul>'
    },
    cancellation: {
        en: '<p>...</p>',
        ru: '<p>...</p>'
    }
};
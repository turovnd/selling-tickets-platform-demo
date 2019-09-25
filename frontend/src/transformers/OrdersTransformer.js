import Transformer from './Transformer';

import config from '../config';
import store from '../store';
import { i18n } from '../plugins/vue-i18n';

const getTripDate = (date, locale) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    let monthName = store.state.calendar[locale].pluralMonths[date.getMonth()];
    return date.getDate() + ' ' + monthName + ' ' + date.getFullYear();
};

const getStatus = (status, locale) => {
    switch (status) {
        case 0:
            return i18n.t('CONTENT.STATUS_CREATED', locale);
        case 1:
            return i18n.t('CONTENT.STATUS_PENDING', locale);
        case 2:
            return i18n.t('CONTENT.STATUS_CONFIRMED', locale);
        case 3:
            return i18n.t('CONTENT.STATUS_CHARGED', locale);
        case 4:
            return i18n.t('CONTENT.STATUS_REFUNDED', locale);
        case 5:
            return i18n.t('CONTENT.STATUS_CANCELED', locale);
        default:
            return i18n.t('CONTENT.STATUS_ERROR', locale);
    }
};

export default class OrdersTransformer extends Transformer {
    static fetch(item) {
        return {
            id: item._id,
            status: item.status,
            statusText: {
                en: getStatus(item.status, 'en'),
                ru: getStatus(item.status, 'ru')
            },
            orderId: item.parkPrefix + '-' + item.realId,
            userId: item.userId,
            tripDate: {
                en: getTripDate(item.startDate, 'en'),
                ru: getTripDate(item.startDate, 'ru')
            },
            createdAt: {
                en:
                    getTripDate(item.createdAt, 'en') +
                    '<br>' +
                    new Date(item.createdAt).toLocaleTimeString(),
                ru:
                    getTripDate(item.createdAt, 'ru') +
                    '<br>' +
                    new Date(item.createdAt).toLocaleTimeString()
            },
            tripLocation: {
                en: item.park ? item.park.name['en'] : '',
                ru: item.park ? item.park.name['ru'] : ''
            },
            guests: item.guests,
            amount: {
                en: '$' + item.totalPrice,
                ru: config.getCourse('RUB') * item.totalPrice + '₽'
            },
            ticket: item.ticket,
            files: item.tickets,
            contactInfo: {
                updates: item.contactInfo ? item.contactInfo.updates : false,
                email: item.contactInfo ? item.contactInfo.email : null,
                phone: item.contactInfo ? item.contactInfo.phone : null
            },
            search: [
                item.parkPrefix + '-' + item.realId,
                getStatus(item.status, 'en'),
                getStatus(item.status, 'ru'),
                getTripDate(item.createdAt, 'en'),
                getTripDate(item.createdAt, 'ru'),
                getTripDate(item.startDate, 'en'),
                getTripDate(item.startDate, 'ru'),
                item.park ? item.park.name['en'] : '',
                item.park ? item.park.name['ru'] : '',
                item.guests
                    ? item.guests.map(
                          item => item.firstName + ' ' + item.lastName
                      )
                    : '',
                item.contactInfo
                    ? item.contactInfo.email + item.contactInfo.phone
                    : ''
            ].toString()
        };
    }

    static send(item) {
        return {
            guests: [...item.adults, ...item.children],
            contactInfo: {
                email: item.email,
                phone: item.phone
            }
        };
    }
}

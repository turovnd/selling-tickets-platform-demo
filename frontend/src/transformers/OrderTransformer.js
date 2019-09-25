import Transformer from './Transformer';
import TicketTransformer from './TicketTransformer';
import ParkTransformer from './ParkTransformer';
import config from '../config';

export default class OrderTransformer extends Transformer {
    static fetch(item) {
        return {
            id: item._id,
            reference: item.parkPrefix + '-' + item.realId,
            status: item.status,
            userId: item.userId,
            ticketId: item.ticketId,
            parkLink: item.parkAlias,
            totalPrice: {
                en: '$' + item.totalPrice,
                ru: Math.ceil(item.totalPrice * config.getCourse('RUB')) + '₽'
            },
            discount: item.discount,
            endDate: item.endDate,
            createdFrom: item.createdFrom,
            guests: item.guests,
            adultsNum: item.guests.filter(item => item.isAdult).length,
            childrenNum: item.guests.filter(item => !item.isAdult).length,
            currentTicketUrl: `${config.API}/v1/orders/${item._id}/ticket`,
            canCancel: item.canCancel || false,
            tickets: item.tickets || [],
            contactInfo: item.contactInfo,
            visitDate: item.startDate,
            createdAt: item.createdAt,
            ticket: item.ticket ? TicketTransformer.fetch(item.ticket) : null,
            park: item.park ? ParkTransformer.fetch(item.park) : null
        };
    }

    static send(item) {
        return {
            orderId: item.orderId,
            ticketId: item.ticketId,
            discount: item.discount,
            visitDate: item.visitDate,
            guests: [
                ...item.adults.map((item, ind) => {
                    return Object.assign(
                        {
                            isLead: ind === 0,
                            isAdult: true
                        },
                        item
                    );
                }),
                ...item.children.map(item => {
                    return Object.assign(
                        {
                            isLead: false,
                            isAdult: false
                        },
                        item
                    );
                })
            ],
            locale: item.locale,
            parkAlias: item.park,
            paymentDetails: {
                paymentMethod: item.paymentMethod,
                paymentPacket: item.paymentPacket,
                paymentCardHolder: item.paymentCardHolder
            },
            contactInfo: {
                updates: item.bookingUpdates,
                email: item.email,
                phone: item.phone
            },
            user: {
                email: item.email,
                password: item.password,
                emailSubscription: item.specialOffers
            }
        };
    }

    static sendFormData(data) {
        return {
            locale: data.locale,
            ticketId: data.ticket,
            park: data.parkAlias,
            visitDate: data.visitDate,
            adults: data.adults,
            children: data.children,
            userId: data.userId,
            maxPass: data.maxPass,
            discount: data.discount,
            paymentDetails: {
                paymentMethod: 'card'
            },
            contactInfo: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone
            }
        };
    }
}

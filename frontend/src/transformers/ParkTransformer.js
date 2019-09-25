import Transformer from './Transformer';
import config from '../config';

/**
 * Get days options from tickets with min price
 *
 * @param tickets
 * @return {array}
 */
const getDaysOption = tickets => {
    let options = {};
    tickets.forEach((ticket, ind) => {
        if (!options[ticket.days]) {
            options[ticket.days] = {
                days: ticket.days,
                price: { en: 10000000, ru: 10000000 },
                selected: ind === 0
            };
        }
        let price = ticket.adultPrice * (1 - config.maxDiscount);
        if (options[ticket.days].price.en > price / ticket.days) {
            options[ticket.days].price = {
                en: Math.ceil(price / ticket.days),
                ru: Math.ceil((price / ticket.days) * config.getCourse('RUB'))
            };
        }
    });
    return Object.keys(options).map(key => {
        return options[key];
    });
};

export default class ParkTransformer extends Transformer {
    static fetch(item) {
        return {
            title: item.name,
            prefix: item.prefix,
            link: item.alias,
            logo: item.logo,
            image: item.image,
            location: item.location,
            description: item.description,
            features: item.features
                ? item.features.map(el => {
                      return {
                          name: el.name,
                          icon: config.API + el.icon
                      };
                  })
                : null,
            images: item.images ? item.images.map(el => config.API + el) : null,
            daysOptions: item.daysSelection
                ? getDaysOption(item.tickets)
                : false,
            ticketsOptions: item.tickets
                ? item.tickets.map((el, ind) => {
                      return {
                          id: el._id,
                          title: el.title,
                          days: el.days,
                          description: el.description,
                          adultPrice: {
                              en: el.adultPrice,
                              ru: Math.ceil(
                                  el.adultPrice * config.getCourse('RUB')
                              )
                          },
                          childrenPrice: {
                              en: el.childrenPrice,
                              ru: Math.ceil(
                                  el.childrenPrice * config.getCourse('RUB')
                              )
                          },
                          additional: !el.additionalText
                              ? null
                              : {
                                    icon: el.additionalIcon,
                                    content: el.additionalText,
                                    tooltip: el.additionalTooltip
                                },
                          selected: ind === 0
                      };
                  })
                : null,
            minDate: item.minDate,
            included: item.included,
            departure: item.departure,
            additional: item.additional,
            cancellation: item.cancellation
        };
    }

    static send(item) {
        return item;
    }
}

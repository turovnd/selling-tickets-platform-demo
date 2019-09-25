import Transformer from './Transformer';
import config from '../config';

export default class ParksTransformer extends Transformer {
    static fetch(item) {
        let minPrice = item.minPrice * (1 - config.maxDiscount);
        return {
            id: item._id,
            name: item.name,
            prefix: item.prefix,
            route: item.minPrice ? item.alias : null,
            image: config.API + item.image,
            logo: config.API + item.logo,
            price: {
                en: Math.ceil(minPrice),
                ru: Math.ceil(minPrice * config.getCourse('RUB'))
            },
            btnText: {
                en: Math.ceil(item.minPrice - minPrice),
                ru: Math.ceil(
                    (item.minPrice - minPrice) * config.getCourse('RUB')
                )
            }
        };
    }

    static send(item) {
        return item;
    }
}

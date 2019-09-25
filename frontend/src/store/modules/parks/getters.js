const getDateString = date => {
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
};

export default {
    getAllParks: state => state.parks,
    getAllParksOptions: state =>
        state.parks
            .map(item => {
                return { name: item.name, link: item.route };
            })
            .filter(item => item.link),
    shownPark: state => state.shownPark || {},
    selectedPark: state => state.selectedPark,
    selectedParkPrices: state => {
        let adultPrice = state.selectedPark.ticket.adultPrice || {
            en: 0,
            ru: 0
        };
        let childrenPrice = state.selectedPark.ticket.childrenPrice || {
            en: 0,
            ru: 0
        };
        let tempDate = new Date();
        tempDate.setHours(0, 0, 0);
        let prices = {};
        let i = 0;
        while (i < 25) {
            let discount = {
                val: state.salesOptions[2],
                class: 'text-danger'
            };
            let today = new Date();
            today.setHours(0, 0, 0);
            let difDays = Math.ceil(
                Math.abs(tempDate - today) / (24 * 60 * 60 * 1000)
            );
            if (difDays <= 3) {
                discount = {
                    val: state.salesOptions[0],
                    class: 'text-success'
                };
            } else if (difDays <= 10) {
                discount = {
                    val: state.salesOptions[1],
                    class: 'text-warning'
                };
            }
            prices[getDateString(tempDate)] = {
                text: {
                    en:
                        '$' +
                        (Math.ceil(adultPrice.en * (1 - discount.val)) *
                            state.selectedPark.adultsNum +
                            Math.ceil(childrenPrice.en * (1 - discount.val)) *
                                state.selectedPark.childrenNum),
                    ru:
                        Math.ceil(adultPrice.ru * (1 - discount.val)) *
                            state.selectedPark.adultsNum +
                        Math.ceil(childrenPrice.ru * (1 - discount.val)) *
                            state.selectedPark.childrenNum +
                        '₽'
                },
                class: discount.class
            };
            tempDate.setDate(tempDate.getDate() + 1);
            i++;
        }
        return prices;
    }
};

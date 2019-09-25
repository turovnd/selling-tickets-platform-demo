let visitDate = new Date();
visitDate.setDate(visitDate.getDate() + 2);

export default {
    SET_ALL_PARKS(state, data) {
        state.parks = data;
    },

    CHANGE_SELECTED_PARK(state, data) {
        state.selectedPark.park = data.park || state.selectedPark.park;
        state.selectedPark.ticket = data.ticket || state.selectedPark.ticket;

        state.selectedPark.adultsNum =
            data.adultsNum !== undefined
                ? data.adultsNum
                : state.selectedPark.adultsNum;

        state.selectedPark.childrenNum =
            data.childrenNum !== undefined
                ? data.childrenNum
                : state.selectedPark.childrenNum;

        if (data.visitDate) {
            data.createdAt = data.createdAt
                ? data.createdAt instanceof Date
                    ? data.createdAt
                    : new Date(data.createdAt)
                : null;
            state.selectedPark.createdAt = data.createdAt || new Date();
            state.selectedPark.visitDate =
                data.visitDate instanceof Date
                    ? data.visitDate
                    : new Date(data.visitDate);
            let difDays = Math.ceil(
                Math.abs(
                    state.selectedPark.visitDate - state.selectedPark.createdAt
                ) /
                    (24 * 60 * 60 * 1000)
            );
            state.selectedPark.discount =
                difDays <= 3
                    ? state.salesOptions[0]
                    : difDays <= 10
                    ? state.salesOptions[1]
                    : state.salesOptions[2];
        }

        let adultPrice = state.selectedPark.ticket.adultPrice;
        let childrenPrice = state.selectedPark.ticket.childrenPrice;

        if (adultPrice && childrenPrice) {
            state.selectedPark.totalPrice = {
                en:
                    state.selectedPark.adultsNum *
                        Math.ceil(
                            adultPrice['en'] * (1 - state.selectedPark.discount)
                        ) +
                    state.selectedPark.childrenNum *
                        Math.ceil(
                            childrenPrice['en'] *
                                (1 - state.selectedPark.discount)
                        ),
                ru:
                    state.selectedPark.adultsNum *
                        Math.ceil(
                            adultPrice['ru'] * (1 - state.selectedPark.discount)
                        ) +
                    state.selectedPark.childrenNum *
                        Math.ceil(
                            childrenPrice['ru'] *
                                (1 - state.selectedPark.discount)
                        )
            };
        }
    },

    RESET_SELECTED_PARK(state) {
        state.selectedPark.park = null;
        state.selectedPark.adultsNum = 1;
        state.selectedPark.childrenNum = 0;
        state.selectedPark.ticket = {};
        state.selectedPark.discount = 0.2;
        state.selectedPark.totalPrice = {};
        state.selectedPark.visitDate = visitDate;
        state.selectedPark.createdAt = new Date();
    },

    SET_SHOWN_PARK(state, data) {
        state.shownPark = data;
    },

    RESET_SHOWN_PARK(state) {
        state.shownPark = {};
    }
};

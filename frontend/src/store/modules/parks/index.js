/* ============
 * Parks Module
 * ============
 */

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

let visitDate = new Date();
visitDate.setDate(visitDate.getDate() + 2);

export default {
    state: {
        parks: [],
        selectedPark: {
            step: 1,
            park: null,
            adultsNum: 1,
            childrenNum: 0,
            ticket: {},
            totalPrice: {},
            discount: 0.2,
            visitDate: visitDate,
            createdAt: new Date()
        },
        shownPark: {},
        salesOptions: [0.2, 0.15, 0.1]
    },
    actions,
    getters,
    mutations
};

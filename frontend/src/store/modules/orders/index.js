/* ============
 * Orders Module
 * ============
 */

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    state: {
        currentOrder: null, // Shows current order on payment|confirmation
        currentTicket: null, // Shows current ticket for current order
        currentPark: null, // Shows current park for current order
        orderHasAccount: false, // Shoes if there is a user with entered email
        ordersStatistic: null,
        orders: {
            UPCOMING: [],
            ONGOING: [],
            COMPLETED: []
        },
        myOrders: [] // Contains order array that used in `MyTrip` page
    },
    actions,
    getters,
    mutations
};

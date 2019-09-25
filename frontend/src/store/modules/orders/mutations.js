import Vue from 'vue';

export default {
    SET_ORDER_HAS_ACCOUNT(state, status) {
        state.orderHasAccount = status;
    },

    SET_ORDER(state, data) {
        state.currentOrder = data.order;
        state.currentTicket = data.ticket;
        state.currentPark = data.park;
    },

    SET_ORDER_ID(state, id) {
        state.currentOrder = {
            id: id
        };
    },

    UPDATE_ORDER(state, data) {
        state.currentOrder.status = data.status;
        state.currentOrder.canCancel = data.canCancel;
    },

    CLEAR_ORDER(state) {
        state.currentOrder = null;
        state.currentTicket = null;
        state.currentPark = null;
    },

    SET_ORDERS_STATISTICS(state, data) {
        state.ordersStatistic = {
            UPCOMING: data.upcoming,
            ONGOING: data.ongoing,
            COMPLETED: data.completed,
            CANCELED: data.canceled
        };
    },

    SET_ORDERS(state, data) {
        let type = data.type.toUpperCase();
        Vue.set(state.orders, type, data.items);
    },

    UPDATE_ORDERS(state, data) {
        let updated = false;
        let type = data.type.toUpperCase();
        for (let i in state.orders[type]) {
            if (state.orders[type][i].id === data.item.id) {
                Vue.set(state.orders[type], i, data.item);
                updated = true;
                break;
            }
        }
        if (!updated) {
            state.orders[type].push(data.item);
        }
    },

    UPDATE_ORDERS_STATUS(state, data) {
        let type = data.type.toUpperCase();
        for (let i in state.orders[type]) {
            if (state.orders[type][i].id === data.item.id) {
                let item = state.orders[type][i];
                item.status = data.item.status;
                item.statusText = data.item.statusText;
                // If it was charged => change status => else (canceled|refunded) delete order from table
                if (data.item.status === 3) {
                    Vue.set(state.orders[type], i, item);
                } else {
                    state.orders[type].splice(i, 1);
                }
                break;
            }
        }
    },

    ADD_FILE_TO_ORDER(state, data) {
        let type = data.type.toUpperCase();
        for (let i in state.orders[type]) {
            if (state.orders[type][i].id === data.id) {
                state.orders[type][i].files.push(data.file);
                break;
            }
        }
    },

    REMOVE_FILE_FROM_ORDER(state, data) {
        let type = data.type.toUpperCase();
        for (let i in state.orders[type]) {
            if (state.orders[type][i].id === data.id) {
                let files = state.orders[type][i].files;
                for (let j in files) {
                    if (files[j].path === data.file.path) {
                        state.orders[type][i].files.splice(j, 1);
                        return;
                    }
                }
            }
        }
    },

    SEND_ORDER_FILES(state, data) {
        let type = data.type.toUpperCase();
        for (let i in state.orders[type]) {
            if (state.orders[type][i].id === data.id) {
                let files = state.orders[type][i].files;
                for (let j in files) {
                    if (files[j].path === data.data.current) {
                        files[j].current = true;
                        state.orders[type][i].files.splice(j, 1, files[j]);
                        return;
                    }
                }
            }
        }
    },

    SET_MY_ORDERS(state, data) {
        state.myOrders = data;
    }
};

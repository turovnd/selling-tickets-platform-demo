import Vue from 'vue';

import OrdersAPI from '../../../api/OrdersAPI';
import UserAPI from '../../../api/UserAPI';

import OrderTransformer from '../../../transformers/OrderTransformer';
import OrdersTransformer from '../../../transformers/OrdersTransformer';
import TicketTransformer from '../../../transformers/TicketTransformer';
import ParkTransformer from '../../../transformers/ParkTransformer';

export default {
    createOrder({ commit }, data) {
        new OrdersAPI()
            .create(OrderTransformer.send(data))
            .then(resp => {
                commit('SET_ORDER_ID', resp.data.orderId);
                let transaction = resp.data.transaction;
                // If payment success (without 3DS)
                if (transaction.status) {
                    return Vue.router.push({
                        name: 'ConfirmationPage',
                        query: {
                            order: resp.data.orderId
                        }
                    });
                }
                // If the response has 3DS data -> redirect
                if (transaction.paReq) {
                    let pForm = document.createElement('form');
                    pForm.action = transaction.acsUrl;
                    pForm.method = 'POST';
                    pForm.classList.add('hidden');
                    let paReqInput = document.createElement('input');
                    paReqInput.name = 'PaReq';
                    paReqInput.value = transaction.paReq;
                    let mdInput = document.createElement('input');
                    mdInput.name = 'MD';
                    mdInput.value = transaction.transactionId;
                    let callInput = document.createElement('input');
                    callInput.name = 'TermUrl';
                    callInput.value = transaction.termUrl;
                    pForm.appendChild(paReqInput);
                    pForm.appendChild(mdInput);
                    pForm.appendChild(callInput);
                    document.body.appendChild(pForm);
                    return pForm.submit();
                }
                Vue.notify({
                    type: 'error',
                    title: transaction.reasonMessage
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    createFormOrder({ commit }, data) { // eslint-disable-line
        new OrdersAPI()
            .createFormOrder(OrderTransformer.sendFormData(data))
            .then(resp => {
                Vue.router.push({
                    name: 'FormPage',
                    query: {
                        step: 3,
                        order: resp.data._id,
                        amount: resp.data.totalPrice
                    }
                });
            })
            .catch(() => {
                Vue.router.push({
                    name: 'FormPage',
                    query: {
                        step: 4,
                        status: false
                    }
                });
            });
    },

    orderCheckAccount({ commit }, email) {
        new UserAPI()
            .checkByEmail(email)
            .then(() => {
                commit('SET_ORDER_HAS_ACCOUNT', true);
            })
            .catch(() => {
                commit('SET_ORDER_HAS_ACCOUNT', false);
            });
    },

    getOrderDetails({ commit }, payload) {
        new OrdersAPI()
            .getOrderDetails(payload)
            .then(resp => {
                let order = OrderTransformer.fetch(resp.data.order);
                let ticket = TicketTransformer.fetch(resp.data.ticket);
                if (payload.process) {
                    commit('CHANGE_SELECTED_PARK', {
                        park: order.parkLink,
                        adultsNum: order.adultsNum,
                        childrenNum: order.childrenNum,
                        ticket: TicketTransformer.fetch(resp.data.ticket),
                        discount: order.discount,
                        visitDate: order.visitDate,
                        createdAt: order.createdAt
                    });
                }
                commit('SET_ORDER', {
                    order: order,
                    ticket: ticket,
                    park: ParkTransformer.fetch(resp.data.park)
                });
            })
            .catch(err => {
                if (err.response.status === 404) {
                    return Vue.router.push({ name: 'NotFound' });
                }
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    getOrderById({ commit }, id) {
        new OrdersAPI()
            .getOrderById(id)
            .then(resp => {
                commit('SET_ORDER', {
                    order: OrderTransformer.fetch(resp.data.order),
                    ticket: TicketTransformer.fetch(resp.data.ticket),
                    park: ParkTransformer.fetch(resp.data.park)
                });
            })
            .catch(() => {
                Vue.router.push({ name: 'NotFound' });
            });
    },

    getOrdersStatistic({ commit }, type) {
        new OrdersAPI()
            .getStatistics({ type: type.toLowerCase() })
            .then(resp => {
                commit('SET_ORDERS_STATISTICS', resp.data);
            })
            .catch(err => {
                console.error(err);
            });
    },

    getOrdersByType({ commit }, query) {
        new OrdersAPI()
            .getOrders(query)
            .then(resp => {
                commit('SET_ORDERS', {
                    type: query.type,
                    items: OrdersTransformer.fetchCollections(resp.data)
                });
            })
            .catch(err => {
                console.error(err);
            });
    },

    updateOrder({ commit }, json) {
        new OrdersAPI()
            .updateOrder(json.id, OrdersTransformer.send(json.data))
            .then(resp => {
                commit('UPDATE_ORDERS', {
                    type: json.type,
                    item: OrdersTransformer.fetch(resp.data)
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    cancelOrder({ commit }, json) {
        new OrdersAPI()
            .cancelOrder(json.id)
            .then(resp => {
                commit('UPDATE_ORDERS_STATUS', {
                    type: json.type,
                    item: OrdersTransformer.fetch(json.item)
                });
                this.dispatch('getOrdersStatistic', json.from);
                Vue.notify({
                    type: 'info',
                    title: resp.message
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    chargeOrder({ commit }, json) {
        new OrdersAPI()
            .chargeOrder(json.id)
            .then(resp => {
                commit('UPDATE_ORDERS_STATUS', {
                    type: json.type,
                    item: OrdersTransformer.fetch(json.item)
                });
                this.dispatch('getOrdersStatistic', json.from);
                Vue.notify({
                    type: 'info',
                    title: resp.message
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    refundOrder({ commit }, json) {
        new OrdersAPI()
            .refundOrder(json.id)
            .then(resp => {
                commit('UPDATE_ORDERS_STATUS', {
                    type: json.type,
                    item: OrdersTransformer.fetch(json.item)
                });
                this.dispatch('getOrdersStatistic', json.from);
                Vue.notify({
                    type: 'info',
                    title: resp.message
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    removeOrderFile({ commit }, data) {
        new OrdersAPI()
            .deleteFile(data.id, data.file)
            .then(() => {
                commit('REMOVE_FILE_FROM_ORDER', data);
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    sendOrderTickets({ commit }, payload) {
        new OrdersAPI()
            .sendTickets(payload.id, payload.data)
            .then(res => {
                commit('SEND_ORDER_FILES', payload);
                Vue.notify({
                    type: 'info',
                    title: res.message
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    getMyOrders({ commit }) {
        new OrdersAPI()
            .getMyOrders()
            .then(resp => {
                commit(
                    'SET_MY_ORDERS',
                    OrderTransformer.fetchCollections(resp.data)
                );
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    },

    cancelMyOrder({ commit }, id) {
        new OrdersAPI()
            .cancelMyOrder(id)
            .then(resp => {
                commit('UPDATE_ORDER', {
                    status: 5,
                    canCancel: false
                });
                Vue.notify({
                    type: 'info',
                    title: resp.message
                });
            })
            .catch(err => {
                Vue.notify({
                    type: 'error',
                    title: err.response.data.error
                });
            });
    }
};

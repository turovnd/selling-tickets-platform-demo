import API from './API';

class OrdersAPI extends API {
    constructor(parameters = {}) {
        super('/v1/orders', parameters);
    }

    /**
     * Get orders statistic request
     *
     * @param query = {type: 'site||form'}
     * @return {*}
     */
    getStatistics(query) {
        this.setParameters(query);
        return this.submitWithToken('get', `${this.endpoint}/statistics`);
    }

    /**
     * Get orders request
     *
     * @param query - filters
     * @return {*}
     */
    getOrders(query) {
        this.setParameters(query || {});
        return this.submitWithToken('get', `${this.endpoint}`);
    }

    /**
     * Update order request
     *
     * @param id
     * @param data
     * @return {*}
     */
    updateOrder(id, data) {
        return this.submitWithToken('put', `${this.endpoint}/${id}`, data);  // eslint-disable-line
    }

    /**
     * Cancel order request
     *
     * @param id
     * @return {*}
     */
    cancelOrder(id) {
        return this.submitWithToken('put', `${this.endpoint}/${id}/cancel`);    // eslint-disable-line
    }

    /**
     * Charge order request
     *
     * @param id
     * @return {*}
     */
    chargeOrder(id) {
        return this.submitWithToken('put', `${this.endpoint}/${id}/charge`);    // eslint-disable-line
    }

    /**
     * Refund order request
     *
     * @param id
     * @return {*}
     */
    refundOrder(id) {
        return this.submitWithToken('put', `${this.endpoint}/${id}/refund`);    // eslint-disable-line
    }

    /**
     * Send delete file request
     *
     * @param id
     * @param file
     * @return {*}
     */
    deleteFile(id, file) {
        return this.submitWithToken('delete', `${this.endpoint}/${id}/files/${file.path}`);    // eslint-disable-line
    }

    /**
     * Send tickets request
     *
     * @param id
     * @param data  = { method: 'email|phone', current: 'current ticket path' }
     * @return {*}
     */
    sendTickets(id, data) {
        return this.submitWithToken('put', `${this.endpoint}/${id}/send`, data);    // eslint-disable-line
    }

    /**
     * Send get my orders request
     *
     * @return {*}
     */
    getMyOrders() {
        return this.submitWithToken('get', `${this.endpoint}/my`);
    }

    /**
     * Get order details by secret
     *
     * @param data
     * @return {*}
     */
    getOrderDetails(data) {
        return this.submit('post', `${this.endpoint}/details`, data);    // eslint-disable-line
    }

    /**
     * Get order details by ID
     *
     * @param id
     * @return {*}
     */
    getOrderById(id) {
        return this.submitWithToken('get', `${this.endpoint}/${id}`);    // eslint-disable-line
    }

    /**
     * Cancel my order request
     *
     * @param id
     * @return {*}
     */
    cancelMyOrder(id) {
        return this.submitWithToken('put', `${this.endpoint}/${id}/cancel`);    // eslint-disable-line
    }

    /**
     * Create order from form
     *
     * @param data
     * @return {*}
     */
    createFormOrder(data) {
        return this.submit('post', `${this.endpoint}/form`, data);    // eslint-disable-line
    }
}

export default OrdersAPI;

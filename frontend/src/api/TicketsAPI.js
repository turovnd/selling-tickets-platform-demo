import API from './API';

class TicketsAPI extends API {
    constructor(parameters = {}) {
        super('/v1/tickets', parameters);
    }

    /**
     * Get ticket from form page
     *
     * @param id
     * @return {*}
     */
    findFormTicket(id) {
        return this.submit('get', `${this.endpoint}/form/${id}`);
    }
}

export default TicketsAPI;

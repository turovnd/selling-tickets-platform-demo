import API from './API';

class PaymentsAPI extends API {
    constructor(parameters = {}) {
        super('/v1/payments', parameters);
    }
}

export default PaymentsAPI;

import API from './API';

class ParksAPI extends API {
    constructor(parameters = {}) {
        super('/v1/parks', parameters);
    }
}

export default ParksAPI;

import API from './API';

class AuthAPI extends API {
    constructor(parameters = {}) {
        super('/v1/auth', parameters);
    }

    /**
     * Send register request
     *
     * @param data
     * @return {*}
     */
    register(data) {
        return this.submit('post', `${this.endpoint}/register`, data);
    }

    /**
     * Send login request
     *
     * @param data
     * @return {*}
     */
    login(data) {
        return this.submit('post', `${this.endpoint}/login`, data);
    }

    /**
     * Send logout request
     *
     * @return {*}
     */
    logout() {
        this.setParameter('refreshToken', localStorage.getItem('refresh'));
        return this.submit('post', `${this.endpoint}/logout`);
    }

    /**
     * Send reset password request
     *
     * @param data
     * @return {*}
     */
    resetPassword(data) {
        return this.submit('post', `${this.endpoint}/reset`, data);
    }

    /**
     * Send recovery request
     *
     * @param data
     * @return {*}
     */
    recovery(data) {
        return this.submit('post', `${this.endpoint}/recovery`, data);
    }

    /**
     * Send refresh token request
     *
     * @return {*}
     */
    refreshToken(data) {
        return this.submit('post', `${this.endpoint}/refresh`, data);
    }
}

export default AuthAPI;

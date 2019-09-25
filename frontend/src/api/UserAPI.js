import API from './API';

class UserAPI extends API {
    constructor(parameters = {}) {
        super('/v1/users', parameters);
    }

    /**
     * Check user account by email
     *
     * @return {*}
     */
    checkByEmail(email) {
        this.setParameter('email', email);
        return this.submit('get', `${this.endpoint}/check`);
    }

    /**
     * Get my profile request
     *
     * @return {*}
     */
    getProfile() {
        return this.submitWithToken('get', `${this.endpoint}/me`);
    }

    /**
     * Update my profile request
     *
     * @param data
     * @return {*}
     */
    updateProfile(data) {
        return this.submitWithToken('put', `${this.endpoint}/me`, data);
    }

    /**
     * Change password request
     * @param data
     * @return {*}
     */
    changePassword(data) {
        return this.submitWithToken('put', `${this.endpoint}/me/password`, data);  // eslint-disable-line
    }

    /**
     * Send deactivate request
     *
     * @return {*}
     */
    deactivateAccount() {
        return this.submitWithToken('post', `${this.endpoint}/me/deactivate`);  // eslint-disable-line
    }

    /**
     * Send change avatar request
     *
     * @param file
     * @return {*}
     */
    changeAvatar(file) {
        return this.submitWithToken('put', `${this.endpoint}/me/avatar`, file);  // eslint-disable-line
    }

    /**
     * Send delete avatar request
     *
     * @return {*}
     */
    deleteAvatar() {
        return this.submitWithToken('delete', `${this.endpoint}/me/avatar`);  // eslint-disable-line
    }
}

export default UserAPI;

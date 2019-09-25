import Vue from 'vue';
import ParkTransformer from '../../../transformers/ParkTransformer';
import ParksTransformer from '../../../transformers/ParksTransformer';
import ParksAPI from '../../../api/ParksAPI';

export default {
    getAllParks({ commit }) {
        new ParksAPI()
            .all()
            .then(resp => {
                commit(
                    'SET_ALL_PARKS',
                    ParksTransformer.fetchCollections(resp.data)
                );
            })
            .catch(() => {
                Vue.router.push({
                    name: 'NotFound'
                });
            });
    },

    getParkInfo({ commit }, link) {
        new ParksAPI()
            .find(link)
            .then(resp => {
                commit('SET_SHOWN_PARK', ParkTransformer.fetch(resp.data));
            })
            .catch(() => {
                Vue.router.push({
                    name: 'NotFound'
                });
            });
    }
};

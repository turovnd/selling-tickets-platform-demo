<template>
    <div>
        <Search />
        <separator class="mt-0" />
        <v-container grid-list-xl>
            <b-row>
                <ParkCard
                    v-for="(park, ind) in getAllParks"
                    :item="park"
                    :hover="false"
                    :size="sizes[ind % 4]"
                    :key="ind"
                />
            </b-row>
        </v-container>
        <separator class="mt-0" />
    </div>
</template>

<script>
import Separator from '../../components/Separator';
import ParkCard from '../../components/ParkCard';
import Search from './Search';
import { mapGetters } from 'vuex';
export default {
    name: 'home-page',
    components: {
        Separator,
        ParkCard,
        Search
    },
    created() {
        this.$store.commit('CLEAR_ORDER');
        this.$store.commit('RESET_SHOWN_PARK');
        this.$store.commit('RESET_SELECTED_PARK');
    },
    updated() {
        window.scrollTo(0, 0);
    },
    computed: {
        ...mapGetters(['getAllParks'])
    },
    data() {
        return {
            sizes: [6, 6, 8, 4]
        };
    }
};
</script>

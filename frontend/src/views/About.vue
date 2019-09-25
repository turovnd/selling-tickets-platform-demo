<template>
    <v-container grid-list-xl class="about-page">
        <v-layout wrap flex-row-reverse>
            <v-flex xs12>
                <div
                    class="about-banner"
                    :style="'background-image: url(\'' + banner + '\');'"
                >
                    <h1>
                        {{ $t('ABOUT_PAGE.WE_OFFER') }}&nbsp;
                        <span class="label text-lowercase">
                            {{ $t('ABOUT_PAGE.BEST_PRICES') }}
                        </span>
                    </h1>
                    <h1 class="text-lowercase">
                        {{ $t('ABOUT_PAGE.FOR_CALIFORNIA_THEMPARK') }}
                    </h1>
                </div>
            </v-flex>
            <v-flex xs12>
                <b-tabs
                    vertical
                    v-model="tabIndex"
                    class="about-tabs"
                    nav-wrapper-class="col-12 col-md-4 col-lg-3 nav-aside"
                >
                    <b-tab
                        v-for="(tab, ind) in tabs"
                        @click="changeTab(tab)"
                        :key="'tab' + ind"
                        :title="$t('ABOUT_PAGE.' + tab + '.TITLE')"
                        v-html="$t('ABOUT_PAGE.' + tab + '.CONTENT')"
                    >
                    </b-tab>
                </b-tabs>
            </v-flex>
        </v-layout>
        <b-row>
            <ParkCard
                v-for="(park, ind) in getAllParks"
                v-show="park.route"
                :item="park"
                :hover="true"
                :size="sizes[ind % 4]"
                :key="ind"
            />
        </b-row>
    </v-container>
</template>
<script>
import ParkCard from '../components/ParkCard';
import { mapGetters } from 'vuex';
export default {
    name: 'about-page',
    components: {
        ParkCard
    },
    created() {
        if (
            this.$route.query.tab &&
            this.tabs.indexOf(this.$route.query.tab.toUpperCase()) > -1
        ) {
            this.tabIndex = this.tabs.indexOf(
                this.$route.query.tab.toUpperCase()
            );
        }
    },
    computed: {
        ...mapGetters(['getAllParks'])
    },
    data() {
        return {
            sizes: [4, 4, 4, 4],
            tabIndex: 0,
            tabs: ['ABOUT', 'TERMS', 'POLICY'],
            banner: require('../assets/images/about-banner.png')
        };
    },
    methods: {
        changeTab(tab) {
            this.$router.replace({
                query: {
                    tab: tab.toLowerCase()
                }
            });
        }
    }
};
</script>

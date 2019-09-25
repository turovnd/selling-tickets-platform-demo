<template>
    <v-layout class="ml-0 mr-0 mt-4 park-guests-selection">
        <v-flex d-flex flex-row aligin-center class="park-guests-block">
            <div class="flex-column d-flex">
                <b>{{ $t('CONTENT.ADULT') }}</b>
                <small class="text-muted"> {{ $t('CONTENT.AGES') }} 10+ </small>
            </div>
            <GuestsCounter
                :number="selectedPark.adultsNum"
                :min="1"
                :max="maxGuests - selectedPark.childrenNum"
                :type="'adults'"
            />
        </v-flex>
        <div class="split"></div>
        <v-flex d-flex flex-row aligin-center class="park-guests-block">
            <div class="flex-column d-flex">
                <b>{{ $t('CONTENT.CHILD') }}</b>
                <small class="text-muted"> {{ $t('CONTENT.AGES') }} 3-9 </small>
            </div>
            <GuestsCounter
                :number="selectedPark.childrenNum"
                :min="0"
                :max="maxGuests - selectedPark.adultsNum"
                :type="'children'"
            />
        </v-flex>
    </v-layout>
</template>
<script>
import GuestsCounter from './GuestsCounter';
import { mapGetters } from 'vuex';
export default {
    name: 'guests-selection-component',
    data() {
        return {
            maxGuests: this.$store.state.maxGuests
        };
    },
    computed: {
        ...mapGetters(['selectedPark'])
    },
    components: {
        GuestsCounter
    },
    created() {
        this.$on('increase', type => {
            switch (type) {
                case 'adults':
                    this.$store.commit('CHANGE_SELECTED_PARK', {
                        adultsNum: this.selectedPark.adultsNum + 1,
                        childrenNum: this.selectedPark.childrenNum
                    });
                    break;
                case 'children':
                    this.$store.commit('CHANGE_SELECTED_PARK', {
                        adultsNum: this.selectedPark.adultsNum,
                        childrenNum: this.selectedPark.childrenNum + 1
                    });
                    break;
            }
        });
        this.$on('decrease', type => {
            switch (type) {
                case 'adults':
                    this.$store.commit('CHANGE_SELECTED_PARK', {
                        adultsNum: this.selectedPark.adultsNum - 1,
                        childrenNum: this.selectedPark.childrenNum
                    });
                    break;
                case 'children':
                    this.$store.commit('CHANGE_SELECTED_PARK', {
                        adultsNum: this.selectedPark.adultsNum,
                        childrenNum: this.selectedPark.childrenNum - 1
                    });
                    break;
            }
        });
    }
};
</script>

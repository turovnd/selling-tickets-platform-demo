<template>
    <v-container grid-list-xl class="search-block">
        <v-form ref="form" @submit.prevent="handleSearchEvent">
            <h2
                class="mb-3 text-center font-weight-normal"
                v-html="$t('CONTENT.GET_BEST_PRICE')"
            ></h2>
            <v-layout wrap align-start>
                <v-flex xs12 sm5 d-flex>
                    <v-select
                        class="v-park"
                        :items="getAllParksOptions"
                        :item-text="'name.' + $i18n.locale"
                        :item-value="'link'"
                        :rules="[v => !!v || '']"
                        v-model="themePark"
                        required
                        :label="$t('CONTENT.THEME_PARK')"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                    <v-select
                        class="v-number"
                        :items="adultsOptions"
                        :rules="[v => v > 0 || '']"
                        v-model="adults"
                        :label="$t('CONTENT.ADULT')"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs12 sm2 d-flex>
                    <v-select
                        class="v-numeric"
                        :items="childrenOptions"
                        :rules="[v => v >= 0 || '']"
                        v-model="children"
                        :label="$t('CONTENT.CHILDREN')"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs12 sm3 d-flex>
                    <b-btn variant="submit" size="lg" type="submit" class="p-3">
                        {{ $t('CONTENT.FIND_TICKETS') }}
                    </b-btn>
                </v-flex>
            </v-layout>
        </v-form>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'search-component',
    data() {
        return {
            themePark: '',
            adults: 1,
            children: 0,
            maxVisitors: this.$store.state.maxGuests
        };
    },
    computed: {
        ...mapGetters(['getAllParksOptions']),
        adultsOptions() {
            let arr = [];
            for (let i = 1; i + this.children <= this.maxVisitors; i++) {
                arr.push(i);
            }
            return arr;
        },
        childrenOptions() {
            let arr = [];
            for (let i = 0; i + this.adults <= this.maxVisitors; i++) {
                arr.push(i);
            }
            return arr;
        }
    },
    methods: {
        handleSearchEvent() {
            if (this.$refs.form.validate()) {
                this.$store.commit('CHANGE_SELECTED_PARK', {
                    park: this.themePark,
                    adultsNum: this.adults,
                    childrenNum: this.children
                });
                this.$router.push({
                    name: 'ParkPage',
                    params: { link: this.themePark }
                });
            }
        }
    }
};
</script>

<template>
    <v-container grid-list-xl>
        <v-layout wrap flex-row-reverse>
            <v-flex xs12 sm5 md4 style="z-index: 1">
                <Summary />
            </v-flex>
            <v-flex xs12 sm7 md8>
                <Progress :steps="steps" :step="currentStep" />
                <div class="park-page" id="parkPage">
                    <ParkMetadata
                        :title="shownPark.title || {}"
                        :location="shownPark.location || {}"
                        :description="shownPark.description"
                        :features="shownPark.features"
                        :images="shownPark.images"
                    />
                    <div v-if="shownPark.daysOptions">
                        <h3>{{ $t('CONTENT.HOW_MANY_DAYS_VISIT') }}</h3>
                        <DaysSelection :options="shownPark.daysOptions" />
                    </div>
                    <Separator v-if="shownPark.daysOptions" />
                    <div>
                        <h3>{{ $t('CONTENT.WHO_IS_COMING') }}</h3>
                        <p>{{ $t('CONTENT.CHILDREN_UNDER_3_FREE') }}</p>
                        <GuestsSelection />
                    </div>
                    <Separator />
                    <div>
                        <h3>{{ $t('CONTENT.WHICH_TICKET_TYPE') }}</h3>
                        <TicketTypeSelection
                            :filter="
                                shownPark.daysOptions &&
                                this.selectedPark.ticket
                                    ? this.selectedPark.ticket.days
                                    : null
                            "
                            :options="shownPark.ticketsOptions"
                        />
                    </div>
                    <Separator />
                    <div>
                        <h3>{{ $t('CONTENT.CHOOSE_DATE') }}</h3>
                        <Calendar
                            class="ml-0"
                            :value="selectedPark.visitDate"
                            :lang="locale"
                            :i18n="calendar"
                            :firstDayOfWeek="0"
                            :disabledDaysOfWeek="[]"
                            :minDate="shownPark.minDate"
                            :maxDate="''"
                            :width="450"
                            :additionalData="selectedParkPrices"
                            :onDayClick="selectedDay"
                        />
                    </div>
                    <Separator />
                    <div class="page-faq">
                        <h3>{{ $t('CONTENT.FAQ') }}</h3>
                        <div
                            v-if="
                                shownPark.included && shownPark.included.length
                            "
                        >
                            <b-btn block v-b-toggle.included>
                                {{ $t('CONTENT.WHAT_INCLUDED') }}
                                <fa-icon class="icon" icon="chevron-up" />
                            </b-btn>
                            <b-collapse tag="p" id="included">
                                <div
                                    v-for="(block, ind) in shownPark.included"
                                    :key="'included' + ind"
                                >
                                    <div
                                        class="font-weight-bold mb-2"
                                        v-if="block.title"
                                    >
                                        {{ block.title[locale] }}
                                    </div>
                                    <ul class="icons-list">
                                        <li
                                            v-for="(item, ind1) in block.list"
                                            :key="'included-list' + ind1"
                                            :class="
                                                item.isInclude
                                                    ? 'check-icon'
                                                    : 'times-icon'
                                            "
                                        >
                                            {{ item.text[locale] }}
                                        </li>
                                    </ul>
                                </div>
                            </b-collapse>
                        </div>
                        <div v-if="shownPark.departure">
                            <b-btn block v-b-toggle.departure>
                                {{ $t('CONTENT.DEPARTURE_RETURN') }}
                                <fa-icon class="icon" icon="chevron-up" />
                            </b-btn>
                            <b-collapse tag="p" id="departure">
                                <dl>
                                    <dt>
                                        {{ $t('CONTENT.DEPARTURE_POINT') }}:
                                    </dt>
                                    <dd>
                                        {{ shownPark.departure.point[locale] }}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>{{ $t('CONTENT.DEPARTURE_TIME') }}:</dt>
                                    <dd>
                                        {{ shownPark.departure.time[locale] }}
                                    </dd>
                                </dl>
                                <b-alert
                                    v-if="shownPark.departure.note"
                                    variant="secondary"
                                    show
                                >
                                    {{ shownPark.departure.note[locale] }}
                                </b-alert>
                            </b-collapse>
                        </div>
                        <div v-if="shownPark.additional">
                            <b-btn block v-b-toggle.additional>
                                {{ $t('CONTENT.ADDITIONAL_INFO') }}
                                <fa-icon class="icon" icon="chevron-up" />
                            </b-btn>
                            <b-collapse
                                tag="p"
                                id="additional"
                                v-html="shownPark.additional[locale]"
                                class="icons-list"
                            ></b-collapse>
                        </div>
                        <div v-if="shownPark.cancellation">
                            <b-btn block v-b-toggle.policy>
                                {{ $t('CONTENT.CANCELLATION_POLICY') }}
                                <fa-icon class="icon" icon="chevron-up" />
                            </b-btn>
                            <b-collapse
                                tag="p"
                                id="policy"
                                v-html="shownPark.cancellation[locale]"
                            ></b-collapse>
                        </div>
                    </div>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Progress from '../../components/Progress';
import Separator from '../../components/Separator';
import DaysSelection from '../../components/DaysSelection';
import GuestsSelection from '../../components/GuestsSelection';
import TicketTypeSelection from '../../components/TicketTypeSelection';
import Calendar from '../../components/Calendar';
import ParkMetadata from './ParkMetadata';
import Summary from './Summary';
import { mapGetters } from 'vuex';
export default {
    name: 'park-page',
    components: {
        ParkMetadata,
        Summary,
        Progress,
        Separator,
        DaysSelection,
        GuestsSelection,
        TicketTypeSelection,
        Calendar
    },
    data() {
        return {
            calendar: this.$store.state.calendar,
            steps: this.$store.state.orderSteps,
            currentStep: 1
        };
    },
    computed: {
        ...mapGetters(['shownPark', 'selectedPark', 'selectedParkPrices']),
        parkRoute() {
            return this.$route.params.link;
        },
        locale() {
            return this.$i18n.locale;
        }
    },
    watch: {
        shownPark(park) {
            if (park.link) {
                if (!this.selectedPark.ticket) {
                    park.ticketsOptions[0].selected = true;
                }
                this.$store.commit('CHANGE_SELECTED_PARK', {
                    ticket: park.ticketsOptions.find(item => item.selected)
                });
            }
        }
    },
    created() {
        window.scrollTo(0, 0);
        this.$store.commit('CLEAR_ORDER');
        // If shownPark content is not for current park, request for retrieve new park data
        if (this.shownPark.link !== this.parkRoute) {
            this.$store.commit('RESET_SHOWN_PARK');
            this.$store.dispatch('getParkInfo', this.parkRoute);
        }
        // When page is create, set park to `selectedPark`
        this.$store.commit('CHANGE_SELECTED_PARK', {
            park: this.parkRoute
        });
        // Handle changes of day options if it is on the page
        this.$on('changeDayOption', val => {
            this.shownPark.daysOptions.forEach(item => {
                item.selected = val === item.days;
            });
            let selectedTicket = null;
            for (let i in this.shownPark.ticketsOptions) {
                if (
                    this.shownPark.ticketsOptions[i].days === val &&
                    !selectedTicket
                ) {
                    selectedTicket = this.shownPark.ticketsOptions[i];
                }
                this.shownPark.ticketsOptions[i].selected = false;
            }
            selectedTicket.selected = true;
            this.$store.commit('CHANGE_SELECTED_PARK', {
                ticket: selectedTicket
            });
        });
        // Handle changes of ticket options if it is on the page
        this.$on('changeTicketOption', val => {
            this.shownPark.ticketsOptions.forEach(item => {
                item.selected = val === item.id;
                if (val === item.id) {
                    this.$store.commit('CHANGE_SELECTED_PARK', {
                        ticket: item
                    });
                }
            });
        });
    },
    methods: {
        // Change visit date
        selectedDay(date) {
            this.$store.commit('CHANGE_SELECTED_PARK', {
                visitDate: date
            });
        }
    }
};
</script>

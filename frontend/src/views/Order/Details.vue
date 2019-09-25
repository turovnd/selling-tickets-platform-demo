<template>
    <v-container grid-list-xl class="mt-4 min-vh-65">
        <v-layout wrap>
            <v-flex v-if="isAuthenticated" xs12 text-center>
                <router-link
                    :to="{ name: 'ProfileMyTrips' }"
                    class="p-3 text-decoration-none h5 font-weight-normal"
                    style="color: inherit"
                >
                    <img
                        src="@/assets/images/icons/arrow-left.svg"
                        alt=""
                        class="mr-3"
                    />
                    <span>{{ $t('CONTENT.BACK_TO_TRIPS') }}</span>
                </router-link>
            </v-flex>
            <v-flex xs12 pt-3 v-if="currentOrder">
                <h1 class="text-center mb-4">
                    {{ currentPark.title[locale] }}
                </h1>
                <div class="park-details">
                    <div>
                        <img
                            src="@/assets/images/icons/calendar.svg"
                            alt=""
                            class="mr-2 flex-grow-0"
                        />
                        {{ getDate(currentOrder.visitDate) }}
                    </div>
                    <div>
                        <img
                            src="@/assets/images/icons/guests.svg"
                            alt=""
                            class="mr-2 flex-grow-0"
                        />
                        {{
                            $tc(
                                'CONTENT.GUESTS_NUMBER',
                                currentOrder.guests.length,
                                {
                                    val: currentOrder.guests.length
                                }
                            )
                        }}
                    </div>
                    <div>
                        <img
                            src="@/assets/images/icons/location.svg"
                            alt=""
                            class="mr-2 flex-grow-0"
                        />
                        {{
                            currentPark.title[locale] +
                                ' | ' +
                                currentPark.location[locale]
                        }}
                    </div>
                </div>
                <v-layout wrap mt-3>
                    <v-flex xs12 sm8>
                        <img :src="currentPark.logo" class="mb-2" height="35" />
                        <h4 class="float-right">
                            <b-badge
                                :variant="
                                    [2, 3].indexOf(currentOrder.status) > -1
                                        ? 'success'
                                        : 'brand'
                                "
                                pill
                                class="py-2 px-3"
                            >
                                <span v-if="currentOrder.status <= 1">{{
                                    $t('CONTENT.PENDING')
                                }}</span>
                                <span
                                    v-else-if="
                                        [2, 3].indexOf(currentOrder.status) > -1
                                    "
                                    >{{ $t('CONTENT.CONFIRMED') }}</span
                                >
                                <span v-else-if="currentOrder.status === 4">{{
                                    $t('CONTENT.REFUNDED')
                                }}</span>
                                <span v-else-if="currentOrder.status === 5">{{
                                    $t('CONTENT.CANCELED')
                                }}</span>
                            </b-badge>
                        </h4>
                        <h5 class="mb-5">
                            {{ currentTicket.title[locale] }}
                        </h5>
                        <h4 class="font-weight-normal">
                            {{ $t('CONTENT.GUESTS') }}
                        </h4>
                        <table class="park-guests">
                            <tbody>
                                <tr
                                    v-for="(guest, ind) in currentOrder.guests"
                                    :key="ind"
                                >
                                    <td width="30" class="text-center pb-3">
                                        <img
                                            src="@/assets/images/icons/guests.svg"
                                        />
                                    </td>
                                    <td class="pb-3">
                                        {{
                                            guest.firstName +
                                                ' ' +
                                                guest.lastName
                                        }}
                                        <img
                                            v-if="guest.isLead"
                                            class="flex-grow-0 d-sm-none pl-3"
                                            src="@/assets/images/icons/crown.svg"
                                        />
                                    </td>
                                    <td
                                        class="text-right pr-3 text-capitalize mb-3"
                                    >
                                        {{
                                            guest.isAdult
                                                ? $t('CONTENT.ADULT_TICKET')
                                                : $t('CONTENT.CHILDREN_TICKET')
                                        }}
                                    </td>
                                    <td
                                        v-if="guest.isLead"
                                        class="d-none d-sm-block pl-3 border mb-3"
                                    >
                                        {{ $t('CONTENT.LEAD_TRAVELER') }}
                                        <img
                                            class="ml-3"
                                            src="@/assets/images/icons/crown.svg"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="font-weight-normal mt-5">
                            {{ $t('CONTENT.CONTACT_INFORMATION') }}
                        </h4>
                        <p class="font-weight-light ml-1">
                            <fa-icon
                                class="mr-3"
                                icon="envelope"
                                style="opacity: .7"
                            />
                            {{ currentOrder.contactInfo.email }}
                        </p>
                        <p class="font-weight-light ml-1 mb-0">
                            <fa-icon
                                class="mr-3"
                                icon="phone-alt"
                                style="opacity: .7"
                            />
                            {{ currentOrder.contactInfo.phone }}
                        </p>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <Summary :showBtn="true" />
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 v-else-if="!isAuthenticated" auth-page pt-4 mt-0>
                <h3 class="mb-5 text-center">
                    {{ $t('CONTENT.ENTER_LEADER_DATA') }}
                </h3>
                <v-form ref="secretForm" @submit.prevent="getOrderDetails">
                    <v-text-field
                        v-model="secretData.firstName"
                        autocomplete="off"
                        type="text"
                        :rules="[
                            v => !!v || $t('CONTENT.FIRST_NAME_REQUIRED'),
                            v =>
                                NAME_REGEXP.test(v) ||
                                $t('CONTENT.NAME_SYMBOLS_PERMITTED')
                        ]"
                        :label="$t('CONTENT.FIRST_NAME')"
                        outline
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="secretData.lastName"
                        autocomplete="off"
                        type="text"
                        :rules="[
                            v => !!v || $t('CONTENT.LAST_NAME_REQUIRED'),
                            v =>
                                NAME_REGEXP.test(v) ||
                                $t('CONTENT.NAME_SYMBOLS_PERMITTED')
                        ]"
                        :label="$t('CONTENT.LAST_NAME')"
                        outline
                        required
                    ></v-text-field>
                    <b-btn
                        size="lg"
                        type="submit"
                        variant="submit"
                        class="w-100 mt-3"
                    >
                        {{ $t('CONTENT.VIEW_DATA') }}
                    </b-btn>
                    <div class="mt-3 text-center">
                        <span>{{ $t('CONTENT.ALREADY_HAVE_ACCOUNT') }}</span>
                        <b-link
                            class="submit-link font-weight-bold"
                            :to="{
                                name: 'SignIn',
                                query: { target: $route.path }
                            }"
                        >
                            {{ $t('CONTENT.SIGN_IN') }}
                        </b-link>
                    </div>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import Summary from '../Confirmation/Summary';
export default {
    name: 'order-details-page',
    components: {
        Summary
    },
    data() {
        return {
            calendar: this.$store.state.calendar,
            NAME_REGEXP: this.$store.state.regexp.name,
            orderId: this.$route.params.id,
            secretData: {
                firstName: null,
                lastName: null
            }
        };
    },
    computed: {
        ...mapGetters([
            'isAuthenticated',
            'currentOrder',
            'currentTicket',
            'currentPark'
        ]),
        locale() {
            return this.$i18n.locale;
        }
    },
    watch: {
        isAuthenticated() {
            this.$store.dispatch('getOrderById', this.orderId);
        }
    },
    created() {
        if (this.isAuthenticated) {
            this.$store.dispatch('getOrderById', this.orderId);
        }
    },
    beforeDestroy() {
        this.$store.commit('CLEAR_ORDER');
    },
    methods: {
        getOrderDetails() {
            if (this.$refs.secretForm.validate()) {
                this.$store.dispatch('getOrderDetails', {
                    id: this.orderId,
                    secret: this.secretData.lastName + this.secretData.firstName
                });
            }
        },
        getDate(date) {
            date = date instanceof Date ? date : new Date(date);
            let monthName = this.calendar[this.locale].pluralMonths[
                date.getMonth()
            ];
            return date.getDate() + ' ' + monthName + ' ' + date.getFullYear();
        }
    }
};
</script>

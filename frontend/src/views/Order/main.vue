<template>
    <v-container grid-list-xl>
        <v-layout wrap flex-row-reverse>
            <v-flex xs12 sm5 md4>
                <SummaryFull />
            </v-flex>
            <v-flex xs12 sm7 md8>
                <Progress :steps="steps" :step="currentStep" />
                <div class="order-page" id="orderPage">
                    <ParkMetadata
                        :title="shownPark.title || {}"
                        :location="shownPark.location || {}"
                    />
                    <v-layout wrap>
                        <v-flex d-flex xs12 md4>
                            <img
                                :src="icons.mobileTicket"
                                alt=""
                                class="mr-3"
                            />
                            <div>
                                {{ $t('CONTENT.PRINTED_MOBILE_VOUCHER') }}
                            </div>
                        </v-flex>
                        <v-flex d-flex xs12 md4>
                            <img
                                :src="icons.ticketConfirmation"
                                alt=""
                                class="mr-3"
                            />
                            <div>
                                {{ $t('CONTENT.TICKET_CONFIRMATION_WITHIN') }}
                            </div>
                        </v-flex>
                        <v-flex d-flex xs12 md4>
                            <img
                                :src="icons.cancellation"
                                alt=""
                                class="mr-3"
                            />
                            <div>
                                {{ $t('CONTENT.CANCELLATION_POLICY_FULL') }}
                            </div>
                        </v-flex>
                    </v-layout>
                    <v-form class="mt-4" ref="form">
                        <v-layout
                            wrap
                            justify-space-between
                            v-for="ind in formData.adults.length"
                            :key="'adult' + ind"
                        >
                            <v-flex xs12 class="pb-0">
                                <h5 v-if="ind === 1" class="mb-0">
                                    {{ $t('CONTENT.LEAD_TRAVELER') }}
                                    <span class="text-lowercase"
                                        >({{ $t('CONTENT.ADULT') }})</span
                                    >
                                </h5>
                                <h5 v-else class="mb-0">
                                    {{ $t('CONTENT.TRAVELER') }}
                                    {{ ind }}
                                    <span class="text-lowercase"
                                        >({{ $t('CONTENT.ADULT') }})</span
                                    >
                                </h5>
                            </v-flex>
                            <v-flex xs12 md6 class="pt-0">
                                <v-text-field
                                    v-model="formData.adults[ind - 1].firstName"
                                    pattern="[a-zA-Z]"
                                    :rules="[
                                        v =>
                                            !!v ||
                                            $t('CONTENT.FIRST_NAME_REQUIRED'),
                                        v =>
                                            NAME_REGEXP.test(v) ||
                                            $t('CONTENT.NAME_SYMBOLS_PERMITTED')
                                    ]"
                                    :label="$t('CONTENT.ENTER_FIRST_NAME')"
                                    required
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 class="pt-0">
                                <v-text-field
                                    v-model="formData.adults[ind - 1].lastName"
                                    :rules="[
                                        v =>
                                            !!v ||
                                            $t('CONTENT.LAST_NAME_REQUIRED'),
                                        v =>
                                            NAME_REGEXP.test(v) ||
                                            $t('CONTENT.NAME_SYMBOLS_PERMITTED')
                                    ]"
                                    :label="$t('CONTENT.ENTER_LAST_NAME')"
                                    required
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout
                            wrap
                            justify-space-between
                            v-for="ind in formData.children.length"
                            :key="'child' + ind"
                        >
                            <v-flex xs12 class="pb-0">
                                <h5 class="mb-0">
                                    {{ $t('CONTENT.TRAVELER') }}
                                    {{ selectedPark.adultsNum + ind }}
                                    <span class="text-lowercase">
                                        ({{ $t('CONTENT.CHILD') }})
                                    </span>
                                </h5>
                            </v-flex>
                            <v-flex xs12 md6 class="pt-0">
                                <v-text-field
                                    v-model="
                                        formData.children[ind - 1].firstName
                                    "
                                    :rules="[
                                        v =>
                                            !!v ||
                                            $t('CONTENT.FIRST_NAME_REQUIRED'),
                                        v =>
                                            NAME_REGEXP.test(v) ||
                                            $t('CONTENT.NAME_SYMBOLS_PERMITTED')
                                    ]"
                                    :label="$t('CONTENT.ENTER_FIRST_NAME')"
                                    required
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 class="pt-0">
                                <v-text-field
                                    v-model="
                                        formData.children[ind - 1].lastName
                                    "
                                    :rules="[
                                        v =>
                                            !!v ||
                                            $t('CONTENT.LAST_NAME_REQUIRED'),
                                        v =>
                                            NAME_REGEXP.test(v) ||
                                            $t('CONTENT.NAME_SYMBOLS_PERMITTED')
                                    ]"
                                    :label="$t('CONTENT.ENTER_LAST_NAME')"
                                    required
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <h2 class="mt-5 mb-4">
                            {{ $t('CONTENT.PAYMENT_INFORMATION') }}
                        </h2>
                        <PaymentWidget
                            :amount="selectedPark.totalPrice[locale]"
                            :showTabs="true"
                        />
                        <h2 class="mt-5">
                            {{ $t('CONTENT.CONTACT_INFORMATION') }}
                        </h2>
                        <v-layout wrap>
                            <v-flex xs12 md6 py-0>
                                <v-text-field
                                    v-model="formData.email"
                                    @blur="checkAccount"
                                    :rules="[
                                        v =>
                                            !!v || $t('CONTENT.EMAIL_REQUIRED'),
                                        v =>
                                            EMAIL_REGEXP.test(v) ||
                                            $t('CONTENT.EMAIL_INVALID')
                                    ]"
                                    :label="$t('CONTENT.ENTER_EMAIL')"
                                    outline
                                    required
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 py-0>
                                <v-text-field
                                    v-model="formData.phone"
                                    :rules="[
                                        v =>
                                            !!v || $t('CONTENT.PHONE_REQUIRED'),
                                        v =>
                                            PHONE_REGEXP.test(v) ||
                                            $t('CONTENT.PHONE_REGEXP')
                                    ]"
                                    :label="$t('CONTENT.PHONE_NUMBER')"
                                    outline
                                    required
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <h5
                            v-if="orderHasAccount"
                            class="text-brand mb-4 font-italic text-center"
                        >
                            {{ $t('CONTENT.ORDER_WILL_ADD_TO_ACCOUNT') }}
                        </h5>
                        <div v-else>
                            <h3>
                                {{ $t('CONTENT.MANAGE_YOUR_BOOKING') }}
                            </h3>
                            <ul class="icons-list d-flex mb-0 mt-4">
                                <li class="check-icon">Faster checkout</li>
                                <li class="check-icon">
                                    All your itineraries in one place
                                </li>
                            </ul>
                            <v-layout wrap>
                                <v-flex xs12 md6 py-0>
                                    <v-text-field
                                        v-model="formData.password"
                                        autocomplete="off"
                                        type="password"
                                        :rules="[
                                            v =>
                                                PASSWORD_REGEXP.test(v) ||
                                                $t(
                                                    'CONTENT.PASSWORD_VALIDATION'
                                                )
                                        ]"
                                        :label="$t('CONTENT.CREATE_PASSWORD')"
                                        outline
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md6 py-0>
                                    <v-text-field
                                        v-model="formData.password1"
                                        autocomplete="off"
                                        type="password"
                                        :rules="[
                                            v =>
                                                PASSWORD_REGEXP.test(v) ||
                                                $t(
                                                    'CONTENT.PASSWORD_VALIDATION'
                                                ),
                                            v =>
                                                v === formData.password ||
                                                $t('CONTENT.PASSWORD_NOT_SAME')
                                        ]"
                                        :label="$t('CONTENT.CONFIRM_PASSWORD')"
                                        outline
                                        required
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </div>
                        <v-checkbox
                            class="mt-0"
                            v-model="formData.bookingUpdates"
                            :value="true"
                            :label="$t('CONTENT.RECEIVE_BOOKING_UPDATES')"
                            type="checkbox"
                        ></v-checkbox>
                        <v-checkbox
                            v-if="!orderHasAccount"
                            class="mt-0"
                            v-model="formData.specialOffers"
                            :value="true"
                            :label="$t('CONTENT.RECEIVE_SPECIAL_OFFERS')"
                            type="checkbox"
                        ></v-checkbox>
                    </v-form>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import SummaryFull from './Summary';
import ParkMetadata from '../Park/ParkMetadata';
import Progress from '../../components/Progress';
import PaymentWidget from '../../components/PaymentWidget';
import { mapGetters } from 'vuex';
export default {
    name: 'order-page',
    components: {
        SummaryFull,
        ParkMetadata,
        Progress,
        PaymentWidget
    },
    computed: {
        ...mapGetters([
            'shownPark',
            'selectedPark',
            'orderHasAccount',
            'currentOrder'
        ]),
        locale() {
            return this.$i18n.locale;
        },
        hasPaid() {
            return (
                this.orderId &&
                this.currentOrder &&
                (this.currentOrder.status === 1 ||
                    this.currentOrder.status === 2)
            );
        }
    },
    beforeDestroy() {
        this.$store.commit('CLEAR_ORDER');
    },
    created() {
        if (!this.orderId && !this.shownPark.prefix) {
            return this.$router.push({ name: 'Home' });
        }
        if (this.orderId) {
            this.$store.dispatch('getOrderDetails', {
                id: this.orderId,
                secret: this.secret,
                process: true
            });
        }
        this.createFormData();
        this.$on('submitOrder', this.validateForm);
        this.$on('makePaymentRequest', this.makePaymentRequest);
        this.$on('changePaymentMethod', method => {
            this.formData.paymentMethod = method;
        });
        if (!this.isSuccess) {
            this.$notify({
                type: 'error',
                title: this.reasonMessage
            });
        }
        if (this.hasPaid) {
            this.$router.push({
                name: 'ConfirmationPage',
                query: {
                    order: this.orderId,
                    secret: this.secret
                }
            });
        }
    },
    watch: {
        currentOrder(val) {
            if (val.contactInfo && val.guests) {
                this.createFormData();
            }
        }
    },
    data() {
        return {
            steps: this.$store.state.orderSteps,
            currentStep: 2,
            orderId: this.$route.query.order,
            secret: this.$route.query.secret,
            isSuccess: this.$route.query.status
                ? this.$route.query.status === 'true'
                : true,
            reasonMessage: this.$route.query.reasonMessage || 'Error',
            EMAIL_REGEXP: this.$store.state.regexp.email,
            PASSWORD_REGEXP: this.$store.state.regexp.password,
            NAME_REGEXP: this.$store.state.regexp.name,
            PHONE_REGEXP: this.$store.state.regexp.phone,
            calendar: this.$store.state.calendar,
            icons: {
                mobileTicket: require('../../assets/images/icons/mobile-ticket.svg'),
                ticketConfirmation: require('../../assets/images/icons/ticket-confirmation.svg'),
                cancellation: require('../../assets/images/icons/cancellation.svg')
            },
            formData: {
                bookingUpdates: false,
                specialOffers: false,
                email: '',
                phone: '',
                password: '',
                paymentMethod: 'card',
                adults: [],
                children: []
            }
        };
    },
    methods: {
        createFormData() {
            let adults = [];
            let adultsData =
                this.orderId && this.currentOrder && this.currentOrder.guests
                    ? this.currentOrder.guests.filter(item => item.isAdult)
                    : null;
            for (let i = 0; i < this.selectedPark.adultsNum; i++) {
                if (this.orderId && adultsData && adultsData[i]) {
                    adults.push({
                        firstName: adultsData[i].firstName,
                        lastName: adultsData[i].lastName
                    });
                } else {
                    adults.push({ firstName: '', lastName: '' });
                }
            }
            let children = [];
            let childrenData =
                this.orderId && this.currentOrder && this.currentOrder.guests
                    ? this.currentOrder.guests.filter(item => !item.isAdult)
                    : null;
            for (let i = 0; i < this.selectedPark.childrenNum; i++) {
                if (this.orderId && childrenData && childrenData[i]) {
                    children.push({
                        firstName: childrenData[i].firstName,
                        lastName: childrenData[i].lastName
                    });
                } else {
                    children.push({ firstName: '', lastName: '' });
                }
            }
            this.formData = {
                bookingUpdates:
                    this.orderId &&
                    this.currentOrder &&
                    this.currentOrder.contactInfo
                        ? this.currentOrder.contactInfo.updates
                        : false,
                specialOffers: false,
                email:
                    this.orderId &&
                    this.currentOrder &&
                    this.currentOrder.contactInfo
                        ? this.currentOrder.contactInfo.email
                        : null,
                phone:
                    this.orderId &&
                    this.currentOrder &&
                    this.currentOrder.contactInfo
                        ? this.currentOrder.contactInfo.phone
                        : null,
                password: '',
                paymentMethod: 'card',
                paymentPacket: null,
                paymentCardHolder: null,
                adults: adults,
                children: children
            };
            this.checkAccount();
        },
        getDate(date) {
            date = date instanceof Date ? date : new Date(date);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            return (
                date.getFullYear() +
                '-' +
                (month < 10 ? '0' + month : month) +
                '-' +
                (day < 10 ? '0' + day : day)
            );
        },
        validateForm() {
            this.$refs.form.validate();
        },
        makePaymentRequest(data) {
            this.formData.paymentPacket = data.packet;
            this.formData.paymentCardHolder = data.cardHolder;
            if (
                this.$refs.form.validate() &&
                (this.formData.paymentMethod === 'paypal' ||
                    (this.formData.paymentMethod === 'card' &&
                        this.formData.paymentPacket &&
                        this.formData.paymentCardHolder))
            ) {
                this.$store.dispatch(
                    'createOrder',
                    Object.assign(
                        {
                            orderId: this.currentOrder
                                ? this.currentOrder.id
                                : null,
                            locale: this.locale,
                            park: this.selectedPark.park,
                            ticketId: this.selectedPark.ticket.id,
                            discount: this.selectedPark.discount,
                            visitDate: this.getDate(this.selectedPark.visitDate)
                        },
                        this.formData
                    )
                );
            }
        },
        checkAccount() {
            if (this.EMAIL_REGEXP.test(this.formData.email)) {
                this.$store.dispatch('orderCheckAccount', this.formData.email);
            } else {
                this.$store.commit('SET_ORDER_HAS_ACCOUNT', false);
            }
        }
    }
};
</script>

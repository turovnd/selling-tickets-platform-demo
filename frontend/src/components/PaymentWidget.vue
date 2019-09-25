<template>
    <form class="payment-widget" ref="payment">
        <v-layout v-if="showTabs">
            <v-flex xs12 md6>
                <label
                    @click="changeTab('card')"
                    :class="
                        'payment-tab' +
                            (currentTab === 'card' ? ' checked' : '')
                    "
                >
                    <span class="mb-3 d-block">
                        <span
                            :class="
                                'radio' +
                                    (currentTab === 'card' ? ' checked' : '')
                            "
                        >
                            <span class="circle"></span>
                            <span class="check"></span>
                            <input
                                type="radio"
                                name="selectedMethod"
                                value="card"
                            />
                        </span>
                        {{ $t('CONTENT.PAY_WITH_CARD', { val: amount }) }}
                    </span>
                    <span class="d-flex justify-space-around">
                        <span
                            class="payment-image"
                            v-for="(item, ind) in paymentImages"
                            :key="ind"
                        >
                            <img :src="getPaymentImage(item)" :alt="item" />
                        </span>
                    </span>
                </label>
            </v-flex>
            <v-flex xs12 md6 v-if="false">
                <label @click="changeTab('paypal')" class="payment-tab">
                    <span class="mb-3 d-block">
                        <span
                            :class="
                                'radio' +
                                    (currentTab === 'paypal' ? ' checked' : '')
                            "
                        >
                            <span class="circle"></span>
                            <span class="check"></span>
                            <input
                                type="radio"
                                name="selectedMethod"
                                value="paypal"
                            />
                        </span>
                        {{ $t('CONTENT.PAY_WITH_PAYPAL', { val: amount }) }}
                    </span>
                    <span class="d-flex justify-space-around">
                        <span class="payment-image">
                            <img
                                :src="getPaymentImage('paypal-full.png')"
                                alt="Paypal"
                            />
                        </span>
                    </span>
                </label>
            </v-flex>
        </v-layout>
        <v-layout wrap justify-space-between v-if="currentTab === 'card'">
            <v-flex xs12 py-0>
                <v-text-field
                    v-model="payment.name"
                    append-icon="person"
                    @input="checkValidation('name')"
                    :rules="[
                        v => !!v || $t('CONTENT.NAME_ON_CARD_REQUIRED'),
                        v =>
                            (v && !paymentErrors.name) ||
                            $t('CONTENT.NAME_ON_CARD_INVALID')
                    ]"
                    :label="$t('CONTENT.NAME_ON_CARD')"
                    outline
                    required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 py-0>
                <v-text-field
                    v-model="payment.cardNumber"
                    mask="#### #### #### #### ###"
                    append-icon="payment"
                    @input="checkValidation('cardNumber')"
                    :rules="[
                        v =>
                            (v && !paymentErrors.cardNumber) ||
                            $t('CONTENT.CARD_NUMBER_INVALID')
                    ]"
                    :label="$t('CONTENT.CARD_NUMBER')"
                    outline
                    required
                ></v-text-field>
            </v-flex>
            <v-flex xs6 sm4 py-0>
                <v-select
                    v-model="payment.expDateMonth"
                    @change="checkValidation('expDateMonth')"
                    :items="monthsOptions"
                    :rules="[
                        v =>
                            (v && !paymentErrors.expDateMonth) ||
                            $t('CONTENT.EXP_MONTH_REQUIRED')
                    ]"
                    :label="$t('CONTENT.EXP_MONTH')"
                    required
                    outline
                ></v-select>
            </v-flex>
            <v-flex xs6 sm4 py-0>
                <v-select
                    v-model="payment.expDateYear"
                    @change="checkValidation('expDateYear')"
                    :items="yearsOptions"
                    :rules="[
                        v =>
                            (v && !paymentErrors.expDateYear) ||
                            $t('CONTENT.EXP_YEAR_REQUIRED')
                    ]"
                    :label="$t('CONTENT.EXP_YEAR')"
                    required
                    outline
                ></v-select>
            </v-flex>
            <v-flex xs12 sm4 py-0>
                <v-text-field
                    v-model="payment.cvv"
                    append-icon="lock"
                    mask="###"
                    @input="checkValidation('cvv')"
                    :rules="[
                        v =>
                            (v && !paymentErrors.cvv) ||
                            $t('CONTENT.CVC_NUMBER_REQUIRED')
                    ]"
                    :label="$t('CONTENT.CVC_NUMBER')"
                    outline
                    required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 pt-0 v-if="showCVVHelp">
                <small class="text-light col-12 col-md-6 d-block p-0">
                    {{ $t('CONTENT.CVV_CVC_DESCRIPTION') }}
                </small>
            </v-flex>
        </v-layout>
        <v-layout v-if="currentTab === 'paypal'">
            <v-flex xs12 mb-5>
                {{ $t('CONTENT.PAYPAL_CONFIRM_ORDER') }}
            </v-flex>
        </v-layout>
    </form>
</template>
<script>
import Vue from 'vue';
import config from '../config';
export default {
    name: 'payment-widget',
    props: {
        showTabs: {
            type: Boolean,
            default: false
        },
        amount: {
            type: Number,
            default: 0
        },
        showCVVHelp: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.$parent.$parent.$emit('changePaymentMethod', this.currentTab);
        this.checkout = new window.cp.Checkout(
            config.paymentPublicKey,
            this.$refs.payment
        );
        this.$parent.$parent.$on('submitOrder', () => {
            if (this.currentTab === 'card') {
                let status = this.checkout.createCryptogramPacket(this.payment);
                this.paymentErrors = status.messages || {};
                this.$parent.$parent.$emit('makePaymentRequest', {
                    cardHolder: this.payment.name,
                    packet: status.packet
                });
            } else {
                this.$parent.$parent.$emit('makePaymentRequest', {});
            }
        });
    },
    data() {
        return {
            checkout: null,
            paymentErrors: {},
            currentTab: 'card',
            monthsOptions: [
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12'
            ],
            paymentImages: [
                // 'amex.png',
                'mastercard.png',
                // 'discover.png',
                // 'amazon.png',
                'visa.png'
            ],
            payment: {
                cardNumber: null,
                expDateMonth: null,
                expDateYear: null,
                cvv: null,
                name: null
            }
        };
    },
    computed: {
        yearsOptions() {
            let year = new Date().getFullYear();
            let options = [];
            for (let i = 0; i < 20; i++) {
                options.push(year + i);
            }
            return options;
        }
    },
    methods: {
        changeTab(tab) {
            if (this.currentTab !== tab) {
                this.payment.cardNumber = null;
                this.payment.expDateMonth = null;
                this.payment.expDateYear = null;
                this.payment.cvv = null;
                this.payment.name = null;
            }
            this.currentTab = tab;
            this.$parent.$parent.$emit('changePaymentMethod', tab);
        },
        getPaymentImage(image) {
            return require('../assets/images/payment/' + image);
        },
        checkValidation(key) {
            let status = this.checkout.createCryptogramPacket(this.payment);
            Vue.set(
                this.paymentErrors,
                key,
                status.messages ? status.messages[key] : null
            );
        }
    }
};
</script>

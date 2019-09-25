<template>
    <div
        class="summary clearfix"
        id="summaryBlock"
        v-if="selectedPark.park && selectedPark.ticket.title"
    >
        <div class="summary-content">
            <p class="d-flex flex-column">
                <small class="text-muted text-uppercase">
                    {{ $t('CONTENT.TICKET_TYPE') }}
                </small>
                <b>{{ selectedPark.ticket.title[locale] }}</b>
            </p>
            <p class="d-flex flex-column">
                <small class="text-muted"> {{ $t('CONTENT.DATE') }}: </small>
                <span>{{ getDate(selectedPark.visitDate) }}</span>
            </p>
            <div class="d-flex flex-column mb-3">
                <small class="text-muted"> {{ $t('CONTENT.GUESTS') }}: </small>
                <dl>
                    <dt>
                        {{
                            $tc(
                                'CONTENT.TOTAL_FOR_ADULTS',
                                selectedPark.adultsNum,
                                { val: selectedPark.adultsNum }
                            )
                        }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{ $t('CONTENT.CURRENCY', { val: adultPrice }) }}
                    </dd>
                </dl>
                <dl v-if="selectedPark.childrenNum">
                    <dt>
                        {{
                            $tc(
                                'CONTENT.TOTAL_FOR_CHILDREN',
                                selectedPark.childrenNum,
                                { val: selectedPark.childrenNum }
                            )
                        }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{ $t('CONTENT.CURRENCY', { val: childrenPrice }) }}
                    </dd>
                </dl>
                <dl>
                    <dt>{{ $t('CONTENT.TAXES_FEES') }}</dt>
                    <dd class="font-weight-bold">
                        {{ $t('CONTENT.INCLUDED') }}
                    </dd>
                </dl>
            </div>
            <div class="d-flex flex-column mb-3">
                <div class="align-center mb-1">
                    <small class="text-muted "
                        >{{ $t('CONTENT.PAYMENT_DETAILS') }}:</small
                    >
                    <img
                        id="popover-payment-details"
                        class="ml-2"
                        :src="icons.question"
                    />
                    <b-popover
                        target="popover-payment-details"
                        placement="top"
                        triggers="hover focus"
                    >
                        <span
                            v-html="$t('CONTENT.PAYMENT_DETAILS_TOOLTIP')"
                        ></span>
                    </b-popover>
                </div>
                <dl>
                    <dt>
                        {{ $t('CONTENT.HOLD_ON') }} {{ getDate(new Date()) }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{
                            $t('CONTENT.CURRENCY', {
                                val: selectedPark.totalPrice[locale]
                            })
                        }}
                    </dd>
                </dl>
                <dl>
                    <dt>
                        {{ $t('CONTENT.HOLD_ON') }}
                        {{ getDate(selectedPark.visitDate) }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{
                            $t('CONTENT.CURRENCY', {
                                val: selectedPark.totalPrice[locale]
                            })
                        }}
                    </dd>
                </dl>
            </div>
            <p>
                <small>
                    {{ $t('CONTENT.BY_COMPLETING_AGREE') }}
                    <b-link
                        :to="{ name: 'About', query: { tab: 'terms' } }"
                        class="external-link"
                        target="_blank"
                    >
                        {{ $t('CONTENT.TERMS_OF_SERVICE') }}
                    </b-link>
                    and
                    <b-link
                        :to="{ name: 'About', query: { tab: 'policy' } }"
                        class="external-link"
                        target="_blank"
                    >
                        {{ $t('CONTENT.PRIVACY_POLICY') }}
                    </b-link>
                </small>
            </p>
            <div class="d-flex align-center">
                <img class="mr-2" :src="icons.sequre" />
                <div>
                    <small>
                        {{ $t('CONTENT.WE_USE_SSL') }}
                    </small>
                </div>
            </div>
        </div>
        <b-btn class="summary-button" @click="submitOrder">
            <span v-if="paymentMethod === 'card'">
                {{ $t('CONTENT.ORDER_TICKETS') }}
            </span>
            <span v-else-if="paymentMethod === 'paypal'">
                {{ $t('CONTENT.ORDER_TICKETS_PAYPAL') }}
            </span>
        </b-btn>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'order-summary',
    data() {
        return {
            paymentMethod: 'card',
            icons: {
                sequre: require('../../assets/images/icons/sequre.svg'),
                question: require('../../assets/images/icons/question.svg')
            },
            calendar: this.$store.state.calendar
        };
    },
    created() {
        this.$parent.$on('changePaymentMethod', method => {
            this.paymentMethod = method;
        });
        window.onscroll = function() {
            if (document.getElementById('summaryBlock')) {
                let offsetTop = window.pageYOffset - 50;
                let bHeight = document.getElementById('summaryBlock')
                    .scrollHeight;
                let pageHeight = document.getElementById('orderPage')
                    .scrollHeight;
                if (pageHeight > offsetTop + bHeight) {
                    document.getElementById('summaryBlock').style.marginTop =
                        (offsetTop > 0 ? offsetTop : 0) + 'px';
                }
                if (window.innerWidth <= 600) {
                    document.getElementById('summaryBlock').style.marginTop = 0;
                }
            }
        };
    },
    computed: {
        ...mapGetters(['selectedPark']),
        locale() {
            return this.$i18n.locale;
        },
        adultPrice() {
            return (
                Math.ceil(
                    this.selectedPark.ticket.adultPrice[this.locale] *
                        (1 - this.selectedPark.discount)
                ) * this.selectedPark.adultsNum
            );
        },
        childrenPrice() {
            return (
                Math.ceil(
                    this.selectedPark.ticket.childrenPrice[this.locale] *
                        (1 - this.selectedPark.discount)
                ) * this.selectedPark.childrenNum
            );
        }
    },
    methods: {
        getDate(date) {
            if (!date) return date;
            date = date instanceof Date ? date : new Date(date);
            let monthName = this.calendar[this.locale].pluralMonths[
                date.getMonth()
            ];
            return date.getDate() + ' ' + monthName + ' ' + date.getFullYear();
        },
        submitOrder() {
            this.$parent.$emit('submitOrder');
        }
    }
};
</script>

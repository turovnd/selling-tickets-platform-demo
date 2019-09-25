<template>
    <div
        class="summary clearfix"
        id="summaryBlock"
        v-if="currentOrder && currentTicket"
    >
        <div class="summary-content">
            <div class="d-flex flex-column mb-3">
                <small class="text-muted"> {{ $t('CONTENT.GUESTS') }}: </small>
                <dl>
                    <dt>
                        {{
                            $tc(
                                'CONTENT.TOTAL_FOR_ADULTS',
                                currentOrder.adultsNum,
                                { val: currentOrder.adultsNum }
                            )
                        }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{ $t('CONTENT.CURRENCY', { val: adultPrice }) }}
                    </dd>
                </dl>
                <dl v-if="currentOrder.childrenNum">
                    <dt>
                        {{
                            $tc(
                                'CONTENT.TOTAL_FOR_CHILDREN',
                                currentOrder.childrenNum,
                                { val: currentOrder.childrenNum }
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
            <div class="d-flex flex-column">
                <div class="align-center mb-1">
                    <small class="text-muted">
                        {{ $t('CONTENT.PAYMENT_DETAILS') }}:
                    </small>
                    <img
                        :id="'popover-payment-details'"
                        class="ml-2"
                        src="@/assets/images/icons/question.svg"
                    />
                    <b-popover
                        :target="'popover-payment-details'"
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
                        {{ $t('CONTENT.HOLD_ON') }}
                        {{ getDate(currentOrder.createdAt) }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{ $t('CONTENT.CURRENCY', { val: totalPrice }) }}
                    </dd>
                </dl>
                <dl>
                    <dt>
                        {{ $t('CONTENT.HOLD_ON') }}
                        {{ getDate(currentOrder.visitDate) }}
                    </dt>
                    <dd class="font-weight-bold">
                        {{ $t('CONTENT.CURRENCY', { val: totalPrice }) }}
                    </dd>
                </dl>
            </div>
            <div
                v-if="!currentOrder.canCancel || !isAuthenticated"
                class="mt-3 text-center"
            >
                <a class="text-brand" :href="'mailto:' + company.email">
                    {{ $t('CONTENT.QUESTIONS_CONTACT_US') }}
                </a>
            </div>
        </div>
        <b-btn
            v-if="showBtn && [2, 3].indexOf(currentOrder.status) > -1"
            class="summary-button text-capitalize"
            @click="handleDownloadTicket"
        >
            {{ $t('CONTENT.DOWNLOAD_TICKET') }}
        </b-btn>
        <b-btn
            v-else-if="showBtn && currentOrder.canCancel && isAuthenticated"
            class="summary-button text-capitalize"
            @click="handleCancelReservation"
        >
            {{ $t('CONTENT.CANCEL_RESERVATION') }}
        </b-btn>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'confirmation-summary',
    props: ['showBtn'],
    data() {
        return {
            company: this.$store.state.company,
            calendar: this.$store.state.calendar
        };
    },
    computed: {
        ...mapGetters(['currentOrder', 'currentTicket', 'isAuthenticated']),
        locale() {
            return this.$i18n.locale;
        },
        adultPrice() {
            return Math.ceil(
                Math.ceil(
                    this.currentTicket.adultPrice[this.locale] *
                        (1 - this.currentOrder.discount)
                ) * this.currentOrder.adultsNum
            );
        },
        childrenPrice() {
            return Math.ceil(
                Math.ceil(
                    this.currentTicket.childrenPrice[this.locale] *
                        (1 - this.currentOrder.discount)
                ) * this.currentOrder.childrenNum
            );
        },
        totalPrice() {
            return this.adultPrice + this.childrenPrice;
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
        handleDownloadTicket() {
            let leader =
                this.currentOrder.guests.find(item => item.isLead) || {};
            window.open(
                this.currentOrder.currentTicketUrl +
                    `?secret=${leader.lastName + leader.firstName}`
            );
        },
        handleCancelReservation() {
            this.$store.dispatch('cancelMyOrder', this.currentOrder.id);
        }
    }
};
</script>

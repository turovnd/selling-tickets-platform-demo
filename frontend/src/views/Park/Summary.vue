<template>
    <div class="summary clearfix" v-if="selectedPark.ticket" id="summaryBlock">
        <div class="summary-header">
            <p class="d-flex flex-column">
                <small class="text-muted text-uppercase">
                    {{ $t('CONTENT.TICKET_TYPE') }}
                </small>
                <b>{{
                    selectedPark.ticket.title
                        ? selectedPark.ticket.title[locale]
                        : ''
                }}</b>
            </p>
            <p class="d-flex">
                <img class="summary-icon" :src="icons.calendar" />
                <span class="summary-text">{{
                    getDate(selectedPark.visitDate)
                }}</span>
            </p>
            <p class="d-flex">
                <img class="summary-icon" :src="icons.guests" />
                <span class="summary-text">
                    {{ $tc('CONTENT.GUESTS_NUMBER', guests, { val: guests }) }}
                </span>
            </p>
        </div>
        <div class="summary-content">
            <dl class="mb-3">
                <dt>
                    {{
                        $tc(
                            'CONTENT.ADULTS_TICKETS_VAL',
                            selectedPark.adultsNum,
                            {
                                val: selectedPark.adultsNum
                            }
                        )
                    }}
                </dt>
                <dd class="text-lowercase font-weight-bold text-right">
                    {{ $t('CONTENT.CURRENCY', { val: adultPrice }) }}/{{
                        $t('CONTENT.TICKET')
                    }}
                </dd>
            </dl>
            <dl class="mb-3" v-if="selectedPark.childrenNum">
                <dt>
                    {{
                        $tc(
                            'CONTENT.CHILDREN_TICKETS_VAL',
                            selectedPark.childrenNum,
                            {
                                val: selectedPark.childrenNum
                            }
                        )
                    }}
                </dt>
                <dd class="text-lowercase font-weight-bold text-right">
                    {{ $t('CONTENT.CURRENCY', { val: childrenPrice }) }}/{{
                        $t('CONTENT.TICKET')
                    }}
                </dd>
            </dl>
            <dl class="font-weight-bold">
                <dt>{{ $t('CONTENT.SUBTOTAL') }}</dt>
                <dd>
                    {{
                        $t('CONTENT.CURRENCY', {
                            val: selectedPark.totalPrice[locale]
                        })
                    }}
                </dd>
            </dl>
        </div>
        <b-btn class="summary-button" @click="nextStep">
            {{ $t('CONTENT.BOOK_NOW') }}
        </b-btn>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'park-summary',
    data() {
        return {
            icons: {
                calendar: require('../../assets/images/icons/calendar.svg'),
                guests: require('../../assets/images/icons/guests.svg')
            },
            calendar: this.$store.state.calendar
        };
    },
    created() {
        window.onscroll = function() {
            if (document.getElementById('summaryBlock')) {
                let offsetTop = window.pageYOffset - 50;
                let bHeight = document.getElementById('summaryBlock')
                    .scrollHeight;
                let pageHeight = document.getElementById('parkPage')
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
        guests() {
            return this.selectedPark.adultsNum + this.selectedPark.childrenNum;
        },
        adultPrice() {
            if (!this.selectedPark.ticket.adultPrice) return 0;
            return Math.ceil(
                this.selectedPark.ticket.adultPrice[this.locale] *
                    (1 - this.selectedPark.discount)
            );
        },
        childrenPrice() {
            if (!this.selectedPark.ticket.childrenPrice) return 0;
            return Math.ceil(
                this.selectedPark.ticket.childrenPrice[this.locale] *
                    (1 - this.selectedPark.discount)
            );
        }
    },
    methods: {
        nextStep() {
            this.$router.push({ name: 'OrderPage' });
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

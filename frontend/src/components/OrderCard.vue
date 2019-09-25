<template>
    <div class="order-card">
        <div v-if="status <= 1" class="order-status pending">
            <img src="@/assets/images/icons/pending.svg" alt="" />
            <span class="ml-1">{{ $t('CONTENT.PENDING') }}</span>
        </div>
        <div
            v-else-if="status === 2 || status === 3"
            class="order-status confirmed"
        >
            <img src="@/assets/images/icons/confirmed.svg" alt="" />
            <span class="ml-1">{{ $t('CONTENT.CONFIRMED') }}</span>
        </div>
        <div v-else-if="status === 4" class="order-status pending">
            <fa-icon icon="times" />
            <span class="ml-1">{{ $t('CONTENT.REFUNDED') }}</span>
        </div>
        <div v-else-if="status === 5" class="order-status pending">
            <fa-icon icon="times" />
            <span class="ml-1">{{ $t('CONTENT.CANCELED') }}</span>
        </div>
        <div class="order-block">
            <img :src="image" alt="Image" class="order-image" />
            <div class="order-content">
                <div>
                    <b-btn
                        variant="outline-submit"
                        class="order-btn d-none d-sm-inline-flex"
                        v-if="orderId"
                        :to="{
                            name: 'OrderDetailsPage',
                            params: { id: orderId }
                        }"
                    >
                        {{ $t('CONTENT.VIEW_DETAILS') }}
                    </b-btn>
                    <img :src="logo" alt="Logo" class="order-logo" />
                </div>
                <h5 class="order-ticket">{{ ticketName[locale] }}</h5>
                <div
                    :class="
                        'order-info' + (orderId ? ' flex-row' : ' flex-column')
                    "
                >
                    <p>
                        <img
                            src="@/assets/images/icons/calendar.svg"
                            alt=""
                            class="mr-3 flex-grow-0"
                        />
                        {{ getDate(visitDate) }}
                    </p>
                    <p>
                        <img
                            src="@/assets/images/icons/guests.svg"
                            alt=""
                            class="mr-3 flex-grow-0"
                        />
                        {{
                            $tc('CONTENT.GUESTS_NUMBER', guestsNum, {
                                val: guestsNum
                            })
                        }}
                    </p>
                    <p v-if="location && parkName">
                        <img
                            src="@/assets/images/icons/location.svg"
                            alt=""
                            class="mr-3 flex-grow-0"
                        />
                        {{ parkName[locale] + ' | ' + location[locale] }}
                    </p>
                </div>
                <p class="order-price" v-if="price">
                    {{ price[locale] }}
                </p>
                <b-btn
                    variant="outline-submit"
                    class="order-btn d-block d-sm-none p-3"
                    v-if="orderId"
                    :to="{ name: 'OrderDetailsPage', params: { id: orderId } }"
                >
                    {{ $t('CONTENT.VIEW_DETAILS') }}
                </b-btn>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'order-card',
    props: [
        'logo',
        'image',
        'ticketName',
        'visitDate',
        'guestsNum',
        'status',
        'parkName',
        'location',
        'price',
        'orderId'
    ],
    data() {
        return {
            calendar: this.$store.state.calendar
        };
    },
    computed: {
        locale() {
            return this.$i18n.locale;
        }
    },
    methods: {
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

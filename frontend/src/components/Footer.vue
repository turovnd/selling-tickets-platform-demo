<template>
    <footer class="app-footer text-lg-left text-center">
        <b-container>
            <b-row>
                <b-col cols="12" md="3" class="pt-3">
                    <img
                        src="@/assets/images/logo.png"
                        alt="ticket-selling"
                        class="logo"
                    />
                    <small class="d-block mt-2 text-muted">
                        {{ $t('CONTENT.COPYRIGHT') }}
                    </small>
                </b-col>
                <b-col cols="12" md="3" class="pt-3">
                    <b-nav vertical>
                        <b-nav-item
                            class="font-weight-bold"
                            :to="{ name: 'Home' }"
                        >
                            {{ $t('CONTENT.HOME') }}
                        </b-nav-item>
                        <b-nav-item
                            class="font-weight-bold"
                            :to="{ name: 'About' }"
                        >
                            {{ $t('CONTENT.ABOUT') }}
                        </b-nav-item>
                        <b-nav-item
                            class="font-weight-bold"
                            target="tab"
                            :href="company.facebook"
                        >
                            Facebook
                        </b-nav-item>
                    </b-nav>
                </b-col>
                <b-col cols="12" md="3" class="pt-3">
                    <b-nav vertical>
                        <b-nav-item
                            :href="'mailto:' + company.email"
                            class="nav-link-small"
                        >
                            <fa-icon class="icon" icon="envelope" />
                            {{ company.email }}
                        </b-nav-item>
                        <b-nav-item
                            :href="'tel:' + company.tel"
                            class="nav-link-small"
                        >
                            <fa-icon class="icon" icon="phone-alt" />
                            {{ company.tel | telFilter }}
                        </b-nav-item>
                    </b-nav>
                </b-col>
                <b-col cols="12" md="3" class="pt-3">
                    <b-nav>
                        <div
                            class="payment"
                            v-for="(item, ind) in paymentImages"
                            :key="ind"
                        >
                            <img :src="getPaymentImage(item)" :alt="item" />
                        </div>
                    </b-nav>
                </b-col>
            </b-row>
        </b-container>
    </footer>
</template>
<script>
export default {
    name: 'footer-component',
    data() {
        return {
            company: this.$store.state.company,
            paymentImages: [
                // 'amex.png',
                'mastercard.png',
                // 'discover.png',
                // 'amazon.png',
                'visa.png'
                //'paypal.png'
            ]
        };
    },
    filters: {
        telFilter(value) {
            return (
                value.slice(0, 2) +
                ' (' +
                value.slice(2, 5) +
                ') ' +
                value.slice(5, 8) +
                ' ' +
                value.slice(8, 10) +
                ' ' +
                value.slice(10, 12)
            );
        }
    },
    methods: {
        getPaymentImage(image) {
            return require('../assets/images/payment/' + image);
        }
    }
};
</script>

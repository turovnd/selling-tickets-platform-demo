<template>
    <v-container grid-list-xl>
        <v-layout wrap flex-row-reverse>
            <v-flex xs12>
                <Progress :steps="steps" :step="currentStep" />
                <v-flex xs12 sm8 md6 class="d-flex mx-auto py-5">
                    <div class="mr-5">
                        <img
                            height="120px"
                            src="@/assets/images/icons/success.svg"
                            alt="Success"
                        />
                    </div>
                    <div class="d-flex flex-column">
                        <h1 class="mb-0">
                            {{ $t('CONTENT.THANK_YOU') }}
                        </h1>
                        <p class="mb-0 text-muted">
                            {{ $t('CONTENT.CONFIRMATION_CONTENT') }}
                        </p>
                    </div>
                </v-flex>
            </v-flex>
            <v-layout wrap align-items-center>
                <v-flex xs12 md7 mt-4>
                    <OrderCard
                        v-if="currentPark && currentOrder"
                        :logo="currentPark.logo"
                        :image="currentPark.image"
                        :ticketName="currentTicket.title"
                        :visitDate="currentOrder.visitDate"
                        :guestsNum="
                            currentOrder.adultsNum + currentOrder.childrenNum
                        "
                        :status="currentOrder.status"
                    />
                </v-flex>
                <v-flex xs12 md4 offset-md1 mt-4>
                    <Summary />
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>
<script>
import Progress from '../../components/Progress';
import OrderCard from '../../components/OrderCard';
import Summary from './Summary';

import { mapGetters } from 'vuex';
export default {
    name: 'confirmation-page',
    components: {
        Progress,
        OrderCard,
        Summary
    },
    created() {
        if (!this.isSuccess) {
            this.$notify({
                type: 'error',
                title: this.reasonMessage
            });
        }
        if (this.orderId) {
            this.$store.dispatch('getOrderDetails', {
                id: this.orderId,
                secret: this.secret
            });
        }
    },
    data() {
        return {
            steps: this.$store.state.orderSteps,
            currentStep: 4,
            orderId: this.$route.query.order,
            secret: this.$route.query.secret,
            isSuccess: this.$route.query.success || true,
            reasonMessage: this.$route.query.reasonMessage || 'Error'
        };
    },
    computed: {
        ...mapGetters(['currentOrder', 'currentTicket', 'currentPark']),
        locale() {
            return this.$i18n.locale;
        }
    }
};
</script>

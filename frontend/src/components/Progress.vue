<template>
    <div class="steps-progress">
        <div
            :class="
                'step' +
                    (step > ind ? ' active' : '') +
                    (step - 1 > ind ? ' completed' : '')
            "
            v-for="(name, ind) in steps"
            :key="ind"
            @click="navigateToStep(ind)"
        >
            <div class="step-circle">
                {{ ind + 1 }}
            </div>
            <div class="step-name">
                {{ $t('CONTENT.' + name) }}
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'progress-component',
    props: {
        steps: Array,
        step: Number,
        hasNavigation: {
            type: Boolean,
            defaultValue: false
        }
    },
    computed: {
        ...mapGetters(['currentOrder'])
    },
    methods: {
        navigateToStep(clickStep) {
            if (this.hasNavigation && clickStep + 1 <= this.step) {
                switch (clickStep + 1) {
                    case 1:
                        this.$router.push({
                            name: 'ParkPage',
                            params: {
                                link: this.park || this.currentOrder.parkLink
                            }
                        });
                        break;
                    case 2:
                        if (this.currentOrder.id) {
                            this.$router.push({
                                name: 'OrderPage',
                                query: {
                                    order: this.currentOrder.id
                                }
                            });
                        }
                        break;
                }
            }
        }
    }
};
</script>

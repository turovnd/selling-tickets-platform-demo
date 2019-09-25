<template>
    <div class="park-guests-counter">
        <div
            :class="'circle' + (number <= min ? ' disabled' : '')"
            @click="decrease"
        >
            <fa-icon icon="minus" />
        </div>
        <div class="number">
            {{ number }}
        </div>
        <div
            :class="'circle' + (number >= max ? ' disabled' : '')"
            @click="increase"
        >
            <fa-icon icon="plus" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'guests-counter-component',
    props: ['min', 'max', 'number', 'type'],
    methods: {
        increase() {
            if (this.number < this.max) {
                this.$parent.$emit('increase', this.type);
            }
        },
        decrease() {
            if (this.number > this.min) {
                this.$parent.$emit('decrease', this.type);
            }
        }
    }
};
</script>

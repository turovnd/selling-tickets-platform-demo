<template>
    <v-layout class="park-options ml-0 mr-0 mt-4">
        <v-flex
            v-for="(item, ind) in options"
            :class="'option-block' + (item.selected ? ' selected' : '')"
            @click="selectOption(item.days)"
            :key="ind"
        >
            <div class="option-content">
                <h4>
                    {{
                        $tc('CONTENT.DAYS_NUMBER', item.days, {
                            days: item.days
                        })
                    }}
                </h4>
                <div class="text-muted small">
                    {{
                        $t('CONTENT.FROM_PRICE_PER_DAY', {
                            value: item.price[$i18n.locale]
                        })
                    }}
                </div>
            </div>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    name: 'days-selection-component',
    props: ['options'],
    methods: {
        selectOption(val) {
            this.$parent.$emit('changeDayOption', val);
        }
    }
};
</script>

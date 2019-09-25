<template>
    <v-layout class="park-tickets ml-0 mr-0 mt-4" flex-column>
        <v-flex
            flex-row
            v-for="(item, ind) in options"
            :class="'option-block' + (item.selected ? ' selected' : '')"
            @click="selectOption(item.id)"
            v-show="filter ? filter === item.days : true"
            :key="ind"
        >
            <div
                class="option-content d-flex flex-row align-center justify-space-between"
            >
                <div class="option-content-title">
                    <h5>{{ item.title[$i18n.locale] }}</h5>
                    <div class="text-muted small">
                        {{ item.description[$i18n.locale] }}
                    </div>
                    <div
                        v-if="item.additional"
                        class="flex flex-row align-center mt-2 p-0"
                    >
                        <img :src="item.additional.icon" alt="" class="mr-2" />
                        <span>{{ item.additional.content[$i18n.locale] }}</span>
                        <img
                            v-if="item.additional.tooltip"
                            src="@/assets/images/icons/question.svg"
                            alt=""
                            :id="'popover-' + item.id"
                            class="ml-2"
                        />
                        <b-popover
                            v-if="item.additional.tooltip"
                            :target="'popover-' + item.id"
                            placement="top"
                            triggers="hover focus"
                            class=""
                        >
                            <span
                                v-html="item.additional.tooltip[$i18n.locale]"
                            ></span>
                        </b-popover>
                    </div>
                </div>
                <div class="option-content-price">
                    <h5>
                        {{
                            $t('CONTENT.CURRENCY', {
                                val: Math.ceil(
                                    item.adultPrice[$i18n.locale] *
                                        (1 - config.maxDiscount)
                                )
                            })
                        }}
                    </h5>
                    <div class="text-muted small text-uppercase">
                        {{ $t('CONTENT.ADULT') }}
                    </div>
                </div>
                <div class="option-content-price">
                    <h5>
                        {{
                            $t('CONTENT.CURRENCY', {
                                val: Math.ceil(
                                    item.childrenPrice[$i18n.locale] *
                                        (1 - config.maxDiscount)
                                )
                            })
                        }}
                    </h5>
                    <div class="text-muted small text-uppercase">
                        {{ $t('CONTENT.CHILD') }}
                    </div>
                </div>
            </div>
        </v-flex>
    </v-layout>
</template>
<script>
import config from '../config';
export default {
    name: 'days-selection-component',
    data() {
        return {
            config: config
        };
    },
    props: ['options', 'filter'],
    methods: {
        selectOption(val) {
            this.$parent.$emit('changeTicketOption', val);
        }
    }
};
</script>

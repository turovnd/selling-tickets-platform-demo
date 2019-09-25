<template>
    <b-col cols="12" :md="size">
        <div
            class="park-card"
            @click="openParkPage"
            :style="'cursor: ' + (this.item.route ? 'pointer' : 'default')"
        >
            <div
                class="park-card-image"
                :style="'background-image: url(\'' + item.image + '\')'"
            ></div>
            <div class="park-card-overlay"></div>
            <div
                :class="'park-card-content' + (hover ? ' park-hover-hide' : '')"
            >
                <img
                    class="park-card-logo mb-3"
                    :src="item.logo"
                    :alt="item.name"
                />
                <div class="park-card-info mb-3" v-if="!hover">
                    <div class="park-card-price" v-if="item.price[locale]">
                        <span class="price-prefix text-lowercase">
                            {{ $t('CONTENT.FROM') }}
                        </span>
                        <span class="price">{{
                            $t('CONTENT.CURRENCY', {
                                val: item.price[locale]
                            })
                        }}</span>
                        <span class="price-append text-muted">/pp</span>
                    </div>
                    <div>
                        <b-btn
                            class="park-card-btn"
                            :variant="
                                item.btnText[locale] !== 0 ? 'success' : 'dark'
                            "
                        >
                            <span v-if="item.btnText[locale] === 0">{{
                                $t('CONTENT.COMING_SOON')
                            }}</span>
                            <span v-else>{{
                                $t('CONTENT.SAVE_CURRENCY', {
                                    val: item.btnText[locale]
                                })
                            }}</span>
                        </b-btn>
                    </div>
                </div>
            </div>
            <div class="park-card-hover" v-if="hover">
                <div class="park-card-info">
                    <img
                        class="park-card-logo"
                        :src="item.logo"
                        :alt="item.name"
                    />
                    <div class="park-card-price" v-if="item.price">
                        <span class="price-prefix text-lowercase">
                            {{ $t('CONTENT.FROM') }}
                        </span>
                        <span class="price">{{
                            $t('CONTENT.CURRENCY', {
                                val: item.price[locale]
                            })
                        }}</span>
                        <span class="price-append text-muted">/pp</span>
                    </div>
                    <div>
                        <b-btn
                            class="park-card-btn"
                            :variant="item.price ? 'success' : 'dark'"
                            >{{
                                $t('CONTENT.SAVE_CURRENCY', {
                                    val: item.btnText[locale]
                                })
                            }}</b-btn
                        >
                    </div>
                </div>
                <div class="park-card-button">
                    {{ $t('CONTENT.BOOK_NOW') }}
                </div>
            </div>
        </div>
    </b-col>
</template>
<script>
export default {
    name: 'park-card',
    props: ['item', 'size', 'hover'],
    computed: {
        locale() {
            return this.$i18n.locale;
        }
    },
    methods: {
        openParkPage() {
            if (this.item.route) {
                this.$store.commit('CHANGE_SELECTED_PARK', {
                    park: this.item.route,
                    adultsNum: 1,
                    childrenNum: 0
                });
                this.$router.push({
                    name: 'ParkPage',
                    params: { link: this.item.route }
                });
            }
        }
    }
};
</script>

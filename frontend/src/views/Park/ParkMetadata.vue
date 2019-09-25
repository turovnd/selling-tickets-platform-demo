<template>
    <div class="park-metadata">
        <h1 class="park-title">
            {{ title[locale] }}
            <span class="park-location">
                <fa-icon class="icon" icon="map-marker-alt" />
                {{ location[locale] }}
            </span>
        </h1>
        <p
            v-if="description"
            class="park-description more-en"
            ref="description"
            @click="openFullDescription"
        >
            {{ description[locale] }}
        </p>
        <v-layout
            v-if="features"
            wrap
            align-start
            justify-space-between
            class="park-features"
        >
            <v-flex
                align-center
                class="feature"
                v-for="(item, ind) in features"
                :key="ind"
            >
                <img :src="item.icon" />
                <span>{{ item.name[locale] }}</span>
            </v-flex>
        </v-layout>
        <b-row v-if="images" class="park-images">
            <b-col cols="8">
                <b-img :src="images[0]"></b-img>
            </b-col>
            <b-col cols="4">
                <b-img :src="images[1]"></b-img>
                <b-img :src="images[2]"></b-img>
            </b-col>
        </b-row>
    </div>
</template>
<script>
export default {
    name: 'park-metadata',
    props: ['title', 'location', 'description', 'features', 'images'],
    methods: {
        openFullDescription() {
            this.$refs.description.style.cursor = 'default';
            this.$refs.description.style.display = 'block';
            this.$refs.description.classList.remove('more-ru');
            this.$refs.description.classList.remove('more-en');
        }
    },
    computed: {
        locale() {
            return this.$i18n.locale;
        }
    },
    watch: {
        locale(lang) {
            if (this.$refs.description) {
                switch (lang) {
                    case 'en':
                        this.$refs.description.classList.remove('more-ru');
                        this.$refs.description.classList.add('more-en');
                        break;
                    case 'ru':
                        this.$refs.description.classList.add('more-ru');
                        this.$refs.description.classList.remove('more-en');
                        break;
                }
            }
        }
    }
};
</script>

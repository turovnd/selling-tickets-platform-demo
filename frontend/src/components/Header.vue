<template>
    <b-navbar tag="header" toggleable="md" class="app-header">
        <b-navbar-brand :to="{ name: 'Home' }">
            <img src="@/assets/images/logo.png" alt="ticket-selling" class="logo" />
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <div class="d-flex flex-wrap nav-block">
                <b-navbar-nav>
                    <b-nav-item class="font-weight-bold" :to="{ name: 'Home' }">
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
                </b-navbar-nav>
                <b-navbar-nav>
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
                </b-navbar-nav>
            </div>
            <div class="d-flex flex-sm-column flex-md-row">
                <HeaderUserDropdown />
                <b-nav-item-dropdown right class="language">
                    <template slot="button-content">
                        <img class="icon" :src="getLangIcon($i18n.locale)" />
                        <span class="text">{{ $i18n.locale | uppercase }}</span>
                    </template>
                    <b-dropdown-item
                        v-for="item in languages"
                        :key="item.id"
                        @click="changeLocale(item.id)"
                        :active="$i18n.locale === item.id"
                    >
                        <img class="icon" :src="getLangIcon(item.id)" />
                        <span>{{ item.label }}</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </div>
        </b-collapse>
    </b-navbar>
</template>
<script>
import HeaderUserDropdown from './HeaderUserDropdown';
export default {
    name: 'header-component',
    components: {
        HeaderUserDropdown
    },
    data() {
        return {
            company: this.$store.state.company,
            languages: this.$store.state.locales
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
        changeLocale(lang) {
            localStorage.setItem('lang', lang);
            this.$i18n.locale = lang;
        },
        getLangIcon(icon) {
            for (let i in this.languages) {
                if (icon === this.languages[i].id) {
                    return require('../assets/images/' +
                        this.languages[i].icon);
                }
            }
        }
    }
};
</script>

<template>
    <div>
        <AppHeader />
        <router-view />
        <AppFooter />
    </div>
</template>

<script>
import AppHeader from '../../components/Header';
import AppFooter from '../../components/Footer';

export default {
    name: 'main-layout',
    components: {
        AppHeader,
        AppFooter
    },
    created() {
        this.$store.dispatch('getAllParks');
    }
};
</script>

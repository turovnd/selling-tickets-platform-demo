<template>
    <div class="separator">
        <div class="line"></div>
        <img :src="image" alt="X" class="image" />
        <div class="line"></div>
    </div>
</template>
<script>
export default {
    name: 'separator',
    data() {
        return {
            image: require('../assets/images/logo-small.png')
        };
    }
};
</script>

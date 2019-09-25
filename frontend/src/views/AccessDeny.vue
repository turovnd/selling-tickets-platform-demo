<template>
    <div class="error-page">
        <div class="image">
            <img src="@/assets/images/icons/robot.svg" alt="" />
        </div>
        <div class="content">
            <h1>403</h1>
            <h3>{{ $t('CONTENT.HAVE_NOT_PERMISSION') }}</h3>
            <h5>
                {{ $t('CONTENT.GO_TO') }}
                <b-link class="error-btn" :to="{ name: 'Home' }">
                    {{ $t('CONTENT.HOMEPAGE') }}
                </b-link>
            </h5>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NotFound'
};
</script>

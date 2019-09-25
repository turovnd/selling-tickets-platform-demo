<template>
    <div class="error-page">
        <div class="image">
            <img src="@/assets/images/icons/robot.svg" alt="" />
        </div>
        <div class="content">
            <h1>{{ $t('CONTENT.SORRY') }}</h1>
            <h3>{{ $t('CONTENT.COULD_NOT_FIND') }}</h3>
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

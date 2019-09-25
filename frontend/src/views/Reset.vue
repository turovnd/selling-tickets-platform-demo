<template>
    <div class="auth-page">
        <h1 class="mb-5 text-center text-capitalize">
            {{ $t('CONTENT.RESET_PASSWORD') }}
        </h1>
        <v-form ref="form" @submit.prevent="handleSubmitEvent">
            <v-text-field
                v-model="formData.email"
                name="email"
                :rules="[
                    v => !!v || $t('CONTENT.EMAIL_REQUIRED'),
                    v => EMAIL_REGEXP.test(v) || $t('CONTENT.EMAIL_INVALID')
                ]"
                :label="$t('CONTENT.EMAIL_ADDRESS')"
                outline
                required
            ></v-text-field>
            <b-btn size="lg" type="submit" variant="submit" class="w-100">
                {{ $t('CONTENT.RESET_PASSWORD') }}
            </b-btn>
        </v-form>
    </div>
</template>
<script>
export default {
    name: 'recovery-page',
    data() {
        return {
            EMAIL_REGEXP: this.$store.state.regexp.email,
            target: this.$route.query.target,
            formData: {
                email: null
            }
        };
    },
    methods: {
        handleSubmitEvent() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch(
                    'resetPassword',
                    Object.assign(
                        {
                            target: this.target,
                            locale: this.$i18n.locale
                        },
                        this.formData
                    )
                );
            }
        }
    }
};
</script>

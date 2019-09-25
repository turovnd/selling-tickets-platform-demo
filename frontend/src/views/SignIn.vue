<template>
    <div class="auth-page">
        <h1 class="mb-5 text-center text-capitalize">
            {{ $t('CONTENT.SIGN_IN') }}
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
            <v-text-field
                v-model="formData.password"
                autocomplete="off"
                type="password"
                :rules="[v => !!v || $t('CONTENT.PASSWORD_REQUIRED')]"
                :label="$t('CONTENT.PASSWORD')"
                outline
                required
            ></v-text-field>
            <b-link
                class="submit-link font-weight-bold recovery-link"
                :to="{ name: 'Reset', query: { target: target } }"
            >
                {{ $t('CONTENT.RESET_PASSWORD') }}
            </b-link>
            <v-checkbox
                v-model="formData.remember"
                :value="true"
                :label="$t('CONTENT.REMEMBER_ME')"
                type="checkbox"
            ></v-checkbox>
            <b-btn size="lg" type="submit" variant="submit" class="w-100">
                {{ $t('CONTENT.SIGN_IN') }}
            </b-btn>
            <div class="mt-3 text-center">
                <span>{{ $t('CONTENT.DO_NOT_HAVE_ACCOUNT') }}</span>
                <b-link
                    class="submit-link font-weight-bold"
                    :to="{ name: 'SignUp', query: { target: target } }"
                >
                    {{ $t('CONTENT.SIGN_UP') }}
                </b-link>
            </div>
        </v-form>
    </div>
</template>
<script>
export default {
    name: 'signin-page',
    data() {
        return {
            EMAIL_REGEXP: this.$store.state.regexp.email,
            target: this.$route.query.target,
            formData: {
                email: null,
                password: null,
                remember: null
            }
        };
    },
    methods: {
        handleSubmitEvent() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('signIn', {
                    data: this.formData,
                    target: this.target
                });
            }
        }
    }
};
</script>

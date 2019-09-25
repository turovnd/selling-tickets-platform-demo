<template>
    <div class="auth-page">
        <h1 class="mb-5 text-center text-capitalize">
            {{ $t('CONTENT.SIGN_UP') }}
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
                :rules="[
                    v => !!v || $t('CONTENT.PASSWORD_REQUIRED'),
                    v =>
                        PASSWORD_REGEXP.test(v) ||
                        $t('CONTENT.PASSWORD_VALIDATION')
                ]"
                :label="$t('CONTENT.PASSWORD')"
                outline
                required
            ></v-text-field>
            <v-text-field
                v-model="formData.firstName"
                :rules="[v => !!v || $t('CONTENT.FIRST_NAME_REQUIRED')]"
                :label="$t('CONTENT.FIRST_NAME')"
                outline
                required
            ></v-text-field>
            <v-text-field
                v-model="formData.lastName"
                :rules="[v => !!v || $t('CONTENT.LAST_NAME_REQUIRED')]"
                :label="$t('CONTENT.LAST_NAME')"
                outline
                required
            ></v-text-field>
            <b-btn size="lg" type="submit" variant="submit" class="w-100">
                {{ $t('CONTENT.SIGN_UP') }}
            </b-btn>
            <div class="mt-3 text-center">
                <span>{{ $t('CONTENT.ALREADY_HAVE_ACCOUNT') }}</span>
                <b-link
                    class="submit-link font-weight-bold"
                    :to="{ name: 'SignIn', query: { target: target } }"
                >
                    {{ $t('CONTENT.SIGN_IN') }}
                </b-link>
            </div>
        </v-form>
    </div>
</template>
<script>
export default {
    name: 'signup-page',
    data() {
        return {
            EMAIL_REGEXP: this.$store.state.regexp.email,
            PASSWORD_REGEXP: this.$store.state.regexp.password,
            target: this.$route.query.target,
            formData: {
                email: null,
                password: null,
                firstName: null
            }
        };
    },
    methods: {
        handleSubmitEvent() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('signUp', {
                    data: this.formData,
                    target: this.target
                });
            }
        }
    }
};
</script>

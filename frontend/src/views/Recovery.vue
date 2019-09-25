<template>
    <div class="auth-page">
        <h1 class="mb-5 text-center text-capitalize">
            {{ $t('CONTENT.RECOVERY') }}
        </h1>
        <v-form ref="form" @submit.prevent="handleSubmitEvent">
            <v-text-field
                v-model="formData.password"
                autocomplete="off"
                type="password"
                :rules="[
                    v =>
                        PASSWORD_REGEXP.test(v) ||
                        $t('CONTENT.PASSWORD_VALIDATION')
                ]"
                :label="$t('CONTENT.PASSWORD')"
                outline
                required
            ></v-text-field>
            <v-text-field
                v-model="formData.password1"
                autocomplete="off"
                type="password"
                :rules="[
                    v =>
                        PASSWORD_REGEXP.test(v) ||
                        $t('CONTENT.PASSWORD_VALIDATION'),
                    v =>
                        v === formData.password ||
                        $t('CONTENT.PASSWORD_NOT_SAME')
                ]"
                :label="$t('CONTENT.PASSWORD_REPEAT')"
                outline
                required
            ></v-text-field>
            <b-btn size="lg" type="submit" variant="submit" class="w-100">
                {{ $t('CONTENT.RECOVERY') }}
            </b-btn>
        </v-form>
    </div>
</template>
<script>
export default {
    name: 'recovery-page',
    data() {
        return {
            PASSWORD_REGEXP: this.$store.state.regexp.password,
            target: this.$route.query.target,
            formData: {
                password: null,
                password1: null,
                hash: this.$route.query.hash
            }
        };
    },
    methods: {
        handleSubmitEvent() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('recovery', {
                    data: this.formData,
                    target: this.target
                });
            }
        }
    }
};
</script>

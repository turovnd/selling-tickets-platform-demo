<template>
    <b-nav-item-dropdown
        right
        no-caret
        ref="userDrop"
        @hidden="clearForm"
        class="user-dropdown"
    >
        <template slot="button-content">
            <fa-icon icon="user" />
        </template>
        <v-form
            v-if="!isAuthenticated"
            ref="form"
            @submit.prevent="handleLoginEvent"
        >
            <div class="dropdown-title">
                <div class="close-icon" @click="$refs.userDrop.hide()">
                    <fa-icon icon="times" />
                </div>
            </div>
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
            <v-checkbox
                v-model="formData.remember"
                :value="true"
                :label="$t('CONTENT.REMEMBER_ME')"
                type="checkbox"
            ></v-checkbox>
            <b-btn type="submit" variant="submit" class="w-100">
                {{ $t('CONTENT.SIGN_IN') }}
            </b-btn>
            <div class="mt-3 text-center">
                <span>{{ $t('CONTENT.DO_NOT_HAVE_ACCOUNT') }}</span>
                <b-link
                    class="submit-link font-weight-bold"
                    @click="
                        $router.push({ name: 'SignUp' });
                        $refs.userDrop.hide();
                    "
                >
                    {{ $t('CONTENT.SIGN_UP') }}
                </b-link>
            </div>
        </v-form>
        <div v-else>
            <div class="dropdown-title d-flex">
                <b-img
                    v-bind="{ width: 60, height: 60, style: 'min-width: 60px' }"
                    class="mr-4"
                    :src="'https://api.com/img/icons/favicon-48x48.png'"
                    rounded="circle"
                    alt="User logo"
                ></b-img>
                <div class="w-100 d-flex flex-column justify-center">
                    <div class="close-icon" @click="$refs.userDrop.hide()">
                        <fa-icon icon="times" />
                    </div>
                    <h6 class="flex-grow-0 mb-1">
                        {{ myProfile.firstName }} {{ myProfile.lastName }}
                    </h6>
                    <small class="flex-grow-0 text-muted">
                        {{ myProfile.email }}
                    </small>
                </div>
            </div>
            <div class="d-flex">
                <b-btn
                    variant="submit"
                    class="mr-3"
                    :to="{ name: 'ProfileSettings' }"
                >
                    {{ $t('CONTENT.MY_ACCOUNT') }}
                </b-btn>
                <b-btn variant="outline-submit" @click="handleLogOut">
                    {{ $t('CONTENT.SIGN_OUT') }}
                </b-btn>
            </div>
            <div class="mt-3 text-center" v-if="isAdmin">
                <b-link :to="{ name: 'Admin' }" class="text-brand">
                    {{ $t('CONTENT.ADMIN_PANEL') }}
                </b-link>
            </div>
        </div>
    </b-nav-item-dropdown>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'header-user-dropdown',
    data() {
        return {
            EMAIL_REGEXP: this.$store.state.regexp.email,
            formData: {
                email: null,
                password: null,
                remember: null
            }
        };
    },
    computed: {
        ...mapGetters(['isAuthenticated', 'isAdmin', 'myProfile'])
    },
    watch: {
        isAuthenticated() {
            this.clearForm();
        }
    },
    methods: {
        clearForm() {
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
                this.$refs.form.reset();
            }
        },
        handleLoginEvent() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('signIn', {
                    data: this.formData
                });
            }
        },
        handleLogOut() {
            this.$store.dispatch('signOut');
        }
    }
};
</script>

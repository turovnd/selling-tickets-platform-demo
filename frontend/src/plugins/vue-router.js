/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '../routes';
import store from '../store';

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

const sleep = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 200);
    });
};

router.beforeEach(async (to, from, next) => {
    while (store.getters.isRestoreAccess) {
        await sleep();
    }
    // If page requires admin and not admin -> redirect to AccessDeny page
    if (to.matched.some(m => m.meta.requiresAdmin) && !store.getters.isAdmin) {
        return next({ name: 'AccessDeny' });
    }
    // If page requires auth and not authenticated -> redirect to SignIn page
    else if (
        to.matched.some(m => m.meta.requiresAuth) &&
        !store.getters.isAuthenticated
    ) {
        return next({ name: 'SignIn', query: { target: from.path } });
    }
    // If user has signed in and go to auth page -> redirect to Home page
    else if (
        to.matched.some(m => m.meta.authPage) &&
        store.getters.isAuthenticated
    ) {
        return next({ name: 'Home' });
    }
    next();
});

Vue.router = router;

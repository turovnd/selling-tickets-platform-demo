/* ============
 * Vue i18n
 * ============
 *
 * Internationalization plugin of Vue.js.
 *
 * https://kazupon.github.io/vue-i18n/
 */

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/locale';

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'en',
    fallbackLocale: 'en',
    messages
});

export default {
    i18n
};

Vue.filter('translate', (value, arg) => {
    return i18n.t(value, i18n.locale, arg);
});

Vue.filter('uppercase', value => {
    return value.toUpperCase();
});

VueI18n.prototype.getChoiceIndex = (choice, choicesLength) => {
    if (i18n.locale !== 'ru') {
        if (choicesLength === 2) {
            return choice ? (choice > 1 ? 1 : 0) : 1;
        }
        return choice ? Math.min(choice, 2) : 0;
    }

    if (choice === 0) {
        return 0;
    }
    const teen = choice > 10 && choice < 20;
    const endsWithOne = choice % 10 === 1;

    if (!teen && endsWithOne) {
        return 1;
    }

    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2;
    }
    return choicesLength < 4 ? 2 : 3;
};

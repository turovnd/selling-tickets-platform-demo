import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Import modules
import auth from './modules/auth';
import parks from './modules/parks';
import orders from './modules/orders';
import profile from './modules/profile';
import form from './modules/form';

export const store = new Vuex.Store({
    modules: {
        // auth,
        parks,
        orders,
        // profile,
        // form
    },
    state: {
        locales: [
            { id: 'en', label: 'English', icon: 'lang/en.png' },
            { id: 'ru', label: 'Русский', icon: 'lang/ru.png' }
        ],
        calendar: {
            en: {
                daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                pluralMonths: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ]
            },
            ru: {
                daysOfWeek: ['Вск', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                pluralMonths: [
                    'Января',
                    'Февраля',
                    'Марта',
                    'Апреля',
                    'Мая',
                    'Июня',
                    'Июля',
                    'Августа',
                    'Сентября',
                    'Октября',
                    'Ноября',
                    'Декабря'
                ],
                months: [
                    'Январь',
                    'Февраль',
                    'Март',
                    'Апрель',
                    'Май',
                    'Июнь',
                    'Июль',
                    'Август',
                    'Сентябрь',
                    'Октябрь',
                    'Ноябрь',
                    'Декабрь'
                ]
            }
        },
        company: {
            tel: '+79096903007',
            email: 'support@.io',
            facebook: 'https://facebook.com/'
        },
        orderSteps: [
            'STEP_SELECT_TICKETS',
            'STEP_SECURE_CHECKOUT',
            'STEP_CONFIRMATION'
        ],
        maxGuests: 9,
        regexp: {
            password: /^[^ ]{6,30}$/,
            phone: /^[0-9+]{10,}$/,
            email: /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            name: /^[a-zA-Z]+$/
        }
    }
});

export default store;

/* ============
 * Vue Font Awesome
 * ============
 *
 * Font Awesome 5 Vue component
 *
 * https://github.com/FortAwesome/vue-fontawesome
 */

import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPhoneAlt,
    faEnvelope,
    faMapMarkerAlt,
    faChevronUp,
    faMinus,
    faPlus,
    faUser,
    faTimes,
    faEllipsisH,
    faTrashAlt,
    faCheck,
    faDownload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
    faPhoneAlt,
    faEnvelope,
    faMapMarkerAlt,
    faChevronUp,
    faMinus,
    faPlus,
    faUser,
    faTimes,
    faEllipsisH,
    faTrashAlt,
    faCheck,
    faDownload
);

Vue.component('fa-icon', FontAwesomeIcon);

import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
import $ from 'jquery';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add FA icons.
library.add(faMoon, faSun);

createApp(App)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');

if (
    localStorage.theme === 'dark' ||
    (
        !('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )
) {
    $("html").addClass('dark');

} else {

    $("html").removeClass('dark');
}

import Vue from 'vue';
import axios from 'axios';
axios.defaults.baseURL = `http://localhost:${process.env.PORT}`;
Vue.prototype.$http = axios;

import BootstrapVue from 'bootstrap-vue';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueMoment from 'vue-moment';

import App from './App.vue'
import { createRouter } from './router/router.js'

Vue.use(BootstrapVue);
Vue.use(VueMoment);

// export a factory function for creating fresh app, router and store
// instances
export function createApp() {
    // create router instance
    const router = createRouter();

    const app = new Vue({
        router,
        // the root instance simply renders the App component.
        render: h => h(App)
    });

    return { app, router };
}
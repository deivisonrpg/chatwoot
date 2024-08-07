import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from '../survey/App.vue';
import i18n from '../survey/i18n';
import store from '../survey/store';
import { emitter } from 'shared/helpers/mitt';

Vue.use(VueI18n);

const i18nConfig = new VueI18n({
  locale: 'en',
  messages: i18n,
});

// Event Bus
Vue.prototype.$emitter = emitter;

Vue.config.productionTip = false;

window.onload = () => {
  window.WOOT_SURVEY = new Vue({
    i18n: i18nConfig,
    store,
    render: h => h(App),
  }).$mount('#app');
};

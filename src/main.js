import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/es'
import VueI18n from 'vue-i18n';
import VueScroll from 'vue-scrollto';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index';
import messages from './i18n';
import './stylesheets/style.sass';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import JsonExcel from 'vue-json-excel';
import 'chart.js';
import 'hchs-vue-charts';
import ChartJSPluginDatalabels from "chartjs-plugin-labels";
import VueCookies from 'vue-cookies';
//sipsder components
import Button from "@/components/shared/Button.vue";
import Title from "@/components/shared/Title.vue";
// import CommentList from "@/components/views/comment/CommentList.vue"
import IdleVue from 'idle-vue';
import VueValidationEs from 'vee-validate/dist/locale/es';
import VueTagsInput from '@johmun/vue-tags-input';
import VueHtmlToPaper from 'vue-html-to-paper';
//import * as jsPDF  from "jspdf"
import VueHtml2Canvas from 'vue-html2canvas';

Vue.component('tags-input', VueTagsInput);
 
Vue.component('sipsder-btn', Button);
Vue.component('sipsder-title', Title);
// Vue.component('comment-list', CommentList)
Vue.use(require('vue-moment'));

Vue.use(window.VueCharts);
Vue.use(ChartJSPluginDatalabels);
Vue.component('downloadExcel', JsonExcel);
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(VueScroll);
Vue.use(BootstrapVue);
Vue.use(VueCookies);
Vue.use(ElementUI,{ locale });
Vue.use(VueHtmlToPaper);
Vue.use(VueHtml2Canvas);

const eventsHub = new Vue();
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 15*60*1000 // 15 mins
})
 
 const i18n = new VueI18n({
  locale: 'es', // set locale
  messages, // set locale messages
  silentTranslationWarn: true
})

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    es: VueValidationEs
  },
  fieldsBagName: 'veeFields'
});

Vue.filter( 'truncate10chars', function( value ) {
  if( !value ) return '';
  value = value.toString( );
  if( value.length > 10 ) return value.substring( 0, 9 ) + '...'
  else return value;
} );

Vue.filter( 'truncate30chars', function( value ) {
  if( !value ) return '';
  value = value.toString( );
  if( value.length > 30 ) return value.substring( 0, 29 ) + '...'
  else return value;
} );

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


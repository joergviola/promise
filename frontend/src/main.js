import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import _ from 'lodash'
import elementLocale from 'element-ui/lib/locale/lang/de'
import './util/filters' 
import init from './util/init' 
import localeDE from './lang/de'
import localeEN from './lang/en'
import moment from 'moment'

Vue.prototype._ = _

Vue.use(VueI18n)

Vue.use(ElementUI, {
  locale: elementLocale,
  size: 'small'
});

const i18n = new VueI18n({
  locale: 'de',
  messages: {
    'de': localeDE,
    'en': localeEN,
  }
})
moment.locale('de');

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')

init()
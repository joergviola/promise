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
import localeDE from './lang/de'

Vue.prototype._ = _

Vue.use(VueI18n)

Vue.use(ElementUI, {
  locale: elementLocale,
  size: 'small'
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

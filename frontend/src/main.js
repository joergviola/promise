import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import _ from 'lodash'
import elementLocale from 'element-ui/lib/locale/lang/en'
import './util/filters' 

Vue.prototype._ = _

Vue.use(ElementUI, {
  locale: elementLocale,
  size: 'small'
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

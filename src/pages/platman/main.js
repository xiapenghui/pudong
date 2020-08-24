import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import config from '@configs'
import utils from '@utils'
import '@assets/css/element-variables.scss'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.prototype.$$config = config
Vue.prototype.$$utils = utils

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})

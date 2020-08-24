import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueSlimScroll from 'vue-slimscroll'
import '@assets/css/element-variables.scss'
import config from '@configs'
import utils from '@utils'
import router from './router'
import sysUtils from './utils'
import sysConfig from './config'
import store from './store'
import App from './App.vue'

if (typeof layer !== 'undefined') {
  layer.config({ skin: 'layer-ext-moon', extend: 'moon/style.css' })
}

Vue.use(ElementUI)
Vue.use(VueSlimScroll)

Vue.prototype.$$config = config
Vue.prototype.$$utils = utils
Vue.prototype.$$sysUtils = sysUtils
Vue.prototype.$$sysConfig = sysConfig

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

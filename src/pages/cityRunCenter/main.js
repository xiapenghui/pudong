import 'babel-polyfill'
import Vue from 'vue'
import echarts from 'echarts'
import ElementUI from 'element-ui'
import '@assets/css/element-variables.scss'
import config from '@configs'
import utils from '@utils'
import router from './router'
import store from './store'
import App from './App.vue' 

// Vue.config.devtools = true;

Vue.prototype.$echarts = echarts
Vue.use(ElementUI)

Vue.prototype.$$config = config
Vue.prototype.$$utils = utils

/*mock*/
// if (process.env.NODE_ENV === 'development') {
//   require('../admin/mock') // simulation data
//   require('./mock') // simulation data
// }

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

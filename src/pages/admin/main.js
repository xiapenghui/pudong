import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueSlimScroll from 'vue-slimscroll'
import '@assets/css/element-variables.scss'
import config from '@configs'
import utils from '@utils'
import router from './router'
import App from './App.vue'
import sysStore from '@/sys/store'
import sysConfig from '@/sys/config'
import direwolfDialog from '@components/DirewolfDialog'

if (typeof layer !== 'undefined') {
  layer.config({
    skin: 'layer-ext-moon', extend: 'moon/style.css',
    success (layero) {
      // 获取当前皮肤
      let theme = localStorage.getItem(utils.theme.getUserThemeKey())
      const iframeObjs = layero.find('iframe')
      if (iframeObjs.length > 0) {
        utils.theme.changeTheme(
          iframeObjs[0].contentWindow.document, {
            defaultTheme: config.defaultTheme,
            newTheme: theme,
            oldTheme: config.defaultTheme,
          })
      }
    },
  })
}

Vue.use(ElementUI)
Vue.use(VueSlimScroll)

Vue.prototype.$$config = config
Vue.prototype.$$utils = utils
Vue.prototype.$$dwDialog = direwolfDialog
Vue.prototype.$$sysConfig = sysConfig

/*mock*/
if (process.env.NODE_ENV === 'development') {
 // require('./mock') // simulation data
}

new Vue({
  el: '#app',
  router,
  store: sysStore,
  render: h => h(App),
})

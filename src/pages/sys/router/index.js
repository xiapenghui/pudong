import Vue from 'vue'
import Router from 'vue-router'
import utils from '@utils'
import personal from './personal'

Vue.use(Router)

// 此处仅提供默认路由，更多路由在登录后动态添加
const routeList = [
  personal.index,
]
const router = new Router({ mode: 'history', routes: routeList })

// 全局路径跳转判断
router.beforeEach((to, from, next) => {
  utils.router.beforeEachRoute({ to, from, next }, { router, module: 'sys' })
})

export default router



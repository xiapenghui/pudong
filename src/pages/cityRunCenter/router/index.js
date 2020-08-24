import Vue from 'vue'
import Router from 'vue-router'
import utils from '@utils'
import config from '@configs'
import bigLogin from '../views/login/BigScreenLogin'

Vue.use(Router)

const {projectContext} = config

// 此处仅提供默认路由，更多路由在登录后动态添加
const routeList = [
    {
        path: `${projectContext}/cityRunCenter/bigLogin`,
        name: 'cityRunCenterLogin',
        component: bigLogin,
    },
    {
        path: `${projectContext}/cityRunCenter/index`,
        name: 'cityRunCenterIndex',
        component: r => require.ensure([], () => r(require('../views/bigScreen/BigScreenIndex.vue')), 'cityRunCenterIndex'),
    },
]
const router = new Router({mode: 'history', routes: routeList})

// 全局路径跳转判断
router.beforeEach((to, from, next) => {
    utils.router.beforeEachRoute({to, from, next},
          {router, module: 'cityRunCenter', loginUrl: `${projectContext}/cityRunCenter/bigLogin`})
        // {router, module: 'bigLogin', loginUrl: `${projectContext}/cityRunCenter/index`})
})

export default router



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
        path: `${projectContext}/bigScreen/bigLogin`,
        name: 'bigLogin',
        component: bigLogin,
    },
    {
        path: `${projectContext}/bigScreen/index`,
        name: 'index',
        component: r => require.ensure([], () => r(require('../views/bigScreen/BigScreenIndex.vue')), 'bigScreenIndex'),
    },
]
const router = new Router({mode: 'history', routes: routeList})

// 全局路径跳转判断
router.beforeEach((to, from, next) => {
    utils.router.beforeEachRoute({to, from, next},
          {router, module: 'bigScreen', loginUrl: `${projectContext}/bigScreen/bigLogin`})
        //{router, module: 'bigScreen', loginUrl: `${projectContext}/bigScreen/index`})
})

export default router



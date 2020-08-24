import Vue from 'vue'
import Router from 'vue-router'
import config from '@configs'
import utils from '@utils'

Vue.use(Router)

const { projectContext } = config
const platmanContext = `${projectContext}/platman`

const routeList = [
  {
    path: `${platmanContext}/msGatewayRouteConfigList`,
    name: 'msGatewayRouteConfigList',
    meta: {
      title: '网关路由配置信息管理',
    },
    component: r => require.ensure([], () => r(require('../views/MsGatewayRouteConfigList.vue')), 'msGatewayRouteConfig'),
  }, {
    path: `${platmanContext}/msGatewayRouteGrayScale`,
    name: 'msGatewayRouteGrayScale',
    meta: {
      title: '灰度发布设置',
    },
    component: r => require.ensure([], () => r(require('../views/MsGatewayRouteGrayScale.vue')), 'msGatewayRouteConfig'),
  }]

const router = new Router({ mode: 'history', routes: routeList })

router.beforeEach((to, from, next) => {
  utils.router.beforeEachRoute({ to, from, next }, { router, module: 'platman' })
})

export const platmanRouterList = routeList

export default router

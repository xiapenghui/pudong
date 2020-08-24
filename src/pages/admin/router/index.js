import Vue from 'vue'
import Router from 'vue-router'
import config from '@configs'
import utils from '@utils'
import personal from '@/sys/router/personal'

Vue.use(Router)

const { projectContext, adminContext } = config

// 此处仅提供默认路由，更多路由在登录后动态添加
const routeList = [
  {
    path: `${adminContext}/login`,
    name: 'login',
    meta: {
      title: '登录',
    },
    components: {
      login: r => require.ensure([], () => r(require('@/sys/views/login/Login.vue')), 'login'),
    },
  }, {
    path: `${adminContext}/`,
    component: r => require.ensure([], () => r(require('@/sys/views/layout/App.vue')), 'layout'),
    meta: {
      title: '首页',
    },
    children: [
      {
        path: `${adminContext}/`,
        name: 'dashboard',
        component: () => import(`@/sys/views/home/Index.vue`),
        meta: {
          id: 'dashboard',
          title: '首页',
        },
      },
      personal.showInAdmin,
      {
        path: `${adminContext}/404`,
        meta: {
          status: 404,
          title: '指定资源不存在',
        },
        component: (resolve) => require(['@components/ErrorPage.vue'], resolve),
      }, {
        path: `${adminContext}/401`,
        meta: {
          status: 401,
          title: '权限异常',
        },
        component: (resolve) => require(['@components/ErrorPage.vue'], resolve),
      }, {
        path: `${adminContext}/500`,
        meta: {
          status: 500,
          title: '服务器内部错误',
        },
        component: (resolve) => require(['@components/ErrorPage.vue'], resolve),
      },
    ],
  }, {
    path: `${projectContext}/admin/error`,
    component: (resolve) => require(['@components/ErrorPage.vue'], resolve),
  },
]
const router = new Router({ mode: 'history', routes: routeList })

// 全局路径跳转判断
router.beforeEach((to, from, next) => {
  utils.router.beforeEachRoute({ to, from, next }, { router, module: 'admin' })
})

router.afterEach(transition => {
  const { siteName } = config
  const { title } = transition.meta
  // 动态修改页面展示信息
  window.document.title = title ? `${title} - ${siteName}` : siteName
})

export default router



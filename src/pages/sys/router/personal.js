import config from '@configs'

// 全局配置，前端系统上下文，前端管理页面上下文
const { projectContext, adminContext } = config
// 前端平台管理上下文
const sysContext = `${projectContext}/sys`

export default {
  index: {
    path: `${sysContext}/personal`,
    name: 'Personal',
    meta: {
      title: '个人中心',
    },
    component: r => require.ensure([], () => r(require('../views/personal/Index.vue')), 'personal'),
  },
  showInAdmin: {
    path: `${adminContext}/sys/personal`,
    name: 'Personal',
    meta: {
      title: '个人中心',
    },
    component: r => require.ensure([], () => r(require('../views/personal/Index.vue')), 'personal'),
  },
}

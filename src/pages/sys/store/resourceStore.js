import adminRouter from '@/admin/router'
import utils from '@utils'
import config from '@configs'
import api from '../api'

const { menuKey, routeKey, menuMapKey } = config

const state = {
  /**
   * 菜单集合
   */
  menuMap: [],
  /**
   * 组装好的菜单树
   */
  menuTree: [],
}

const actions = {
  /**
   * 初始化用户菜单数据
   * @param commit
   * @returns {Promise<void>}
   */
  async initUserMenu ({ commit }) {
    const result = await api.resource.getMenuList()
    if (result && result.length > 0) {
      let menuMap = {}, menuTree = [], userRoutes = []
      result.forEach(menu => {
        // 使用主键做key值，方便后续获取
        const { id, resName, permission } = menu
        const { pageDirection, path, url } = utils.router.getRouteInfoByMenu(menu)
        menuMap[id] = { ...menu, path }
        // 生成动态路由信息
        userRoutes.push({ pageDirection, path, url, title: resName, permission, id })
      })
      // 生成动态路由
      utils.router.generateRouteByInfo(userRoutes)
      // 保存动态路由信息至缓存
      sessionStorage.setItem(routeKey, JSON.stringify(userRoutes))
      // 将菜单数组组装成菜单树
      assembleMenu(menuMap, menuTree)
      // 保存菜单树信息至缓存
      sessionStorage.setItem(menuKey, JSON.stringify(menuTree))
      commit('setMenuTree', menuTree)
      // 保存菜单树信息至缓存
      sessionStorage.setItem(menuMapKey, JSON.stringify(menuMap))
      commit('setMenuMap', menuMap)
    } else {
      utils.router.logout()
      utils.direwolfCommonTips('error', '获取用户菜单失败，请重新登录或联系管理员')
    }
  },
}

const mutations = {
  setMenuTree (state, newData) {
    state.menuTree = newData
  },
  setMenuMap (state, newData) {
    state.menuMap = newData
  },
}

/**
 * 组装菜单和路由
 * @param menuMap 以菜单主键为key值的数据集
 * @param menuTree
 */
function assembleMenu (menuMap, menuTree) {
  // 主键缓存，方便判断层级及父级是否已添加
  let menuIdTree = {}
  // 组装菜单列表
  Object.entries(menuMap).forEach(menu => {
    const menuData = menu[1]
    const { parentIds, id } = menuData
    // 判断父级层级
    const parentIdArr = parentIds.split(',')
    // 如果父级仅为根菜单则直接添加到缓存
    if (parentIdArr.length === 1 && parentIdArr[0] === '0') {
      if (!Object.keys(menuIdTree).includes(id)) {
        menuIdTree[id] = {}
        menuTree.push(menuData)
      }
    } else {
      // 移除根菜单
      parentIdArr.shift()
      // 缓存当前父级，之后循环一层层往下找
      let parentTree = menuIdTree, parentMenu = menuTree
      parentIdArr.forEach(id => {
        // 父菜单尚未添加，则从菜单数据集中获取添加到第一层
        const parent = menuMap[id]
        if (parent) {
          if (!Object.keys(parentTree).includes(id)) {
            parentTree[id] = {}
            parentMenu.push(parent)
          }
          // 进入下一层循环
          parentTree = parentTree[id]
          const currentMenu = parentMenu.find(menu => menu.id === id)
          if (!currentMenu.children) {
            currentMenu.children = []
          }
          parentMenu = currentMenu.children
        }
      })
      // 将自己添加到当前层列表中
      parentTree[id] = {}
      parentMenu.push(menuData)
    }
  })
  // 将菜单列表排序
  sortMenu(menuTree)
}

/**
 * 递归排序所有层级的菜单
 * @param menuTree
 */
function sortMenu (menuTree) {
  menuTree.sort((a, b) => a.menuOrder - b.menuOrder)
  menuTree.forEach(({ children }) => {
    if (children && children.length > 0) {
      sortMenu(children)
    }
  })
}

export default {
  state,
  actions,
  mutations,
}

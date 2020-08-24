import api from '../api'
import utils from '@utils'
import config from '@configs'
import sysUtils from '../utils'

const state = {
  /**
   * 当前用户信息
   */
  currentUserInfo: {},
}

const actions = {
  /**
   * 获取当前用户信息
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async getUserInfo ({ commit, dispatch }) {
    const result = await api.user.getUserInfo()
    if (result && result.code === 0) {
      dispatch('setUserInfo', result.data)
      // const { roleKey, permissionKey } = config
      // const { user, roles, permissions } = result.data
      // sysUtils.saveUserToSession(user)
      // sessionStorage.setItem(roleKey, roles.join(','))
      // sessionStorage.setItem(permissionKey, permissions.join(','))
      // commit('setCurrentUserInfo', { user, roles, permissions })
    } else {
      utils.direwolfCommonTips('error', '获取当前用户信息失败，请重试')
      setTimeout(() => {
        utils.router.logout()
      }, 1000)
    }
  },
  setUserInfo ({ commit }, payload) {
    const { roleKey, permissionKey } = config
    const { user, roles, permissions } = payload
    sysUtils.saveUserToSession(user)
    sessionStorage.setItem(roleKey, roles.join(','))
    sessionStorage.setItem(permissionKey, permissions.join(','))
    commit('setCurrentUserInfo', { user, roles, permissions })
  },
  /**
   * 保存用户信息
   * @param commit
   * @param state
   * @param payload
   * @returns {Promise<void>}
   */
  async saveUser ({ commit, state }, payload) {
    const result = await api.user.saveUser(payload)
    if (result.type === 'success') {
      const user = { ...state.currentUserInfo.user, ...payload }
      commit('setCurrentUserInfo', {
        ...state.currentUserInfo, user,
      })
      utils.direwolfCommonTips('success', '保存用户信息成功')
      sysUtils.saveUserToSession(user)
    } else {
      utils.direwolfCommonTips('error', '保存用户信息失败')
    }
  },
  /**
   * 修改密码
   * @param commit
   * @param state
   * @param payload
   * @returns {Promise<void>}
   */
  async changePassword ({ commit, state }, payload) {
    const result = await api.user.changePassword(payload)
    if (result.type === 'success') {
      utils.logout()
    } else {
      utils.direwolfCommonTips('error', '修改用户密码失败')
    }
  },
}

const mutations = {
  setCurrentUserInfo (state, newData) {
    state.currentUserInfo = newData
  },
}

export default {
  state,
  actions,
  mutations,
}

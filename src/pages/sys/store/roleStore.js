import api from '../api'

const state = {
  userRoles: [],
}

const getters = {}

const actions = {
  /**
   * 获取用户角色
   * @param commit
   */
  async getUserRoles ({ commit }) {
    const result = await api.role.getUserRoles()
    if (result.type === 'success') {
      commit('setUserRoles', result.data)
    }
  },
}

const mutations = {
  setUserRoles (state, newData) {
    state.userRoles = newData
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}

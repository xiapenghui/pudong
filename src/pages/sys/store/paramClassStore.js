import api from '../api'

const state = {}

const actions = {
  /**
   * 根据编码获取字典参数
   * @param commit
   * @param payload
   * @returns {Promise<void>}
   */
  async getDictByCodes ({ commit }, payload) {
    return await api.paramClass.getDictByCodes(payload)
  },
}

const mutations = {}

export default {
  state,
  actions,
  mutations,
}

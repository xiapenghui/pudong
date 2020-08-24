import utils from '@utils'

export default {
  getMenuList () {
    return utils.axiosRequest(utils.getBackServerUrl('menuUrl'), '获取当前用户菜单')
  },
}

import utils from '@utils'
import { backendContext } from '../config'

export default {
  getMenuList () {
    const url = `${backendContext}${utils.getBackServerUrl('menuUrl')}`
    return utils.axiosRequest(url, '获取当前用户菜单')
  },
}

import utils from '@utils'
import sysConfig, { backendContext } from '../config'

const userURL = {
  'getUserInfo': `${sysConfig.gatewayRoute}/user/info/`,
  'saveUser': `${backendContext}/sys/user/save`,
  'changePassword': `${backendContext}/sys/user/savePassword`,
}

export default {
  userURL,
  getUserInfo (payload) {
    return utils.axiosRequest(`${userURL.getUserInfo}${payload ? payload : ''}`, '获取当前用户信息')
  },
  saveUser (payload) {
    return utils.axiosRequest(userURL.saveUser, '保存当前用户信息', 'POST', payload)
  },
  changePassword (payload) {
    return utils.axiosRequest(userURL.changePassword, '修改用户密码', 'POST', payload)
  },
}

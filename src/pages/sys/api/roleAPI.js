import utils from '@utils'
import { backendContext } from '../config'

const roleURL = {
  'getUserRoles': `${backendContext}/sys/role/getUserRoles`,
}

export default {
  getUserRoles () {
    return utils.axiosRequest(roleURL.getUserRoles, '获取当前用户角色列表')
  },
}

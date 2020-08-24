import utils from '@utils'
import { backendContext } from '../config'

const sysParamURL = {
  'adminUser': `${backendContext}/sys/sysParam/getSysParam?code=ADMIN_USER`,
}

export default {
  getAdminUser () {
    return utils.axiosRequest(sysParamURL.adminUser, '获取系统超级管理员账号')
  },
}

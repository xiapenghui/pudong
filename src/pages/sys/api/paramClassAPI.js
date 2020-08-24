import utils from '@utils'
import { backendContext } from '../config'

const url = {
  'getDictByCodes': `${backendContext}/sys/sysParam/getParamsByCodeStr`,
}

export default {
  getDictByCodes (classCodes) {
    return utils.axiosRequest(url.getDictByCodes, '获取字典参数', 'GET', { classCodes })
  },
}

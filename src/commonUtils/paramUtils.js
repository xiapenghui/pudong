import axiosRequest from './axiosRequest'
import { backendContext } from '@/sys/config'

/**
 * 获取多个字典参数
 * @param classCodes 以逗号分隔的字典编码
 * @returns {Promise<AxiosResponse<any>|never>}
 */
async function getDictByCodes (classCodes) {
  return await axiosRequest(`${backendContext}/sys/sysParam/getParamsByCodeStr`, '获取字典参数', 'GET',
    { classCodes })
}

/**
 * 获取级联过滤后的参数值
 * @param value 过滤值
 * @param type 目标参数类型
 * @param callback 回调
 * @returns {Promise<void>}
 */
function getFilteredDict (value, type, callback) {
  if (value) {
    axiosRequest(`${backendContext}/common/paramValue/getCascadeValueList`, '获取级联参数', 'GET', {
      classCode: 'res_type', triggerType: 'relation', subClassCode: type, paramCode: value,
    }).then(response => {
      callback(response.data)
    })
  } else {
    axiosRequest(`${backendContext}/common/paramValue/${type}`, '获取级联参数').then(response => {
      callback(response.data)
    })
  }
}

export default {
  getDictByCodes,
  getFilteredDict,
}
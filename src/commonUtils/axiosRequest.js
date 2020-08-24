import axios from 'axios'
import config from '@configs'
import utils from '@utils'
import routerUtils from './routerUtils'

let showErrors = config.showErrorTips
axios.defaults.timeout = config.requestTimeout
axios.defaults.withCredentials = true
// 添加代理识别前缀，将AJAX请求转发至网关
axios.defaults.baseURL = '/api'
// 全局请求自动添加认证信息头
// axios.interceptors.request.use(req => {
//   let token = sessionStorage.getItem(config.tokenKey)
//   if (token) {
//     if (config.backServerType === 'soa') {
//       if (!req.params) {
//         req.params = {}
//       }
//       req.params['token'] = token
//       let params = utils.getQueryObject(req.url)
//       req.params['digest'] = utils.getStatelessCertificate({ ...params, ...req.data })
//       req.headers.stateless = 'yes'
//     } else {
//       req.headers.Authorization = utils.getAuthorization()
//     }
//   }
//   return req
// }, error => {
//   return Promise.reject(error)
// })

// axios.interceptors.response.use(response => {
//   return response
// }, error => {
//   return Promise.resolve(error.response || { status: 500, statusText: error.message })
// })

function checkStatus (response, info) {
  if (!response) {
    utils.direwolfCommonTips('error', `${info}失败，请求无响应`)
    throw new Error('请求无响应')
  }
  const { status, data } = response
  // 后端成功响应
  if (status >= 200 && status < 300) {
    // 返回数据内容为失败
    if (data.type === 'failure' && data.message && data.message.indexOf('Access denied') > -1) {
      utils.direwolfCommonConfirm({
        message: '无权限进行当前操作或登录已过期，是否重新登录？',
        title: '操作提示',
      }, () => {
        routerUtils.logout()
      })
      throw new Error(data.message)
    }
    return response
  }
  // 后端异常响应
  const error = new Error(response.statusText)
  error['response'] = response
  if (showErrors) {
    let message = `${info}失败`
    switch (status) {
      case 400:
        message += '，请求参数异常'
        break
      case 401:
        message += '，权限验证失败'
        utils.direwolfCommonConfirm({
          message: '无权限进行当前操作或登录已过期，是否重新登录？',
          title: '操作提示',
        }, () => {
          routerUtils.logout()
        })
        break
      case 404:
        message += '，请求地址不存在'
        break
      case 403:
        message += '，请求地址禁止访问'
        break
      case 500:
        message += '，服务器内部异常'
        break
      default:
        message += '，请求响应异常'
        break
    }
    if (status !== 401) {
      utils.direwolfCommonTips('error', message)
    }
  }
  throw error
}

function checkCode (res, info) {
  const keys = Object.keys(res.data)
  if (keys.indexOf('type') !== -1 && keys.indexOf('data') !== -1 && keys.indexOf('message') !== -1 &&
    (res.data.type !== 'success' && Number(res.data.type) !== 0)) {
    const tips = `${info}失败，返回信息：${res.data.message}`
    utils.direwolfCommonTips('error', tips)
    throw new Error(tips)
  }
  return res.data
}

/**
 * 请求服务器数据
 * @param {string} url 请求地址
 * @param {string} info 操作描述信息
 * @param {string?} method HTTP METHOD
 * @param {Object?} params 请求参数
 * @param {Object?} config 自定义配置
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export default function (url, info, method = 'GET', params = null, config) {
  if (!config) {
    config = {}
  }
  const { showLoading = false, loadingText = '', ...others } = config
  let loading
  if (showLoading) {
    loading = utils.fullscreenLoading(loadingText)
  }
  let payload = {}
  if (method === 'POST') {
    payload = { data: params }
  } else {
    payload = { params }
  }
  return axios({ method, url, ...payload, ...others }).then(
    (response) => {
      loading && loading.close()
      return checkStatus(response, info)
    },
  ).then(
    (res) => {
      return checkCode(res, info)
    },
  )
}
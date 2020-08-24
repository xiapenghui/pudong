import Vue from 'vue'
import axiosRequest from './axiosRequest'
import paramUtils from './paramUtils'
import routerUtils from './routerUtils'
import themeUtils from './themeUtils'
import validatorUtils from './validatorUtils'
import direwolfDialog from '@components/DirewolfDialog'
import config from '@configs'
import sysConfig, { backendContext } from '@/sys/config'
import fileUploadUtils from './fileUploadUtils'

Vue.prototype.$$dwDialog = direwolfDialog

function getInstance () {
  let instance = Vue.prototype

  if (top.direwolfVueApp) {
    instance = top.direwolfVueApp.__vue__
  }
  return instance
}

/**
 * 通用消息提示，方便控制权限
 * @param type 提示类型，可选值success/warning/info/error
 * @param message 页面提示
 * @param consoleMessage 控制台打印内容，供开发人员分析问题
 */
function direwolfCommonTips (type, message, consoleMessage) {
  // 统一添加配置，使得系统可以显示或者不显示错误提示
  if (!getInstance().$$config.showErrorTips && type === 'error') {
    return
  }
  getInstance().$message({ message: message, type: type, dangerouslyUseHTMLString: true })
  if (consoleMessage) {
    console.error(consoleMessage)
  }
}

/**
 * axios异常统一提示
 * @param error 错误对象
 * @param info 提示信息
 */
function axiosErrorTips (error, info) {
  let exceptionMessage = info
  const errorMessage = error && error.message ? ('，请参考：' + error.message) : '，无相关提示'
  direwolfCommonTips('error', exceptionMessage, exceptionMessage + errorMessage)
}

/**
 * 打开layer对话框，以IFrame展示用户指定页面
 * @param title 标题
 * @param url 页面地址
 * @param config 简单配置，包括窗口大小，自定义确定按钮点击方法（指定后将不再执行后续回调），数据提交回调，是否默认最大化
 */
function openLayerDialog (title, url, config) {
  const { full = false, width = '800px', height = '500px', ...others } = config
  layer[full ? 'full' : 'open']({
    type: 2,
    area: [width, height],
    title,
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    zIndex: vm.$$utils.getTopIndex(),
    btn1: function (index, layero) {
      if (typeof config.yes === 'function' && config.yes(index, layero)) {
        return
      }
      // 得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
      const iframeWin = layero.find('iframe')[0]
      iframeWin.contentWindow.doSubmit(function (data) {
        setTimeout(function () {
          if (!!config.callback) {
            config.callback(data)
          }
          layer.close(index)
          direwolfCommonTips('success', data.message)
        }, 100)
      })
    },
    btn2: function (index) {
      setTimeout(function () {
        layer.close(index)
      }, 100)
    },
    ...others,
  })
}

function showDialog (config, callback) {
  let dialog = getInstance().$$dwDialog
  let {
    vNode = null,
    title = '明细',
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    ...others
  } = config
  if (typeof callback == 'undefined') {
    callback = (type, instance) => { }
  }
  dialog.open({
    vNode, title,
    confirmButtonText, cancelButtonText, dangerouslyUseHTMLString: true, ...others,
    callback,
  })
}

/**
 * 通用确认方法
 * @param config
 * @param confirmCallback
 * @param cancelCallback
 */
function direwolfCommonConfirm (config, confirmCallback, cancelCallback) {
  let {
    message = '确定继续吗',
    title = '确定提示',
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    type = 'warning',
    isView,
    ...others
  } = config
  if (typeof cancelCallback == 'undefined') {
    cancelCallback = function (reason) { }
  }
  let confirm = getInstance().$confirm
  let customClass = ''
  if (isView) {
    customClass = 'width-80'
    type = ''
  }
  confirm(message, title, {
    confirmButtonText,
    cancelButtonText,
    type,
    customClass,
    dangerouslyUseHTMLString: true,
    ...others,
    zIndex: getTopIndex(),
  }).then(confirmCallback).catch(cancelCallback)
}

/**
 * 获取当前页面查询参数
 * @param name
 * @returns {*}
 */
function getQueryString (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 获取所有查询参数
 * @param url
 * @returns {*}
 */
function getQueryObject (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

/**
 * ElementUI表格列数据翻译
 * @param scope 列参数
 * @param dictData 翻译字典
 * @returns {string|*} 展示值
 */
function eleTableColumnFormatter (scope, dictData) {
  const fields = scope.column.property
  // 列名称可能是'a.b'格式，逐层获取最终值
  const fieldArr = fields.split('.')
  let value = scope.row
  fieldArr.forEach(function (field) {
    value = value[field]
  })
  if (!value) { return '-' }
  let valueArr = []
  if (value instanceof Array) {
    valueArr = value
  } else if (typeof value === 'number') {
    valueArr = [value]
  } else {
    valueArr = value.split(',')
  }
  let codeName = []
  valueArr.forEach(code => {
    let translated = false
    dictData.forEach(dict => {
      if (code && code === dict.paramCode) {
        codeName.push(dict.paramName)
        translated = true
        return false
      }
    })
    // 未翻译成功则展示为“-”
    if (!translated) {
      codeName.push('-')
    }
  })
  return codeName.join(',')
}

/**
 * ElementUI表格单击行选中方法
 * @param table 表格对象
 * @param row 行数据
 * @param column 点击位置所属列
 */
function eleTableClickSelection (table, row, column) {
  if (column.type !== 'selection') {
    table.clearSelection()
    table.toggleRowSelection(row, true)
  }
}

/**
 * 根据后端应用类型获取相应URL
 * @param key
 * @returns {*}
 */
function getBackServerUrl (key) {
  const urlSet = sysConfig[`${config.backServerType}Url`]
  if (urlSet) {
    return urlSet[key]
  }
  return `${config.adminContext}/error?status=404`
}

/**
 * 获取参数认证摘要
 * @param params
 * @returns {*}
 */
function getStatelessCertificate (params) {
  let token = sessionStorage.getItem(config.tokenKey)
  let key = sessionStorage.getItem(config.publicKey)
  if (!params || Object.keys(params).length === 0) {
    params = { token }
  } else {
    params['token'] = token
  }
  let digest = digestObject(token, params)
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(key)
  return encrypt.encrypt(digest)
}

/**
 * 获取对象摘要
 * @param token
 * @param params
 * @returns {*}
 */
function digestObject (token, params) {
  let sorted = {}
  Object.keys(params).sort().forEach(key => {
    sorted[key] = params[key]
  })
  let strArr = []
  Object.keys(sorted).forEach(key => {
    const value = sorted[key]
    if (value instanceof Array) {
      value.forEach(v => strArr.push(v))
    } else {
      strArr.push(value)
    }
  })
  return digestString(token, strArr.join(''))
}

/**
 * 获取字符串摘要
 * @param key
 * @param content
 * @returns {*}
 */
function digestString (key, content) {
  if (!key || !content) {
    return ''
  }
  const hash = CryptoJS.HmacSHA256(content, key)
  return CryptoJS.enc.Hex.stringify(hash)
}

/**
 * 获取顶层文档最高弹窗层级
 * @returns {number}
 */
function getTopIndex () {
  let max = 500
  for (let messageBox of top.document.getElementsByClassName('el-message-box__wrapper')) {
    const zIndex = Number(messageBox.style.zIndex)
    if (zIndex > max) {
      max = zIndex
    }
  }
  for (let layer of top.document.getElementsByClassName('layui-layer')) {
    const zIndex = Number(layer.style.zIndex)
    if (zIndex > max) {
      max = zIndex
    }
  }
  return max + 100
}

/**
 * 设置一个全屏的加载遮罩
 * @param text 提示文字
 */
function fullscreenLoading (text) {
  const loading = getInstance().$loading
  if (!text) {
    text = '正在提交...'
  }
  return loading({
    lock: true,
    text,
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)',
  })
}

/**
 * ElementUI Form提交通用方法
 * @param {obj} param 参数
 * @param {obj} param.vueIns vue实例
 * @param {string} param.info 操作描述
 * @param {string} param.formRef 表单引用名称
 * @param {string} param.saveUrl 保存地址
 * @param {function} param.callback layer弹窗回调
 * @param {obj} param.data 提交数据，默认取实体entity
 */
function eleFormSubmit ({ vueIns: vm, info, callback, data, formRef, saveUrl }) {
  if (!data) {
    data = vm.entity
  }
  vm.$refs[formRef].validate(valid => {
    if (valid) {
      axiosRequest(saveUrl, info, 'POST', data, {
        showLoading: true,
      }).then(result => {
        vm.$$utils.direwolfCommonTips('success', `${info}成功`)
        typeof callback === 'function' && callback(result)
      })
      return false
    }
    direwolfCommonTips('error', '内容填写有误，请修改后再提交')
  })
}

/**
 * 获取页面编辑模式名称
 * @param editType
 * @returns {string}
 */
function getEditTypeName (editType) {
  switch (editType) {
    case 'edit':
      return '编辑'
    case 'view':
      return '查看'
    case 'add':
      return '新增'
    default:
      return ''
  }
}

/**
 * 获取日期格式化字符串
 * @param {string} format 格式
 * @param {Date} value 日期
 * @returns {*}
 */
function getFormattedDate (format, value = new Date()) {
  const date = {
    'M+': value.getMonth() + 1,
    'd+': value.getDate(),
    'h+': value.getHours(),
    'm+': value.getMinutes(),
    's+': value.getSeconds(),
    'q+': Math.floor((value.getMonth() + 3) / 3),
    'S+': value.getMilliseconds(),
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k]
        : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}

function getAuthorization () {
  return `Bearer ${sessionStorage.getItem(config.tokenKey)}`
}

export default {
  axiosErrorTips,
  axiosRequest,
  direwolfCommonConfirm,
  direwolfCommonTips,
  eleFormSubmit,
  eleTableClickSelection,
  eleTableColumnFormatter,
  fullscreenLoading,
  getAuthorization,
  getBackServerUrl,
  getEditTypeName,
  getFormattedDate,
  getQueryObject,
  getQueryString,
  getStatelessCertificate,
  getTopIndex,
  showDialog,
  upload: fileUploadUtils,
  param: paramUtils,
  router: routerUtils,
  theme: themeUtils,
  validator: validatorUtils,
  // openLayerDialog,
}

var direwolfVueApp = null
if (top.direwolfVueApp) {
  direwolfVueApp = top.direwolfVueApp.__vue__
}
// 获取主页面认证信息
var auth = sessionStorage.getItem('Authorization')
var headerAuth = 'Bearer ' + auth
// 字典获取地址
var dictUrl = ''
if (typeof axios === 'function') {
// 设置请求通用信息，使用api作为请求标识，重定向至相应网关
  axios.defaults.baseURL = '/api'
// 添加认证请求头
  axios.interceptors.request.use(function (config) {
    config.headers.Authorization = headerAuth
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    return Promise.resolve(error.response)
  })

  function axiosRequest (url, info, method, params, config) {
    if (!method) {
      method = 'GET'
    }
    var data = {}
    if (method === 'POST') {
      data = JSON.parse(JSON.stringify(params))
      params = null
    }
    if (!config) {
      config = {}
    }
    var showErrors = commonConfig.showErrorTips || true
    var loading
    if (config.showLoading) {
      loading = fullscreenLoading(config.loadingText)
    }
    var cfg = Object.assign({}, { method: method, url: url, params: params, data: data }, config)
    return axios(cfg).then(function (response) {
      loading && loading.close()
      if (response && response.status >= 200 && response.status < 300) {
        return response
      }
      var error = new Error(response.statusText)
      error['response'] = response
      if (showErrors) {
        var message = info + '失败'
        switch (response.status) {
          case 400:
            message += '，请求参数异常'
            break
          case 401:
            message += '，无权限进行此操作，请重新登录或联系管理员'
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
        direwolfCommonTips('error', message)
      }
      throw error
    }).then(function (res) {
      var keys = Object.keys(res.data)
      if (keys.indexOf('type') !== -1 && keys.indexOf('data') !== -1 && keys.indexOf('message') !== -1 &&
        res.data.type !== 'success') {
        var tips = info + '失败，返回信息：' + res.data.message
        direwolfCommonTips('error', tips)
        throw new Error(tips)
      }
      return res.data
    })
  }
}

// 获取项目配置
var commonConfig = {}
var errorDirection = getProjectPath() + '/common-assets/pages/error'

var WEB_ROOT = ''
if ($) {
  $.ajax({
    url: '/common-assets/json/config.json',
    async: false,
    success: function (data) {
      WEB_ROOT = '/api' + data.sysServiceConfig.gatewayRoute + data.sysServiceConfig.adminPath
    },
  })
}

/**
 * 初始化页面配置
 * @param successCallback 成功回调
 * @param errorCallback 失败回调
 */
function initConfig (successCallback, errorCallback) {
  axiosRequest('../common-assets/json/config.json', '获取项目配置', 'GET').then(function (data) {
    commonConfig = data
    // initElementUITheme()
    // 无认证信息，则跳转至配置的项目登录页面，若未配置，则跳转到通用错误页面
    if (!auth) {
      // 登录页面携带当前地址，使得登录后自动跳转到该页面
      var loginUrl = commonConfig.projectContext + '/admin/login?route=' + window.location.pathname
      window.location.replace(loginUrl)
      return
    }
    if (typeof errorCallback !== 'function') {
      errorCallback = function (error) {
        axiosErrorTips(error, '加载页面配置异常')
      }
    }
    var sysService = data.sysServiceConfig
    commonConfig.sysBackendContext = sysService.gatewayRoute + sysService.adminPath
    dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes='
    if (typeof successCallback === 'function') {
      axiosRequest(getModuleConfigPath(), '获取模块配置', 'GET').then(successCallback).catch(errorCallback)
    }
  }).catch(function () {
    window.location.replace(errorDirection + '/error.html?status=999')
  })
}

/**
 * 页面权限校验
 * @param url
 */
function checkPagePermission (url) {
  var permissionInfo = '校验页面权限信息'
  axiosRequest(url, permissionInfo, 'GET').then(function (result) {
    // 无权限则跳转到通用页面
    if (result.type !== 'success' || !result.data) {
      goTo401()
    }
  }).catch(function (error) {
    window.location.replace('/common-assets/pages/error/error.html?status=500')
    axiosErrorTips(error, permissionInfo + '异常')
  })
}

/**
 * 跳转到401页面
 */
function goTo401 () {
  var page401 = '/common-assets/pages/error/error.html?status=401'
  window.location.replace(page401)
}

/**
 * @deprecated 已废弃，不要使用，通过Axios请求数据
 * @param type 请求类型
 * @param url 请求地址
 * @param params 请求参数
 * @param operationDesc 提示信息
 * @param successCallback 成功回调
 * @param errorCallback 异常回调
 */
function requestByAxios (type, url, params, operationDesc, successCallback, errorCallback) {
  if (!errorCallback || typeof errorCallback !== 'function') {
    errorCallback = function (error) {
      axiosErrorTips(error, operationDesc + '异常')
    }
  }
  axios[type](url, params).then(successCallback).catch(errorCallback)
}

var layer_config = {
  width: '800px',
  height: '500px',
  full: false,
}
if (typeof layer !== 'undefined') {
  layer.config({ skin: 'layer-ext-moon', extend: 'moon/style.css' })
}

/**
 * 打开layer对话框，以IFrame展示用户指定页面
 * @param title 标题
 * @param url 页面地址
 * @param config 简单配置，包括窗口大小，自定义确定按钮点击方法（指定后将不再执行后续回调），数据提交回调，是否默认最大化
 * @param cusConfig 自定义配置，可重写所有默认配置
 */
function openDialog (title, url, config, cusConfig) {
  config = $.extend({}, layer_config, config)
  var openConfig = {
    type: 2,
    area: [config.width, config.height],
    title: title,
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    zIndex: getTopIndex(),
    btn1: function (index, layero) {
      if (typeof config.yes === 'function' && config.yes(index, layero)) {
        return
      }
      var iframeWin = layero.find('iframe')[0] // 得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
      iframeWin.contentWindow.doSubmit(function (data) {
        setTimeout(function () {
          if (!!config.callback) config.callback(data)
          top.layer.close(index)
          if (top.toastr) {
            top.toastr.success(data.message)
          } else if (Vue) {
            direwolfCommonTips('success', data.message)
          }
        }, 100)
      })
    },
    btn2: function (index) {
      setTimeout(function () {
        top.layer.close(index)
      }, 100)
    },
  }
  cusConfig = $.extend({}, openConfig, cusConfig)
  var idx = top.layer.open(cusConfig)
  if (!!config.full) top.layer.full(idx)
}

// 打开对话框(查看)
function openDialogView (title, url, config) {
  config = $.extend({}, layer_config, config)
  top.layer.open({
    type: 2,
    area: [config.width, config.height],
    title: title,
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    zIndex: getTopIndex(),
    btn: ['关闭'],
    cancel: function (index) {
      setTimeout(function () {
        top.layer.close(index)
      }, 100)
    },
  })
}

/**
 * 获取顶层文档最高弹窗层级
 * @returns {number}
 */
function getTopIndex () {
  var max = 500
  var messageBoxes = top.document.getElementsByClassName('el-message-box__wrapper')
  for (var i = 0; i < messageBoxes.length; i++) {
    var msgIndex = Number(messageBoxes[i].style.zIndex)
    if (msgIndex > max) {
      max = msgIndex
    }
  }
  var layers = top.document.getElementsByClassName('layui-layer')
  for (var j = 0; j < layers.length; j++) {
    var layerIndex = Number(layers[j].style.zIndex)
    if (layerIndex > max) {
      max = layerIndex
    }
  }
  return max + 100
}

/**
 * 定义全局方法，翻译Bootstrap-table的枚举数据
 *
 * @param value
 *          枚举值
 * @param row
 *          当前行数据
 * @param index
 *          当前行索引
 * @param dictData
 */
function dictsFormatter (value, row, index, dictData) {
  if (!value) { return '-' }
  var valueArr = []
  if (value instanceof Array) {
    valueArr = value
  } else if (typeof value === 'number') {
    valueArr = [value]
  } else {
    valueArr = value.split(',')
  }
  var codeName = ''
  var data = dictData || this.dictData || []
  for (var i = 0; i < valueArr.length; i++) {
    var translated = false
    var code = valueArr[i]
    for (var j = 0; j < data.length; j++) {
      if (!$.isEmptyObject(code) && code === data[j].paramCode) {
        codeName += data[j].paramName
        translated = true
        break
      }
    }
    // 未翻译成功则展示为“-”
    if (!translated) {
      codeName += '-'
    }
    codeName += ','
  }
  // 移除末尾逗号
  codeName = codeName.substring(0, codeName.length - 1)
  return codeName
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase()
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1])
    : false
}

/**
 * @return {null}
 */
function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(decodeURI(r[2]))
  return null
}

// IE下
(function () {
  if (typeof window.CustomEvent === 'function') return false //If not IE

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.Event = CustomEvent
})()

/**
 * 更新ElementUI主题
 * @param doc 所在页面
 * @param theme
 */
function changeElementUITheme (doc, theme) {
  var themeTags = doc.getElementsByClassName('elementTheme')
  if (themeTags.length === 1) {
    var originLink = themeTags[0].href
    var newFileName = '/element-' + theme + '.css'
    themeTags[0].href = originLink.substring(0, originLink.lastIndexOf('/'))
      + newFileName
  } else if (themeTags.length > 1) {
    initElementUITheme()
  }
}

/**
 * 初始化ElementUI主题
 */
function initElementUITheme () {
  var STORAGE_PRE = commonConfig.moduleContext.substring(1) + '_'
  var storage = window.localStorage
  var theme = storage.getItem(STORAGE_PRE + 'theme') || 'default'
  var defaultCss = document.getElementById('elementThemeD')
  var redCss = document.getElementById('elementThemeR')
  var greenCss = document.getElementById('elementThemeG')
  if (theme !== 'default' && defaultCss !== null) {
    defaultCss.parentNode.removeChild(defaultCss)
  }
  if (theme !== 'red' && redCss !== null) {
    redCss.parentNode.removeChild(redCss)
  }
  if (theme !== 'green' && greenCss !== null) {
    greenCss.parentNode.removeChild(greenCss)
  }
}

/**
 * axios异常统一提示
 * @param error 错误对象
 * @param info 提示信息
 */
function axiosErrorTips (error, info) {
  var exceptionMessage = info
  var errorMessage = error && error.message ? ('，请参考：' + error.message) : '，无相关提示'
  direwolfCommonTips('error', exceptionMessage, exceptionMessage + errorMessage)
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
 * ElementUI表单数字字段校验
 * @param {Object} rule
 * @param {number} rule.max 最大长度
 * @param {number} rule.precision 小数最大位数
 * @param {string} rule.name 字段名称
 * @param {boolean} rule.acceptPositive 是否接受正号开头
 * @param {number|string} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkNumber (rule, value, callback) {
  // 将值转为字符串，以使用其索引查找方法
  value += ''
  var pattern = /^(-|\+)?([1-9]\d*(\.?\d+)?|0\.\d*|0)$/g
  // 不接受正号开头
  if (!rule.acceptPositive) {
    pattern = /^(-)?([1-9]\d*(\.?\d+)?|0\.\d*|0)$/g
  }
  var reg = new RegExp(pattern)
  if (value.length > rule.max) {
    callback(new Error(rule.name + '长度不能超过 ' + rule.max + ' 个字符'))
  } else if (!reg.test(value)) {
    callback(new Error(rule.name + '必须是数字'))
  } else if (value.indexOf('.') === value.lastIndexOf('.') && value.indexOf('.') !== -1) {
    if (!rule.precision || rule.precision <= 0) {
      callback(new Error(rule.name + '必须是整数'))
    } else if (value.split('.')[1].length > rule.precision) {
      callback(new Error(rule.name + '小数不能超过 ' + rule.precision + ' 位'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * ElementUI表单数组字段校验
 * @param {Object} rule
 * @param {number} rule.max 最大长度
 * @param {string} rule.name 字段名称
 * @param {array} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkArrayStrLen (rule, value, callback) {
  if (value.join(',').length > rule.max) {
    callback(new Error(rule.name + '长度不能超过 ' + rule.max + ' 个字符'))
  } else {
    callback()
  }
}

/**
 * 通用消息提示，方便控制权限
 * @param type 提示类型，可选值success/warning/info/error
 * @param message 页面提示
 * @param consoleMessage 控制台打印内容，供开发人员分析问题
 */
function direwolfCommonTips (type, message, consoleMessage) {
  if (!commonConfig.showErrorTips && type === 'error') {
    return
  }
  if (direwolfVueApp && direwolfVueApp.$$utils) {
    direwolfVueApp.utils.direwolfCommonTips(type, message, consoleMessage)
  } else {
    Vue.prototype.$message({ message: message, type: type })
  }
  if (consoleMessage) {
    console.error(consoleMessage)
  }
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
function eleFormSubmit (param) {
  var vm = param.vueIns
  var info = param.info
  var callback = param.callback
  if (!param.data) {
    param.data = vm.entity
  }
  vm.$refs[param.formRef].validate(function (valid) {
    if (valid) {
      axiosRequest(param.saveUrl, info, 'POST', param.data, {
        showLoading: true,
      }).then(function (result) {
        typeof callback === 'function' && callback(result)
      })
      return false
    }
    direwolfCommonTips('error', '内容填写有误，请修改后再提交')
  })
}

/**
 * 设置一个全屏的加载遮罩
 * @param text 提示文字
 */
function fullscreenLoading (text) {
  var loading = Vue.prototype.$loading
  if (direwolfVueApp) {
    loading = direwolfVueApp.$loading
  }
  if (!text) {
    text = '正在提交...'
  }
  return loading({
    lock: true,
    text: text,
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)',
  })
}

/**
 * 通用确认方法，默认统一调用顶层主页面确认方法
 * @param config
 * @param confirmCallback
 * @param cancelCallback
 */
function direwolfCommonConfirm (config, confirmCallback, cancelCallback) {
  var confirm = Vue.prototype.$confirm
  if (direwolfVueApp) {
    confirm = direwolfVueApp.$confirm
  }
  var message = config.message || '确定继续吗？'
  var title = config.title || '确定提示'
  delete config.message
  delete config.title
  var confirmConfig = Object.assign({}, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }, config)
  if (typeof cancelCallback == 'undefined') {
    cancelCallback = function (reason) { }
  }
  confirm(message, title,
    {
      confirmButtonText: confirmConfig.confirmButtonText,
      cancelButtonText: confirmConfig.cancelButtonText,
      type: confirmConfig.type,
      zIndex: getTopIndex(),
    }).then(confirmCallback).catch(cancelCallback)
}

/**
 * 处理axios的返回信息，并默认提示错误信息，成功信息由调用方根据情况自行处理
 * @param response 返回信息
 * @param simpleDesc 当前操作描述
 * @param showSuccessTips 是否显示成功提示
 * @returns {*}
 */
function getDataFromAxiosResponse (response, simpleDesc, showSuccessTips) {
  var errorMessage = simpleDesc + '失败'
  if (response.status === 200 && (response.data === '' || response.data)) {
    if (response.data.type === 'success') { // 返回数据是OperationResult
      showSuccessTips && direwolfCommonTips('success', simpleDesc + '成功')
    } else if (response.data.type === 'failure') { // 返回数据是OperationResult
      errorMessage += '，返回类型为失败，错误信息：' + response.data.message || '未提供'
      direwolfCommonTips('error', response.data.message || simpleDesc + '失败', errorMessage)
    } else if (response.data.limit) {
      // 返回数据是Page
      showSuccessTips && direwolfCommonTips('success', simpleDesc + '成功')
    }
    return response.data
  } else {
    errorMessage += '，请求服务器失败，返回状态：' + response.status + '，返回信息：' + response.error
    direwolfCommonTips('error', simpleDesc + '失败', errorMessage)
    return { 'type': 'error' }
  }
}

/**
 * 处理URL参数，将数组和对象转换为Spring接受的字符串格式
 * @param obj
 * @returns {string}
 */
function jsonToSpringBinder (obj) {
  var query_string = ''
  Object.keys(obj).forEach(function (key) {
    var value = obj[key]
    if (typeof value !== 'object') {
      if (value) {
        query_string += key + '=' + value + '&'
      }
    } else if (value === null || typeof value === 'undefined') {
      // 空值什么也不做
    } else if (Array.isArray(value)) {
      // 数组直接并列写出即可
      value.forEach(function (item, index) {
        query_string += key + '=' + item + '&'
      })
    } else {
      if (value instanceof Date) {
        query_string += key + '=' + value.toJSON() + '&'
      }
      // 如果是对象，则要转换成'a.b.c'的样式
      if (typeof dotize !== 'undefined') {
        var temp = {}
        temp[key] = value
        // 引入dotize首先将对象转成点号取值的样式
        var dotObj = dotize.convert(temp)
        // 添加对象的所有属性
        Object.keys(dotObj).forEach(function (dotKey) {
          if (dotObj[dotKey]) {
            query_string += dotKey + '=' + dotObj[dotKey] + '&'
          }
        })
      }
    }
  })
  return query_string
}

/**
 * ElementUI表格列数据翻译
 * @param scope 列参数
 * @param dictData 翻译字典
 * @returns {string|*} 展示值
 */
function eleTableColumnFormatter (scope, dictData) {
  var fields = scope.column.property
  // 列名称可能是'a.b'格式，逐层获取最终值
  var fieldArr = fields.split('.')
  var value = scope.row
  fieldArr.forEach(function (field) {
    value = value[field]
  })
  return dictsFormatter(value, scope.row, scope.$index, dictData)
}

function getFilteredData (value, type, callback) {
  if (value) {
    axios.get(
      commonConfig.moduleContext +
      '/common/paramValue/getCascadeValueList?classCode=res_type&triggerType=relation&subClassCode=' +
      type + '&paramCode=' + value).then(function (response) {
      callback(response.data)
    })
  } else {
    axios.get(commonConfig.moduleContext + '/common/paramValue/' + type).then(function (response) {
      callback(response.data)
    })
  }
}

function tryParseJSON (jsonString) {
  try {
    var o = JSON.parse(jsonString)
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === 'object') {
      return o
    }
  } catch (e) {
  }
  return false
}

/**
 * 获取页面当前位置
 * @returns {string}
 */
function getRelativePath () {
  var paths = location.pathname.split('/')
  paths.pop()
  return paths.join('/').concat('/')
}

/**
 * 获取模块配置文件位置
 * @returns {string}
 */
function getModuleConfigPath () {
  var paths = location.pathname.split('/')
  var index = paths.indexOf('pages')
  var relativePaths = paths.slice(1, index)
  relativePaths.push('static')
  relativePaths.push('config.json')
  relativePaths.unshift('..')
  return relativePaths.join('/')
}

/**
 * 获取模块访问前缀
 * @returns {string}
 */
function getProjectPath () {
  var paths = location.pathname.split('/')
  var index = paths.indexOf('pages')
  var relativePaths = paths.slice(0, index - 1)
  return relativePaths.join('/')
}

/**
 * 获取日期格式化字符串
 * @param {string} format 格式
 * @param {Date=} value 日期
 * @returns {*}
 */
function getFormattedDate (format, value) {
  if (!value) {
    value = new Date()
  }
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

// 新打开页签，设置一个storage值触发事件
if (!sessionStorage.length) {
  localStorage.removeItem('clearSessionStorage')
  localStorage.setItem('getSessionStorage', Date.now().toString())
}
// 注册storage变更监听事件
window.addEventListener('storage', function (event) {
  if (event.key === 'getSessionStorage') {
    // 有新打开的页签调取storage，将值放在全局，然后移除掉
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage))
    localStorage.removeItem('sessionStorage')
  } else if (event.key === 'clearSessionStorage') {
    // 有其他页签登出，本页签跟随登出
    sessionStorage.clear()
    window.location.replace(event.newValue)
  } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
    // 新页签收到放全局的变更事件，存放在本页签
    var data = JSON.parse(event.newValue)
    for (let key in data) {
      sessionStorage.setItem(key, data[key])
    }
  }
})

// 主页面信息
var direwolfVueApp = null
if (top.direwolfVueApp) {
  direwolfVueApp = top.direwolfVueApp.__vue__
}
// 获取主页面认证信息
var auth = sessionStorage.getItem('Authorization')
var defaultAppId = null
var corpId = null
var admin = null
var LOGIN_USER = null
var LOGIN_ID = null


var commonConfig = {}
var errorDirection = getProjectPath() + '/common-assets/pages'
var unauthorizationPage = errorDirection + '/401.html'
var serverErrorPage = errorDirection + '/500.html'
if (typeof axios === 'function') {
// 设置请求通用信息，使用api作为请求标识，重定向至相应网关
  axios.defaults.baseURL = '/api'
// 添加认证请求头
  axios.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer ' + auth
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}

var WEB_ROOT = ''
$.ajax({
  url: '/common-assets/json/config.json',
  async: false,
  success: function (data) {
    commonConfig = data
    commonConfig['adminContext'] = commonConfig.projectContext + '/admin'
    commonConfig['sysBackendContext'] = commonConfig.sysServiceConfig.gatewayRoute + commonConfig.sysServiceConfig.adminPath
    if (direwolfVueApp) {
      unauthorizationPage = commonConfig.adminContext + '/error?status=401'
      serverErrorPage = commonConfig.adminContext + '/error?status=500'
    }
    // 无认证信息，则跳转至配置的项目登录页面，若未配置，则跳转到通用错误页面
    if (!auth) {
      var loginUrl = commonConfig.adminContext + '/login?route=' + window.location.pathname
      window.location.replace(loginUrl)
      return
    }
    var userDetails = JSON.parse(sessionStorage.getItem('userInfo'))
    defaultAppId = '1'
    corpId = userDetails.orgId
    admin = 'admin'
    LOGIN_USER = userDetails.userAccount
    LOGIN_ID = userDetails.id
    WEB_ROOT = '/api' + commonConfig['sysBackendContext']
  }
})
// 字典获取地址
var dictUrl = commonConfig['sysBackendContext'] + '/sys/sysParam/getParamsByCodeStr?classCodes='

var dwCtx = {
  ROOT: WEB_ROOT,
  CTX: commonConfig.projectContext,
  ADMIN: commonConfig.sysServiceConfig.adminPath,
}
var ctxStatic = dwCtx.CTX + '/static'
var ctx = dwCtx.CTX

function initConfig (successCallback) {
    successCallback()
}

/**
 * 页面权限校验
 * @param url
 */
function checkPagePermission (url) {
  var permissionInfo = '校验页面权限信息'
  axios.get(url).then(function (response) {
    // 无权限则跳转到通用页面
    if (response.data.type !== 'success' || !response.data.data) {
      window.location.replace(unauthorizationPage)
    }
  }).catch(function (error) {
    window.location.replace('/common-assets/pages/error/error.html?status=500')
    axiosErrorTips(error, permissionInfo + '异常')
  })
}

$.ajaxSetup({
  beforeSend: function (xhr, config) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + auth)
  },
})

$(function () {
  if (typeof layer !== 'undefined') {
    layer.config({
      skin: 'layer-ext-moon',
      extend: 'moon/style.css',
    })
  }
  var checkBoxes = $('.i-checks')
  if (checkBoxes.length > 0) {
    checkBoxes.iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    })
  }
})

/**
 * bootstrap-table sort传数据库字段问题
 */
!function ($) {
  'use strict'
  if (!$.fn.bootstrapTable) return
  var BootstrapTable = $.fn.bootstrapTable.Constructor
  BootstrapTable.prototype.onSort = function (event) {
    var $this = event.type === 'keypress' ? $(event.currentTarget) : $(
      event.currentTarget).parent(), $this_ = this.$header.find('th').eq(
      $this.index()), sortName = this.header.sortNames[$this.index()]

    this.$header.add(this.$header_).find('span.order').remove()

    if (this.options.sortName === $this.data('field')) {
      this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc'
        : 'asc'
    } else {
      this.options.sortName = sortName || $this.data('field')
      this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc'
    }
    this.trigger('sort', this.options.sortName, this.options.sortOrder)

    $this.add($this_).data('order', this.options.sortOrder)

    // Assign the correct sortable arrow
    this.getCaret()

    if (this.options.sidePagination === 'server') {
      this.initServer(this.options.silentSort)
      return
    }

    this.initSort()
    this.initBody()
  }
  BootstrapTable.prototype.getCaret = function () {
    var that = this

    $.each(this.$header.find('th'), function (i, th) {
      var sortName = that.header.sortNames[i]
      $(th).find('.sortable').removeClass('desc asc').addClass(
        (sortName || $(th).data('field')) === that.options.sortName
          ? that.options.sortOrder : 'both')
    })
  }
}(jQuery)

$.prototype.serialize = function (base) {
  return function () {
    return $.param(this.serializeArray().filter(function (entry) {return !$.isEmptyObject(entry.value)}))
  }
}($.prototype.serialize)

/** *Ajax 文件下载*** */
jQuery.download = function (url, data, method) {
  // 获得url和data
  if (url && data) {
    // data 是 string 或者 array/object
    data = typeof data == 'string' ? data : jQuery.param(data)
    // 把参数组装成 form的 input
    var inputs = ''
    jQuery.each(data.split('&'), function () {
      var pair = this.split('=')
      inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1]
        + '" />'
    })
    // request发送请求
    jQuery(
      '<form action="' + url + '" method="' + (method || 'post') + '">'
      + inputs + '</form>').appendTo('body').submit().remove()
  }

}

/**
 * { width:600,height:800, full:false, yes:function(idx,layero),
 * callback:function(); }
 */

/**
 * 获取URL中的参数 add by chenchao
 */
function getUrlParam (paramName) {
  var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg) // 匹配目标参数
  if (r != null) return unescape(decodeURI(r[2])) // 返回参数值
  return null
}

/**
 * 时间格式化 add by chenchao
 */
Date.prototype.format = function (format) {
  var date = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds(),
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k]
        : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}

/**
 * 通过js对html转义与反转义 add by chenchao
 */
window.js = window.js || {}
js.lang = js.lang || {}

js.lang.String = function () {
  this.REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g
  this.REGX_HTML_DECODE = /&\w{1,};|&#\d{1,};/g
  this.REGX_ENTITY_NUM = /\d{1,}/
  this.REGX_TRIM = /(^\s*)|(\s*$)/g
  this.HTML_DECODE = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&nbsp;': ' ',
    '&quot;': '"',
    '&copy;': '©',
    // Add more
  }

  this.encodeHtml = function (s) {
    s = (s != undefined) ? s : this
    return (typeof s != 'string') ? s : s.replace(this.REGX_HTML_ENCODE,
      function ($0) {
        var c = $0.charCodeAt(0), r = ['&#']
        c = (c == 0x20) ? 0xA0 : c
        r.push(c)
        r.push(';')
        return r.join('')
      })
  }

  this.decodeHtml = function (s) {
    var HTML_DECODE = this.HTML_DECODE, REGX_NUM = this.REGX_ENTITY_NUM

    s = (s != undefined) ? s : this
    return (typeof s != 'string') ? s : s.replace(this.REGX_HTML_DECODE,
      function ($0) {
        var c = HTML_DECODE[$0]
        if (c == undefined) {
          // Maybe is Entity Number
          var m = $0.match(REGX_NUM)
          if (m) {
            var cc = m[0]
            cc = (cc == 160) ? 32 : cc
            c = String.fromCharCode(cc)
          } else {
            c = $0
          }
        }
        return c
      })
  }

  this.trim = function (s) {
    s = (s != undefined) ? s : this
    return (typeof s != 'string') ? s : s.replace(this.REGX_TRIM, '')
  }

  this.hashCode = function () {
    var hash = this.__hash__, _char
    if (hash == undefined || hash == 0) {
      hash = 0
      for (var i = 0, len = this.length; i < len; i++) {
        _char = this.charCodeAt(i)
        hash = 31 * hash + _char
        hash = hash & hash // Convert to 32bit integer
      }
      hash = hash & 0x7fffffff
    }
    this.__hash__ = hash

    return this.__hash__
  }

}
js.lang.String.call(js.lang.String)

/**
 * 下面这些数组的方法 add by chenchao
 */
Array.prototype.contains = function (needle) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == needle) {
      return true
    }
  }
  return false
}
Array.prototype.remove = function (needle) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == needle) {
      this.splice(i--, 1)
    }
  }
}

Array.prototype.toString = function () {
  var result = ''
  for (var i = 0; i < this.length; i++) {
    result += this[i] + ','
  }
  result = result.substring(0, result.length - 1)
  return result
}

/**
 * 往数组中添加元素，如果已经有该元素，则什么都不做
 */
Array.prototype.put = function (needle) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == needle) {
      return
    }
  }
  this.push(needle)
}

Array.prototype.addAll = function (toAddArray) {
  for (var i = 0; i < toAddArray.length; i++) {
    this.push(toAddArray[i])
  }
}

Array.prototype.addAllNoRepeat = function (toAddArray) {
  for (var i = 0; i < toAddArray.length; i++) {
    this.put(toAddArray[i])
  }
}

Array.prototype.swap = function (index1, index2) {
  var temp = this[index1]
  this[index1] = this[index2]
  this[index2] = temp
}

/**
 * add by chenchao
 */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0
    return this.indexOf(searchString, position) === position
  }
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString) {
    return this.indexOf(searchString, this.length - searchString.length) !== -1
  }
}

function bindEnter (inputId, buttonId) {
  $('#' + inputId).keypress(function (e) {
    var e = event || window.event
    var o = e.target || e.srcElement
    var keyCode = e.keyCode || e.which // 按键的keyCode
    if (keyCode === 13) {
      e.keyCode = 9
      e.returnValue = false
      $('#' + buttonId).click()
    }
  })
}

var layer_config = {
  width: '800px',
  height: '500px',
  full: false,
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
    zIndex: getTopIndex(),
    btn: ['确定', '关闭'],
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
    btn: ['关闭'],
    zIndex: getTopIndex(),
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

function formAjaxSubmit (form, callback, entity) {
  var idx = top.layer.load(1, {
    shade: [0.4, '#FFF'],
  })
  form.ajaxSubmit({
    beforeSubmit: function (f, d, j) {
      // var token = { 'name': 'csrf', value: csrf, 'type': 'hidden', 'required': false }
      // f.push(token)
      if (!entity) {
        entity = {}
        var entityList = {}
        f.forEach(function (field) {
          var arrIndex = field.name.indexOf('[')
          if (arrIndex !== -1) {
            var arrIndex2 = field.name.indexOf(']')
            var objectField = field.name.substr(arrIndex2 + 2, field.name.length)
            var fieldName = field.name.substr(0, arrIndex)
            var index = field.name.substr(arrIndex + 1, arrIndex2 - arrIndex - 1)
            if (!entityList[fieldName]) {
              entityList[fieldName] = []
            }
            if (entityList[fieldName].length <= index) {
              entityList[fieldName].push({})
            }
            if (objectField.indexOf('.') !== -1) {
              var arr1 = objectField.split('.')
              entityList[fieldName][index][arr1[0]] = {}
              entityList[fieldName][index][arr1[0]][arr1[1]] = field.value
            } else {
              entityList[fieldName][index][objectField] = field.value
            }

            // var fieldName = field.name.substr(0, arrIndex2 + 1)
            // if (!entity[fieldName]) {
            //   entity[fieldName] = {}
            // }
            // entity[fieldName][objectField] = field.value
          } else {
            if (field.name.indexOf('.') !== -1) {
              var arr = field.name.split('.')
              if (entity[arr[0]] == null) {
                entity[arr[0]] = {}
              }
              entity[arr[0]][arr[1]] = field.value
            } else {
              entity[field.name] = field.value
            }
          }
        })
        Object.keys(entityList).forEach(function (value) {
          entity[value + 'Str'] = JSON.stringify(entityList[value])
          entity[value] = entityList[value]
        })
      }
      axios.post(j.url, entity).then(function (response) {
        var result = getDataFromAxiosResponse(response, '保存')
        if (result.type === 'success') {
          typeof callback === 'function' && callback(result)
        }
        top.layer.close(idx)
      }).catch(function (error) {
        top.layer.close(idx)
        toastr.error('服务器内部错误,请稍后重试!')
      })

      return false
    },
    // contentType: 'application/json',
    // data: entity,
    type: 'get',
    success: function (data) {
      top.layer.close(idx)
      if (data.type === 'success') {
        callback(data)
      } else {
        toastr.error(data.message)
      }
    },
    async: false,
    error: function () {
      top.layer.close(idx)
      toastr.error('服务器内部错误,请稍后重试!')
    },
  })
}

/**
 * 定义全局方法，本地化时间选择面板
 *
 * @param formatPattern
 *          日期格式
 */
var daterangepickerLocale = function (formatPattern) {
  return {
    applyLabel: '确定',
    cancelLabel: '取消',
    format: formatPattern || 'YYYY-MM-DD HH:mm:ss',
    separator: ' 至 ',
    fromLabel: '从',
    toLabel: '至',
    customRangeLabel: '自定义',
    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
    monthNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    firstDay: 1,
  }
}

/**
 * 定义常用的时间区间
 */
var ranges = function () {
  moment.localeData()._week.dow = 1// 设置周一为一周的开始
  var today = moment()
  var yesterday = moment().subtract(1, 'days')
  var firstDayofWeek = moment().startOf('week')
  var firstDayofLastWeek = moment().subtract(1, 'week')
  var lastDayofLastWeek = moment().subtract(1, 'week').endOf('week')
  var firstDayofMonth = moment().startOf('month')
  var firstDayofLastMonth = moment().subtract(1, 'month').startOf('month')
  var lastDayofLastMonth = moment().subtract(1, 'month').endOf('month')
  return {
    '今天': [today, today],
    '昨天': [yesterday, yesterday],
    '本周': [firstDayofWeek, moment()],
    '上周': [firstDayofLastWeek, lastDayofLastWeek],
    '本月': [firstDayofMonth, moment()],
    '上月': [firstDayofLastMonth, lastDayofLastMonth],
  }
}

$(function () {
  $.ajaxSetup({
    cache: false,
  })
  // 日期范围选择组件绑定
  var dateRangeSelComps = $('.daterangeselect')
  $.each(dateRangeSelComps, function (index, comp) {
    var $comp = $(comp)
    // 根据自定义类设置格式
    var formatPattern = 'YYYY-MM-DD'
    if ($(comp).hasClass('acctosec')) {
      formatPattern = 'YYYY-MM-DD HH:mm:ss'
    } else if ($(comp).hasClass('acctomin')) {
      formatPattern = 'YYYY-MM-DD HH:mm'
    } else if ($(comp).hasClass('acctoday')) {
      formatPattern = 'YYYY-MM-DD'
    }
    $comp.daterangepicker({
      timePicker: formatPattern.length > 10,// 短格式时不启用时间选择
      timePicker24Hour: true,
      showDropdowns: true,// 显示年月选择框
      autoUpdateInput: false,
      buttonClasses: ['btn'],
      applyClass: 'btn-success',// 绿色按钮
      cancelClass: 'btn-primary',// 蓝色按钮
      locale: daterangepickerLocale(formatPattern),// 设置本地化
      ranges: ranges(),
      opens: 'center',
      // 添加默认可选区间
    })
    // 范围选择组件带有两个隐藏的存值组件
    var $beginComp = $comp.next()
    var $endComp = $beginComp.next()
    // 重写确定方法，使得页面打开默认可以为空
    $comp.on('apply.daterangepicker', function (ev, picker) {
      // 格式化
      var formatPattern = picker.locale.format
      var startDateStr = picker.startDate.format(formatPattern)
      var endDateStr = picker.endDate.format(formatPattern)
      // 设置组件值
      $(this).val(startDateStr + picker.locale.separator + endDateStr)
      // 设置存值组件值
      $beginComp.val(startDateStr)
      $endComp.val(endDateStr)
      $(this)[0].dispatchEvent(new Event('input'))
      $beginComp[0].dispatchEvent(new Event('input'))
      $endComp[0].dispatchEvent(new Event('input'))
    })
    // 重写取消方法
    $comp.on('cancel.daterangepicker', function (ev, picker) {
      // 清空组件值
      $(this).val('')
      // 清空存值组件值
      $beginComp.val('')
      $endComp.val('')
      $(this)[0].dispatchEvent(new Event('input'))
      $beginComp[0].dispatchEvent(new Event('input'))
      $endComp[0].dispatchEvent(new Event('input'))
    })
    // 时间格式过长时，页面无法展示全部内容，鼠标移入添加title属性浮动显示完整内容
    $comp.mouseover(function () {
      var timeStr = $(this).val()
      if (timeStr !== null && timeStr !== '') {
        $comp.attr('title', timeStr)
      }
    })
    // 鼠标移出移出title属性
    $comp.mouseout(function () {
      $comp.removeAttr('title')
    })
  })

  // 日期单值选择组件绑定
  var dateSingleSelComps = $('.datesingleselect')
  $.each(dateSingleSelComps, function (index, comp) {
    var $comp = $(comp)
    // 查看模式，取消绑定
    if ($(comp).hasClass('view')) {
      return
    }
    // 根据自定义类设置格式
    var formatPattern = 'YYYY-MM-DD'
    if ($(comp).hasClass('acctosec')) {
      formatPattern = 'YYYY-MM-DD HH:mm:ss'
    } else if ($(comp).hasClass('acctomin')) {
      formatPattern = 'YYYY-MM-DD HH:mm'
    } else if ($(comp).hasClass('acctoday')) {
      formatPattern = 'YYYY-MM-DD'
    }
    $comp.daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      timePicker: formatPattern.length > 10,// 短格式时不启用时间选择
      timePicker24Hour: true,
      timePickerSeconds: true,
      startDate: $comp.val() || moment(),
      buttonClasses: ['btn'],
      applyClass: 'btn-success',// 绿色按钮
      cancelClass: 'btn-primary',// 蓝色按钮
      locale: daterangepickerLocale(formatPattern),
      // 设置本地化
    })
    // 重写确定方法，使得页面打开默认可以为空
    $comp.on('apply.daterangepicker', function (ev, picker) {
      // 格式化
      var formatPattern = picker.locale.format
      var startDateStr = picker.startDate.format(formatPattern)
      // 设置组件值
      $(this).val(startDateStr)
      $(this)[0].dispatchEvent(new Event('input'))
    })
    $comp.on('change.daterangepicker', function (ev, picker) {
      $(this)[0].dispatchEvent(new Event('input'))
    })
    // 重写取消方法
    $comp.on('cancel.daterangepicker', function (ev, picker) {
      // 清空组件值
      $(this).val('')
      $(this)[0].dispatchEvent(new Event('input'))
    })
  })

  // 查看按钮
  var $viewBtns = $('.viewBtn')
  $.each($viewBtns, function (i, btn) {
    $(btn).click(
      function () {
        // 获取公共属性
        var toolBarData = $($(btn).parent()[0]).data()

        var selections = $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('getSelections')
        if (selections.length !== 1) {
          toastr.warning('请选择且只能选择一条记录查看明细!')
          return
        }
        // 设置回调参数
        var args = {
          cancel: false,
          params: '',
          selections: selections,
          dialogCfg: {},
        }
        // 调用回调
        var et = $(btn).data('eventTrigger')
        if (typeof et !== 'undefined' && et !== '') {
          window[et](args)
          if (args.cancel) {
            return
          }
        }
        var formUrl = getRelativePath() + toolBarData.javaClassName + 'Form.html?editType=view'
        if (!$.isEmptyObject(selections[0].id)) {
          formUrl += '&id=' + selections[0].id
        } else if (args.params !== '') {// 设置回调参数
          formUrl += '&' + args.params
        }

        openDialogView('查看' + toolBarData.functionNameSimple, formUrl, {
          width: args.dialogCfg.width || '800px',
          height: args.dialogCfg.height || '500px',
        })
      })
  })

  // 新增按钮
  var $addBtns = $('.addBtn')
  $.each($addBtns, function (i, btn) {
    $(btn).click(
      function () {
        // 获取公共属性
        var toolBarData = $($(btn).parent()[0]).data()
        // 设置回调参数
        var args = {
          cancel: false,
          params: '',
          dialogCfg: {},
        }
        // 调用回调
        var et = $(btn).data('eventTrigger')
        if (typeof et !== 'undefined' && et !== '') {
          window[et](args)
          if (args.cancel) {
            return
          }
        }
        var formUrl = getRelativePath() + toolBarData.javaClassName + 'Form.html?editType=add'
        if (args.params !== '') {// 设置回调参数
          formUrl += '&' + args.params
        }
        openDialog('新增' + toolBarData.functionNameSimple, formUrl, {
          width: args.dialogCfg.width || '800px',
          height: args.dialogCfg.height || '500px',
          callback: function () {
            $('#' + toolBarData.javaClassName + 'Table').bootstrapTable(
              'refresh')
          },
        })
      })
  })

  // 删除按钮
  var $deleteBtns = $('.deleteBtn')
  $.each($deleteBtns, function (i, btn) {
    $(btn).click(
      function () {
        // 获取公共属性
        var toolBarData = $($(btn).parent()[0]).data()
        var selections = $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('getSelections')
        if (selections.length === 0) {
          toastr.warning('请选择要删除的记录!')
          return
        } else {
          var ids = ''
          for (var i = 0; i < selections.length; i++) {
            if (!$.isEmptyObject(selections[i].id)) {
              ids += selections[i].id + ','
            }
          }

          ids = ids.substr(0, ids.length - 1)
          // 设置回调参数
          var args = {
            cancel: false,
            params: {
              ids: ids,
            },
            selections: selections,
          }
          // 调用回调
          var et = $(btn).data('eventTrigger')
          if (typeof et !== 'undefined' && et !== '') {
            window[et](args)
            if (args.cancel) {
              return
            }
          }
          top.layer.confirm('删除数据后不可恢复，确定要继续吗？', {
            icon: 3,
            title: '删除提醒',
          }, function (index) {
            var formUrl = '/api' + toolBarData.urlPrefix + '/deleteAll?type=del'
            if (!$.isEmptyObject(ids)) {
              formUrl += '&ids=' + ids
            } else if (args.params !== '') {// 设置回调参数
              formUrl += '&' + args.params
            }
            $.ajax(formUrl, {
              method: 'post',
              success: function (result) {
                if (result.type === 'success') {
                  toastr.success(result.message || '删除记录成功!')
                  $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('refresh')
                  var afterDelete = $(btn).data('afterDelete')
                  if (typeof afterDelete !== 'undefined'
                    && afterDelete !== '') {
                    window[afterDelete](selections.map(function (item) {
                      return item.id
                    }))
                  }
                } else {
                  toastr.error(result.message || '删除记录失败！')
                }
              },
            })
            top.layer.close(index)
          })
        }
      })
  })

  // 编辑按钮
  var $editBtns = $('.editBtn')
  $.each($editBtns, function (i, btn) {
    $(btn).click(
      function () {
        // 获取公共属性
        var toolBarData = $($(btn).parent()[0]).data()

        var selections = $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('getSelections')
        if (selections.length !== 1) {
          toastr.warning('请选择且只能选择一条记录进行修改!')
          return
        }
        // 设置回调参数
        var args = {
          cancel: false,
          params: '',
          selections: selections,
        }
        // 调用回调
        var et = $(btn).data('eventTrigger')
        if (typeof et !== 'undefined' && et !== '') {
          window[et](args)
          if (args.cancel) {
            return
          }
        }

        var formUrl = getRelativePath() + toolBarData.javaClassName + 'Form.html?editType=edit'
        if (!$.isEmptyObject(selections[0].id)) {
          formUrl += '&id=' + selections[0].id
        } else if (args.params !== '') {// 设置回调参数
          formUrl += '&' + args.params
        }
        openDialog('修改' + toolBarData.functionNameSimple, formUrl, {
          width: '800px',
          height: '500px',
          callback: function () {
            $('#' + toolBarData.javaClassName + 'Table').bootstrapTable(
              'refresh')
          },
        })
      })
  })

  var triggerSels = $('.triggerOff')
  $.each(triggerSels, function (i, select) {
    $(select).change(
      function () {
        var selVal = $(select).val()
        var triggeredSel = $(select.form).find(
          '#' + $(select).data('triggerOff'))
        var $hintOption = $(triggeredSel.children()[0])
        triggeredSel.val('')
        triggeredSel.empty()
        triggeredSel.append($hintOption)
        var triggeredValList = null
        if (selVal === '') {
          triggeredValList = $.parseJSON($.ajax({
            url: ctx + '/common/paramValue/'
              + $(select).data('cascadeType'),
            type: 'GET',
            async: false,
          }).responseText)
        } else {
          triggeredValList = $.parseJSON($.ajax({
            url: ctx + '/common/paramValue/getCascadeValueList',
            data: {
              classCode: $(select).data('paramType'),
              paramCode: selVal,
              triggerType: $(select).data('triggerType'),
              subClassCode: $(select).data('cascadeType'),
            },
            type: 'GET',
            async: false,
          }).responseText)
        }
        if (triggeredValList.length > 0) {
          $.each(triggeredValList, function (i, item) {
            triggeredSel.append($('<option value="' + item.paramCode
              + '">' + item.paramName + '</option>'))
          })
        }
      })
  })
})

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
  if (!value) {
    return '-'
  }
  var valueArr = []
  if (value instanceof Array) {
    valueArr = value
  } else if (typeof value === 'number') {
    valueArr = [value]
  } else {
    valueArr = value.split(',')
  }
  var codeName = ''
  var data = dictData || this.dictData || pageDictMap[fieldDictTypeMap[this.field]] || []
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

// 获取URL地址参数
function getQueryString (name, url) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  if (!url || url === '') {
    url = window.location.search
  } else {
    url = url.substring(url.indexOf('?'))
  }
  r = url.substr(1).match(reg)
  if (r != null) return unescape(decodeURI(r[2]))
  return null
}

$(function () {
  /** ****LOV树单选择初始化,data-field data-idKey...****** */
  $('.treebt').each(
    function () {
      var $bt = $(this)
      var idKey = $bt.attr('data-id-key')
      var nameKey = $bt.attr('data-name-key')
      var $fieldId = $('[id=\'' + idKey + '\']')
      var $fieldName = $('[id=\'' + nameKey + '\']')
      $bt.click(function () {
        var config = {
          height: '300px',
          width: '250px',
        }
        config.yes = function (index, layero) {
          var tree = layero.find('iframe')[0].contentWindow.tree
          var nodes = tree.getSelectedNodes()
          if (nodes.length > 0) {
            $fieldId.val(nodes[0].id)
            $fieldId[0].dispatchEvent(new Event('input'))
            $fieldName.val(nodes[0].name)
            $fieldName[0].dispatchEvent(new Event('input'))
            $fieldName.focus()
          }
          top.layer.close(index)
          return true
        }
        var params = {}
        params.url = encodeURI($bt.attr('data-url'))
        var keys = [
          'data-idKey', 'data-pIdKey', 'data-rootPId',
          'data-nameKey', 'data-extIds']
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i]
          if (!!$bt.attr(key)) {
            params[key.split('-')[1]] = $bt.attr(key)
          }
        }
        if (!!$fieldId.val()) {
          params.selectId = $fieldId.val()
        }
        openDialog('选择' + $bt.attr('data-title'),
          '/common-assets/pages/treeSelect.html?'
          + $.param(params), config)
      })
      $fieldName.click(function () {
        $bt.trigger('click')
      })
    })

  $('.multi_treebt').each(
    function () {
      var $bt = $(this)
      var field = $bt.attr('data-field')
      var $fieldIds = $('#' + field + 'Ids')
      var $fieldNames = $('#' + field + 'Names')
      if ($fieldIds.length == 0) $fieldIds = $('#' + field + '\\.Ids')
      if ($fieldNames.length == 0)
        $fieldNames = $('#' + field + '\\.Names')
      $bt.click(function () {
        var config = {
          height: '500px',
          width: '250px',
        }
        config.yes = function (index, layero) {
          var tree = layero.find('iframe')[0].contentWindow.tree
          var checkedNode = tree.getCheckedNodes()
          var checkedIdsOfLeaf = []
          var checkedNamesOfLeaf = []
          for (var i = 0; i < checkedNode.length; i++) {
            var halfChecked = checkedNode[i].getCheckStatus().half // 该节点是否是半选状态
            if (!halfChecked) {
              checkedIdsOfLeaf.push(checkedNode[i].id)
              checkedNamesOfLeaf.push(checkedNode[i].name)
            }
          }
          $fieldIds.val(checkedIdsOfLeaf)
          $fieldIds[0].dispatchEvent(new Event('input'))
          $fieldNames.val(checkedNamesOfLeaf)
          $fieldName[0].dispatchEvent(new Event('input'))
          $fieldNames.focus()
          top.layer.close(index)
          return true
        }
        var params = {}
        params.url = encodeURI($bt.attr('data-url'))
        var keys = [
          'data-idKey', 'data-pIdKey', 'data-rootPId',
          'data-nameKey', 'data-extIds']
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i]
          if (!!$bt.attr(key)) {
            params[key.split('-')[1]] = $bt.attr(key)
          }
        }
        if (!!$fieldIds.val()) {
          params.checkedIds = $fieldIds.val()
        }
        openDialog('选择' + $bt.attr('data-title'),
          dwCtx.ROOT + '/tag/multiTreeSelect?'
          + $.param(params), config)
      })
      $fieldNames.click(function () {
        $bt.trigger('click')
      })
    })
  // 人员选择加载树
  $('.lazyTreeSelectBt').each(
    function () {
      var $bt = $(this)
      var $fieldId = $('#user\\.id')
      var $fieldName = $('#user\\.userName')
      $bt.click(function () {
        var config = {
          height: '500px',
          width: '250px',
        }
        var params = {}
        if (!!$fieldId.val()) {
          params.checkedId = $fieldId.val()
        }
        var url = dwCtx.ROOT + '/tag/lazyTreeSelect?'
          + 'url=' + dwCtx.ROOT
          + '/sys/org/getOrgList' + '&expendURL='
          + dwCtx.ROOT
          + '/sys/user/getUserTreeListOfExpand'
          + '&parentKeyOfLeaf=orgId' + '&searchUrl='
          + dwCtx.ROOT + '/sys/role/searchUserList'
          + '&pIdKeyOfParent=parentId' + '&nameKeyOfParent=orgName'
          + '&' + $.param(params)
        top.layer.open({
          type: 2,
          area: [config.width, config.height],
          title: '选择用户',
          maxmin: true, // 开启最大化最小化按钮
          content: url,
          btn: ['确定', '关闭'],
          yes: function (index, layero) {
            var tree = layero.find('iframe')[0].contentWindow.tree
            var node = tree.getSelectedNodes()[0] // 获取到选择的节点
            if (node.isParent) {
              toastr.warning('不能选择父节点!')
              return
            }
            $fieldId.val(node.id)
            $fieldId[0].dispatchEvent(new Event('input'))
            $fieldName.val(node.name)
            $fieldName[0].dispatchEvent(new Event('input'))
            setTimeout(function () {
              top.layer.close(index)
            }, 100)
          },
          cancel: function (index) {
            setTimeout(function () {
              top.layer.close(index)
            }, 100)
          },
        })
      })
      $fieldName.click(function () {
        $bt.trigger('click')
      })
    })

  // Collapse ibox function
  $('.collapse-link').on('click', function () {
    var ibox = $(this).closest('div.ibox')
    var button = $(this).find('i')
    var content = ibox.children('.ibox-content')
    content.slideToggle(200)
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down')
    ibox.toggleClass('').toggleClass('border-bottom')
    setTimeout(function () {
      ibox.resize()
      ibox.find('[id^=map-]').resize()
    }, 50)
  })

  // Close ibox function
  $('.close-link').on('click', function () {
    var content = $(this).closest('div.ibox')
    content.remove()
  })

  // Fullscreen ibox function
  $('.fullscreen-link').on('click', function () {
    var ibox = $(this).closest('div.ibox')
    var button = $(this).find('i')
    $('body').toggleClass('fullscreen-ibox-mode')
    button.toggleClass('fa-expand').toggleClass('fa-compress')
    ibox.toggleClass('fullscreen')
    setTimeout(function () {
      $(window).trigger('resize')
    }, 100)
  })
  // if (window.top == window.self) {
  // var pathnames = window.location.pathname.split("/");
  // if (pathnames.length == 3 || (pathnames.length == 4 && pathnames[2] ==
  // 'a'))
  // return;
  // layer.msg('是否导航回主框架页面？', {
  // time: 0,
  // icon: 3,
  // shade: [0.8, '#393D49'],
  // btn: ['确定', '取消'],
  // yes: function(index) {
  // if (!window.location.origin) {
  // window.location.origin = window.location.protocol + "//"
  // + window.location.hostname
  // + (window.location.port ? ':' + window.location.port : '');
  // }
  // window.location.href = window.location.origin + "/" + pathnames[1];
  // }
  // });
  // }
  if (!window.frameElement || window.frameElement.scrolling !== 'no') {
    if ($('.container-fluid').length > 0 && $('.container-fluid').slimScroll) {
      $('.container-fluid').slimScroll({
        height: '100%',
        railOpacity: 0.9,
      })
    }
  }

  var minWidth = 768
  /**
   * bootstrap table响应式布局，当视图大小小于一定大小时隐藏一些列 add by chenchao
   */
  $(window).resize(function () {
    updateHideColumn()
  })
  updateHideColumn() // 打开页面时也要判断

  function updateHideColumn () {
    var iframeWidth = $('.J_iframe').context.body.clientWidth
      || $('.J_iframe').context.documentElement.clientWidth
    if (iframeWidth < minWidth) {
      $('table').each(function () {
        var $table = $(this)
        var tableId = $table.attr('id')
        $(this).find('th').each(function () {
          var $this = $(this)
          var smVisible = $this.data('smVisible')
          if (smVisible == false) {
            window.hideColumns = window.hideColumns || []
            var field = $this.data('field')
            window.hideColumns.put(field)
            $table.bootstrapTable('hideColumn', field)
          }
        })
      })
    } else {
      $('table').each(function () {
        var $table = $(this)
        if (!window.hideColumns) return
        for (var i = 0; i < window.hideColumns.length; i++) {
          $table.bootstrapTable('showColumn', window.hideColumns[i])
        }
      })
    }
  }
})

function changeTheme (theme) {
  var STORAGE_PRE = ctx.substring(1) + '_'
  var storage = window.localStorage
  storage.setItem(STORAGE_PRE + 'theme', theme)

  // 获取皮肤的link
  var $skinLink
  $('link').each(function () {
    var href = $(this).attr('href')
    if (href.indexOf('skin-') >= 0) $skinLink = $(this)
  })
  // 修改css文件
  renderSkinLink($skinLink, theme)
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//'
      + window.location.hostname
      + (window.location.port ? ':' + window.location.port : '')
  }
  changeIframeSkin(window.location.origin, $('iframe'), theme)

}

/**
 * 递归更换所有嵌套同域Iframe的皮肤
 *
 * @param parentOrigin
 * @param $iframe
 * @param theme
 * @returns
 */
function changeIframeSkin (parentOrigin, $iframe, theme) {
  $iframe.each(function () {
    var $skinLink
    // 系统内使用replace的方法替换页面地址，因此同域iframe没有src值
    // 跨域iframe应当指定src值，否则会出现跨域问题
    var origin = new URL($(this)[0].src
      || $(this)[0].contentWindow.location).origin
    if (parentOrigin === origin) {
      $(this).contents().find('link').each(function () {
        var href = $(this).attr('href')
        if (!!href && href.indexOf('skin-') >= 0) $skinLink = $(this)
      })
      renderSkinLink($skinLink, theme)
      changeElementUITheme(this.contentDocument, theme)
      changeIframeSkin(origin, $(this).contents().find('iframe'), theme)
    }
  })
}

/**
 * 根据是否存在皮肤添加或修改皮肤
 *
 * @param $skinLink
 * @param theme
 * @returns
 */
function renderSkinLink ($skinLink, theme) {
  if ($skinLink == undefined) {
    $('<link>').appendTo('head').attr({
      type: 'text/css',
      rel: 'stylesheet',
    }).attr('href', ctxStatic + '/css/skin-' + theme + '.css')
  } else {
    var originLink = $skinLink.attr('href')
    var newLink = originLink.substring(0, originLink.indexOf('skin-'))
      + 'skin-' + theme + '.css'
    $skinLink.attr('href', newLink)
  }
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase()
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1])
    : false
}

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
if (typeof layer !== 'undefined') {
  layer.config({ skin: 'layer-ext-moon', extend: 'moon/style.css' })
}

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
  var STORAGE_PRE = dwCtx.CTX.substring(1) + '_'
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
      var loading = fullscreenLoading()
      requestByAxios('post', param.saveUrl, param.data, info, function (response) {
        var result = getDataFromAxiosResponse(response, info)
        if (result && result.type === 'success') {
          typeof callback === 'function' && callback(result)
          loading.close()
        }
      }, function (error) {
        axiosErrorTips(error, info + '异常')
        loading.close()
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
    text,
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)',
  })
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
 * 通用确认方法，默认统一调用顶层主页面确认方法
 * @param message
 * @param title
 * @param config
 * @param confirmCallback
 * @param cancelCallback
 */
function direwolfCommonConfirm (message, title, config, confirmCallback, cancelCallback) {
  var confirm = Vue.prototype.$confirm
  if (direwolfVueApp) {
    confirm = direwolfVueApp.confirm
  }
  if (typeof cancelCallack == 'undefined') {
    cancelCallback = function (reason) {
    }
  }
  confirm(message, title, Object.assign({}, config, {
    zIndex: getTopIndex(),
  })).then(confirmCallback).catch(cancelCallback)
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
      dwCtx.CTX + '/common/paramValue/getCascadeValueList?classCode=res_type&triggerType=relation&subClassCode=' +
      type + '&paramCode=' + value).then(function (response) {
      callback(response.data)
    })
  } else {
    axios.get(dwCtx.CTX + '/common/paramValue/' + type).then(function (response) {
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

function getRelativePath () {
  var paths = location.pathname.split('/')
  paths.pop()
  return paths.join('/').concat('/')
}

function getModuleConfigPath () {
  var paths = location.pathname.split('/')
  var index = paths.indexOf('pages')
  var relativePaths = paths.slice(1, index)
  relativePaths.push('static')
  relativePaths.push('config.json')
  relativePaths.unshift('..')
  return relativePaths.join('/')
}

function getProjectPath () {
  var paths = location.pathname.split('/')
  var index = paths.indexOf('pages')
  var relativePaths = paths.slice(0, index - 1)
  return relativePaths.join('/')
}

function fix_height () {
  // var winheight = $(window).height()
  var fbox = $('.ibox:first')
  var lbox = $('.ibox:last')
  var fheight = fbox.height()
  var lheight = lbox.height()
  var maxh = fheight > lheight ? fheight : lheight
  // if (maxh <= winheight || $(window).width() >= (fbox.width() + lbox.width())) {
  //   $('.ibox').css('min-height', (winheight - 30) + 'px')
  //   $('.ibox-content').css('min-height', (winheight - 50) + 'px')
  // } else {
  //   $('.ibox').css('min-height', '')
  //   $('.ibox-content').css('min-height', '')
  // }
  // $('.ibox').css('height', maxh + 'px')
  // $('.ibox-content').css('height', maxh + 'px')
}

$(document).ajaxError(function (e, jqXHR, ajaxSettings, thrownError) {
  if (jqXHR.status === 302) {
    window.location.replace(commonConfig.adminContext + '/login')
  } else if (jqXHR.status === 401) {
    window.location.replace(errorDirection + '/401.html')
  } else if (jqXHR.status === 500) {
    try {
      var msg = $.parseJSON(jqXHR.responseText)
      direwolfCommonTips('error', '服务器内部错误', msg.message)
    } catch (e) {
      direwolfCommonTips('error', '服务器内部错误')
    }
  }
})

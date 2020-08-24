var passWordRegex = '03'
var validateForm

function doSubmit (callback) {// 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
  if (validateForm.form()) {
    calculate()
    formAjaxSubmit($('#userForm'), function (result) {
      callback(result)
    },userListContentVm.entity)
    return true
  }
  return false
}

function calculate () {
  var password = $('#newPassword').val()
  if (!$.isEmptyObject(password)) {
    $('#password').val(password)
  } else {
    $('#password').val(null)
  }
  timeSplit()

}

// 是否启用时限登录值变化确定限制开始时间与限制结束时间的显隐
function limitOnchange (selection) {
  if (selection.value == '0') {
    $('#trTime').hide()
  } else {
    $('#trTime').show()
    $('#bgTimeFormater').addClass('required')
    $('#edTimeFormater').addClass('required')
  }
}

var passWordRegexC = passWordRegex

var pageDictMap = {}
var fieldDictTypeMap = {
  'userStatus': 'user_status',
  'sex': 'sex_type',
  'userType': 'user_type',
  'enTimeLimit': 'y_n',
}
var userListContentVm = new Vue({
  el: '#userForm',
  data: function () {
    return {
      entity: {
        id: GetQueryString('id'),
        userAccount: '',
        userName: '',
        nickName: '',
        email: '',
        empNo:'',
        sex: '0',
        mobile: '',
        password: '',
        enTimeLimit: '0',
        bgTimeFormater:'',
        edTimeFormater:'',
        createTime:'',
        identityCode:'',
        hrCode:'',
        limitIp:'',
        userStatus: '1',
        userType: '1',
        orgId: GetQueryString('orgId'),
      },
      /**
       * 页面查看类型
       */
      editType: GetQueryString('editType'),
      pageDictMap: {},
      urlPrefix: commonConfig.sysBackendContext + '/sys/user',
      orgTreeUrlPrefix:WEB_ROOT + "/sys/org/getOrgTree?pId=",//${dw:getUser().userAccount == admin ?'0': dw:getCurCorp().id}&type=0
      userOrgId: ''
    }
  },
  computed: {
    sexTypeDict : function (){
      return this.pageDictMap['sex_type']
    },
    userStatusDict : function () {
      return  this.pageDictMap['user_status']
    },
    userTypeDict : function (){
      return this.pageDictMap['user_type']
    },
    enTimeLimitDict : function (){
      return this.pageDictMap['y_n']
    },
    orgTreeUrl: function () {
      return this.orgTreeUrlPrefix + this.userOrgId + '&type=0'
    }
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initFormData: function () {
      var vm = this
      var pkValue = this.entity.id
      if (pkValue) {
        var url = this.urlPrefix + '/getUserList?id=' + pkValue
        var info = '获取微服务系统信息'
        axios.get(url).then(function (response) {
          var page = getDataFromAxiosResponse(response, info)
          if (page.list && page.list[0]) {
            vm.entity = page.list[0]
          }
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      }
    },
    getUserOrgId: function () {
      var url = commonConfig.sysBackendContext + '/sys/sysParam/getSysParam?code=ADMIN_USER'
      var info = '获取管理员账号'
      var vm = this
      axios.get(url).then(function (response) {
        var adminAccount = getDataFromAxiosResponse(response, info)
        vm.userOrgId = LOGIN_USER === adminAccount ? '0' : corpId
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    }
  },
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/user/checkUserFormPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,user_status,user_type,sex_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      vm.pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.initFormData()
      vm.getUserOrgId()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {

    // 自定义日期比较验证函数
    jQuery.validator.methods.compareDate = function (value, element, param) {

      if ($('#enTimeLimit').val() === '1') {
        if ((jQuery(param).val() === '' || undefined || null) || (value === '' || undefined || null)) {
          return false
        } else {
          // 补全yyyy/MM/dd HH:mm:ss格式 默认年月日为2017/01/01秒为:00 比较两个时间的大小
          var startDate = '2017/01/01 ' + jQuery(param).val() + ':00'
          var value2 = '2017/01/01 ' + value + ':00'
          var date1 = new Date(Date.parse(startDate.replace('-', '/')))
          var date2 = new Date(Date.parse(value2.replace('-', '/')))
          return date1 < date2
        }
      } else {
        return true
      }
    }

    validateForm = $('#userForm').validate({
      rules: {
        newPassword: {
          checkPassword: true,
        },
        confirmNewPassword: {
          checkPassword: true,
        },
        edTimeFormater: {
          compareDate: '#bgTimeFormater',
        },
      },
      messages: {
        confirmNewPassword: {
          equalTo: '两次输入的密码不一致',
        },
        edTimeFormater: {
          compareDate: '结束日期必须大于开始日期!',
        },

      },
      submitHandler: function (form) {
        loading('正在提交，请稍等...')
        form.submit()
      },
      errorContainer: '#messageBox',
      errorPlacement: function (error, element) {
        $('#messageBox').text('输入有误，请先更正。')
        if (element.is(':checkbox') || element.is(':radio') || element.parent().is('.input-append')) {
          error.appendTo(element.parent().parent())
        } else {
          error.insertAfter(element)
        }
      },
    })
    // 消除不满窗时的滚动条
    if ($('#userForm').height() < $('#userForm').context.defaultView.innerHeight) {
      $($('#userForm').context.firstElementChild).height(
        $('#inputForm').context.defaultView.innerHeight)
    }

    $('.clockpicker').clockpicker().find('input').change(function () {
      this.focus()
    })
    var $ipSelectBtn = $('#ipSelectBtn')
    $ipSelectBtn.click(function () {
      ipSelect()
    })

    // 初始化限制开始时间结束时间
    if ($('#enTimeLimit').val() === '0' || !$('#enTimeLimit').val()) {
      $('#trTime').hide()
    } else {
      $('#trTime').show()
      $('#bgTimeFormater').addClass('required')
      $('#edTimeFormater').addClass('required')
    }
  },
})

// 自定义正则表达示验证方法
$.validator.addMethod('checkPassword', function (value, element, params) {
  var checkPassword = new RegExp()
  if (!$.isEmptyObject(value)) {
    $.ajax({
      type: 'post',
      dataType: 'json',
      async: false,
      url: WEB_ROOT + '/sys/user/getPassWordPolicy?timestamp=' + Date.parse(new Date()),
      success: function (data) {
        var pwdRegex = data.pwdRegex
        var pwdRegName = data.pwdRegName
        checkPassword = new RegExp(pwdRegName)
      },
      error: function () {
        toastr.error('服务器内部错误,请稍后重试!')
      },
    })
  }

  return this.optional(element) || (checkPassword.test(value))
}, '密码至少8位，必须包含数字、字母及特殊字符')

// 开始时间 结束时间解析
function timeSplit () {
  var bgTimeValue = $('#bgTimeFormater').val()
  var edTimeValue = $('#edTimeFormater').val()
  var bgTimeArry = bgTimeValue.split(':')
  var edTimeArry = edTimeValue.split(':')
  var bgTime = null
  var edTime = null
  if (bgTimeArry.length > 1) {
    bgTime = Number(bgTimeArry[0] * 60) + Number(bgTimeArry[1])
  }
  if (edTimeArry.length > 1) {
    edTime = Number(edTimeArry[0] * 60) + Number(edTimeArry[1])
  }
  userListContentVm.entity['bgTime'] = bgTime
  userListContentVm.entity['edTime'] = edTime
  $('#bgTime').val(bgTime)
  $('#edTime').val(edTime)
}

// ip选择
function ipSelect () {
  var ipLimit = $('#limitIp').val()
  var paths = location.pathname.split('/')
  paths.pop()
  var formUrl = paths.join('/') + '/ipLimitSelect.html?ipLimit=' + ipLimit
  openDialog('IP限制', formUrl, {
    width: '400px',
    height: '300px',
    callback: function (result) {
      return true
    },
    yes: function (index, layero) {
      var iframeWin = layero.find('iframe')[0]
      var data = iframeWin.contentWindow.doSubmit(function (data) {
        setTimeout(function () {
          if (!!config.callback)
            config.callback()
          top.layer.close(index)
          // toastr.success(data.message);
        }, 100)
      })
      userListContentVm.entity.limitIp = data.ipLimitback
      // $('#limitIp').val(data.ipLimitback)
      toastr.success(data.message)
      top.layer.close(index)
      return true
    },
  })

}

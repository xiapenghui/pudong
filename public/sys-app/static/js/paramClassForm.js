var validateForm

function doSubmit (callback) {// 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
  // 验证classCode是否重名
  var result = 'success'
  var id = $('#id').val()
  var classCode = $('#classCode').val()

  if (id === '' && classCode != '') {
    $.ajax({
      type: 'get',
      url: WEB_ROOT + '/sys/paramClass/isExisted?classCode=' + classCode
        + '&t=' + new Date().getTime(),
      async: false,
      success: function (data) {
        result = data.type
      },
    })

    if (result !== 'success') {
      toastr.error('系统代码已被占用，请修改')
      return false
    }
  }

  // 提交之前设置appId所在的select控件disabled属性为false
  $('#appId').attr('disabled', false)

  if (validateForm.form()) {
    formAjaxSubmit($('#paramClassForm'), function (result) {
      callback(result)
    })
    return true
  }
  return false
}

var pageDictMap = {}
var fieldDictTypeMap = {
  'enTimeLimit': 'y_n',
}
var paramClassListContentVm = new Vue({
  el: '#paramClassForm',
  data: function () {
    return {
      entity: {
        id: GetQueryString('id'),
        classCode: '',	// 系统代码
        className: '',	// class_name
        classDesc: '',	// 扩展配置
        appId: '1',	// app_id

      },
      /**
       * 页面查看类型
       */
      editType: GetQueryString('editType'),
      pageDictMap: {},
      urlPrefix: commonConfig.sysBackendContext + '/sys/paramClass',
    }
  },
  computed: {
    enTimeLimitDict () {
      return this.pageDictMap['y_n']
    },
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initFormData: function () {
      var vm = this
      var pkValue = this.entity.id
      if (pkValue) {
        var url = this.urlPrefix + '/getParamClassList?id=' + pkValue
        var info = '获取系统字典表配置信息'
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

  },
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/paramClass/checkParamClassFormPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,user_status,user_type,sex_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      vm.pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.initFormData()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    validateForm = $('#paramClassForm').validate(
      {
        submitHandler: function (form) {
          loading('正在提交，请稍等...')
          form.submit()
        },
        errorContainer: '#messageBox',
        errorPlacement: function (error, element) {
          $('#messageBox').text('输入有误，请先更正。')
          if (element.is(':checkbox') || element.is(':radio')
            || element.parent().is('.input-append')) {
            error.appendTo(element.parent().parent())
          } else {
            error.insertAfter(element)
          }
        },
      })
    // 消除不满窗时的滚动条
    if ($('#paramClassForm').height() < $('#paramClassForm').context.defaultView.innerHeight) {
      $($('#paramClassForm').context.firstElementChild).height(
        $('#inputForm').context.defaultView.innerHeight)
    }

  },
})




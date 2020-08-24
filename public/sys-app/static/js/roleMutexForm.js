var validateForm

function doSubmit (callback) {// 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
  if (validateForm.form()) {
    formAjaxSubmit($('#roleMutexForm'), function (result) {
      callback(result)
    })
    return true
  }
  return false
}

var pageDictMap = {}
var fieldDictTypeMap = {
  'roleMutexType': 'roleMutex_type',
}
var roleMutexFormContentVm = new Vue({
  el: '#roleMutexForm',
  data: function () {
    return {
      entity: {
        id: GetQueryString('id'),
        type: '',
        appId: '',
        appName: '',
        groupDesc: '',
      },
      /**
       * 页面查看类型
       */
      editType: GetQueryString('editType'),
      urlPrefix: commonConfig.sysBackendContext + '/sys/roleMutex',
      pageDictMap: {},
    }
  },
  computed: {
    roleMutexTypeDict: function () {
      return this.pageDictMap['roleMutex_type']
    },
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initFormData: function () {
      var vm = this
      var pkValue = vm.entity.id
      if (pkValue) {
        var url = this.urlPrefix + '/getRoleMutexList?id=' + pkValue
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
  },
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/roleMutex/checkRoleMutexFormPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=roleMutex_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      vm.pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.initFormData()
      //vm.getUserOrgId()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    var vm = this

    $('#roleMutexForm').submit(function (e) {
      e.preventDefault()
    })

    // 初始化appId
    $.ajax({
      async: false,
      type: 'GET',
      url: WEB_ROOT + '/sys/app/getAppListOfUser?timestamp='
        + Date.parse(new Date()),
      error: function () {
        alert('请求失败')
      },
      success: function (result) {
        var apps = result.data
        $appId = $('#appId')
        for (var i = 0; i < apps.length; i++) {
          $appId.append('<option value=\'' + apps[i].id + '\'>'
            + apps[i].appName + '</option>')
        }
        //$("#appId").val(apps[0].id);
        //vm.entity.id = apps[0].appId
        /*$appName.change(function() {
          var appId = $(this).children('option:selected').val();// 这就是selected的值
          $("#appId").val(appId);
        });*/
      },
    })

    validateForm = $('#roleMutexForm').validate(
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
    if ($('#roleMutexForm').height() < $('#roleMutexForm').context.defaultView.innerHeight) {
      $($('#roleMutexForm').context.firstElementChild).height(
        $('#inputForm').context.defaultView.innerHeight)
    }
  },
})

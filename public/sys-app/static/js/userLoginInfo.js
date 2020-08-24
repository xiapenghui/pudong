var pageDictMap = {}
var fieldDictTypeMap = {
  'userStatus': 'user_status',
  'enTimeLimit': 'y_n',
}
var userListContentVm = new Vue({
  el: '#userListContent',
  data: function () {
    return {
      /**
       * 页面加载状态
       */
      pageLoading: true,
      /**
       * 页面查看类型
       */
      editType: GetQueryString('editType'),
      /**
       * 页面字典列表
       */
      pageDictMap: {},
      backendContext: commonConfig.sysBackendContext,
    }
  },
  computed: {
    /**
     * 用户状态
     */
    userStatusDict: function () {
      return this.pageDictMap['user_status']
    },
  },
  created: function () {
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,user_status'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
      setDefaultValue()
      refreshTable()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  methods: {},
  mounted: function () {

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#userSearchBtn')
    var $resetBtn = $('#userResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
    $('.exportBtn').click(function () {
      var dictUrl = commonConfig.sysBackendContext + '/sys/userLoginInfo/export?' + $('#userSearchForm').serialize()
      var info = '导出用户登录信息'
      axios.get(dictUrl).then(function (response) {

      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    })
    setDefaultValue()
  },
})

function refreshTable () {
  var data_url = WEB_ROOT + '/sys/userLoginInfo/getUserList?'
  $('#userTable').bootstrapTable('refresh', {
    url: data_url + $('#userSearchForm').serialize(),
  })
}

//设置查询项的默认值，在初始化及点击重置按钮时调用
function setDefaultValue () {
  $('#userSearchForm #lastLoginTime').val('')
  $('#userSearchForm #userStatus').val('')
}






var pageDictMap = {}
var fieldDictTypeMap = {
  'userStatus': 'user_status',
  'sex': 'sex_type',
  'userType': 'user_type',
  'enTimeLimit': 'y_n',
}
var userRedundantListContentVm = new Vue({
  el: '#userRedundantListContent',
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
    }
  },
  computed: {},
  methods: {},
  created: function () {
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,user_status,user_type,sex_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    refreshTable()

    var $searchBtn = $('#userSearchBtn')
    var $resetBtn = $('#userResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
  },
})

//设置查询项的默认值，在初始化及点击重置按钮时调用
function setDefaultValue () {
  $('#userSearchForm #identityCode').val('')
}

// 刷新表格公共方法
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/userRedundant/getUserList?'
  $('#userTable').bootstrapTable('refresh', {
    url: data_url + $('#userSearchForm').serialize(),
  })
}

function selectFormatter (value, row, index) {
  return '<input type=\'checkbox\' class=\'mainData\' value=\'' + row.id + '\'/>'
}

function mergeUser () {
  //获取所有选择要合并的账号，以及主记录
  var selectedDataList = []
  $(':checked[name=\'btSelectItem\']').each(function () {
    selectedDataList.push($(this).val())
  })
  var mainDataList = []
  $(':checked.mainData').each(function () {
    mainDataList.push($(this).val())
  })
  if (selectedDataList.length <= 1) {
    toastr.error('请选择需要合并的数据,并且必须选择2条或2条以上数据！')
    return
  }
  if (mainDataList.length != 1) {
    toastr.error('合并失败，同一组账号只能选择一个主记录！')
    return
  }
  var url = commonConfig.sysBackendContext + '/sys/userRedundant/merge?selectedDataList=' + selectedDataList.join(',') + '&mainDataList=' +
    mainDataList.join(',')
  axios.get(url).then(function (response) {
    var data = getDataFromAxiosResponse(response, '合并用户信息')
    if (data.type == 'success') {
      toastr.success(data.message)
      refreshTable()
    } else {
      toastr.error(data.message)
    }
  }).catch(function (error) {
    toastr.error('请求失败')
  })
}

function operateFormatter (value, row, index) {
  var deleteTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button></div>'
  return deleteTable
}

window.operateEvents = {
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据后不可恢复，确定要继续吗？', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      var formUrl = WEB_ROOT + '/sys/user/delete?type=del&id=' + row.id
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {
            toastr.success(result.message || '删除记录成功!')
            refreshTable()
          } else {
            toastr.error(result.message || '删除记录失败！')
          }
        },
      })
      layer.close(index)
    })
  },
}




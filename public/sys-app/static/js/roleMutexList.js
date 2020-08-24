var pageDictMap = {}
var fieldDictTypeMap = {
  'type': 'roleMutex_type',
}

var roleMutexListContentVm = new Vue({
  el: '#roleMutexListContent',
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
     * 角色
     */
    roleMutexTypeDict: function () {
      return this.pageDictMap['roleMutex_type']
    },
  },
  methods: {},
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/roleMutex/checkRoleMutexListPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=roleMutex_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
      refreshTable()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    setDefaultValue()
    // 设置查询重置按钮点击方法
    var $searchBtn = $('#roleMutexSearchBtn')
    var $resetBtn = $('#roleMutexResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })

    bindEnter('roleName', 'roleMutexSearchBtn')

  },
})

//设置查询项的默认值，在初始化及点击重置按钮时调用
function setDefaultValue () {
  $('#roleMutexSearchForm #type').val('')
  $('#roleMutexSearchForm #strRoleNames').val('')
}

// 刷新表格公共方法
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/roleMutex/getRoleMutexList?'
  $('#roleMutexTable').bootstrapTable('refresh',
    {
      url: data_url + $('#roleMutexSearchForm').serialize(),
    })
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingRoleMutex (args) {
  return args
}

// 删除前触发
function deletingRoleMutex (args) {
  if (!!args.selections) {
    var ids = ''
    for (var i = 0; i < args.selections.length; i++) {
      if (!!args.selections[i].id) {
        ids += args.selections[i].id + ','
      }
    }
    ids = ids.substr(0, ids.length - 1)
    if (!!ids) {
      args.params = 'ids=' + ids
    }
  }
  return args
}

// 查看前触发
function viewingRoleMutex (args) {
  if (!!args.selections && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

//操作列定义
function operateFormatter (value, row, index) {

  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button title=\'修改\' style=\'margin:1px\' class=\'edit btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var editRole = '<button title=\'修改\' style=\'margin:1px\' class=\'changeRole btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-group fa-fw\'></i></button>'
  var deleteTable = '<button title=\'删除\' style=\'margin:1px\' class=\'btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button></div>'
  return editTable + editRole + deleteTable

}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    //var formUrl=window.location.pathname + "/form?editType=edit&id="+row.id;
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('roleMutex')
    var formUrl = paths.join('/') + 'Form.html?editType=edit&id=' + row.id
    openDialog('修改角色互斥关系', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        $('#roleMutexTable').bootstrapTable('refresh')
      },
    })
  },
  'click .changeRole': function (e, value, row, index) {
    editRoles(row)
  },
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据不可恢复,确定要继续吗?', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      var formUrl = WEB_ROOT + '/sys/roleMutex/delete?id=' + row.id
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type == 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#roleMutexTable').bootstrapTable('refresh')
          } else {
            toastr.error(result.message || '删除记录失败!')
          }
        },
      })
      layer.close(index)
    })
  },

}

function editRoles (row) {
  var id = row.id
  var appId = row.appId
  var config = { height: '500px', width: '250px' }
  var checkedIds = row.roleIds
  //multiTreeSelect接口的url参数有多个，则需要用encodeURIComponent()编码，这里可以不用
  var paramUrl = encodeURIComponent(WEB_ROOT + '/sys/role/getRolesAndOrgs?appId=' + appId)
  var url = '/common-assets/pages/multiTreeSelect.html?url=' + paramUrl + '&checkedIds=' + checkedIds

  top.layer.open({
    type: 2,
    area: [config.width, config.height],
    title: '编辑互斥角色',
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    yes: function (index, layero) {
      var tree = layero.find('iframe')[0].contentWindow.tree
      var checkedNode = tree.getCheckedNodes()
      var checkedIdsOfLeaf = []
      for (var i = 0; i < checkedNode.length; i++) {
        if (!checkedNode[i].isParent)//该节点是否是角色节点
          checkedIdsOfLeaf.push(checkedNode[i].id)
      }
      var str_checkedIdsOfLeaf = ''
      for (var i = 0; i < checkedIdsOfLeaf.length; i++) {
        str_checkedIdsOfLeaf += checkedIdsOfLeaf[i] + ','
      }
      str_checkedIdsOfLeaf = str_checkedIdsOfLeaf.substring(0, str_checkedIdsOfLeaf.length - 1)
      // 保存数据
      $.ajax({
        async: false,
        type: 'POST',
        url: WEB_ROOT + '/sys/roleMutex/save',
        data: JSON.stringify({
          id: id,
          roleIds: checkedIdsOfLeaf,
          appId: appId,
        }),
        contentType: 'application/json',
        error: function () {
          alert('请求失败')
        },
        success: function (result) {
          if (result.type == 'success') {
            refreshTable()
            toastr.success(result.message)
          } else {
            toastr.error(result.message)
          }
        },
      })
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
}
	

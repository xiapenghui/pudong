var pageDictMap = {}
var fieldDictTypeMap = {
  'roleCode': 'role_code',
}

  var roleListContentVm = new Vue({
  el: '#roleListContent',
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
    roleCodeDict: function () {
      return this.pageDictMap['role_code']
    },
  },
  methods: {},
  created: function () {
     checkPagePermission(commonConfig.sysBackendContext + '/sys/role/checkRoleListPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=role_code'
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
    //填充app选择框数据
    $.ajax({
      cache: false,
      type: 'GET',
      dataType: 'json',
      url: WEB_ROOT + '/sys/app/getAppListOfUser?timestamp=' + Date.parse(new Date()),
      error: function () {
        alert('请求失败')
      },
      success: function (result) {
        var data = result.data
        var appNames = data.map(function (item) {
          return item.appName
        })
        $appName = $('#appName')
        for (var i = 0; i < data.length; i++) {
          $appName.append('<option value=\'' + data[i].appName + '\'>' + data[i].appName + '</option>')
        }
      },
    })

    // 设置查询项的默认值，在初始化及点击重置按钮时调用
    function setDefaultValue() {
      $('#roleSearchForm #roleName').val('')
      $('#roleSearchForm #roleDesc').val('')
      $('#roleSearchForm #roleCode').val('')
      $('#roleSearchForm #orgName').val('')
      $('#roleSearchForm #appName').val('')
    }

    setDefaultValue()

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#roleSearchBtn')
    var $resetBtn = $('#roleResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
    //绑定回车事件为搜索
    $(document).keydown(function (event) {
      if (event.keyCode == 13) {
        $('#roleSearchBtn').click()
      }
    })

    // 新增按钮
    var $addBtns = $('.addRoleBtn')
    $.each($addBtns, function (i, btn) {
      $(btn).click(function () {
        // 获取公共属性
        var toolBarData = $($(btn).parent()[0]).data()
        // 设置回调参数
        var args = {
          cancel: false,
          params: '',
        }
        // 调用回调
        var et = $(btn).data('eventTrigger')
        if (typeof et !== 'undefined' && et !== '') {
          window[et](args)
          if (args.cancel) {
            return
          }
        }
        var paths = location.pathname.split('/')
        paths.pop()
        paths.push('role')
        var formUrl = paths.join('/') + 'Form.html?editType=add';
        if (args.params !== '') {// 设置回调参数
          formUrl += '&' + args.params
        }
        openDialog('新增' + toolBarData.functionNameSimple,
            formUrl, {
              width: '800px',
              height: '500px',
              callback: function (result) {
                $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('refresh')
              },
            })
      })
    })
  }
})


// 刷新表格公共方法
function refreshTable() {
  var data_url = WEB_ROOT + '/sys/role/getRoleList?'
  $('#roleTable').bootstrapTable('refresh',
      {
        url: data_url + $('#roleSearchForm').serialize(),
      })
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingRole (args) {
  return args
}

// 删除前触发
function deletingRole (args) {
  if (!$.isEmptyObject(args.selections)) {
    var ids = ''
    for (var i = 0; i < args.selections.length; i++) {
      if (!$.isEmptyObject(args.selections[i].id)) {
        ids += args.selections[i].id + ','
      }
    }
    ids = ids.substr(0, ids.length - 1)
    if (!$.isEmptyObject(ids)) {
      args.params = 'ids=' + ids
    }
  }
  return args
}

// 修改前触发
function editingRole (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 查看前触发
function viewingRole (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 导出前触发
function exportingRole (args) {
  var $th = $('#roleTable thead').children().children()
  var headers = []
  $.each($th, function (i, item) {
    // 获取所有列信息
    if (!$(item).hasClass('bs-checkbox')) {
      headers.push({
        field: $(item).data('field'),// 列名称
        text: item.innerText, // 列注释
        colSpan: item.colSpan, // 列宽度
        rowSpan: item.rowSpan, // 列高度
        dictData: $(item).data('dictData'), // 列码表
      })
    }
  })
  args.params = {
    queryParams: $('#roleSearchForm').serialize(),
    headers: headers,
  }
  return args
}

// 主表按钮点击前置回调结束

function viewFormatter (value, row, index) {
  return '<a href=\'#\' class=\'view\'>' + value + '</a>'
}

/**
 * 定义全局方法，新增操作一列
 *
 * 如果是超级系统管理员角色，则不能删除和编辑资源
 *
 * @param value
 *            枚举值
 * @param row
 *            当前行数据
 * @param index
 *            当前行索引
 */
function operateFormatter (value, row, index) {
  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'tooltip-toggle edit btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var editUser = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'分配用户\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-primary btn-xs editUser\' >'
    + '<i class=\'fa fa-user-circle-o fa-fw\'></i></button></div>'
  if (row.roleCode == '11') {
    return editTable + editUser
  } else {
    var deleteTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-danger btn-xs remove\' >'
      + '<i class=\'fa fa-trash fa-fw\'></i></button>'
    var editRes = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'编辑资源\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-primary btn-xs editRes\' >'
      + '<i class=\'fa fa-diamond fa-fw\'></i></button>'
    return editTable + deleteTable + editRes + editUser
  }
}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    //var formUrl = window.location.pathname + '/roleForm.html?editType=edit&id=' + row.id
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('role')
    var formUrl = paths.join('/') + 'Form.html?editType=edit&id=' + row.id;
    openDialog('修改角色', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        $('#roleTable').bootstrapTable('refresh')
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据后不可恢复，确定要继续吗？', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
        var formUrl = WEB_ROOT + '/sys/role/delete?editType=edit&id=' + row.id;
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#roleTable').bootstrapTable('refresh')
          } else {
            toastr.error(result.message || '删除记录失败！')
          }
        },
      })
      layer.close(index)
    })
  },
  'click .editRes': function (e, value, row, index) {
    editRes(row)
  },
  'click .editUser': function (e, value, row, index) {
    editUser(row)
  },
  'click .view': function (e, value, row, index) {
    //var formUrl = window.location.pathname + '/roleForm.html?editType=view&id=' + row.id
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('role')
    var formUrl = paths.join('/') + 'Form.html?editType=view&id=' + row.id;
    openDialogView('角色详情', formUrl, {
      width: '800px',
      height: '500px',
    })
  },
  'mouseenter .tooltip-toggle': function (e, value, row, index) {
    $(this).tooltip('show')
  },
}

function editRes (row) {
  var id = row.id
  var orgId = row.orgId
  var appId = row.appId
  var config = { height: '500px', width: '250px' }
  var checkedIds = []
  $.ajax({
    async: false,
    type: 'GET',
    dataType: 'json',
    url: WEB_ROOT + '/sys/roleRes/getRoleResList?roleId=' + id + '&timestamp=' + Date.parse(new Date()),
    error: function () {
      alert('请求失败')
    },
    success: function (result) {
      checkedIds = result.rows.map(function (item) {
        return item.resId
      })
    },
  })
  //multiTreeSelect接口的url参数有多个，则需要用encodeURIComponent()编码
  var paramUrl = encodeURIComponent( WEB_ROOT + '/sys/role/getResTreeListOfRoleResAssign?roleId=' + id)
  var url = '/common-assets/pages/multiTreeSelect.html?url=' + paramUrl + "&checkedIds=" + checkedIds;

  top.layer.open({
    type: 2,
    area: [config.width, config.height],
    title: '编辑资源',
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    yes: function (index, layero) {
      var tree = layero.find('iframe')[0].contentWindow.tree
      var checkedIdsOfLeaf = []
      tree.getCheckedNodes().forEach(function (node) {
        //if (!(node.id === '0' || node.pId === '0')) {
        if (!(node.id === '0')) {
          checkedIdsOfLeaf.push(node.id)
        }
      })
      // 保存数据
      $.ajax({
        async: false,
        type: 'POST',
        url: WEB_ROOT + '/sys/role/save',
        data: JSON.stringify({
          id: id,
          resIds: checkedIdsOfLeaf,
          appId: appId,
        }),
        contentType: 'application/json',
        error: function () {
          alert('请求失败')
        },
        success: function (result) {
          if (result.type === 'success') {
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

function editUser (row) {
  var id = row.id
  var orgId = row.orgId
  var appId = row.appId
  var config = { height: '500px', width: '250px' }
  var checkedIds = []
  $.ajax({
    async: false,
    type: 'GET',
    dataType: 'json',
    url:  WEB_ROOT + '/sys/roleUser/getRoleUserList?roleId=' + id + '&timestamp=' + Date.parse(new Date()),
    error: function () {
      alert('请求失败')
    },
    success: function (result) {
      checkedIds = result.rows.map(function (item) {
        return item.userId
      })
    },
  })
  var paths = location.pathname.split('/')
  paths.pop()
  var url = paths.join('/') + '/lazyMultiUserTree.html?appId=' + appId + '&roleId=' + id
  var config = { height: '500px', width: '250px' }
  top.layer.open({
    type: 2,
    area: [config.width, config.height],
    title: '分配用户',
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    yes: function (index, layero) {
      var tree = layero.find('iframe')[0].contentWindow.tree
      var checkedIdsOfLeaf = layero.find('iframe')[0].contentWindow.arr_checkedIds
      var str_checkedIdsOfLeaf = ''
      for (var i = 0; i < checkedIdsOfLeaf.length; i++) {
        str_checkedIdsOfLeaf += checkedIdsOfLeaf[i] + ','
      }
      str_checkedIdsOfLeaf = str_checkedIdsOfLeaf.substring(0, str_checkedIdsOfLeaf.length - 1)
      // 保存数据
      $.ajax({
        async: false,
        type: 'POST',
        url:  WEB_ROOT + '/sys/role/save',
        data: JSON.stringify({
            id: id,
            userIds: checkedIdsOfLeaf,
            appId: appId,
        }),
        contentType: 'application/json',
        error: function () {
          alert('请求失败')
        },
        success: function (result) {
          if (result.type == 'success') {
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
	

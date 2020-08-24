var pageDictMap = {}
var fieldDictTypeMap = {
  'userStatus': 'user_status',
  'sex': 'sex_type',
  'userType': 'user_type',
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
      backendContext: '',
      settings: {
        view: {
          removeHoverDom: removeHoverDom,
          selectedMulti: false,
          fontCss: setFontCss,
        },
        data: {
          simpleData: {
            enable: true,
          },
        },
        callback: {
          beforeDrag: beforeNodeDrag,// 节点拖拽事件
          onClick: onNodeClick,
        },
      },
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
  methods: {},
  created: function () {
    var vm = this
    vm.backendContext = commonConfig.sysServiceConfig.gatewayRoute + commonConfig.sysServiceConfig.adminPath
    checkPagePermission(vm.backendContext + '/sys/user/checkUserListPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var dictUrl = vm.backendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,user_status,user_type,sex_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
      $.get('/api' + vm.backendContext + '/sys/org/getOrgTree?pId='
        + (LOGIN_USER === 'admin' ? '0' : corpId), function (result) {
        $.fn.zTree.init($('#orgTree'), vm.settings, result)
        var treeObj = $.fn.zTree.getZTreeObj('orgTree')
        // 获取根节点并且选中触发点击事件
        var nodes = treeObj.getNodes()
        if (nodes.length > 0) {
          treeObj.selectNode(nodes[0])
          treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0])// 调用事件
        } else {
          toastr.error('树加载失败或数据不存在', '树加载提醒')
        }
      })
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    // 设置树所在ibox的高度
    // $("#orgTreeIbox").css('min-height',$("#userFormIbox").css('height'));
    // $(".ibox-content:first").css('min-height',$("div.ibox-content:last").css('height'));
    // alert($("div.ibox-content:last").css('height'));
    // ztree

    var lastSearchNodes = []

    // 设置查询项的默认值，在初始化及点击重置按钮时调用
    function setDefaultValue () {
      $('#userSearchForm #userAccount').val('')
      $('#userSearchForm #userName').val('')
      $('#userSearchForm #orgId').val('')
      $('#userSearchForm #empNo').val('')
      $('#userSearchForm #userStatus').val('')
    }

    // 刷新表格公共方法
    setDefaultValue()

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#userSearchBtn')
    var $resetBtn = $('#userResetBtn')
    var $forbiddenBtn = $('#forbiddenBtn')
    var $normalizeBtn = $('#normalizeBtn')
    var $resetPwdBtn = $('#resetPwdBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
    $forbiddenBtn.click(forbiddenTable)
    $normalizeBtn.click(normalizeTable)
    $resetPwdBtn.click(resetUserPwd)

    $('#orgSearchBtn').click(function () {
      var tree = $.fn.zTree.getZTreeObj('orgTree')
      var value = $('#orgSearchName').val()
      if ($.isEmptyObject(value)) { return }
      var nodes = tree.getNodesByParamFuzzy('name', value)
      if (lastSearchNodes !== null && lastSearchNodes.length > 0) {
        for (var i = 0; i < lastSearchNodes.length; i++) {
          var node = lastSearchNodes[i]
          node.highlight = false
          tree.updateNode(node)
        }
      }
      lastSearchNodes = nodes
      if (nodes !== null && nodes.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i]
          node.highlight = true
          tree.updateNode(node)
          tree.expandNode(node.getParentNode(), true)
          if (node.isParent) {
            tree.expandNode(node, true)
          }

        }
      }
    })
    $(window).bind('load resize scroll', function () {
      fix_height()
    })
    $('#userTable').on('post-body.bs.table', function () {
      $(this).find('.dropdown-toggle').off('click').dropdown()
    })
  },
})

// 节点点击事件
function onNodeClick (event, treeId, treeNode, clickFlag) {
  refreshTable()
}

function setFontCss (treeId, treeNode) {
  return (!!treeNode.highlight) ? {
    color: '#A60000',
    'font-weight': 'bold',
  } : {
    color: '#333',
    'font-weight': 'normal',
  }
}

// 用户禁止拖动节点
function beforeNodeDrag () {
  return false
}

function removeHoverDom (treeId, treeNode) {
  $('#addBtn_' + treeNode.tId).unbind().remove()
}

function refreshTable () {
  var data_url = '/api' + userListContentVm.backendContext + '/sys/user/getUserList?'
  var tree = $.fn.zTree.getZTreeObj('orgTree')
  if (tree != null) {
    var selNodes = tree.getSelectedNodes()
    if (selNodes.length > 0) {
      // $("#userSearchForm #orgId
      // option:checked").attr("value",tree.getSelectedNodes()[0].id);
      $('#userSearchForm #orgId option:checked').prop('text',
        tree.getSelectedNodes()[0].name)
      data_url += 'orgId=' + tree.getSelectedNodes()[0].id + '&'
    }
  }

  $('#userTable').bootstrapTable('refresh', {
    url: data_url + $('#userSearchForm').serialize(),
  })
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingUser (args) {
  var treeObj = $.fn.zTree.getZTreeObj('orgTree')
  if (!$.isEmptyObject(treeObj.getSelectedNodes())
    && treeObj.getSelectedNodes().length === 1) {
    args.params = 'orgId=' + treeObj.getSelectedNodes()[0].id
  }
  return args
}

// 删除前触发
function deletingUser (args) {
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
function editingUser (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length === 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 查看前触发
function viewingUser (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length === 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 导出前触发
function exportingUser (args) {
  var $th = $('#userTable thead').children().children()
  var headers = []
  $.each($th, function (i, item) {
    // 获取所有列信息
    if (!$(item).hasClass('bs-checkbox')) {
      headers.push({
        field: $(item).data('field'),// 列名称
        text: item.innerText, // 列注释
        colSpan: item.colSpan, // 列宽度
        rowSpan: item.rowSpan, // 列高度
        dictData: $(item).data('dictData'),
        // 列码表
      })
    }
  })
  args.params = {
    queryParams: $('#userSearchForm').serialize(),
    headers: headers,
  }
  return args
}

/*
 * function viewFormatter(value, row, index) { return "<a href=\#\"
 * onclick=\"viewDetail('" + row.id + "')\">" + value + "</a>"; }
 */
function viewFormatter (value, row, index) {
  return '<a href=\'#\' class=\'view\'>' + value + '</a>'
}

window.viewEvents = {
  'click .view': function (e, value, row, index) {
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('user')
    var formUrl = paths.join('/') + 'Form.html?editType=view&id=' + row.id
    openDialogView('查看账户', formUrl, {
      width: '800px',
      height: '500px',
    })
  },
}

/**
 * 定义全局方法，新增操作一列
 *
 * @param value
 *          枚举值
 * @param row
 *          当前行数据
 * @param index
 *          当前行索引
 */

/*
 * var editTable = "<div style='position:relative;' class='btn-group-xs'><button
 * title='修改' class='edit btn btn-primary btn-xs'>" + "<i class='fa fa-edit
 * fa-fw'></i></button>"; var deleteTable = "<button title='删除' class='btn
 * btn-danger btn-xs remove' >" + "<i class='fa fa-trash fa-fw'></i></button>";
 * var roleAssignTable = "<button title='角色分配' class='btn btn-primary btn-xs
 * roleAssign' >" + "<i class='fa fa-group fa-fw'></i></button></div>"; }
 */
function operateFormatter (value, row, index) {
  var drop = '<div class=\'btn-group-xs\'><button type=\'button\' id=\'specialbtn\' class=\'specialbtn btn btn-primary btn-xs tbl-menu\' data-toggle=\'dropdown\'>'
    + '<i class=\'fa fa-cog\'></i> <span class=\'fa fa-chevron-down\'></span></button>'
    + '<ul class=\'dropdownlist dropdown-menu pull-right\' role=\'menu\'> '
    +
    '<li><a class=\'edit\'><i class=\'fa fa-edit fa-fw\'></i>修改</a></li><li><a class=\'remove\'><i class=\'fa fa-trash fa-fw\'></i>删除</a></li> '
    + '<li><a class=\'roleAssign\'><i class=\'fa fa-group fa-fw\'></i>角色分配</a></li></ul></div>'
  return drop
}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('user')
    var formUrl = paths.join('/') + 'Form.html?editType=edit&id=' + row.id
    openDialog('修改账户', formUrl, {
      width: '800px',
      height: '520px',
      callback: function () {
        $('#userTable').bootstrapTable('refresh')
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据后不可恢复，确定要继续吗？', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      var formUrl = '/api' + userListContentVm.backendContext + '/sys/user/delete?type=del&id=' + row.id +
        '&userAccount=' + row.userAccount
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#userTable').bootstrapTable('refresh')
          } else {
            toastr.error(result.message || '删除记录失败！')
          }
        },
      })
      layer.close(index)
    })
  },
  'click .roleAssign': function (e, value, row, index) {
    var paths = location.pathname.split('/')
    paths.pop()
    var formUrl = paths.join('/') + '/userAssignRole.html?userId=' + row.id + '&orgId=' + row.orgId
    openDialog('角色分配', formUrl, {
      width: '800px',
      height: '550px',
      callback: function () {
        $('#userTable').bootstrapTable('refresh')
      },
    })
  },
  'click .tbl-menu': function (e, value, row, index) {
    e.preventDefault()
  },
  'click .specialbtn': function (e, value, row, index) {
    var vtop = $(this).parent().position().top + $(this).parent().height()
    var vright = $(this).parent().width() - $(this).width() - 4
    $('.dropdownlist').css('top', +vtop + 'px')
    $('.dropdownlist').css('right', +vright + 'px')
  },
}

function forbiddenTable () {
  var selectId = $('#userTable').bootstrapTable('getSelections')
  if (selectId.length == 0) {
    toastr.error('请至少选择一行数据')
    return
  }
  if (selectId.length > 1) {
    toastr.error('请至多选择一行数据')
    return
  }
  if (selectId[0].userStatus == '3') {
    toastr.error('禁用用户不能重复操作')
    return
  }

  layer.confirm('禁用后该用户不能正常使用，确定要继续吗？', {
    icon: 3,
    title: '禁用提醒',
  }, function (index) {
    var formUrl = '/api' + userListContentVm.backendContext + '/sys/user/operator?type=operator&opType=forbidden&id=' +
      selectId[0].id
    $.ajax(formUrl, {
      success: function (result) {
        if (result.type === 'success') {
          toastr.success('禁用成功!')
          $('#userTable').bootstrapTable('refresh')
        } else {
          toastr.error(result.message || '禁用失败！')
        }
      },
    })
    layer.close(index)
  })

}

function normalizeTable () {
  var selectId = $('#userTable').bootstrapTable('getSelections')
  if (selectId.length == 0) {
    toastr.error('请至少选择一行数据！')
    return
  }
  if (selectId.length > 1) {
    toastr.error('请至多选择一行数据！')
    return
  }
  if (selectId[0].userStatus == '1') {
    toastr.error('正常用户的账号不需要该操作！')
    return
  }

  layer.confirm('恢复正常后该用户可以正常使用，确定要继续吗？', {
    icon: 3,
    title: '恢复成功提醒',
  }, function (index) {
    var formUrl = '/api' + userListContentVm.backendContext + '/sys/user/operator?type=operator&opType=normalize&id=' +
      selectId[0].id + '&userAccount=' + selectId[0].userAccount
    $.ajax(formUrl, {
      success: function (result) {
        if (result.type === 'success') {
          toastr.success('恢复正常成功!')
          $('#userTable').bootstrapTable('refresh')
        } else {
          toastr.error(result.message || '恢复正常失败！')
        }
      },
    })
    layer.close(index)
  })
}

function resetUserPwd () {
  var selections = $('#userTable').bootstrapTable('getSelections')
  if (selections.length == 0) {
    toastr.error('请至少选择一行数据！')
    return
  }

  layer.confirm('重置后用户的密码将修改为系统账号默认密码，确定要继续吗？', {
    icon: 3,
    title: '密码重置提醒',
  }, function (index) {
    var ids = ''
    for (var i = 0; i < selections.length; i++) {
      if (!$.isEmptyObject(selections[i].id)) {
        ids += selections[i].id + ','
      }
    }
    ids = ids.substr(0, ids.length - 1)
    var formUrl = '/api' + userListContentVm.backendContext + '/sys/user/resetPwd?ids=' + ids
    $.ajax(formUrl, {
      success: function (result) {
        if (result.type === 'success') {
          toastr.success('密码重置成功!')
          $('#userTable').bootstrapTable('refresh')
        } else {
          toastr.error(result.message || '密码重置失败！')
        }
      },
    })
    layer.close(index)
  })
}

// 子系统添加管理员确认自定义js
function doSubmit (callback) {
  var url = location.search // 获取url中"?"符后的字串
  var theRequest = new Object()
  if (url.indexOf('?') != -1) {
    var str = url.substr(1)
    strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1])
    }
  }
  var appId = theRequest.appId

  var selections = $('#userTable').bootstrapTable('getSelections')// 子页面
  var params
  if (selections.length == 0) {
    toastr.warning('请选择用户进行添加!')
  } else {
    if (!$.isEmptyObject(selections)) {
      var ids = ''
      for (var i = 0; i < selections.length; i++) {
        if (!$.isEmptyObject(selections[i].id)) {
          ids += selections[i].id + ','
        }
      }
      ids = ids.substr(0, ids.length - 1)
      if (!$.isEmptyObject(ids)) {
        params = ids
      }

      var idx = layer.load(1, {
        shade: [0.4, '#FFF'],
      })

      $.ajax({
        data: {
          'appId': appId,
          'params': params,
        },
        type: 'post',
        dataType: 'json',
        url: WEB_ROOT + '/sys/userApp/save',
        success: function (data) {
          layer.close(idx)
          if (data.type == 'success') {
            callback(data)
          } else {
            toastr.error(data.message)
          }
        },
        error: function () {
          layer.close(idx)
          toastr.error('服务器内部错误,请稍后重试!')
        },
      })

    }
  }
}

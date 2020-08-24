var settings = {
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
}

// 组织树初始化
function initTree () {
  $.get(WEB_ROOT + '/sys/org/getOrgTree?pId=' + (LOGIN_USER == admin ? '0' : corpId),
    function (result) {
      if (LOGIN_USER == admin)
        result.push({
          id: '0',
          pId: '0',
          name: '组织管理',
          orgType: '0',
          parentIds: '0',
        })
      $.fn.zTree.init($('#orgTree'), settings, result)
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
}

// 组织树刷新
function initTreeRefresh (selectedNode) {
  $.get(WEB_ROOT + '/sys/org/getOrgTree?pId=' + (LOGIN_USER == admin ? '0' : corpId),
    function (result) {
      if (LOGIN_USER == admin)
        result.push({
          id: '0',
          pId: '0',
          name: '组织管理',
          orgType: '0',
          parentIds: '0',
        })
      $.fn.zTree.init($('#orgTree'), settings, result)
      var treeObj = $.fn.zTree.getZTreeObj('orgTree')
      // 获取根节点并且选中触发点击事件
      var nodes = treeObj.getNodes()

      if (nodes.length > 0) {
        treeObj.selectNode(selectedNode)
        treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0])// 调用事件
      } else {
        toastr.error('树加载失败或数据不存在', '树加载提醒')
      }
    })
}

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

// 刷新Table
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/org/getOrgList?'
  var tree = $.fn.zTree.getZTreeObj('orgTree')
  if (tree != null) {
    var selNodes = tree.getSelectedNodes()
    if (selNodes.length > 0) {
      data_url += 'id=' + tree.getSelectedNodes()[0].id + '&'
    }
  }
  $('#orgTable').bootstrapTable('refresh', {
    url: data_url + $('#orgSearchForm').serialize(),
  })
}

// 获取选中节点的父级节点到根节点 （对于过滤树不适用）
/*
 * function getParentPath(treeObj){ if(treeObj==null) return ""; var parentIds =
 * treeObj.id; var pNode = treeObj.getParentNode(); if(pNode!=null){ parentIds =
 * getParentPath(pNode) +","+ parentIds; } return parentIds; }
 */

// 主表按钮点击前置回调开始
// 新增前触发
/*
 * function addingOrg(args) { var treeObj = $.fn.zTree.getZTreeObj("orgTree");
 * if(!$.isEmptyObject(treeObj.getSelectedNodes()) &&
 * treeObj.getSelectedNodes().length == 1){ var nodes =
 * treeObj.getSelectedNodes(); var parentIds=getParentPath(nodes[0]);
 * args.params = "parentIds=" + "0,"+parentIds; args.params += "&parentId=" +
 * treeObj.getSelectedNodes()[0].id; } return args; }
 */

// 在树上新增组织单元
function addOrg () {
  var treeObj = $.fn.zTree.getZTreeObj('orgTree')
  if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
    var nodes = treeObj.getSelectedNodes()
    var id = treeObj.getSelectedNodes()[0].id
    var parentIds = treeObj.getSelectedNodes()[0].parentIds + ',' + id
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('org')
    var formUrl = paths.join('/') + 'Form.html?editType=add&parentId=' + id + '&parentIds='
      + parentIds
    openDialog('新增组织单元', formUrl,
      {
        width: '800px',
        height: '248px',
        callback: function () {
          $('#orgTable').bootstrapTable('refresh')
          // initTree();
          var treeObj = $.fn.zTree.getZTreeObj('orgTree')
          if (!$.isEmptyObject(treeObj.getSelectedNodes())
            && treeObj.getSelectedNodes().length == 1) {
            var nodes = treeObj.getSelectedNodes()
            initTreeRefresh(nodes[0])
          }
        },
      })
  }
}

// 删除前触发
function deletingOrg (args) {
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
function editingOrg (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 查看前触发
function viewingOrg (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 导出前触发
function exportingOrg (args) {
  var $th = $('#orgTable thead').children().children()
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
    queryParams: $('#orgSearchForm').serialize(),
    headers: headers,
  }
  return args
}

// 主表按钮点击前置回调结束

function viewFormatter (value, row, index) {
  return '<a href=\'#\' class=\'view\'>' + value + '</a>'
}

window.viewEvents = {
  'click .view': function (e, value, row, index) {
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('org')
    var formUrl = paths.join('/') + 'Form.html?editType=view&id=' + row.id
    openDialogView('查看组织单元', formUrl, {
      width: '800px',
      height: '248px',
    })
  },
}

function operateFormatter (value, row, index) {
  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'tooltip-toggle edit btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var deleteTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button>'
  var addTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'新增下级\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-primary btn-xs add\' >'
    + '<i class=\'fa fa-plus fa-fw\'></i></button></div> '
  return editTable + deleteTable + addTable

}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('org')
    var formUrl = paths.join('/') + 'Form.html?editType=edit&id=' + row.id
    openDialog('修改组织单元', formUrl,
      {
        width: '800px',
        height: '248px',
        callback: function () {
          $('#orgTable').bootstrapTable('refresh')

          var treeObj = $.fn.zTree.getZTreeObj('orgTree')
          if (!$.isEmptyObject(treeObj.getSelectedNodes())
            && treeObj.getSelectedNodes().length == 1) {
            var nodes = treeObj.getSelectedNodes()
            initTreeRefresh(nodes[0])
          }
        },
      })
  },
  'click .remove': function (e, value, row, index) {
    direwolfCommonConfirm('删除数据后不可恢复，确定要继续吗？', '删除提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }, function () {
      var formUrl = WEB_ROOT + '/sys/org/delete?type=del&id=' + row.id
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {

            var treeObj = $.fn.zTree.getZTreeObj('orgTree')
            if (!$.isEmptyObject(treeObj.getSelectedNodes())
              && treeObj.getSelectedNodes().length == 1) {
              var nodes = treeObj.getSelectedNodes()
              // 顶层节点

              // 父节点
              var nodesP = nodes[0].getParentNode()
              // 判断选中节点是否为顶层节点
              if ($.isEmptyObject(nodesP) && (nodes[0].id == '0')) {
                initTreeRefresh(nodes[0])
              } else {
                // 兄弟节点
                var nodesB = nodes[0].getParentNode().children
                if (!$.isEmptyObject(nodesB) && (nodes[0].id != nodesB[0].id)) {
                  initTreeRefresh(nodesB[0])
                } else {
                  initTreeRefresh(nodesP)
                }
              }
            }
            $('#orgTable').bootstrapTable('refresh')
            toastr.success(result.message || '删除记录成功!')

          } else {
            toastr.error(result.message || '删除记录失败！')
          }
        },
      })
      layer.close(index)
    })
  },

  'click .add': function (e, value, row, index) {
    var paths = location.pathname.split('/')
    paths.pop()
    paths.push('org')
    var parentIds = row.parentIds + ',' + row.id
    var idO = row.id
    var formUrl = paths.join('/') + 'Form.html?editType=add&parentId=' + idO + '&parentIds='
      + parentIds
    openDialog('新增下级组织单元', formUrl,
      {
        width: '800px',
        height: '248px',
        callback: function () {
          $('#orgTable').bootstrapTable('refresh')
          var treeObj = $.fn.zTree.getZTreeObj('orgTree')
          if (!$.isEmptyObject(treeObj.getSelectedNodes())
            && treeObj.getSelectedNodes().length == 1) {
            var nodes = treeObj.getSelectedNodes()
            initTreeRefresh(nodes[0])
          }
        },
      })
  },
  'mouseenter .tooltip-toggle': function (e, value, row, index) {
    $(this).tooltip('show')
  },
}

var pageDictMap = {}
var fieldDictTypeMap = {
  'orgClass': 'org_class',
  'orgType': 'org_type',
  'userType': 'user_type',
  'enTimeLimit': 'y_n',
}
var orgListContentVm = new Vue({
  el: '#orgListContent',
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
     * 组织单元分类
     */
    orgTypeDict: function () {
      return this.pageDictMap['org_type']
    },
    /**
     * 组织单元类型
     */
    orgClassDict: function () {
      return this.pageDictMap['org_class']
    },
  },
  methods: {},
  created: function () {
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=org_class,org_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false

      initTree()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    var lastSearchNodes = []
    // initTree();

    // 设置查询项的默认值，在初始化及点击重置按钮时调用
    function setDefaultValue () {
      $('#orgSearchForm #orgName').val('')
      $('#orgSearchForm #orgCode').val('')
      $('#orgSearchForm #orgType').val('')
      $('#orgSearchForm #parentId').val('')
      $('#orgSearchForm #compCode').val('')
      $('#orgSearchForm #orgClass').val('')
    }

    setDefaultValue()
    /* refreshTable(); */

    $('div#toggleSeachFormBar').mouseover(function () {
      $('div#toggleSeachFormBar').css('background-color', '#ccc')
    }).mouseout(function () {
      $('div#toggleSeachFormBar').css('background-color', '#fff')
    })
    $('div#toggleSeachFormBar').click(function (event) {
      $('.hiddenQueryRow').toggleClass('hidden')
      $('div#toggleSeachFormBar').toggleClass('fa-angle-down')
      $('div#toggleSeachFormBar').toggleClass('fa-angle-up')
    })

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#orgSearchBtn')
    var $resetBtn = $('#orgResetBtn')
    var $addOrgBtn = $('#addOrgBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
    $addOrgBtn.click(function () {
      addOrg()
    })

    $('#orgTreeSearchBtn').click(function () {
      var tree = $.fn.zTree.getZTreeObj('orgTree')
      var value = $('#orgSearchName').val()
      if ($.isEmptyObject(value)) {
        return
      }
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
  },
})

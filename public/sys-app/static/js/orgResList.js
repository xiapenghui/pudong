/*
 * 节点点击事件
 */
function onNodeClick (event, treeId, treeNode, clickFlag) {
  refreshResTree()
}

/*
 * 刷新资源树
 */
function refreshResTree () {
  var orgId = ''
  var treeObj = $.fn.zTree.getZTreeObj('orgTree')
  if (!$.isEmptyObject(treeObj.getSelectedNodes())
    && treeObj.getSelectedNodes().length === 1) {
    orgId = treeObj.getSelectedNodes()[0].id
  }
  resource.orgId = orgId
  resource.resTree.updateTree().expandAll(true)
}

// 用户禁止拖动节点
function beforeNodeDrag () {
  return false
}

function removeHoverDom (treeId, treeNode) {
  $('#addBtn_' + treeNode.tId).unbind().remove()
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

/*
 * 编辑资源
 */
function editRes () {
  var orgId = ''
  var pId = ''
  var treeObj = $.fn.zTree.getZTreeObj('orgTree')
  if (!$.isEmptyObject(treeObj.getSelectedNodes())
    && treeObj.getSelectedNodes().length === 1) {
    orgId = treeObj.getSelectedNodes()[0].id
    pId = treeObj.getSelectedNodes()[0].pId
  }

  var config = {
    height: '500px',
    width: '250px',
  }
  var checkedIds = []
  $.ajax({
    async: false,
    type: 'GET',
    dataType: 'json',
    url: WEB_ROOT + '/sys/orgRes/getOrgResList?orgId=' + orgId + '&appId='
      + resource.appId + '&t=' + new Date().getTime(),
    error: function () {
      alert('请求失败')
    },
    success: function (result) {
      checkedIds = result.rows.map(function (item) {
        return item.id
      })
    },
  })

  var url = '/common-assets/pages/multiTreeSelect.html?checkedIds='
    + checkedIds
    + '&url='
    + encodeURIComponent(WEB_ROOT + '/sys/orgRes/getOrgResTreeList?appId=' + resource.appId
      + '&orgId=' + orgId)

  top.layer.open({
    type: 2,
    area: [config.width, config.height],
    title: '编辑资源',
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    yes: function (index, layero) {
      var tree = layero.find('iframe')[0].contentWindow.tree
      var checkedNode = tree.getCheckedNodes()
      var checkedIdsOfLeaf = []

      var checkedLength = checkedNode.length
      for (var i = 0; i < checkedLength; i++) {
        // var halfChecked = node.getCheckStatus().half; // 该节点是否是半选状态
        // if(!halfChecked)
        var node = checkedNode[i]
        if (node.id != '0' && node.id != '1')
          checkedIdsOfLeaf.push(node.id)
      }

      var str_checkedIdsOfLeaf = ''
      for (var i = 0; i < checkedIdsOfLeaf.length; i++) {
        str_checkedIdsOfLeaf += checkedIdsOfLeaf[i] + ','
      }
      str_checkedIdsOfLeaf = str_checkedIdsOfLeaf.substring(0,
        str_checkedIdsOfLeaf.length - 1)
      // 保存数据
      $.ajax({
        async: false,
        type: 'post',
        url: WEB_ROOT + '/sys/orgRes/save',
        data: JSON.stringify({
          'orgId': orgId,
          'resIds': checkedIdsOfLeaf,
          'appId': resource.appId,
        }),
        contentType: 'application/json',
        error: function () {
          alert('请求失败')
        },
        success: function (result) {
          if (result.type === 'success') {
            direwolfCommonTips('success', result.message)
          } else {
            direwolfCommonTips('error', result.message)
          }
        },
      })
      setTimeout(function () {
        top.layer.close(index)
      }, 100)
      refreshResTree()
    },
    cancel: function (index) {
      setTimeout(function () {
        top.layer.close(index)
      }, 100)
    },
  })
}

function beforeRemove (treeId, treeNode) {
  // 不能删除菜单和接口俩个资源
  var result = false
  if (treeNode.id == '0' || treeNode.id == '1') {
    direwolfCommonTips('error', '不允许删除菜单管理或者接口管理')
    return false
  }
  /*
   * var treeObj = $.fn.zTree.getZTreeObj("resTree");
   * treeObj.selectNode(treeNode); var nodes = treeObj.getSelectedNodes();
   */

  var msg = '确认要删除该节点吗。\n\n请确认！'
  // if (nodes[0].children && nodes[0].children.length > 0) {
  if (treeNode.children && treeNode.children.length > 0) {
    msg = '要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！'
    top.layer.confirm(msg, {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      top.layer.close(index)
      removeNode(treeNode)
    })
  } else {
    top.layer.confirm(msg, {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      top.layer.close(index)
      removeNode(treeNode)
    })
  }

  return false
}

/*
 * 删除节点和数据
 */
function removeNode (treeNode) {
  var treeObj = $.fn.zTree.getZTreeObj('resTree')
  // 删除节点
  treeObj.removeNode(treeNode)

  // 删除数据
  $.ajax({
    async: false,
    type: 'POST',
    dataType: 'json',
    url: WEB_ROOT + '/sys/orgRes/deleteAll?editType=del&orgId='
      + resource.orgId + '&resId=' + treeNode.id + '&t='
      + new Date().getTime(),
    error: function () {
      direwolfCommonTips('error', result.message)
    },
    success: function (result) {
      direwolfCommonTips('success', result.message)
    },
  })
  refreshResTree()
}

var corpId = JSON.parse(sessionStorage.getItem('userInfo')).orgId
var LOGIN_USER = JSON.parse(sessionStorage.getItem('userInfo')).userAccount
var orgResContentVm = new Vue({
  el: '#orgResContent',
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
  },
  mounted: function () {
    // 单元树属性设置
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
    $.get(WEB_ROOT + '/sys/org/getOrgTree?pId='
      + (LOGIN_USER === admin ? '0' : corpId) + '&type=0', function (
      result) {
      $.fn.zTree.init($('#orgTree'), settings, result)
      var treeObj = $.fn.zTree.getZTreeObj('orgTree')
      // 获取根节点并且选中触发点击事件
      var nodes = treeObj.getNodes()
      if (nodes.length > 0) {
        treeObj.selectNode(nodes[0])
        treeObj.setting.callback.onClick(null, treeObj.setting.treeId,
          nodes[0])// 调用事件
      } else {
        toastr.error('树加载失败或数据不存在', '树加载提醒')
      }
    })

    // 初始化appId
    $.ajax({
      cache: false,
      type: 'GET',
      dataType: 'json',
      url: WEB_ROOT + '/sys/app/getAppList' + '?t=' + new Date().getTime(),
      error: function () {
        alert('请求失败')
      },
      success: function (result) {
        var data = result.list
        var appIds = data.map(function (item) {
          return item.id
        })
        var appNames = data.map(function (item) {
          return item.appName
        })
        $select_appId = $('#select_appId')
        for (var i = 0; i < data.length; i++) {
          $select_appId.append('<option value=\'' + data[i].id + '\'>'
            + data[i].appName + '</option>')
        }
        $select_appId.val('1')
        $select_appId.change(function () {
          resource.appId = $(this).children('option:selected').val()// 这就是selected的值
          resource.resTree.updateTree()
        })

      },
    })

    // 单元树查询
    var lastSearchNodes = []
    $('#orgSearchBtn').click(function () {
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

    // 资源树对应的对象
    resource = {
      appId: '1', // 默认appId
      orgId: corpId, // orgId默认为corpId
      /** *********************************以下为资源树*********************************** */
      resTree: {
        currentNodeId: '0',
        openNodes: ['0', '1'], // 默认展开顶层节点
        setting: {
          view: {
            dblClickExpand: true,
            showLine: true,
            selectedMulti: false,
            fontCss: function (treeId, treeNode) {
              return (!!treeNode.highlight) ? {
                color: '#A60000',
                'font-weight': 'bold',
              } : {
                color: '#333',
                'font-weight': 'normal',
              }
            },
          },
          edit: {
            enable: true,
            editNameSelectAll: false,
            showRemoveBtn: true,
            showRenameBtn: false,
          },
          data: {
            simpleData: {
              enable: true,
              rootPId: '',
            },
          },
          callback: {
            beforeRemove: beforeRemove,
          },
        },
        updateTree: function () {
          var data = []
          $.ajax({
            async: false,
            cache: false,
            type: 'GET',
            dataType: 'json',
            url: WEB_ROOT + '/sys/orgRes/getOrgResTreeListByOrgId?orgId='
              + resource.orgId + '&appId=' + resource.appId
              + '&t=' + new Date().getTime(),
            error: function () {
              alert('请求失败')
            },
            success: function (result) {
              data = result
            },
          })
          var zNodes = data.map(function (item) {
            return {
              id: item.id,
              pId: item.pId,
              name: item.name,
              isParent: item.isParent,
              // orgResId : item.orgResId,
              open: resource.resTree.openNodes.contains(item.id),
            }
          })
          return $.fn.zTree.init($('#resTree'), resource.resTree.setting,
            zNodes)
        },

      },
    }

    // 初始化资源树
    var resTree = resource.resTree.updateTree()
    resTree.expandAll(true)

    $(window).bind('load resize scroll', function () {
      fix_height()
    })

    // 设置分配资源按钮点击方法
    var $editResBtn = $('#editResBtn')
    $editResBtn.click(editRes)
  },
})

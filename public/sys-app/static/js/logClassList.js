var pageDictMap = {}
var fieldDictTypeMap = {
  'enableType': 'enable_type',
  'enTimeLimit': 'y_n',
}
var logClassListContent = new Vue({
  el: '#logClassListContent',
  data: function () {
    return {
      /**
       * 页面加载状态
       */
      pageLoading: true,
      /**
       * 页面字典列表
       */
      pageDictMap: {},
      backendContext: commonConfig.sysBackendContext
    }
  },
  created: function () {
    //请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,enable_type'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  computed: {
    /**
     * 启用类型字典
     */
    enableTypeDict: function () {
      return this.pageDictMap['enable_type']
    },
  },
  methods: {},
  mounted: function () {
    var lastSearchNodes = []
    initTree()

    // 设置查询项的默认值，在初始化及点击重置按钮时调用
    function setDefaultValue () {
      $('#logClassSearchForm #className').val('')
      $('#logClassSearchForm #classCode').val('')
      $('#logClassSearchForm #enableType').val('')
    }

    setDefaultValue()

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
    var $searchBtn = $('#logClassSearchBtn')
    var $resetBtn = $('#logClassResetBtn')
    var $addLogClassBtn = $('#addLogClassBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
    $addLogClassBtn.click(function () {
      addLogClass()
    })

    $('#logClassTreeSearchBtn').click(function () {
      var tree = $.fn.zTree.getZTreeObj('logClassTree')
      var value = $('#logClassSearchName').val()
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
    // $(window).bind("load resize scroll", function () {
    //     fix_height();
    // });
  },
})

//刷新Table
function refreshTable () {
  // var data_url = window.location.pathname + "/getLogClassList?";
  var data_url = WEB_ROOT + '/sys/logClass/getLogClassList?'
  $('#logClassTable').bootstrapTable('refresh', {
    url: data_url + $('#logClassSearchForm').serialize(),
  })
}

function fix_height () {
  var winheight = $(window).height()
  var fbox = $('.ibox:first')
  var lbox = $('.ibox:last')
  var fheight = fbox.height()
  var lheight = lbox.height()
  var maxh = fheight > lheight ? fheight : lheight
  if (maxh <= winheight || $(window).width() >= (fbox.width() + lbox.width())) {
    $('.ibox').css('min-height', (winheight - 30) + 'px')
    $('.ibox-content').css('min-height', (winheight - 50) + 'px')
  } else {
    $('.ibox').css('min-height', '')
    $('.ibox-content').css('min-height', '')
  }
}

var openNodes = ['0', '1']
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
    /*onExpand: function(event, treeId, treeNode) {
         openNodes.push(treeNode.id);
     },
     onCollapse: function(event, treeId, treeNode) {
         openNodes.remove(treeNode.id);
     },*/
    beforeDrag: beforeNodeDrag,// 节点拖拽事件
    onClick: onNodeClick,
  },
}

//组织树初始化
function initTree () {
  // $.get(window.location.pathname + "/getLogClassTree", function (result) {
  $.get(WEB_ROOT + '/sys/logClass/getLogClassTree', function (result) {
    var zNodes = result.map(function (item) {
      return {
        id: item.id,
        pId: item.pId,
        name: item.name,
        open: openNodes.contains(item.id),
      }
    })
    $.fn.zTree.init($('#logClassTree'), settings, zNodes)
    var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
    //获取根节点并且选中触发点击事件
    var nodes = treeObj.getNodes()
    if (nodes.length > 0) {
      treeObj.selectNode(nodes[0])
      treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0])// 调用事件
    } else {
      toastr.error('树加载失败或数据不存在', '树加载提醒')
    }
  })
}

//树刷新
function initTreeRefresh (selectedNodes) {
  // $.get(window.location.pathname + "/getLogClassTree", function (result) {
  $.get(WEB_ROOT + '/sys/logClass/getLogClassTree', function (result) {
    var zNodes = result.map(function (item) {
      return {
        id: item.id,
        pId: item.pId,
        name: item.name,
        open: openNodes.contains(item.id),
      }
    })
    $.fn.zTree.init($('#logClassTree'), settings, result)
    var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
    //获取根节点并且选中触发点击事件
    var nodes = treeObj.getNodes()

    if (nodes.length > 0) {
      treeObj.selectNode(selectedNodes[0])
      treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0])// 调用事件
    } else {
      toastr.error('树加载失败或数据不存在', '树加载提醒')
    }
  })
}

//节点点击事件
function onNodeClick (event, treeId, treeNode, clickFlag) {
  if (treeNode.id != 'ROOT') {
    $('#classCode').val(treeNode.id)
  } else {
    $('#classCode').val('')
  }
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

// 主表按钮点击前置回调开始
// 新增前触发
function addingLogClass (args) {
  var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
  if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
    var nodes = treeObj.getSelectedNodes()
    var classCode = nodes[0].classCode
    args.params = 'classCode=' + classCode + '.'
  }
  return args
}

//在树上新增日志分类
function addLogClass () {
  var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
  if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
    var nodes = treeObj.getSelectedNodes()
    var id = nodes[0].id
    // var formUrl = window.location.pathname + "/form?editType=add";
    var formUrl = getRelativePath() + 'logClassForm.html?editType=add'
    openDialog('新增日志分类', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        // $('#logClassTable').bootstrapTable('refresh');

        var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
        if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
          var nodes = treeObj.getSelectedNodes()
          initTreeRefresh(nodes)
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

//修改前触发
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

// 主表按钮点击前置回调结束

function viewFormatter (value, row, index) {
  return '<a href=\#" class=\'view\'>' + value + '</a>'
}

window.viewEvents = {
  'click .view': function (e, value, row, index) {
    // var formUrl = window.location.pathname + "/form?editType=view&id=" + row.id;
    var formUrl = getRelativePath() + 'logClassForm.html?editType=view&id=' + row.id
    openDialogView('查看日志分类', formUrl, {
      width: '800px',
      height: '500px',
    })
  },
}

function operateFormatter (value, row, index) {

  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'tooltip-toggle edit btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var deleteTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button>'
  var addTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'新增下级\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-primary btn-xs add\' >'
    + '<i class=\'fa fa-plus fa-fw\'></i></button></div>'
  return editTable + deleteTable + addTable

}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    // var formUrl = window.location.pathname + "/form?editType=edit&id=" + row.id;
    var formUrl = getRelativePath() + 'logClassForm.html?editType=edit&id=' + row.id
    openDialog('修改日志分类', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        // $('#logClassTable').bootstrapTable('refresh');

        var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
        if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
          var nodes = treeObj.getSelectedNodes()
          initTreeRefresh(nodes)
        }
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据后不可恢复，确定要继续吗？', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      // var formUrl = window.location.pathname + "/delete?type=del&id=" + row.id;
      var formUrl = WEB_ROOT + '/sys/logClass/delete?editType=edit&id=' + row.id
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {
            toastr.success(result.message || '删除记录成功!')
            // $('#logClassTable').bootstrapTable('refresh');

            var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
            if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
              var nodes = treeObj.getSelectedNodes()
              initTreeRefresh(nodes)
            }
          } else {
            toastr.error(result.message || '删除记录失败！')
          }
        },
      })
      layer.close(index)
    })
  },

  'click .add': function (e, value, row, index) {
    var idO = row.id
    // var formUrl = window.location.pathname + "/form?editType=add&classCode=" + row.classCode + '.';
    var formUrl = getRelativePath() + 'logClassForm.html?editType=add&classCode=' + row.classCode + '.'
    openDialog('新增下级日志分类', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        // $('#logClassTable').bootstrapTable('refresh');
        var treeObj = $.fn.zTree.getZTreeObj('logClassTree')
        if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
          var nodes = treeObj.getSelectedNodes()
          initTreeRefresh(nodes)
        }
      },
    })
  },
  'mouseenter .tooltip-toggle': function (e, value, row, index) {
    $(this).tooltip('show')
  },
}




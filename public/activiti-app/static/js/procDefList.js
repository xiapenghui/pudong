var pageDictMap = {}
var fieldDictTypeMap = {
  'status': 'flow_def_status',
  'enTimeLimit': 'y_n',
}
/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a'

var procDefListContent = new Vue({
  el: '#procDefListContent',
  data: function () {
    return {
      /**
       * 页面加载状态
       */
      pageLoading: true,
    }
  },
  created: function () {
    //请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,flow_def_status'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
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
    // 流程分类树配置相关
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
    var lastSearchNodes = []
    var treeUrl = requestUrlPrefix + '/activiti/flowType/getProcTypeTree?pId=0'
    $.get(treeUrl, function (result) {
      $.fn.zTree.init($('#flowTypeTree'), settings, result)
      var treeObj = $.fn.zTree.getZTreeObj('flowTypeTree')
      // 获取根节点并且选中触发点击事件
      var nodes = treeObj.getNodes()
      if (nodes.length > 0) {
        treeObj.selectNode(nodes[0])
        treeObj.expandNode(nodes[0], true)
        treeObj.setting.callback.onClick(null, treeObj.setting.treeId,
          nodes[0])// 调用事件
      } else {
        toastr.error('树加载失败或数据不存在', '树加载提醒')
      }
    })

    $('#flowTypeSearchBtn').click(function () {
      var tree = $.fn.zTree.getZTreeObj('flowTypeTree')
      var value = $('#flowTypeSearchName').val()
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

    setDefaultValue()
    refreshTable()

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
    var $searchBtn = $('#procDefSearchBtn')
    var $resetBtn = $('#procDefResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })

    $('.importProcBtn').click(function () {
      $('#fileSelect').click()
    })
    $('#fileSelect').change(function () {
      fileChange()
    })

    var $exportProcBtn = $('.exportProcBtn')
    $exportProcBtn.click(function () {
      // 获取公共属性
      var toolBarData = $($exportProcBtn.parent()[0]).data()
      var selections = $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('getSelections')
      if (selections.length === 0) {
        toastr.warning('请选择要导出的记录!')
        return
      } else {
        var ids = ''
        for (var i = 0; i < selections.length; i++) {
          if (!$.isEmptyObject(selections[i].id)) {
            ids += selections[i].id + ','
          }
        }
        ids = ids.substr(0, ids.length - 1)
        // 设置回调参数
        var args = {
          cancel: false,
          params: {
            ids: ids,
          },
          selections: selections,
        }
        // 调用回调
        var et = $exportProcBtn.data('eventTrigger')
        if (typeof et !== 'undefined' && et !== '') {
          window[et](args)
          if (args.cancel) {
            return
          }
        }
      }
    })
  },
})

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

//节点点击事件
function onNodeClick (event, treeId, treeNode, clickFlag) {
  refreshTable()
}

// 设置查询项的默认值，在初始化及点击重置按钮时调用
function setDefaultValue () {
  $('#procDefSearchForm #flowTypeId').val('')
  $('#procDefSearchForm #procKey').val('')
  $('#procDefSearchForm #name').val('')
  $('#procDefSearchForm #description').val('')
  $('#procDefSearchForm #status').val('')
  $('#procDefSearchForm #formResId').val('')
}

// 刷新表格公共方法
function refreshTable () {
  var data_url = requestUrlPrefix + '/activiti/procDef/getProcDefList?'
  var tree = $.fn.zTree.getZTreeObj('flowTypeTree')
  if (tree != null) {
    var selNodes = tree.getSelectedNodes()
    if (selNodes.length > 0) {
      if (selNodes[0].parentIds == '') {
        data_url += 'procDefId=' + selNodes[0].id + '&'
      } else if (selNodes[0].parentIds == '-1') {
      } else {
        data_url += 'flowTypeId=' + tree.getSelectedNodes()[0].id + '&'
      }
    }
  }
  $('#procDefTable').bootstrapTable('refresh', {
    url: data_url + $('#procDefSearchForm').serialize(),
  })
}

function fileChange () {
  // 先判断上传的文件中是否已经存在
  $.ajaxFileUpload({
    url: requestUrlPrefix + '/activiti/procDef/isImportProcExist', //这里是服务器处理的代码
    type: 'post',
    secureuri: false, //一般设置为false
    fileElementId: 'fileSelect', // 上传文件控件的id
    dataType: 'json', //返回值类型，一般设置为json、application/json
    data: {}, //传递参数到服务器
    success: function (result, status) {
      if (status === 'success') {
        if (result.data === false) {
          upload()
        } else {
          // 弹出确认框
          direwolfCommonConfirm('要导入的流程中有流程已存在，是否确定导入并覆盖?', '导入提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }, function () {
            upload()
          })
        }
      } else {
        toastr.error(result.message || '判断待导入的流程是否已经存在失败')
      }
    },
    error: function (data, status, e) {
      alert('错误：上传组件错误，请检察网络!')
    },
  })

}

function upload () {
  $.ajaxFileUpload({
    url: requestUrlPrefix + '/activiti/procDef/importProc', //这里是服务器处理的代码
    type: 'post',
    secureuri: false, //一般设置为false
    fileElementId: 'fileSelect', // 上传文件控件的id
    dataType: 'json', //返回值类型，一般设置为json、application/json
    data: {}, //传递参数到服务器
    success: function (data, status) {
      if (status === 'success') {
        $('#fileSelect').val('')
        // ajaxFileUpload插件会把原来的file元素替换成新的file元素，所以之前绑定的change事件就失效了，需要重新绑定一下
        $('#fileSelect').change(function () {
          fileChange()
        })
        direwolfCommonTips('success', data.message)
        $('#procDefTable').bootstrapTable('refresh')
      } else {
        toastr.error(data.message)
      }
    },
    error: function (data, status, e) {
      alert('错误：上传组件错误，请检察网络!')
    },
  })
}

function exportProcDef (args) {
  var urls = []
  for (var i = 0; i < args.selections.length; i++) {
    var procKey = args.selections[i].procKey
    var url = requestUrlPrefix + '/activiti/procDef/exportProc?procKey=' + procKey
    urls.push(url)
  }
  downloadFiles(urls)
}

function downloadFiles (urls) {
  for (var i = 0; i < urls.length; i++) {
    // 由于通过连续调用window.open(xxx)，只能打开第一个页面，后面的页面会被浏览器拦截，所以采用创建iframe的方式
    $('<iframe width=\'0\' height=\'0\' style=\'display: none;\' src=\'' + urls[i] + '\'></iframe>').prependTo('body')
  }
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingProcDef (args) {
  return args
}

// 删除前触发
function deletingProcDef (args) {
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
function viewingProcDef (args) {
  if (!!args.selections && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 操作列定义
function operateFormatter (value, row, index) {
  var paintTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button title=\'绘制流程图\' style=\'margin:1px\' class=\'paint btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-paint-brush fa-fw\'></i></button>'

  var editProcTable = '<button title=\'配置流程属性\' style=\'margin:1px\' class=\'editProc btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'

  var editNodeTable = '<button title=\'配置节点属性\' style=\'margin:1px\' class=\'editNode btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-pencil fa-fw\'></i></button>'

  var publishTable = '<button title=\'发布\' style=\'margin:1px\' class=\'publish btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-paper-plane fa-fw\'></i></button>'

  var destroyTable = '<button title=\'废止\' style=\'margin:1px\' class=\'destroy btn btn-danger btn-xs\'>'
    + '<i class=\'fa fa-power-off fa-fw\'></i></button>'

  var recoveryTable = '<button title=\'恢复\' style=\'margin:1px\' class=\'recovery btn btn-danger btn-xs\'>'
    + '<i class=\'fa fa-registered fa-fw\'></i></button>'

  var deleteTable = '<button title=\'删除\' style=\'margin:1px\' class=\'btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button></div>'
  return paintTable + editProcTable + editNodeTable + publishTable
    + destroyTable + recoveryTable + deleteTable

}

window.operateEvents = {
  'click .paint': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'process-editor/modeler.html?modelId='
      + row.activitiProcModelId + '&WEB_ROOT=' + requestUrlPrefix
    window.open(formUrl)
  },
  'click .editProc': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'procDefForm.html?editType=edit&id='
      + row.id
    openDialog('修改流程定义', formUrl, {
      callback: function () {
        $('#procDefTable').bootstrapTable('refresh')
      },
    })
  },
  'click .editNode': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'process.html?procDefId='
      + row.id
    openDialog('修改流程节点定义', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        $('#procDefTable').bootstrapTable('refresh')
      },
    })
  },
  'click .publish': function (e, value, row, index) {
    var formUrl = requestUrlPrefix + '/activiti/procDef/deploy?procDefId=' + row.id
    $.ajax(formUrl, {
      success: function (result) {
        if (result.type == 'success') {
          toastr.success(result.message)
          $('#procDefTable').bootstrapTable('refresh')
        } else {
          toastr.error(result.message)
        }
      },
    })
  },
  'click .destroy': function (e, value, row, index) {
    var formUrl = requestUrlPrefix + '/activiti/procDef/destroy?procDefId='
      + row.id
    $.ajax(formUrl, {
      success: function (result) {
        if (result.type == 'success') {
          toastr.success(result.message)
          $('#procDefTable').bootstrapTable('refresh')
        } else {
          toastr.error(result.message)
        }
      },
    })
  },
  'click .recovery': function (e, value, row, index) {
    var formUrl = requestUrlPrefix + '/activiti/procDef/recovery?procDefId='
      + row.id
    $.ajax(formUrl, {
      success: function (result) {
        if (result.type == 'success') {
          toastr.success(result.message)
          $('#procDefTable').bootstrapTable('refresh')
        } else {
          toastr.error(result.message)
        }
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    direwolfCommonConfirm('删除数据后不可恢复，确定要继续吗？', '删除提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }, function (index) {
      var formUrl = requestUrlPrefix + '/activiti/procDef/delete?id=' + row.id
      $.ajax(formUrl, {
        type: 'POST',
        success: function (result) {
          if (result.type == 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#procDefTable').bootstrapTable('refresh')
          } else {
            toastr.error(result.message || '删除记录失败!')
          }
        },
      })
      layer.close(index)
    })
  },

}

// 主表按钮点击前置回调结束


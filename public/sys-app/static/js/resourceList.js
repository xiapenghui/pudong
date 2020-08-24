var pageDictMap = {}
var fieldDictTypeMap = {
  'visiable': 'y_n',
  'useTag': 'y_n',
  'resType': 'res_type',
  'resCode': 'res_code',
}
var resourceListContentVm = new Vue({
  el: '#resourceListContent',
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
    resTypeDict: function () {
      return this.pageDictMap['res_type']
    },
    resCodeDict: function () {
      return this.pageDictMap['res_code']
    },
  },
  methods: {},
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/resource/checkResourceListPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,res_type,res_code'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false

      $select_appId.val(defaultAppId)
      $select_appId.change(function () {
        refreshTable()
      })
      $select_appId.trigger('change')
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    resource = {
      appId: defaultAppId, // 默认appId

      /** *********************************以下为资源树*********************************** */
      resTree: {
        currentNodeId: '0',
        openNodes: ['0', '1', '2'], // 默认展开顶层节点
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
          data: {
            simpleData: {
              enable: true,
              rootPId: '',
            },
          },
          callback: {
            onClick: function (event, treeId, treeNode) {
              resource.resTree.currentNodeId = treeNode.id
              resource.resTable.updateTable(treeNode.id, resource.appId)
            },
            onExpand: function (event, treeId, treeNode) {
              resource.resTree.openNodes.push(treeNode.id)
            },
            onCollapse: function (event, treeId, treeNode) {
              resource.resTree.openNodes.remove(treeNode.id)
            },

          },
        },

        zTreeOnClick: function (event, treeId, treeNode) {
          resource.resTree.currentNodeId = treeNode.id
          resource.resTable.updateTable(treeNode.id, resource.appId)
        },

        updateTree: function () {
          var data = []
          $.ajax({
            async: false,
            cache: false,
            type: 'GET',
            dataType: 'json',
            url: WEB_ROOT + '/sys/resource/getResourceTreeList?appId=' + resource.appId + '&timestamp=' +
              Date.parse(new Date()),
            // error: function () {
            // 	alert('请求失败');
            // },
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
              open: resource.resTree.openNodes.contains(item.id),
            }
          })
          return $.fn.zTree.init($('#resTree'), resource.resTree.setting, zNodes)
        },

      },

      /** *********************************以下为子节点的table*********************************** */
      resTable: {
        updateTable: function (parentId, appId) {
          $('#resourceTable').bootstrapTable('refresh',
            {
              url: WEB_ROOT + '/sys/resource/getResourceList?parentId=' + parentId + '&appId=' + appId,
            },
          )
        },

        // 设置查询项的默认值，在初始化及点击重置按钮时调用
        setDefaultValue: function () {
          $('#resourceSearchForm #resName').val('')
          $('#resourceSearchForm #resType').val('')
          $('#resourceSearchForm #resCode').val('')
        },

      },
    }

    /*---------------------------------------初始化---------------------------------------------*/

    // 初始化appId
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
        var appIds = data.map(function (item) {return item.id})
        var appNames = data.map(function (item) {return item.appName})
        $select_appId = $('#select_appId')
        for (var i = 0; i < data.length; i++) {
          $select_appId.append('<option value=\'' + data[i].id + '\'>' + data[i].appName + '</option>')
        }
        // $select_appId.val(defaultAppId);
        $select_appId.change(function () {
          resource.appId = $(this).children('option:selected').val()// 这就是selected的值
          resource.resTree.updateTree()
          resource.resTable.setDefaultValue()
          resource.resTable.updateTable('0', resource.appId)
        })

      },
    })

    // 初始化树
    resource.resTree.updateTree()
    var lastSearchNodes = []
    $('#resSearchBtn').click(function () {
      var tree = $.fn.zTree.getZTreeObj('resTree')
      var value = $('#resSearchName').val()
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

    // 初始化表
    resource.resTable.setDefaultValue()
    resource.resTable.updateTable('0', resource.appId) // 初始化表格，默认查询第一层节点

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#resourceSearchBtn')
    var $resetBtn = $('#resourceResetBtn')

    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      resource.resTable.setDefaultValue()
      refreshTable()
    })

    // 新增按钮
    var $addBtns = $('.addResourceBtn')
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
        var parentName = $.fn.zTree.getZTreeObj('resTree').getNodesByParam('id', resource.resTree.currentNodeId)
        var appName = $('#select_appId').children('option:selected').text()
        var formUrl = getRelativePath() + 'resourceForm.html?editType=add&parentId=' + parentName[0].id +
          '&parentResName=' + encodeURI(parentName[0].name) + '&appId=' + resource.appId + '&appName=' +
          encodeURI(appName)
        if (args.params !== '') {// 设置回调参数
          formUrl += '&' + args.params
        }
        openDialog('新增' + toolBarData.functionNameSimple,
          formUrl, {
            width: '800px',
            height: '500px',
            callback: function (result) {
              $('#' + toolBarData.javaClassName + 'Table').bootstrapTable('refresh')
              afterAdd(resource.resTree.currentNodeId)
            },
          })
      })
    })

    // 删除按钮
    var $deleteBtns = $('.deleteResourceBtn')
    $.each($deleteBtns, function (i, btn) {
      $(btn).click(
        function () {
          // 获取公共属性
          var toolBarData = $($(btn).parent()[0]).data()
          var selections = $(
            '#' + toolBarData.javaClassName + 'Table').bootstrapTable('getSelections')
          if (selections.length === 0) {
            toastr.warning('请选择要删除的记录!')
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
            var et = $(btn).data('eventTrigger')
            if (typeof et !== 'undefined' && et !== '') {
              window[et](args)
              if (args.cancel) {
                return
              }
            }
            top.layer.confirm('删除数据后不可恢复，确定要继续吗？', {
              icon: 3,
              title: '删除提醒',
            }, function (index) {
              var formUrl = WEB_ROOT + '/sys/resource/deleteAll?type=del'
              if (!$.isEmptyObject(ids)) {
                formUrl += '&ids=' + ids
              } else if (args.params !== '') {// 设置回调参数
                formUrl += '&' + args.params
              }
              $.ajax(formUrl, {
                method: 'delete',
                success: function (result) {
                  if (result.type === 'success') {
                    toastr.success(result.message
                      || '删除记录成功!')
                    $('#' + toolBarData.javaClassName
                      + 'Table').bootstrapTable('refresh')
                    afterDelete(selections.map(function (item) {return item.id}))
                  } else {
                    toastr.error(result.message
                      || '删除记录失败！')
                  }
                },
              })
              top.layer.close(index)
            })
          }
        })
    })

    $(window).bind('load resize scroll', function () {
      fix_height()
    })

    bindEnter('resSearchName', 'resSearchBtn')
    bindEnter('resName', 'resourceSearchBtn')

  },
})

// 刷新表格公共方法
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/resource/getResourceList?appId=' + resource.appId + '&'
  $('#resourceTable').bootstrapTable('refresh',
    {
      url: data_url + $('#resourceSearchForm').serialize(),
    })
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingResource (args) {
  return args
}

// 删除前触发
function deletingResource (args) {
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
function editingResource (args) {
  if (!$.issEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 查看前触发
function viewingResource (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 导出前触发
function exportingResource (args) {
  var $th = $('#resourceTable thead').children().children()
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
    queryParams: $('#resourceSearchForm').serialize(),
    headers: headers,
  }
  return args
}

// 主表按钮点击前置回调结束

function afterDelete (ids) {
  for (var i = 0; i < ids.length; i++) {
    resource.resTree.openNodes.remove(ids[i])
  }
  resource.resTree.updateTree()
}

function afterAdd (parentId) {
  if (!resource.resTree.openNodes.contains(parentId)) resource.resTree.openNodes.push(parentId)
  resource.resTree.updateTree()
}

function viewFormatter (value, row, index) {
  return '<a href=\'#\' class=\'view\'>' + value + '</a>'
}

/**
 * 定义全局方法，新增操作一列
 *
 * @param value
 *            枚举值
 * @param row
 *            当前行数据
 * @param index
 *            当前行索引
 */
function operateFormatter (value, row, index) {
  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button  data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'tooltip-toggle edit btn btn-primary btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var deleteTable = '<button  data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button></div>'
  return editTable + deleteTable
}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'resourceForm.html?editType=edit&id=' + row.id
    openDialog('修改资源', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        $('#resourceTable').bootstrapTable('refresh')
        resource.resTree.updateTree()
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    deleteTable(row.id)
  },
  'click .view': function (e, value, row, index) {
    viewDetail(row.id)
  },
  'mouseenter .tooltip-toggle': function (e, value, row, index) {
    $(this).tooltip('show')
  },
}

function deleteTable (id) {
  layer.confirm('删除数据后不可恢复，确定要继续吗？', {
    icon: 3,
    title: '删除提醒',
  }, function (index) {
    var formUrl = WEB_ROOT + '/sys/resource/delete?type=del&id=' + id
    $.ajax(formUrl, {
      method: 'delete',
      success: function (result) {
        if (result.type === 'success') {
          toastr.success(result.message || '删除记录成功!')
          $('#resourceTable').bootstrapTable('refresh')
          afterDelete([id])
        } else {
          toastr.error(result.message || '删除记录失败！')
        }
      },
    })
    layer.close(index)
  })
}

function viewDetail (id) {
  var formUrl = getRelativePath() + 'resourceForm.html?editType=view&id=' + id
  openDialogView('资源详情', formUrl, {
    width: '800px',
    height: '500px',
  })
}


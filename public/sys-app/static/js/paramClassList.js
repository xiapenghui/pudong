var pageDictMap = {}
var fieldDictTypeMap = {
  'enTimeLimit': 'y_n',
}
var paramClassListContentVm = new Vue({
  el: '#paramClassListContent',
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
    enTimeLimitDict: function () {
      return this.pageDictMap['y_n']
    },

  },
  methods: {},
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/paramClass/checkParamClassListPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n'
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
    // 初始化appId
    $.ajax({
      cache: false,
      type: 'GET',
      async: false,
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
          if (i === 0) {
            $select_appId.append('<option value=\'' + data[i].id + '\''
              + '' + '>' + data[i].appName + '</option>')
          } else {
            $select_appId.append('<option value=\'' + data[i].id + '\'>'
              + data[i].appName + '</option>')
          }
        }

      },
    })

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#paramClassSearchBtn')
    $searchBtn.click(refreshTable)
    var $resetBtn = $('#paramClassResetBtn')
    $resetBtn.click(function () {
      $('#paramClassSearchName').val('')
      refreshTable()
    })

    // 绑定回车事件为搜索
    $(document).keydown(function (event) {
      if (event.keyCode == 13) {
        $('#paramClassSearchBtn').click()
      }
    })

    // 加载成功之后、search搜索之后，默认选中第一行
    $('#paramClassTable').on(
      'load-success.bs.table search.bs.table',
      function () {
        if ($('#paramClassTable').bootstrapTable('getData').length > 0) {
          // 默认选中第0行
          $('#paramClassTable').bootstrapTable('check', 0)
          var classCode = $('#paramClassTable').bootstrapTable('getData')[0].classCode
          refreshChildTable(classCode)
        } else {
          refreshChildTable('-1')
        }
      })
    // 单击事件触发子表刷新
    $('#paramClassTable').
      on(
        'check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table check-some.bs.table uncheck-some.bs.table',
        function () {
          // 获取之前的选中行，清除选中属性
          var obj = $('#paramClassTable').bootstrapTable('getSelections')
          /*$("#paramClassTable").bootstrapTable("uncheckBy", {
                      field : "id",
                      values : [ obj.id ]
                  })
                  // 选中当前点击行
                  var index = $element.data('index');
                  $('#paramClassTable').bootstrapTable('check', index);*/
          // 刷新字表
          if (obj.length == 1) {
            refreshChildTable(obj[0].classCode)
          }

        })

    // 子表刷新事件
    function refreshChildTable (classCode) {
      // 获取选中的行
      var paramValueUrl = WEB_ROOT + '/sys/paramValue/getParamValueList?'
      $('#paramValueTable').bootstrapTable('refresh', {
        url: paramValueUrl + 'classCode=' + classCode,
      })
    }

    $(window).bind('load resize scroll', function () {
      fix_height()
    })
  },
})

// 刷新表格公共方法
function refreshTable () {
  var appId = $('#select_appId').children('option:selected').val()
  var className = $('#paramClassSearchName').val()
  var data_url = WEB_ROOT + '/sys/paramClass/getParamClassList?'
  $('#paramClassTable').bootstrapTable('refresh', {
    url: data_url + 'appId=' + appId + '&className=' + className,
  })
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingParamClass (args) {
  // var appId = $("#select_appId").children('option:selected').val();
  // 设置主表关联的子系统id
  args.params = 'appId=' + defaultAppId
  args.dialogCfg = {
    width: '700px',
    height: '250px',
  }
  return args
}

// 删除前触发
function deletingParamClass (args) {
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
function editingParamClass (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 查看前触发
function viewingParamClass (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

// 导出前触发
function exportingParamClass (args) {
  var $th = $('#paramClassTable thead').children().children()
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
    queryParams: $('#paramClassSearchForm').serialize(),
    headers: headers,
  }
  return args
}

// 主表按钮点击前置回调结束

// 子表按钮点击前置回调开始
// 新增前触发
function addingParamValue (args) {
  var selections = $('#paramClassTable').bootstrapTable('getSelections')
  if (selections.length === 1) {
    // 设置主表带入子表的值
    var parentId = selections[0].classCode
    args.params = 'classCode=' + parentId
  } else {
    toastr.warning('请选择一条且仅选择一条主表的记录!')
    args.cancel = true
  }
  return args
}

// 删除前触发
function deletingParamValue (args) {
  return args
}

// 修改前触发
function editingParamValue (args) {
  return args
}

// 查看前触发
function viewingParamValue (args) {
  return args
}

// 导出前触发
function exportingParamValue (args) {
  var selections = $('#paramClassTable').bootstrapTable('getSelections')
  if (selections.length === 1) {
    // 设置主表带入子表的值
    var parentId = selections[0].classCode
    var $th = $('#paramValueTable thead').children().children()
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
      queryParams: 'classCode=' + parentId,
      headers: headers,
    }
  } else {
    toastr.warning('请选择一条且仅选择一条主表的记录!')
    args.cancel = true
  }
  return args
}

// 系统字典子表按钮 编辑 删除 查看
function viewFormatter (value, row, index) {
  return '<a href=\'#\' class=\'view\' title=\'查看\'>' + value + '</a>'
}

window.viewEvents = {
  'click .view': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'paramValueForm.html?editType=view&id='
      + row.id
    openDialogView('查看系统字典表', formUrl, {
      width: '800px',
      height: '360px',
    })
  },
}

function operateFormatter (value, row, index) {
  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'tooltip-toggle edit btn btn-primary btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var deleteTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button></div>'
  return editTable + deleteTable
}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'paramValueForm.html?editType=edit&id='
      + row.id
    openDialog('修改系统字典表', formUrl, {
      width: '800px',
      height: '360px',
      callback: function () {
        $('#paramValueTable').bootstrapTable('refresh')
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据后不可恢复，确定要继续吗？', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      var formUrl = WEB_ROOT + '/sys/paramValue/delete?type=del&id='
        + row.id + '&t=' + new Date().getTime()
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#paramValueTable').bootstrapTable('refresh')
          } else {
            toastr.error(result.message || '删除记录失败！')
          }
        },
      })
      layer.close(index)
    })
  },
  'mouseenter .tooltip-toggle': function (e, value, row, index) {
    $(this).tooltip('show')
  },
}
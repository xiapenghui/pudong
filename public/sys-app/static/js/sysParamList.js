// sysParamListContentVm
var pageDictMap = {}
var fieldDictTypeMap = {
  'enTimeLimit': 'y_n',
}
var paramClassListContentVm = new Vue({
  el: '#sysParamListContent',
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
    enTimeLimitDict () {
      return this.pageDictMap['y_n']
    },
  },
  methods: {},
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/sysParam/checkSysParamListPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
      setDefaultValue()
      refreshTable()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    // 设置查询项的默认值，在初始化及点击重置按钮时调用

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#sysParamSearchBtn')
    var $resetBtn = $('#sysParamResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
    // 绑定回车事件为搜索
    $(document).keydown(function (event) {
      if (event.keyCode == 13) {
        $('#sysParamSearchBtn').click()
      }
    })
  },
})

function setDefaultValue () {
  $('#sysParamSearchForm #sysParamCode').val('')
  $('#sysParamSearchForm #sysParamValue').val('')
  $('#sysParamSearchForm #sysParamExt').val('')
  $('#sysParamSearchForm #sysParamDesc').val('')
  $('#sysParamSearchForm #appId').val('1')
}

// 刷新表格公共方法
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/sysParam/getSysParamList?'
  $('#sysParamTable').bootstrapTable('refresh', {
    url: data_url + $('#sysParamSearchForm').serialize(),
  })
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingSysParam (args) {
  return args
}

// 删除前触发
function deletingSysParam (args) {
  if (!$.isEmptyObject(args.selections)) {
    var ids = ''
    for (var i = 0; i < args.selections.length; i++) {
      if (!$.isEmptyObject(args.selections[i].sysParamCode)) {
        ids += args.selections[i].sysParamCode + ','
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
function editingSysParam (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].sysParamCode
  }
  return args
}

// 查看前触发
function viewingSysParam (args) {
  if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].sysParamCode
  }
  return args
}

// 导出前触发
function exportingSysParam (args) {
  var $th = $('#sysParamTable thead').children().children()
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
    queryParams: $('#sysParamSearchForm').serialize(),
    headers: headers,
  }
  return args
}

// 主表按钮点击前置回调结束

/**
 * 翻译app子系统表枚举数据
 *
 * @param value
 *            枚举值
 * @param row
 *            当前行数据
 * @param index
 *            当前行索引
 */
function dictsAppFormatter (value, row, index) {
  if (!value) {
    return '-'
  }
  var valueArr = []
  if (value instanceof Array) {
    valueArr = value
  } else {
    valueArr = value.split(',')
  }
  var codeName = ''
  for (var i = 0; i < valueArr.length; i++) {
    var translated = false
    var code = valueArr[i]
    for (var j = 0; j < this.dictData.length; j++) {
      if (!$.isEmptyObject(code) && code === this.dictData[j].id) {
        codeName += this.dictData[j].appName
        translated = true
        break
      }
    }
    // 未翻译成功则展示为“-”
    if (!translated) {
      codeName += '-'
    }
    codeName += ','
  }
  // 移除末尾逗号
  codeName = codeName.substring(0, codeName.length - 1)
  return codeName
}

// 系统参数表按钮 编辑 删除 查看
function viewFormatter (value, row, index) {
  return '<a href=\'#\' class=\'view\' title=\'查看\'>' + value + '</a>'
}

window.viewEvents = {
  'click .view': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'sysParamForm.html?editType=view&id='
      + row.sysParamCode
    openDialogView('查看系统参数', formUrl, {
      width: '800px',
      height: '360px',
    })
  },
}

function operateFormatter (value, row, index) {
  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'tooltip-toggle edit btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var deleteTable = '<button data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'tooltip-toggle btn btn-danger btn-xs remove\' >'
    + '<i class=\'fa fa-trash fa-fw\'></i></button></div>'
  return editTable + deleteTable
}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    var formUrl = getRelativePath() + 'sysParamForm.html?editType=edit&sysParamCode='
      + row.sysParamCode
    openDialog('修改系统参数', formUrl, {
      width: '800px',
      height: '500px',
      callback: function () {
        $('#sysParamTable').bootstrapTable('refresh')
      },
    })
  },
  'click .remove': function (e, value, row, index) {
    layer.confirm('删除数据后不可恢复，确定要继续吗？', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      var formUrl = WEB_ROOT + '/sys/sysParam/delete?type=del&id='
        + row.id + '&t=' + new Date().getTime()
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type === 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#sysParamTable').bootstrapTable('refresh')
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

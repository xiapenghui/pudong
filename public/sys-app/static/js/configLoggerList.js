var pageDictMap = {}
var configLoggerListContent = new Vue({
  el: '#configLoggerListContent',
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
      backendContext: commonConfig.sysBackendContext,
    }
  },
  created: function () {
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,client_type,result_code'
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
  methods: {},
  mounted: function () {
    setDefaultValue()
    refreshTable()
    // 设置查询重置按钮点击方法
    var $searchBtn = $('#configLoggerSearchBtn')
    var $resetBtn = $('#configLoggerResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })
  },
})

// 设置查询项的默认值，在初始化及点击重置按钮时调用
function setDefaultValue () {
  $('#configLoggerSearchForm #name').val('')
  $('#configLoggerSearchForm #logLevel').val('')
  $('#configLoggerSearchForm #remark').val('')
}

// 刷新表格公共方法
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/configLogger/getconfigLoggerList?'
  $('#configLoggerTable').bootstrapTable('refresh', {
    url: data_url + $('#configLoggerSearchForm').serialize(),
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

// 主表按钮点击前置回调开始
// 新增前触发
function addingconfigLogger (args) {
  return args
}

// 删除前触发
function deletingconfigLogger (args) {
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
function viewingconfigLogger (args) {
  if (!!args.selections && args.selections.length == 1) {
    args.params = 'id=' + args.selections[0].id
  }
  return args
}

//操作列定义
function operateFormatter (value, row, index) {

  var editTable = '<div style=\'position:relative;\' class=\'btn-group-xs\'><button title=\'修改\' style=\'margin:1px\' class=\'edit btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-edit fa-fw\'></i></button>'
  var logmtTable = '<button title=\'维护\'  style=\'margin:1px\' class=\'loggerMaintain btn btn-primary  btn-xs\'>'
    + '<i class=\'fa fa-wrench fa-fw\'></i></button></div>'
  if (row.name == 'root') {
    return editTable + logmtTable
  } else {
    var deleteTable = '<button title=\'删除\' style=\'margin:1px\' class=\'btn btn-danger btn-xs remove\' >'
      + '<i class=\'fa fa-trash fa-fw\'></i></button>'
    return editTable + deleteTable + logmtTable
  }
}

window.operateEvents = {
  'click .edit': function (e, value, row, index) {
    // var formUrl = window.location.pathname + "/form.html?editType=edit&id=" + row.id;
    var formUrl = getRelativePath() + 'configLoggerForm.html?editType=edit&id=' + row.id
    openDialog('修改日志维护', formUrl, {
      callback: function () {
        $('#configLoggerTable').bootstrapTable('refresh')
      },
    })
  },
  'click .remove': function (e, value, row, index) {

    layer.confirm('删除数据不可恢复,确定要继续吗?', {
      icon: 3,
      title: '删除提醒',
    }, function (index) {
      // var formUrl = window.location.pathname + "/delete?id=" + row.id;
      var formUrl = WEB_ROOT + '/sys/configLogger/delete?id=' + row.id
      $.ajax(formUrl, {
        method: 'post',
        success: function (result) {
          if (result.type == 'success') {
            toastr.success(result.message || '删除记录成功!')
            $('#configLoggerTable').bootstrapTable('refresh')
          } else {
            toastr.error(result.message || '删除记录失败!')
          }
        },
      })
      layer.close(index)
    })
  },

  'click .loggerMaintain': function (e, value, row, index) {
    mtLog(row)
  },
}

function getSelectedDatas (_window, keys, primaryKey) {
  var selectedDatas = []
  var $checkboxs = $(':checkbox:checked', _window.document)
  $checkboxs.each(function () {
    var tablerow = $(this.parentNode.parentNode)
    var tds = tablerow.find('td')
    var obj = {}
    for (var i = 0; i < keys.length; i++) {
      obj[keys[i]] = $(tds[i + 1]).text()
    }
    //去除全选框
    if (obj[primaryKey] != '') {
      selectedDatas.push(obj)
    }
  })
  return selectedDatas
}

function mtLog (row) {
  var name = row.name
  var config = { height: '500px', width: '300px' }
  // var url = WEB_ROOT + "/sys/sPLoggerAppenderRef/goToLoggerMaintain?name=" + name;
  var url = getRelativePath() + 'logAppenderRefSelect.html?name=' + name
  top.layer.open({
    type: 2,
    area: [config.width, config.height],
    title: '日志关系维护',
    maxmin: true, // 开启最大化最小化按钮
    content: url,
    btn: ['确定', '关闭'],
    yes: function (index, layero) {
      var selectedAppenderRef = []
      var selectedlogRef = getSelectedDatas(layero.find('iframe')[0].contentWindow, ['appenderRef'], 'appenderRef')
      for (var i = 0; i < selectedlogRef.length; i++) {
        selectedAppenderRef.push(selectedlogRef[i].appenderRef)
      }

      var urla = WEB_ROOT + '/sys/sPLoggerAppenderRef/saveAppender?name=' + name
      $.ajax({
        async: false,
        type: 'POST',
        data: {
          'appenderRef': selectedAppenderRef,
        },
        url: urla,
        traditional: true,
        contentType: 'application/x-www-form-urlencoded',
        error: function () {
          alert('请求失败')
        },
        success: function (result) {
          if (result.type === 'success') {
            direwolfCommonTips('success', result.message)
            refreshTable()
          } else {
            direwolfCommonTips('error', result.message)
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

// 主表按钮点击前置回调结束


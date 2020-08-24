var datas = {}
var root = ''

var genTableListContentVm = new Vue({
  el: '#genTableListContent',
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
    }
  },
  computed: {
    formBaseUrl: function () {
      return getRelativePath() + 'getTableForm.html?editType='
    },
    dataLogicTypeDict: function () {
      return this.pageDictMap['data_logic_type']
    },
    requestPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  created: function () {
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      checkPagePermission(vm.requestPrefix + '/codegen/checkGenTablePermission')
      root = '/api' + vm.requestPrefix
      initDicts()
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'data_logic_type').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.pageLoading = false
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    }).catch(function (error) {
      axiosErrorTips(error, '加载页面配置异常')
    })
  },
  mounted: function () {
    $('#searchBtn').on('click', queryProcess)
    $('#canSearchBtn').on('click', cancelSearch)
    $('#genCodeBtn').on('click', genCode)
    $('#editBtn').on('click', editTable)
    $('#importFromDb').on('click', importFromDb)
    $('#genMenuBtn').on('click', createMenu)
    $('#refreshBtn').on('click', queryProcess)
  },
})

// 初始化数据字典
function initDicts () {
  $.ajax({
    url: root + '/codegen/genTableDict',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    success: function (data) {
      datas = data
      initTable()
    },
    error: function () {
      toastr.error('操作失败')
    },
  })
}

// 表格初始化
function initTable () {
  var url = root + '/codegen/genTableData'
  $('#gen-table').bootstrapTable(
    {
      url: url,
      columns: [
        {
          checkbox: true,
        },
        {
          field: 'name',
          title: '名称',
          sortable: true,
          formatter: function (value, row, index) {
            return '<a href="#" onclick="viewTableDel(\''
              + row.id + '\')">' + value + '</a>'
          },
        }, {
          field: 'tableAlias',
          title: '记录别名',
          sortable: true,
        }, {
          field: 'comments',
          title: '说明',
        }, {
          field: 'className',
          title: '类名',
          sortable: true,
        }, {
          field: 'dataLogicType',
          title: '数据类型',
          sortable: true,
          formatter: function (value, row, index) {
            return datas.data_logic_type[value]
          },
        }, {
          field: 'genDatasource.dsName',
          title: '数据源',
          sortable: true,
        }, {
          title: '操作',
          formatter: function (value, row, index) {
            return initLink(row)
          },
        }],
      pagination: true,
      clickToSelect: true,
      singleSelect: true,
      pageSize: 10,
      sortOrder: 'desc',
      pageList: [10, 20, 30],
      queryParams: function (params) {
        return queryProcessParam(params)
      },
      sidePagination: 'server',
      silentSort: false,
    })
}

// 查询事件
function queryProcess () {
  var param = queryProcessParam(null)
  $('#gen-table').bootstrapTable('refresh', {
    url: root + '/codegen/genTableData',
    query: param,
  })
}

// 重置事件
function cancelSearch () {
  $('#genTableForm .form-control').val(null)
  queryProcess()
}

// 生成代码事件
function genCode () {
  var selId = $('#gen-table').bootstrapTable('getSelections')
  if (selId.length === 0) {
    toastr.error('请至少选择一条数据')
    return
  }
  if (selId.length > 1) {
    toastr.error('请至多选择一条数据')
    return
  }
  var config = {
    width: '700px',
    height: '580px',
    full: false,
  }
  openDialog('生成代码', getRelativePath() + 'genCodeForm.html?genTable.id=' + selId[0].id, config)
}

// 编辑表格
function editTable () {
  var selId = $('#gen-table').bootstrapTable('getSelections')
  if (selId.length === 0) {
    toastr.error('请至少选择一条数据')
    return
  }
  if (selId.length > 1) {
    toastr.error('请至多选择一条数据')
    return
  }
  var config = {
    width: '1000px',
    height: '650px',
    full: false,
    callback: function () {
      queryProcess()
    },
  }
  openDialog('修改表单', getRelativePath() + 'genTableForm.html?id=' + selId[0].id,
    config)
}

// 查看表格明细
function viewTableDel (id) {
  var config = {
    width: '1000px',
    height: '650px',
    full: false,
  }
  openDialogView('查看表单', getRelativePath() + 'genTableForm.html?viewType=view&id=' + id, config)
}

// 从数据库导入表单
function importFromDb () {
  var config = {
    width: '800px',
    height: '500px',
    full: false,
    callback: function () {
      var param = queryProcessParam(null)
      $('#gen-table').bootstrapTable('refresh', {
        url: root + '/codegen/genTableData',
        query: param,
      })
    },
  }
  openDialog('导入表单', getRelativePath() + 'importTableFromDB.html', config)
}

// 创建菜单
function createMenu () {
  var selId = $('#gen-table').bootstrapTable('getSelections')
  if (selId.length === 0) {
    toastr.error('请至少选择一条数据')
    return
  }
  if (selId.length > 1) {
    toastr.error('请至多选择一条数据')
    return
  }
  // 先判断是否已经生成代码
  $.ajax({
    url: root + '/genScheme/isCodeCreate?genTable.id=' + selId[0].id,
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    success: function (data) {
      if (data.type === 'success') {
        var config = {
          width: '750px',
          height: '550px',
          full: false,
        }
        openDialog('创建菜单', getRelativePath() + 'createMenuList.html?genTable.id=' + selId[0].id,
          config)
      } else {
        toastr.error(data.message)
      }
    },
    error: function () {
      toastr.error('操作失败')
    },

  })
}

function editTables (rowid) {
  var config = {
    width: '1000px',
    height: '650px',
    full: false,
    callback: function () {
      queryProcess()
    },
  }
  openDialog('修改表单', getRelativePath() + 'genTableForm.html?id=' + rowid, config)
}

function queryProcessParam (params) {
  var param = {
    'name': $('#name').val(),
    'tableAlias': $('#tableAlias').val(),
    'dataLogicType': $('#dataLogicType').val(),
  }
  if (params != null) {
    param.order = params.order
    param.limit = params.limit
    param.offset = params.offset
    param.search = params.search
    param.sort = params.sort
  }
  return param
}

/**
 * 同步数据库修改
 *
 * @param rowId
 */
function syncTable (rowId) {
  var config = {
    width: '800px',
    height: '600px',
    full: false,
    callback: function () {
      queryProcess()
    },
  }
  openDialog('同步数据库', getRelativePath() + 'syncTableList.html?id=' + rowId, config)
}

function deleteTable (rowId) {
  direwolfCommonConfirm('确认要删除该条记录并删除对应的数据库表？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }, function () {
    $.ajax({
      url: root + '/codegen/deleteTable?id=' + rowId,
      type: 'post',
      contentType: 'application/json; charset=UTF-8',
      success: function (dt) {
        if (dt.type === 'success') {
          queryProcess()
        } else {
          toastr.error(dt.message,
            '操作失败')
        }
      },
      error: function () {
        toastr.error('操作失败')
      },
    })
  })
}

function initLink (rowData) {
  var editTable = '<div class=\'btn-group\'><a data-toggle=\'tooltip\' data-placement=\'top\' title=\'修改\' style=\'margin:1px\' class=\'btn btn-primary btn-xs\' id=\'edit_'
    + rowData.id
    + '\'	onclick=editTables(\''
    + rowData.id
    + '\'); onmouseenter=jQuery(this).tooltip(\'show\');><i class=\'fa fa-pencil-square-o fa-fw\'></i></a>'
  var removeTable = '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'移除\' style=\'margin:1px\' class=\'btn btn-danger btn-xs \' id=\'remove_'
    + rowData.id
    + '\'	onclick=removeTable(\''
    + rowData.id
    + '\'); onmouseenter=jQuery(this).tooltip(\'show\');><i class=\'fa fa-trash fa-fw\'></i></a>'
  var deleteTable = '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除\' style=\'margin:1px\' class=\'btn btn-danger btn-xs\' id=\'delete_'
    + rowData.id
    + '\'	onclick=deleteTable(\''
    + rowData.id
    + '\'); onmouseenter=jQuery(this).tooltip(\'show\');><i class=\'fa fa-trash fa-fw\'></i></a>'
  var syncTable = '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'同步数据库\'	style=\'margin:1px\' class=\'btn btn-primary btn-xs\' id=\'sync_'
    + rowData.id
    + '\'	onclick=syncTable(\''
    + rowData.id
    + '\'); onmouseenter=jQuery(this).tooltip(\'show\');><i class=\'fa fa-database fa-fw\'></i></a></div>'

  var actionLink = '<div title=\'\' style=\'float: left; cursor: pointer;margin:3px;display:none;\' class=\'ui-pg-div ui-inline-edit\' id=\'actionLink_'
    + rowData.task_id + '\'><a href=\'#\'></a></div>'
  return editTable /* + removeTable */ + deleteTable + syncTable + actionLink
}


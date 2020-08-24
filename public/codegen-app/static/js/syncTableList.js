var id = null
var root = ''
jQuery(function () {
  id = GetQueryString('id')
  axios.get(getModuleConfigPath()).then(function (response) {
    var msConfig = response.data
    var prefix = msConfig['gatewayRoutePath'] + msConfig['direwolfAdminPath']
    root = '/api' + prefix
    checkPagePermission(prefix + '/codegen/checkSyncTablePermission')
    var dictUrl = root + '/codegen/genTableDict'
    var syncTableUrl = root + '/codegen/genSyncData?id=' + id
    var datas = {}// 字典列表

    initDicts()
    initTable()

    /**
     * 初始化表格
     *
     * @returns
     */
    function initTable () {
      var colmodel = [
        {
          field: 'id',
          title: '列名',
          visible: false,
        }, {
          field: 'name',
          title: '列名',
        }, {
          field: 'jdbcType',
          title: '物理类型',
        }, {
          field: 'isPk',
          title: '是否为主键',
          formatter: function (value, row, index) {
            return datas.y_n[value]
          },
        }, {
          field: 'isNull',
          title: '是否可空',
          formatter: function (value, row, index) {
            return datas.y_n[value]
          },
        }]
      $.ajax({
        url: syncTableUrl,
        contentType: 'application/json',
        success: function (data) {
          var tb1 = {
            'data': data.updates,
          }
          tb1.columns = colmodel
          tb1.pagination = false
          var tb2 = {
            'data': data.deletes,
          }
          tb2.columns = colmodel
          tb2.pagination = false
          var tb3 = {
            'data': data.inserts,
          }
          tb3.columns = colmodel
          tb3.pagination = false
          $('#update').bootstrapTable(tb1)
          $('#delete').bootstrapTable(tb2)
          $('#insert').bootstrapTable(tb3)

        },
        error: function (e) {
        },
        type: 'get',
      })
    }

    /**
     * 初始化字典
     *
     * @returns
     */
    function initDicts () {
      $.ajax({
        url: dictUrl,
        contentType: 'application/json',
        async: false,
        success: function (data) {
          datas = data
        },
        error: function (e) {
        },
        type: 'get',
      })
    }
  }).catch(function (error) {
    axiosErrorTips(error, '加载页面配置异常')
  })
})

/**
 * 表单提交
 *
 * @param callback
 * @returns
 */
function doSubmit (callback) {
  var dataJson = {}
  var updateData = $('#update').bootstrapTable('getData')
  var ids = {}
  var deleteData = $('#delete').bootstrapTable('getData')
  for (var i = 0; i < deleteData.length; i++) {
    if (i === 0) {
      ids.deletes = deleteData[i].id
    } else {
      ids.deletes = deleteData[i].id + ',' + ids.deletes
    }
  }
  var insertData = $('#insert').bootstrapTable('getData')
  dataJson.ids = ids
  dataJson.insertData = insertData
  dataJson.updateData = updateData
  $.ajax({
    url: root + '/codegen/genSyncData/save?id=' + id,
    contentType: 'application/json',
    // data : JSON.stringify(dataJson),
    success: function (data) {
      callback(data)
    },
    error: function (e) {
    },
    // type : "post"
  })
}
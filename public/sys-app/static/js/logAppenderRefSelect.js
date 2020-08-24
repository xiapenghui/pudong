var logAppenderRefSelectContent = new Vue({
  el: '#logAppenderRefSelectContent',
  data: function () {
    return {
      name: GetQueryString('name'),
    }
  },
  created: function () {
  },
  methods: {},
  mounted: function () {
    var dataList = []
    $.ajax({
      type: 'get',
      async: false,
      url: WEB_ROOT + '/sys/sPLoggerAppenderRef/findByAppender',
      success: function (result) {
        var data = []

        $.each(result, function (index, value) {
          data[index] = { appenderRef: value }
        })
        dataList = data
      },
    })
    var oldAppenderRefs = ''
    $.ajax({
      type: 'get',
      async: false,
      url: WEB_ROOT + '/sys/sPLoggerAppenderRef/findByloggerName?name=' + this.name,
      success: function (result) {
        oldAppenderRefs = result
      },
    })
    initial(dataList)
    //勾选原来的appenderref
    $('#LoggerMaintainTable').bootstrapTable('checkBy', { field: 'appenderRef', values: oldAppenderRefs })
  },
})

function initial (dataList) {

  $('#LoggerMaintainTable').bootstrapTable({
    data: dataList,
    cache: false,
    formatNoMatches: function () {
      return '无符合条件的记录'
    },
    sidePagination: 'client',           //分页方式：client客户端分页，server服务端分页（*）
    pagination: true,
    clickToSelect: true,
    pageNumber: 1,                       //初始化加载第一页，默认第一页
    pageSize: 5,                       //每页的记录行数（*）
    pageList: [5, 10, 20, 50],        //可供选择的每页的行数（*）
  })
}



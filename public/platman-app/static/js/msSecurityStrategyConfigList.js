// 查询参数初始值，重置按钮将使用该值
var defaultParams = {
  sys: {
    id: '',
  },
  strategyName: '',
  userName: '',
  limit: 5,
  offset: 0,
  order: '',
  sort: '',
}

var msSecurityStrategyConfigListContentVm = new Vue({
  el: '#msSecurityStrategyConfigListContent',
  data: {
    /**
     * 查询参数，包含表格分页参数
     */
    searchParams: JSON.parse(JSON.stringify(defaultParams)), // 拷贝初始值
    /**
     * 安全策略信息表格分页数据
     */
    msSecurityStrategyConfigTablePage: {},
    editType: GetQueryString('editType'),
    msSysList: [],
    /**
     * 页面加载状态
     */
    pageLoading: false,
    /**
     * 系统下拉框加载状态
     */
    sysLoading: false,
    /**
     * 页面TOKEN，请求维护后台数据时须携带
     */
    pageToken: '',
    /**
     * 安全策略信息表格加载状态
     */
    msSecurityStrategyConfigTableLoading: false,
  },
  computed: {
    formBaseUrl: function () {
      return getRelativePath() + 'msSecurityStrategyConfigForm.html?editType='
    },
    requestPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  methods: {
    /**
     * 刷新表格，重新获取数据
     */
    refreshTable: function () {
      var dataUrl = this.requestPrefix + '/platman/msSecurityStrategyConfig/getMsSecurityStrategyConfigList?' +
        jsonToSpringBinder(this.searchParams)
      var info = '获取安全策略信息记录'
      var vm = this
      vm.msSecurityStrategyConfigTableLoading = true
      axios.get(dataUrl).then(function (response) {
        vm.msSecurityStrategyConfigTablePage = getDataFromAxiosResponse(response, info)
        vm.msSecurityStrategyConfigTableLoading = false
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
    /**
     * 重置按钮点击事件
     */
    resetSearchParam: function () {
      this.searchParams = JSON.parse(JSON.stringify(defaultParams))
      this.refreshTable()
    },
    /**
     * 表格行点击事件
     * @param row 行数据
     * @param event 原生事件
     * @param column 点击位置所属列
     */
    handleRowClick: function (row, event, column) {
      eleTableClickSelection(this.$refs.msSecurityStrategyConfigTable, row, column)
    },
    /**
     * 分页大小切换事件
     * @param val 新值
     */
    handleTableSizeChange: function (val) {
      this.searchParams.limit = val
      this.refreshTable()
    },
    /**
     * 页码切换事件
     * @param val 新页码
     */
    handleTableCurrentChange: function (val) {
      this.searchParams.offset = this.searchParams.limit * (val - 1)
      this.refreshTable()
    },
    /**
     * 排序变更事件
     * @param scope 组件参数
     */
    handleSortChange: function (scope) {
      // 排序取消则使用初始参数
      if (scope.prop === null) {
        this.searchParams.sort = defaultParams.sort
        this.searchParams.order = defaultParams.order
      } else {
        if (scope.prop === 'sysName') {
          this.searchParams.sort = 'sysId'
        } else {
          this.searchParams.sort = scope.prop
        }
        // 组件传递的order格式为'descending'/'ascending'
        this.searchParams.order = scope.order.split('ending')[0]
      }
      this.refreshTable()
    },
    /**
     * 新增记录
     */
    addNewMsSecurityStrategyConfig: function () { // 新增记录
      var formUrl = this.formBaseUrl + 'add'
      var vm = this
      openDialog('新增安全策略信息', formUrl, {
        width: '700px',
        height: '350px',
        callback: function () {
          // 新增成功后刷新表格
          vm.refreshTable()
        },
      })
    },
    /**
     * 删除选中记录
     */
    deleteSelectedMsSecurityStrategyConfig: function () {
      var vm = this
      var selections = vm.$refs.msSecurityStrategyConfigTable.selection
      if (selections.length === 0) {
        direwolfCommonTips('warning', '请选择要删除的记录')
        return
      }
      direwolfCommonConfirm({
        message: '数据删除后不可恢复，确定继续删除吗?',
        title: '删除提醒',
      }, function () {
        var ids = ''
        selections.forEach(function (select) {
          if (select.id) {
            ids += select.id + ','
          }
        })
        if (ids.length > 1) {
          ids = ids.substr(0, ids.length - 1)
          var formUrl = vm.requestPrefix + '/platman/msSecurityStrategyConfig/deleteAll?ids=' + ids
          var info = '批量删除安全策略信息'
          axios.delete(formUrl).then(function (response) {
            var result = getDataFromAxiosResponse(response, info, true)
            result.type === 'success' && vm.refreshTable()
          }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
          })
        }
      })
    },
    /**
     * 修改选中的记录
     */
    editSelectedMsSecurityStrategyConfig: function () {
      var vm = this
      var selections = vm.$refs.msSecurityStrategyConfigTable.selection
      if (selections.length !== 1) {
        direwolfCommonTips('warning', '仅能选择一条记录进行编辑')
        return
      }
      var formUrl = vm.formBaseUrl + 'edit&id=' + selections[0].id
      openDialog('修改安全策略信息', formUrl, {
        width: '700px',
        height: '350px',
        callback: function (result) {
          vm.refreshTable()
        },
      })
    },
    /**
     * 远程加载选择框默认不加载，添加焦点触发查询
     */
    handleSysParamFocus: function () {
      this.getSysListByUser('')
    },
    /**
     * 根据用户和输入的系统名称获取系统列表
     * @param query
     */
    getSysListByUser: function (query) {
      var vm = this
      var listSysUrl = vm.requestPrefix + '/platman/msSystemAdmin/listSystemByCurrentUser?sysName=' + query
      var listInfo = '获取系统列表'
      vm.sysLoading = true
      axios.get(listSysUrl).then(function (response) {
        vm.sysLoading = false
        vm.msSysList = getDataFromAxiosResponse(response, listInfo).data
      }).catch(function (error) {
        axiosErrorTips(error, listInfo + '异常')
      })
    },
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(
        vm.requestPrefix + '/platman/msSecurityStrategyConfig/checkMsSecurityStrategyConfigListPermission')
      vm.pageLoading = false
      vm.refreshTable()
    })
  },
  mounted: function () {
  },
})
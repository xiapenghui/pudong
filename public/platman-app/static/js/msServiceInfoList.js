// 查询参数初始值，重置按钮将使用该值
var defaultParams = {
  sysId: '',
  status: '',
  serviceCode: '',
  serviceName: '',
  swaggerUrl: '',
  limit: 5,
  offset: 0,
  order: '',
  sort: '',
}

var msServiceInfoListContentVm = new Vue({
  el: '#msServiceInfoListContent',
  data: function () {
    return {
      /**
       * 查询参数，包含表格分页参数
       */
      searchParams: JSON.parse(JSON.stringify(defaultParams)), // 拷贝初始值
      /**
       * 字段字典类型集合
       */
      dictMap: {
        'status': 'ms_service_status',
      },
      /**
       * 页面字典集合
       */
      pageDictMap: {},
      /**
       * 服务列表分页数据
       */
      msServiceInfoTablePage: {},
      /**
       * 系统查询返回列表
       */
      msSysList: [],
      /**
       * 页面加载状态
       */
      pageLoading: false,
      /**
       * 系统查询加载状态
       */
      sysLoading: false,
      /**
       * 服务编码查询返回列表
       */
      msServiceCodeList: [],
      /**
       * 服务编码查询加载状态
       */
      serviceLoading: false,
      /**
       * 服务列表表格加载状态
       */
      msServiceInfoTableLoading: false,
      /**
       * 页面编辑模式
       */
      editType: GetQueryString('editType'),
    }
  },
  computed: {
    formBaseUrl: function () {
      return getRelativePath() + 'msServiceInfoForm.html?editType='
    },
    requestPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  methods: {
    /**
     * 根据字段获取字典列表
     * @param field 字段
     * @returns {*} 字典列表
     */
    getDictByField: function (field) {
      return this.pageDictMap[this.dictMap[field]]
    },
    /**
     * 表格刷新方法
     */
    refreshTable: function () {
      var vm = this
      var dataUrl = vm.requestPrefix + '/platman/msServiceInfo/getMsServiceInfoList?' +
        jsonToSpringBinder(this.searchParams)
      var info = '获取微服务信息记录'
      vm.msServiceInfoTableLoading = true
      axios.get(dataUrl).then(function (response) {
        vm.msServiceInfoTablePage = getDataFromAxiosResponse(response, info)
        vm.msServiceInfoTableLoading = false
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
    resetSearchParam: function () { // 重置按钮事件
      this.searchParams = JSON.parse(JSON.stringify(defaultParams))
      this.refreshTable()
    },
    handleRowClick: function (row, event, column) { // 单击选中行
      eleTableClickSelection(this.$refs.msServiceInfoTable, row, column)
    },
    handleTableSizeChange: function (val) { // 表格显示行数切换
      this.searchParams.limit = val
      this.refreshTable()
    },
    handleTableCurrentChange: function (val) { // 表格切换页码
      this.searchParams.offset = this.searchParams.limit * (val - 1)
      this.refreshTable()
    },
    handleSortChange: function (scope) { // 排序
      if (scope.prop === null) {
        this.searchParams.sort = defaultParams.sort
        this.searchParams.order = defaultParams.order
      } else {
        if (scope.prop === 'sysName') {
          this.searchParams.sort = 'sysId'
        } else {
          this.searchParams.sort = scope.prop
        }
        this.searchParams.order = scope.order.split('ending')[0]
      }
      this.refreshTable()
    },
    /**
     * 查看微服务信息
     * @param row
     */
    viewSelectedMsServiceInfo: function (row) {
      var formUrl = this.formBaseUrl + 'view&id=' + row.id
      openDialogView('查看微服务信息', formUrl, {
        width: '800px',
        height: '360px',
      })
    },
    /**
     * 在线文档地址为空时提示
     * @param url
     */
    handleSwaggerUrlClick: function (url) {
      if (!url) {
        direwolfCommonTips('warning', '文档地址未提供')
      }
    },
    /**
     * 查看可用实例明细列表
     * @param row
     */
    viewUsableInstancesDetail: function (row) {
      if (row.usableInstanceCount === 0) {
        direwolfCommonTips('warning', '指定微服务没有可用的实例')
        return
      }
      this.viewInstancesDetail(row, 'UP')
    },
    /**
     * 查看不可用实例明细列表
     * @param row
     */
    viewUnusableInstancesDetail: function (row) {
      if (row.unusableInstanceCount === 0) {
        direwolfCommonTips('warning', '指定微服务没有不可用的实例')
        return
      }
      this.viewInstancesDetail(row, 'OTHERS')
    },
    /**
     * 查看实例明细列表
     * @param row
     * @param status
     */
    viewInstancesDetail: function (row, status) {
      var formUrl = getRelativePath() + 'msServiceInstance.html?serviceCode=' + row.serviceCode + '&status=' + status
      openDialogView('查看微服务实例', formUrl, {
        width: '800px',
        height: '500px',
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
    /**
     * 远程加载选择框默认不加载，添加焦点触发查询
     */
    handleServiceParamFocus: function () {
      this.getServiceListByUser('')
    },
    /**
     * 根据用户和输入的服务编码获取服务列表
     * @param query
     */
    getServiceListByUser: function (query) {
      var vm = this
      var listServiceUrl = vm.requestPrefix + '/platman/msServiceInfo/getMsServiceInfoList?serviceCode=' + query
      var listInfo = '获取服务列表'
      vm.serviceLoading = true
      axios.get(listServiceUrl).then(function (response) {
        vm.serviceLoading = false
        vm.msServiceCodeList = getDataFromAxiosResponse(response, listInfo).list
      }).catch(function (error) {
        axiosErrorTips(error, listInfo + '异常')
      })
    },
    /**
     * 下线勾选的服务
     */
    offlineService: function () {
      var vm = this
      var selections = vm.$refs.msServiceInfoTable.selection
      if (selections.length === 0) {
        direwolfCommonTips('warning', '请选择要禁用的服务')
        return
      }
      if ('OUT_OF_SERVICE' === selections[0].status) {
        direwolfCommonTips('warning', '所选择的服务已经不可用')
        return
      }

      direwolfCommonConfirm({
        message: '确定将勾选的服务禁用吗?',
        title: '禁用提醒',
      }, function () {
        var statusUrl = vm.requestPrefix + '/platman/msServiceInfo/status/' + selections[0].serviceCode +
          '?status=OUT_OF_SERVICE'
        var info = '禁用服务'
        axios.get(statusUrl).then(function (response) {
          getDataFromAxiosResponse(response, info, true)
          vm.refreshTable()
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      })
    },
    /**
     * 上线勾选的服务
     */
    onlineService: function () {
      var vm = this
      var selections = vm.$refs.msServiceInfoTable.selection
      if (selections.length === 0) {
        direwolfCommonTips('warning', '请选择要启用的服务')
        return
      }
      if ('UP' === selections[0].status) {
        direwolfCommonTips('warning', '所选择的服务已经是可用状态')
        return
      }
      direwolfCommonConfirm({
        message: '确定将勾选的服务启用吗?',
        title: '启用提醒',
      }, function () {
        var statusUrl = vm.requestPrefix + '/platman/msServiceInfo/status/' + selections[0].serviceCode + '?status=UP'
        axiosRequest(statusUrl, '启用服务').then(function (result) {
          if (result && result.type === 'success') {
            direwolfCommonTips('success', '启用服务成功。由于实例缓存刷新需要时间，请等待30秒再查看新的实例状态')
            vm.refreshTable()
          }
        })
      })
    },
    deleteServiceRecord: function () {
      var vm = this
      var selections = vm.$refs.msServiceInfoTable.selection
      if (selections.length === 0) {
        direwolfCommonTips('warning', '请选择要删除的服务')
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
          axiosRequest(vm.requestPrefix + '/platman/msServiceInfo/deleteAll?ids=' + ids,
            '批量微服务信息', 'DELETE').then(function (result) {
            if (result && result.type === 'success') {
              direwolfCommonTips('success', '删除服务信息成功')
              vm.refreshTable()
            }
          })
        }
      })
    },
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(vm.requestPrefix + '/platman/msServiceInfo/checkMsServiceInfoListPermission')
      vm.pageLoading = false
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'ms_service_status').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.refreshTable()
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    })
  },
  mounted: function () {
  },
})
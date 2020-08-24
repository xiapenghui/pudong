// 查询参数初始值，重置按钮将使用该值
var defaultParams = {
  clientId: '',
  scope: '',
  authorizedGrantTypesArray: [],
  limit: 5,
  offset: 0,
  order: '',
  sort: ''
}

var sysOauthClientDetailsListContentVm = new Vue({
  el: '#sysOauthClientDetailsListContent',
  data: {
    /**
     * 查询参数，包含表格分页参数
     */
    searchParams: JSON.parse(JSON.stringify(defaultParams)), // 拷贝初始值
    /**
     * 字段字典类型集合
     */
    fieldDictTypeMap: {
      'authorizedGrantTypes': 'authorized_grant_types',
      'autoapprove': 'autoapprove',
    },
    /**
     * 页面字典集合
     */
    pageDictMap: {},
    /**
     * 页面TOKEN，请求维护后台数据时须携带
     */
    pageToken: '',
    /**
     * 服务请求认证详情表表格分页数据
     */
    sysOauthClientDetailsTablePage: {},
    /**
     * 页面加载状态
     */
    pageLoading: false,
    /**
     *
     * 服务列表表格加载状态
     */
    sysOauthClientDetailsTableLoading: false,
    /**
     * 页面编辑模式
     */
    editType: GetQueryString('editType'),
  },
  computed: {
    formBaseUrl: function () {
      return getRelativePath() + 'sysOauthClientDetailsForm.html?editType='
    },
    requestPrefix: function () {
      return commonConfig.sysBackendContext
    },
  },
  methods: {
    /**
     * 根据字段获取字典列表
     * @param field 字段
     * @returns {*} 字典列表
     */
    getDictByField: function (field) {
      return this.pageDictMap[this.fieldDictTypeMap[field]]
    },
    /**
     * 表格数据翻译
     * @param scope 表格组件参数
     * @returns {string|*} 翻译结果
     */
    dictFormatter: function (scope) {
      var fields = scope.column.property
      // 列名称可能是'a.b'格式，逐层获取最终值
      var fieldArr = fields.split('.')
      var value = scope.row
      fieldArr.forEach(function(field){
        value = value[field]
      })
      return dictsFormatter(value, scope.row, scope.$index, this.getDictByField(fields))
    },
    /**
     * 刷新表格，重新获取数据
     */
    refreshTable: function () {
      var vm = this
      var dataUrl = vm.requestPrefix+'/sys/sysOauthClientDetails/getSysOauthClientDetailsList?' + jsonToSpringBinder(this.searchParams)
      var info = '获取服务请求认证详情表记录'
      axios.get(dataUrl).then(function (response) {
        vm.sysOauthClientDetailsTablePage = getDataFromAxiosResponse(response, info)
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
      eleTableClickSelection(this.$refs.sysOauthClientDetailsTable, row, column)
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
        this.searchParams.sort = scope.prop
        // 组件传递的order格式为'descending'/'ascending'
        this.searchParams.order = scope.order.split('ending')[0]
      }
      this.refreshTable()
    },
    /**
     * 新增记录
     */
    addNewSysOauthClientDetails: function () { // 新增记录
      var vm = this
      var formUrl = vm.formBaseUrl + 'add'
      openDialog('新增服务请求认证详情表', formUrl, {
        width: '800px',
        height: '500px',
        callback: function () {
          // 新增成功后刷新表格
          vm.refreshTable()
        }
      })
    },
    /**
     * 删除选中记录
     */
    deleteSelectedSysOauthClientDetails: function () {
      var vm = this
      var selections = vm.$refs.sysOauthClientDetailsTable.selection
      if (selections.length === 0) {
        direwolfCommonTips('warning', '请选择要删除的记录')
        return
      }
      direwolfCommonConfirm('数据删除后不可恢复，确定继续删除吗?', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      },function () {
        var ids = ''
        selections.forEach(function (select) {
          if (select.id) {
            ids += select.id + ','
          }
        })
        if (ids.length > 1) {
          ids = ids.substr(0, ids.length - 1)
          var formUrl =  vm.requestPrefix+'/sys/sysOauthClientDetails/deleteAll?ids=' + ids
          var info = '批量删除服务请求认证详情表'
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
     * 查看选中的记录
     */
    viewSelectedSysOauthClientDetails: function () {
      var selections = this.$refs.sysOauthClientDetailsTable.selection
      if (selections.length !== 1) {
        direwolfCommonTips('warning', '仅能选择一条记录进行查看')
        return
      }
      var formUrl = this.formBaseUrl +  'view&id=' + selections[0].id
      openDialogView('查看服务请求认证详情表', formUrl, {
        width: '800px',
        height: '500px'
      })
    },

    /**
     * 点击系统编码展示系统明细
     * @param scope
     */
    viewSelectedMsSystemInfo: function (scope) {
      var formUrl = this.formBaseUrl + 'view&id=' + scope.row.id
      openDialogView('查看服务请求认证详情表', formUrl, {
        width: '800px',
        height: '500px',
      })
    },
    /**
     * 修改选中行
     * @param scope 组件参数
     */
    editSelectedSysOauthClientDetails: function () {
      var vm = this
      var selections = vm.$refs.sysOauthClientDetailsTable.selection
      if (selections.length !== 1) {
        direwolfCommonTips('warning', '仅能选择一条记录进行修改')
        return
      }
      var formUrl = getRelativePath() + 'sysOauthClientDetailsForm.html?id=' + selections[0].id
      openDialog('修改服务请求认证详情表', formUrl, {
        width: '800px',
        height: '500px',
        callback: function (result) {
          vm.refreshTable()
        }
      })
    },
    /**
     * 删除当前行
     * @param scope 组件参数
     */
    sysOauthClientDetailsRecordRemove: function (scope) {
      var vm = this
      direwolfCommonConfirm('数据删除后不可恢复，确定继续删除吗?', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      },function () {
        var formUrl = vm.requestPrefix+ '/sys/sysOauthClientDetails/delete?id=' + scope.row.id
        var info = '删除服务请求认证详情表'
        axios.delete(formUrl).then(function (response) {
          var result = getDataFromAxiosResponse(response, info, true)
          result.type === 'success' && vm.refreshTable()
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      })
    },
    /**
     * 主表当前行变更，刷新子表
     * @param selection 当前行
     */
    handleSelectionChange: function(selection) {
    }
  },
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/sysOauthClientDetails/checkSysOauthClientDetailsListPermission')
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      vm.pageLoading = false
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'authorized_grant_types,autoapprove').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.refreshTable()
      }).catch(function (error) {
        // axiosErrorTips(error, info + '异常')
      })
    }).catch(function (error) {
      axiosErrorTips(error, '加载页面配置异常')
    })
  },
//   created: function () {
//     // axios.defaults.baseURL = dwCtx.CTX
//     // initElementUITheme()
//     // var vm = this
//     // // 请求所有字典，全部请求返回后再继续加载页面
//     // var dictUrl = '/common/getParamList?classCodes=authorized_grant_types,autoapprove'
//     // var info = '获取字典信息'
//     // axios.get(dictUrl).then(function (response) {
//     //   vm.pageDictMap = getDataFromAxiosResponse(response, info).data
//     //   vm.refreshTable()
//     // }).catch(function (error) {
//     //   axiosErrorTips(error, info + '异常')
//     // })
//       var vm = this
//       axios.get(getModuleConfigPath()).then(function (response) {
//         vm.msConfig = response.data
//         vm.pageLoading = false
//         // 请求所有字典，全部请求返回后再继续加载页面
//         var info = '获取字典信息'
//         axios.get(dictUrl + 'authorized_grant_types,autoapprove').then(function (response) {
//           vm.pageDictMap = getDataFromAxiosResponse(response, info).data
//           vm.refreshTable()
//         }).catch(function (error) {
//           axiosErrorTips(error, info + '异常')
//         })
//       }).catch(function (error) {
//         axiosErrorTips(error, '加载页面配置异常')
//       })
// /*    var tokenInfo = '获取TOKEN信息'
//     axios.get('/common/getToken').then(function (response) {
//       vm.pageToken = getDataFromAxiosResponse(response, tokenInfo).data
//       // 给所有的axios数据维护请求携带验证信息
//       axios.interceptors.request.use(function (config) {
//         var params = config.data
//         var type = config.method
//         var query = 'csrf=' + vm.pageToken
//         // 对服务器数据进行操作时，需要携带TOKEN信息
//         if ('POST' === type.toUpperCase()) {
//           config.data = params.concat(query)
//         } else if ('DELETE' === type.toUpperCase()) {
//           config.url = config.url.concat(config.url.indexOf('?') !== -1 ? "&" : "?").concat(query)
//         }
//         return config
//       }, function (error) {
//         return Promise.reject(error)
//       })
//     }).catch(function (error) {
//       axiosErrorTips(error, tokenInfo + '异常')
//     })*/
//   },
  mounted: function () {
  }
})
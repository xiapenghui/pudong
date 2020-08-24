// 查询参数初始值，重置按钮将使用该值
var defaultParams = {
  sysCode: '',
  sysName: '',
  sysDomain: '',
  valid: '',
  limit: 5,
  offset: 0,
  order: '',
  sort: '',
}

var msSystemInfoListContentVm = new Vue({
  el: '#msSystemInfoListContent',
  data: {
    /**
     * 微服务配置
     */
    msConfig: {},
    /**
     * 查询参数，包含表格分页参数
     */
    searchParams: JSON.parse(JSON.stringify(defaultParams)), // 拷贝初始值
    /**
     * 字段字典类型集合
     */
    fieldDictTypeMap: {
      'sysDomain': 'ms_system_biz_domain',
      'valid': 'y_n',
      'admin.userStatus': 'user_status',
    },
    /**
     * 页面字典集合
     */
    pageDictMap: {},
    /**
     * 系统信息表格分页数据
     */
    msSystemInfoTablePage: {},
    /**
     * 系统管理员表查询条件，包括父表选中记录及分页参数
     */
    msSystemAdminSearchParams: {
      sys: '-1',
      limit: 5,
      offset: 0,
      order: '',
      sort: '',
    },
    /**
     * 系统管理员表分页数据
     */
    msSystemAdminTablePage: {},
    /**
     * 页面加载状态
     */
    pageLoading: true,
    /**
     * 页面查看类型
     */
    editType: GetQueryString('editType'),
    /**
     * 系统管理员表加载状态
     */
    systemInfoLoading: false,
    /**
     * 系统管理员表表格加载状态
     */
    msSystemAdminTableLoading: false,
  },
  computed: {
    formBaseUrl: function () {
      return getRelativePath() + 'msSystemInfoForm.html?editType='
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
      return this.pageDictMap[this.fieldDictTypeMap[field]]
    },
    /**
     * 刷新表格，重新获取数据
     */
    refreshTable: function () { // 表格刷新方法
      var vm = this
      var dataUrl = vm.requestPrefix + '/platman/msSystemInfo/getMsSystemInfoList?' +
        jsonToSpringBinder(vm.searchParams)
      var info = '获取微服务系统信息记录'
      vm.systemInfoLoading = true
      axios.get(dataUrl).then(function (response) {
        vm.msSystemInfoTablePage = getDataFromAxiosResponse(response, info)
        vm.systemInfoLoading = false
        // 加载成功后自动选中第一行以刷新子表
        vm.$nextTick(function () {
          var table = vm.$refs.msSystemInfoTable
          if (table.tableData.length > 0) {
            table.toggleRowSelection(table.tableData[0], true)
          }
        })
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
      eleTableClickSelection(this.$refs.msSystemInfoTable, row, column)
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
    addNewMsSystemInfo: function () {
      var formUrl = this.formBaseUrl + 'add'
      var vm = this
      openDialog('新增微服务系统信息', formUrl, {
        width: '800px',
        height: '500px',
        callback: function () {
          // 新增成功后刷新表格
          vm.refreshTable()
        },
      })
    },
    /**
     * 删除选中记录
     */
    deleteSelectedMsSystemInfo: function () {
      var vm = this
      var selections = vm.$refs.msSystemInfoTable.selection
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
        }
        var formUrl = vm.requestPrefix + '/platman/msSystemInfo/deleteAll?ids=' + ids
        var info = '批量删除微服务系统信息'
        axios.delete(formUrl).then(function (response) {
          var result = getDataFromAxiosResponse(response, info, true)
          result.type === 'success' && vm.refreshTable()
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      })
    },
    /**
     * 点击系统编码展示系统明细
     * @param scope
     */
    viewSelectedMsSystemInfo: function (scope) {
      var formUrl = this.formBaseUrl + 'view&id=' + scope.row.id
      openDialogView('查看微服务系统信息', formUrl, {
        width: '800px',
        height: '500px',
      })
    },
    /**
     * 修改选中的记录
     */
    editMsSystemInfoRecord: function () {
      var vm = this
      var selections = this.$refs.msSystemInfoTable.selection
      if (selections.length !== 1) {
        direwolfCommonTips('warning', '仅能选择一条记录进行修改')
        return
      }
      openDialog('修改微服务系统信息',
        vm.formBaseUrl + 'edit&id=' + selections[0].id,
        {
          width: '800px',
          height: '500px',
          callback: function () {
            vm.refreshTable()
          },
        })
    },
    /**
     * 主表当前行变更，刷新子表
     * @param selection 当前行
     */
    handleSelectionChange: function (selection) {
      if (selection.length === 1) {
        this.msSystemAdminSearchParams.sys = selection[0].id
        this.refreshMsSystemAdminTable()
      }
    },
    /**
     * 系统管理员表行点击事件
     * @param row 行数据
     * @param event 原生事件
     * @param column 点击位置所在列
     */
    handleMsSystemAdminRowClick: function (row, event, column) {
      eleTableClickSelection(this.$refs.msSystemAdminTable, row, column)
    },
    /**
     * 系统管理员表分页大小变更
     * @param val 新值
     */
    handleMsSystemAdminTableSizeChange: function (val) {
      this.msSystemAdminSearchParams.limit = val
      this.refreshMsSystemAdminTable()
    },
    /**
     * 系统管理员表格页码变更
     * @param val 当前页码
     */
    handleMsSystemAdminTableCurrentChange: function (val) {
      this.msSystemAdminSearchParams.offset = this.msSystemAdminSearchParams.limit * (val - 1)
      this.refreshMsSystemAdminTable()
    },
    /**
     * 刷新系统管理员表
     */
    refreshMsSystemAdminTable: function () {
      // 定义子表数据获取URL
      var vm = this
      var msSystemAdminUrl = vm.requestPrefix + '/platman/msSystemAdmin/getMsSystemAdminList?' +
        jsonToSpringBinder(vm.msSystemAdminSearchParams)
      var info = '获取租户信息信息'
      vm.msSystemAdminTableLoading = true
      axios.get(msSystemAdminUrl).then(function (response) {
        vm.msSystemAdminTablePage = getDataFromAxiosResponse(response, info)
        vm.msSystemAdminTableLoading = false
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
    /**
     * 新增系统管理员记录
     */
    addNewMsSystemAdmin: function () {
      var vm = this
      var config = { height: '400px', width: '250px' }
      var params = {}
      var url = '/common-assets/pages/lazyTreeSelect.html?url=' + WEB_ROOT + '/sys/org/getOrgList&expendURL=' +
        encodeURIComponent( WEB_ROOT + '/sys/user/getUserTreeListOfExpand?roleId=2780e66aa97b480898d377831fb2084c') +
        '&parentKeyOfLeaf=orgId&multiple=T&searchUrl=' +
        encodeURIComponent( WEB_ROOT + '/sys/role/searchUserList?roleId=2780e66aa97b480898d377831fb2084c') +
        '&pIdKeyOfParent=parentId&nameKeyOfParent=orgName&' + $.param(params)
      top.layer.open({
        type: 2,
        area: [config.width, config.height],
        title: '选择用户',
        maxmin: false,
        content: url,
        btn: ['确定', '关闭'],
        zIndex: getTopIndex(),
        yes: function (index, layero) {
          var tree = layero.find('iframe')[0].contentWindow.tree
          var node = tree.getSelectedNodes()[0] // 获取到选择的节点
          if (node.isParent) {
            direwolfCommonTips('warning', '不能选择单位节点')
            return
          }
          // TODO 多人选择
          axiosRequest(vm.requestPrefix + '/platman/msSystemAdmin/save',
            '保存租户信息', 'POST', {
              sys: { id: vm.msSystemAdminSearchParams.sys },
              admin: { id: node.id },
            }).then(function (result) {
            if (result && result.type === 'success') {
              top.layer.close(index)
              vm.refreshMsSystemAdminTable()
            }
          })
        },
        cancel: function (index) {
          setTimeout(function () {
            top.layer.close(index)
          }, 100)
        },
      })
    },
    /**
     * 删除选择的租户信息记录
     */
    deleteSelectedMsSystemAdmin: function () {
      var selections = this.$refs.msSystemAdminTable.selection
      var vm = this
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
        }
        var url = vm.requestPrefix + '/platman/msSystemAdmin/deleteAll?ids=' + ids
        var info = '批量删除系统管理员'
        axios.delete(url).then(function (response) {
          var result = getDataFromAxiosResponse(response, info, true)
          result.type === 'success' && vm.refreshMsSystemAdminTable()
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      })
    },
    /**
     * 查看系统管理员记录
     * @param scope 组件参数
     */
    viewSelectedMsSystemAdmin: function (scope) {
      var formUrl = getProjectPath() + '/sys-app/pages/userForm.html?editType=view&id=' + scope.row.admin.id
      openDialogView('查看租户信息', formUrl, {
        width: '800px',
        height: '500px',
      })
    },
    configSystemInfo: function () {
      var selections = this.$refs.msSystemInfoTable.selection
      var vm = this
      if (selections.length === 0) {
        direwolfCommonTips('warning', '请选择要配置的系统')
        return
      }
      window.location.href = './msSystemConfigCenter.html?sysId=' + selections[0].id
    },
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(vm.requestPrefix + '/platman/msSystemInfo/checkMsSystemInfoListPermission')
      // 根据当前用户身份判断数据是否可编辑
      axiosRequest(vm.requestPrefix + '/platman/msSystemInfo/getEditType', '获取系统信息').then(function (result) {
        vm.pageLoading = false
        vm.editType = result.data
      })
      // 请求所有字典，全部请求返回后再继续加载页面
      axiosRequest(dictUrl + 'ms_system_biz_domain,y_n,user_status', '获取字典信息').then(function (result) {
        vm.pageDictMap = result.data
        vm.refreshTable()
      })
    })
  },
  mounted: function () { },
})

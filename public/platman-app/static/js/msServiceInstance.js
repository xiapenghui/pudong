var msServiceInstanceContentVm = new Vue({
  el: '#msServiceInstanceContent',
  data: {
    /**
     * 页面加载状态
     */
    pageLoading: false,
    /**
     * 服务实例列表数据
     */
    msServiceInstanceList: [],
    /**
     * 服务实例选中行元数据
     */
    selectedInstanceMetadata: {},
  },
  computed: {
    requestPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  methods: {
    /**
     * 查看实例自定义元数据
     * @param row
     */
    viewInstanceMetadata: function (row) {
      this.selectedInstanceMetadata = row.metadata
      this.$nextTick(function () {
        // 此处由于使用的是页面元素内容，无法弹到顶层页面
        layer.open({
          title: '查看元数据',
          type: 1,
          content: $('#metadataForm'),
          area: ['500px', '400px'],
        })
      })
    },
    /**
     * 下线实例
     */
    offlineInstance: function (scope) {
      var vm = this
      direwolfCommonConfirm({
        message: '确定将此实例下线吗?',
        title: '下线提醒',
      }, function () {
        var statusUrl = vm.requestPrefix + '/platman/msServiceInfo/status/' + scope.row.app + '/' +
          scope.row.instanceId +
          '?status=OUT_OF_SERVICE'
        var info = '实例下线'
        axios.get(statusUrl).then(function (response) {
          getDataFromAxiosResponse(response, info, true)
          layer.closeAll()
          direwolfCommonTips('由于服务实例刷新需要时间，请等待30秒再查看新的实例状态')
          vm.refreshTable()
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      })
    },
    /**
     * 上线实例
     */
    onlineInstance: function (scope) {
      var vm = this
      direwolfCommonConfirm({
        message: '确定将此实例上线吗?',
        title: '上线提醒',
      }, function () {
        var statusUrl = vm.requestPrefix + '/platman/msServiceInfo/status/' + scope.row.app + '/' +
          scope.row.instanceId +
          '?status=UP'
        var info = '实例上线'
        axios.get(statusUrl).then(function (response) {
          getDataFromAxiosResponse(response, info, true)
          vm.refreshTable()
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      })
    },
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(vm.requestPrefix + '/platman/msServiceInfo/checkMsServiceInstancePermission')
      vm.pageLoading = false
      var info = '获取微服务实例明细'
      axios.get(vm.requestPrefix + '/platman/msServiceInfo/listServiceInstances?serviceCode=' +
        GetQueryString('serviceCode') + '&status=' + GetQueryString('status')).then(function (response) {
        vm.msServiceInstanceList = getDataFromAxiosResponse(response, info).data
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    })
  },
  mounted: function () {
  },
})
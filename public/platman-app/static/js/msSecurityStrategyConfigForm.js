var msSecurityStrategyConfigFormVm = new Vue({
  el: '#msSecurityStrategyConfigForm',
  data: function () {
    function checkService (rule, value, callback) {
      if (value.serviceName && value.id) {
        callback()
      } else {
        callback(new Error('服务不能为空'))
      }
    }

    return {
      /**
       * 微服务配置
       */
      msConfig: {},
      /**
       * 实体对象数据
       */
      entity: {
        /**
         * 主键
         */
        id: GetQueryString('id') || '',
        /**
         * 策略名称
         */
        strategyName: '',
        /**
         * 系统
         */
        sys: { id: '' },
        /**
         * 用户名
         */
        userName: '',
        /**
         * 口令
         */
        userPassword: '',
        /**
         * 加密口令
         */
        encryptPassword: '',
        /**
         * 头参数名称
         */
        headerName: '',
      },
      /**
       * 页面TOKEN，请求维护后台数据时须携带
       */
      pageToken: '',
      /**
       * 页面字典集合
       */
      pageDictMap: {},
      /**
       * 页面编辑类型，控制页面组件是否可用
       */
      editType: GetQueryString('editType'),
      msSysList: [],
      sysLoading: false,
      /**
       * 校验规则，对应页面el-form-item的prop属性值
       */
      rules: {
        service: [
          { required: true, validator: checkService, message: '服务不能为空', trigger: 'change' },
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
        ],
        userPassword: [
          { required: true, message: '用户密码不能为空', trigger: 'change' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
        headerName: [
          { required: true, message: '头参数名称不能为空', trigger: 'change' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] +
        '/platman/msSecurityStrategyConfig'
    },
    requestPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initFormData: function () {
      var vm = this
      var pkValue = this.entity.id
      if (pkValue) {
        var url = vm.urlPrefix + '/getMsSecurityStrategyConfigList?id=' + pkValue
        var info = '获取安全策略信息'
        axios.get(url).then(function (response) {
          var page = getDataFromAxiosResponse(response, info)
          if (page.list && page.list[0]) {
            vm.entity = page.list[0]
          }
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
        this.getSysListByUser('')
      }
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
      checkPagePermission(vm.urlPrefix + '/checkMsSecurityStrategyConfigFormPermission')
      vm.initFormData()
    })
  },
  mounted: function () {
    var vm = this
    // 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    window.doSubmit = function (callback) {
      // 对表单数据进行校验
      vm.$refs['msSecurityStrategyConfigForm'].validate(function (valid) {
        if (valid) {
          var info = '保存安全策略信息'
          axios.post(vm.urlPrefix + '/save', vm.entity).then(function (response) {
            var result = getDataFromAxiosResponse(response, info)
            if (result && result.type === 'success') {
              callback(result)
            }
          }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
          })
          return false
        }
        direwolfCommonTips('error', '内容填写有误，请修改后再提交')
      })
      return false
    }
  },
})
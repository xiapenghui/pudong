var serviceCode_serviceNameJson = {}

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
      /* /!**
        * 微服务配置
        *!/
       msConfig: {},*/
      /**
       * 实体对象数据
       */
      entity: {
        id: GetQueryString('id'),
        sysParamCode: GetQueryString('sysParamCode'),// 系统代码
        sysParamValue: '',// 参数值
        application: '',//
        profile: '',//
        label: '',//
        appId: '1',
      },
      /**
       * 页面查看类型，上个页面传来的的editType是add还是edit
       */
      editType: GetQueryString('editType'),
      /**
       * 上个页面传来的的sysId，用于查找所有serviceName对应服务选择applicationSelect下拉框
       */
      sysId: GetQueryString('sysId'),
      applicationSelect: [],
      profileSelect: ['dev', 'test', 'prod'],
      labelSelect: ['master', 'test'],
      /**
       * 校验规则，对应页面el-form-item的prop属性值
       */
      rules: {
        application: [
          { required: true, message: '服务名称不能为空', trigger: 'change' },
          { max: 100, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
        profile: [
          { required: true, message: '环境不能为空', trigger: 'change' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
        label: [
          { required: true, message: '分支不能为空', trigger: 'change' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
        sysParamCode: [
          { required: true, message: '配置项不能为空', trigger: 'change' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
        sysParamValue: [
          { required: true, message: '参数值不能为空', trigger: 'change' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
        ],
      },
      urlPrefixSys: commonConfig.sysBackendContext,
    }
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(vm.urlPrefixSys + '/sys/sysParam/checkSysParamFormPermission')
      vm.initFormData()
    })
  },
  computed: {
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initFormData: function () {
      var vm = this
      var getMsServiceInfoListUrl = vm.urlPrefix +
        '/platman/msServiceInfo/getAllMsServiceInfoServiceCodeAndServiceNameBySysId?sysId=' + vm.sysId
      // var getMsServiceInfoListUrl = vm.urlPrefix + '/platman/msServiceInfo/getAllMsServiceInfoServiceCodeAndServiceNameBySysId?sysId=b71b215c48d74632b4d282f83b910117';
      //获取所有serviceCode并填充到applicationSelect
      axiosRequest(getMsServiceInfoListUrl, '获取服务列表').then(function (data) {
        vm.applicationSelect = data
        for (var i in data) {
          serviceCode_serviceNameJson[data[i].serviceCode] = data[i].serviceName
        }
        vm.getSystemBySysParamCode()
      })

    },
    getSystemBySysParamCode: function () {
      var vm = this
      var sysParamCode = vm.entity.sysParamCode
      if (sysParamCode) {
        var url = vm.urlPrefixSys + '/sys/sysParam/getSysParamList?sysParamCode=' + sysParamCode
        axiosRequest(url, '获取配置项信息').then(function (data) {
          if (data.list && data.list[0]) {
            vm.entity = data.list[0]
            vm.entity.application = vm.entity.application.toUpperCase()
          }
        })
      }
    },
  },
  mounted: function () {
    var vm = this
    // 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    window.doSubmit = function (callback) {
      // 对表单数据进行校验
      vm.$refs['msSecurityStrategyConfigForm'].validate(function (valid) {
        if (valid) {
          axiosRequest(vm.urlPrefixSys + '/sys/sysParam/save', '保存配置项信息', 'POST', vm.entity).then(function (data) {
            if (data && data.type === 'success') {
              callback(data)
            }
          })
          return false
        }
        direwolfCommonTips('error', '内容填写有误，请修改后再提交')
      })
      return false
    }
  },
})

var msServiceInfoFormVm = new Vue({
  el: '#msServiceInfoForm',
  data: function () {
    return {
      /**
       * 微服务配置
       */
      msConfig: {},
      entity: {
        version: 0,
        id: GetQueryString('id') || '', // 主键
        sysId: GetQueryString('sysId'), // 系统主键
        serviceCode: '', // 服务编码_            命名规则：应用系统_服务编码
        serviceName: '', // 名称
        serviceDesc: '', // 描述
        status: '', // 状态
        swaggerUrl: '', // 在线文档
        createUser: '', // 创建人
        createTime: '', // 创建时间
        modifyUser: '', // 最后修改人
        modifyTime: '', // 最后修改时间
      },
      dictMap: {
        'status': 'ms_service_status',
      },
      pageDicts: {}, // 页面字典
      editType: GetQueryString('editType'), // 表单编辑类型
      rules: {
        serviceCode: [
          { required: true, message: '服务编码不能为空', trigger: 'change' },
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
        ],
        serviceName: [
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
        ],
        serviceDesc: [
          { max: 1000, message: '长度不能超过 1000 个字符', trigger: 'change' },
        ],
        status: [
          { max: 15, message: '长度不能超过 15 个字符', trigger: 'change' },
        ],
        swaggerUrl: [
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] + '/platman/msServiceInfo'
    },
  },
  methods: {
    initFormData: function () {
      // 加载传入的数据
      var pkValue = this.entity.id
      if (pkValue) {
        var url = this.urlPrefix + '/getMsServiceInfoList?id=' + pkValue
        var info = '获取微服务信息'
        axios.get(url).then(function (response) {
          var page = getDataFromAxiosResponse(response, info)
          if (page.list && page.list[0]) {
            msServiceInfoFormVm.entity = page.list[0]
          }
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      }
    },
    getDictByField: function (field) {
      return this.pageDicts[this.dictMap[field]]
    },
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(vm.urlPrefix + '/checkMsServiceInfoFormPermission')
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'ms_service_status').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.initFormData()
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    })
  },
  mounted: function () {
    var vm = this
    window.doSubmit = function (callback) {// 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
      vm.$refs['msServiceInfoForm'].validate(function (valid) {
        if (valid) {
          var info = '保存微服务信息'
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
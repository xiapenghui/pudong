var sysOauthClientDetailsFormVm = new Vue({
  el: '#sysOauthClientDetailsForm',
  data: function () {
    return {
      /**
       * 实体对象数据
       */
      entity: {
        /**
         * 主键
         */
        id: GetQueryString('id') || '',
        /**
         * 客户端
         */
        clientId: '',
        /**
         * 访问密匙
         */
        clientSecret: '',
        /**
         * 申请权限范围
         */
        scope: '',
        /**
         * 支持的授权类型多值数组
         */
        authorizedGrantTypesArray: [],
        /**
         * 重定向URI
         */
        webServerRedirectUri: '',
        /**
         * 拥有的权限值
         */
        authorities: '',
        /**
         * access_token的有效时间(秒)
         */
        // accessTokenValidity: 0,
        /**
         * refresh_token的有效时间(秒)
         */
        // refreshTokenValidity: 0,
        /**
         * 用户是否自动操作, 默认值为 'false'
         */
        autoapprove: "true",
      },
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
       * 页面编辑类型，控制页面组件是否可用
       */
      editType: GetQueryString('editType'),
      /**
       * 页面TOKEN，请求维护后台数据时须携带
       */
      pageToken: '',
      /**
       * 校验规则，对应页面el-form-item的prop属性值
       */
      rules: {
        clientId: [
          { required: true, message: '客户端不能为空', trigger: 'change' },
          { max: 32, message: '长度不能超过 32 个字符', trigger: 'change' },
        ],
        clientSecret: [
          { required: true, message: '访问密钥不能为空', trigger: 'change' },
          { max: 256, message: '长度不能超过 256 个字符', trigger: 'change' },
        ],
        scope: [
          { required: true, message: '申请权限不能为空', trigger: 'change' },
          { max: 256, message: '长度不能超过 256 个字符', trigger: 'change' },
        ],
        authorizedGrantTypesArray: [
          { required: true, message: '支持的授权类型不能为空', trigger: 'change' },
          { validator: checkArrayStrLen, max: 256, name: '支持的授权类型', trigger: 'change' },
        ],
        webServerRedirectUri: [
          { max: 256, message: '长度不能超过 256 个字符', trigger: 'change' },
        ],
        authorities: [
          { max: 256, message: '长度不能超过 256 个字符', trigger: 'change' },
        ],
        accessTokenValidity: [
          { validator: checkTokenNumber, max: 11, precision: 0, name: 'access_token的有效时间(秒)', trigger: 'change' },
        ],
        refreshTokenValidity: [
          { validator: checkTokenNumber, max: 11, precision: 0, name: 'refresh_token的有效时间(秒)', trigger: 'change' },
        ],
        autoapprove: [
          { required: true, message: '用户是否自动操作不能为空', trigger: 'change' },
          { max: 256, message: '长度不能超过 256 个字符', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] + '/sys/sysOauthClientDetails'
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
        var url = this.urlPrefix + '/getSysOauthClientDetailsList?id=' + pkValue
        var info = '获取服务请求认证详情表信息'
        axios.get(url).then(function (response) {
          var page = getDataFromAxiosResponse(response, info)
          if (page.list && page.list[0]) {
            vm.entity = page.list[0]
          }
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      }
    },
    /**
     * 根据字段获取字典列表
     * @param field 字段
     * @returns {*} 字典列表
     */
    getDictByField: function (field) {
      return this.pageDictMap[this.fieldDictTypeMap[field]]
    },
  },
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/sysOauthClientDetails/checkSysOauthClientDetailsFormPermission')
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'authorized_grant_types,autoapprove').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.initFormData()
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    }).catch(function (error) {
      axiosErrorTips(error, '加载页面配置异常')
    })
    /*var tokenInfo = "获取TOKEN信息"
    axios.get("/common/getToken").then(function (response) {
      vm.pageToken = getDataFromAxiosResponse(response, tokenInfo).data
      axios.interceptors.request.use(function (config) {
        var params = config.data
        var type = config.method
        var query = 'csrf=' + vm.pageToken
        // 对服务器数据进行操作时，需要携带TOKEN信息
        if ('POST' === type.toUpperCase()) {
          config.data = params.concat(query)
        } else if ('DELETE' === type.toUpperCase()) {
          config.url = config.url.concat(config.url.indexOf('?') !== -1 ? "&" : "?").concat(query)
        }
        return config
      }, function (error) {
        return Promise.reject(error)
      })
    }).catch(function (error) {
      axiosErrorTips(error, tokenInfo + '异常')
    })*/
  },
  mounted: function () {
    var vm = this
    // 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    window.doSubmit = function (callback) {
      // 对表单数据进行校验
      vm.$refs['sysOauthClientDetailsForm'].validate(function (valid) {
        if (valid) {
          var info = '保存服务请求认证详情表'
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
  }
})

function checkTokenNumber (rule, value, callback) {
  // 将值转为字符串，以使用其索引查找方法
  value += ''
  var pattern = /^(-|\+)?([1-9]\d*(\.?\d+)?|0\.\d*|0)$/g
  // 不接受正号开头
  if (!rule.acceptPositive) {
    pattern = /^(-)?([1-9]\d*(\.?\d+)?|0\.\d*|0)$/g
  }
  var reg = new RegExp(pattern)
  if (value.length > rule.max) {
    callback(new Error(rule.name + '长度不能超过 ' + rule.max + ' 个字符'))
  } else if (value!=""&&value!="undefined" && value!="null" && !reg.test(value)) {
    callback(new Error(rule.name + '必须是数字'))
  } else if (value.indexOf('.') === value.lastIndexOf('.') && value.indexOf('.') !== -1) {
    if (!rule.precision || rule.precision <= 0) {
      callback(new Error(rule.name + '必须是整数'))
    } else if (value.split('.')[1].length > rule.precision) {
      callback(new Error(rule.name + '小数不能超过 ' + rule.precision + ' 位'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
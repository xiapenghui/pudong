var msSystemInfoFormVm = new Vue({
  el: '#msSystemInfoForm',
  data: function () {
    var vm = this

    // 系统编码不接受点号，否则与微服务命名规则冲突
    function dontAcceptDot (rule, value, callback) {
      if (value.indexOf('.') !== -1) {
        callback(new Error(rule.name + '不能包含字符"."'))
      } else {
        callback()
      }
    }

    // 系统编码进行唯一性校验
    function uniqueCodeValidator (rule, value, callback) {
      var url = vm.urlPrefix + '/uniqueCodeValidator?id=' + (vm.entity.id || '-1') + '&systemCode=' + value
      var info = '校验系统编码是否重复'
      axios.get(url).then(function (response) {
        var result = getDataFromAxiosResponse(response, info)
        if (result.data === 'T') {
          callback()
        } else {
          callback(new Error('填写的系统编号已存在，请重新输入'))
        }
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    }

    // 简单校验URI的规则
    function checkURIPath (rule, value, callback) {
      var pattern = /^\/(([a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+\/)*([a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+$/g
      var reg = new RegExp(pattern)
      if (value.length > 100) {
        callback(new Error(rule.name + '长度不得超过100字符'))
      } else if (!reg.test(value)) {
        callback(new Error(rule.name + '必须以/开头，必须符合URI规则'))
      } else {
        callback()
      }
    }

    // 根路径在全局范围内唯一
    function uniqueRootValidator (rule, value, callback) {
      var url = vm.urlPrefix + '/uniqueRootValidator?id=' + (vm.entity.id || '-1') + 'rootPath=' + value
      var info = '校验根路径是否重复'
      axios.get(url).then(function (response) {
        var result = getDataFromAxiosResponse(response, info)
        if (result.data === 'T') {
          callback()
        } else {
          callback(new Error('填写的根路径已存在，请重新输入'))
        }
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
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
         * 编码
         */
        sysCode: '',
        /**
         * 名称
         */
        sysName: '',
        /**
         * 描述
         */
        sysDesc: '',
        /**
         * 业务域
         */
        sysDomain: '',
        /**
         * 根路径
         */
        rootPath: '',
        /**
         * 是否有效
         */
        valid: '1',
        /**
         * 默认AES加密
         */
        authType: '02',
        /**
         * 授权码
         */
        authCode: '',
        /**
         * 最大服务实例数
         */
        maxAppInstanceNum: 20,
      },
      /**
       * 授权临时信息，用于存储变更前的授权信息以供恢复
       */
      tempAuth: {
        /**
         * 默认BCrypt加密
         */
        authType: '',
        /**
         * 授权码
         */
        authCode: '',
      },
      /**
       * 字段字典类型集合
       */
      fieldDictTypeMap: {
        'sysDomain': 'ms_system_biz_domain',
        'valid': 'y_n',
        'authType': 'ms_sys_auth_type',
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
       * 校验规则，对应页面el-form-item的prop属性值
       */
      rules: {
        sysCode: [
          { required: true, message: '编码不能为空', trigger: 'blur' },
          { max: 50, message: '长度不能超过 50 个字符', trigger: 'change' },
          { validator: dontAcceptDot, name: '编码', trigger: 'change' },
          { validator: uniqueCodeValidator, trigger: 'blur' },
        ],
        sysName: [
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' },
        ],
        sysDesc: [
          { max: 1000, message: '长度不能超过 1000 个字符', trigger: 'blur' },
        ],
        sysDomain: [
          { required: true, message: '业务域不能为空', trigger: 'blur' },
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
        ],
        rootPath: [
          { required: true, message: '根路径不能为空', trigger: 'blur' },
          { validator: checkURIPath, name: '根路径', trigger: 'change' },
          { validator: uniqueRootValidator, trigger: 'blur' },
        ],
        valid: [
          { max: 10, message: '长度不能超过 10 个字符', trigger: 'change' },
        ],
        authCode: [
          { required: true, message: '授权码不能为空', trigger: 'blur' },
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
        ],
        maxAppInstanceNum: [
          { required: true, message: '最大服务实例数不能为空', trigger: 'change' },
          { validator: checkNumber, max: 5, precision: 0, name: '最大服务实例数', trigger: 'change', acceptPositive: false },
        ],
      },
    }
  },
  computed: {
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] + '/platman/msSystemInfo'
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
        var url = this.urlPrefix + '/getMsSystemInfoList?id=' + pkValue
        var info = '获取微服务系统信息'
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
    /**
     * 设置根路径默认值为系统编码
     * @param event
     */
    setDefaultRootPath: function (event) {
      // 如果根路径尚未设置，设置其默认值
      if (!this.entity.rootPath) {
        this.entity.rootPath = '/' + event.currentTarget.value
      }
    },
    /**
     * 根据系统编码生成授权码
     */
    generateNewCode: function () {
      var vm = this
      if (!vm.entity.sysCode || !vm.entity.authType) {
        direwolfCommonTips('warning', '系统编码及授权码类型不能为空')
        return
      }

      function getNewCode () {
        var url = vm.urlPrefix + '/newSystemAuthCode?&authType=' + vm.entity.authType + '&sysCode=' +
          vm.entity.sysCode
        var info = '获取系统授权码'
        axios.get(url).then(function (response) {
          vm.entity.authCode = getDataFromAxiosResponse(response, info).data
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      }

      if (vm.entity.authCode) {
        direwolfCommonConfirm({
          message: '授权信息变更后需及时告知系统租户，确定继续吗?',
          title: '变更提醒',
        }, getNewCode)
      } else {
        getNewCode()
      }
    },
    /**
     * 授权码类型下拉显隐变更事件
     */
    handleAuthTypeDropVisible: function (visible) {
      // 每次下拉框出现时将原授权信息备份
      if (visible) {
        this.tempAuth = {
          authType: this.entity.authType,
          authCode: this.entity.authCode,
        }
      }
    },
    /**
     * 授权码类型变更事件
     */
    handleAuthTypeChange: function () {
      var vm = this
      direwolfCommonConfirm({
        message: '授权信息变更后需及时告知系统租户，确定继续吗?',
        title: '变更提醒',
      }, function () {
        // 确认变更后，清空原授权码使用户重新生成
        vm.entity.authCode = null
      }, function () {
        // 取消变更后，还原备份的授权信息
        vm.entity.authCode = vm.tempAuth.authCode
        vm.entity.authType = vm.tempAuth.authType
      })
    },
  },
  beforeCreate: function () {
  },
  created: function () {
    var vm = this
    initConfig(function (data) {
      vm.msConfig = data
      checkPagePermission(vm.urlPrefix + '/checkMsSystemInfoFormPermission')
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'ms_system_biz_domain,y_n,user_status,ms_sys_auth_type').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.initFormData()
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    })
  },
  mounted: function () {
    var vm = this
    // 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    window.doSubmit = function (callback) {
      eleFormSubmit({
        vueIns: vm,
        info: '保存微服务系统信息',
        formRef: 'msSystemInfoForm',
        saveUrl: vm.urlPrefix + '/save',
        callback: callback,
      })
      return false
    }
  },
})
<template>
    <el-form class="with-border" ref="msGatewayRouteConfigForm" label-position="right" size="small" label-width="100px"
             :model="entity" :rules="rules">
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <el-form-item prop="routeName" label="路由名称">
                    <el-input placeholder="请输入路由名称" v-model="entity.routeName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="routeSort" label="路由排序">
                    <el-input-number v-model="entity.routeSort" :step="1" :precision="0"
                                     controls-position="right"></el-input-number>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <el-form-item prop="requestUri" label="请求地址">
                    <el-input placeholder="请输入请求地址" v-model="entity.requestUri">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="自动启用配置">
                    <el-switch v-model="entity.routeEnabled" active-value="1" inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="12">
                <el-form-item prop="sysId" label="系统">
                    <el-select :popper-append-to-body="false" v-model="entity.sysName" filterable :clearable="false"
                               remote placeholder="输入关键字搜索系统" :remote-method="getSysListByUser" :loading="sysLoading"
                               @focus="handleSysParamFocus" @change="handleSystemChange">
                        <el-option v-for="item in msSysList" :key="item.id" :label="item.sysName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="serviceId" label="服务">
                    <el-select :popper-append-to-body="false" v-model="entity.serviceName" filterable :clearable="false"
                               remote placeholder="输入关键字搜索服务" :remote-method="getServiceListByUser"
                               :loading="serviceLoading" @focus="handleServiceParamFocus" @change="handleServiceChange">
                        <el-option v-for="item in msServiceList" :key="item.id" :label="item.serviceName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" v-show="grayScaleRelease === '0'">
            <el-col :span="12">
                <el-form-item prop="routeUri" label="路由地址">
                    <el-tooltip :content="routePath || ''" placement="top">
                        <el-input :placeholder="showServiceButton ? '请选择服务' : '请输入路由地址'"
                                  v-model="routePath" :readOnly="routePathDisabled" class="input-with-select-prepend">
                            <el-select :popper-append-to-body="false" v-model="routeProtocol" slot="prepend"
                                       @change="handleRouteProtocolChange">
                                <el-option label="lb://" value="lb://"></el-option>
                                <el-option label="ws://" value="ws://"></el-option>
                                <el-option label="lb:ws://" value="lb:ws://"></el-option>
                                <el-option label="http://" value="http://"></el-option>
                                <el-option label="https://" value="https://"></el-option>
                            </el-select>
                        </el-input>
                    </el-tooltip>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="请求方式">
                    <el-select multiple :popper-append-to-body="false" v-model="entity.requestMethods"
                               placeholder="请选择类型">
                        <el-option v-for="param in methodList" :key="param.value" :label="param.value"
                                   :value="param.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col v-show="grayScaleRelease === '1'">
                <el-button-group v-if="editType !== 'view'" style="margin-top: 5px;margin-bottom: 5px;">
                    <el-button size="mini" icon="el-icon-plus" @click="addGrayScaleRelease">新增
                    </el-button>
                </el-button-group>
                <el-table size="medium" stripe border tooltip-effect="dark"
                          style="width: 100%;"
                          ref="grayScaleReleaseTable" :data="grayScaleReleaseList"
                          @row-click="handleGrayScaleReleaseRowClick">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="uri" label="地址">
                    </el-table-column>
                    <el-table-column prop="weight" label="权重" width="90">
                    </el-table-column>
                    <el-table-column prop="operation" label="操作" width="70">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="deleteGrayScaleRelease(scope)"
                                       icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
  import { backendContext } from '../config'
  import GrayScaleReleaseDetail from './GrayScaleReleaseDetail'

  export default {
    name: 'msGatewayRouteConfigDetail',
    props: {
      /**
       * 页面编辑类型
       */
      editType: {
        default: 'view',
      },
      /**
       * 主键
       */
      id: String,
      /**
       * 是否为灰度发布
       */
      grayScaleRelease: {
        default: '0',
      },
    },
    data () {
      const vm = this

      function checkRoute (rule, value, callback) {
        if (vm.grayScaleRelease === '0') {
          if (!value || value.indexOf('//') === -1 || value.indexOf('//') === value.length - 2) {
            callback(new Error('路由地址不能为空'))
          } else if (value.startsWith('lb:') && !vm.entity.serviceId) {
            callback(new Error('负载均衡地址必须选择有效的微服务'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      return {
        entity: {
          grayScaleRelease: '0',
          /**
           * 路由名称
           */
          routerName: '',
          /**
           * 路由描述，文本信息
           */
          routerDesc: '',
          /**
           * 路由排序
           */
          routeSort: 0,
          /**
           *服务主键
           */
          serviceId: '',
          /**
           * 路由地址
           */
          routeUri: '',
          /**
           *系统主键
           */
          sysId: '',
          /**
           * 是否启用安全策略
           */
          enableSecStrategy: '0',
          /**
           * 安全策略主键
           */
          secStrategyId: '',
          /**
           * 服务名称
           */
          serviceName: '',
          /**
           * 请求地址
           */
          requestUri: '',
          /**
           * 请求方式
           */
          requestMethods: [],
          /**
           * 路由是否启用
           */
          routeEnabled: '0',
        },
        /**
         * 远程加载系统列表
         */
        sysLoading: false,
        /**
         * 系统列表
         */
        msSysList: [],
        /**
         * 远程加载服务列表
         */
        serviceLoading: false,
        /**
         * 服务列表
         */
        msServiceList: [],
        methodPredicate: {
          predicateType: 'Method',
          predicateValue: [],
        },
        timePredicate: {
          predicateValue: '',
        },
        rateLimiter: { name: '', keyResolverName: '', burstCapacity: '', replenishRate: '' },
        /**
         * 数据加载状态
         */
        dataLoading: !!vm.id,
        /**
         * 路由协议
         */
        routeProtocol: 'lb://',
        /**
         * 路由路径
         */
        routePath: '',
        /**
         * 路由路径是否可编辑
         */
        routePathDisabled: true,
        /**
         * 字段字典类型集合
         */
        fieldDictTypeMap: {
          'enableSecStrategy': 'y_n',
          'predicateType': 'ms_gateway_predicate_type',
        },
        /**
         * 页面字典集合
         */
        pageDictMap: {},
        /**
         * 校验规则，对应页面el-form-item的prop属性值
         */
        rules: {
          sysId: [
            { required: true, message: '系统不能为空', trigger: 'change' },
          ],
          serviceId: [
            { required: true, message: '服务不能为空', trigger: 'change' },
          ],
          routeName: [
            { required: true, message: '路由名称不能为空', trigger: 'change' },
            { max: 100, message: '长度不能超过 100 个字符', trigger: 'change' },
          ],
          requestUri: [
            { required: true, message: '请求地址不能为空', trigger: 'change' },
          ],
          routeUri: [
            { required: true, validator: checkRoute, trigger: 'change' },
            { max: 500, message: '长度不能超过 500 个字符', trigger: 'change' },
          ],
          routeSort: [
            { required: true, message: '路由顺序不能为空', trigger: 'change' },
            { validator: vm.$$utils.validator.checkNumber, max: 5, precision: 0, name: '顺序', trigger: 'change' },
          ],
        },
        methodList: [
          { value: 'GET' },
          { value: 'POST' },
          { value: 'DELETE' },
          { value: 'PUT' },
          { value: 'PATCH' },
        ],
        listPath: '',
        /**
         * 灰色发布权重路由列表
         */
        grayScaleReleaseList: [],
      }
    },
    computed: {
      /**
       * 页面是否处于查看模式
       */
      isViewing () {
        return this.editType === 'view'
      },
      /**
       * 页面请求前缀
       */
      urlPrefix: function () {
        return `${backendContext}/platman`
      },
      /**
       * 配置请求前缀
       */
      msGatewayRouteConfigPrefix: function () {
        return `${backendContext}/platman/msGatewayRouteConfig`
      },
      showServiceButton: function () {
        return this.routeProtocol === 'lb://' || this.routeProtocol === 'lb:ws://'
      },
    },
    watch: {
      routeProtocol: function (newValue) {
        this.entity.routeUri = newValue + this.routePath
        this.handleRouteProtocolChange(newValue)
      },
      routePath: function (newValue) {
        this.entity.routeUri = this.routeProtocol + newValue
      },
      entity: {
        handler: function (newValue) {
          if (newValue.routeUri) {
            let routeParts = newValue.routeUri.split('//')
            this.routePath = routeParts[1]
            this.routeProtocol = routeParts[0] + '//'
          }
        },
        deep: true,
      },
    },
    beforeRouteEnter (to, from, next) {
      // 记录上一个地址以便返回
      next(vm => vm.listPath = from.path)
    },
    methods: {
      /**
       * 初始化表单数据
       */
      initFormData () {
        const vm = this
        const pkValue = vm.id
        if (pkValue) {
          vm.$$utils.axiosRequest(
            `${vm.msGatewayRouteConfigPrefix}/getEntity?id=${pkValue}&grayScaleRelease=${vm.grayScaleRelease}`,
            '获取网关路由配置信息').then(function (result) {
            vm.dataLoading = false
            vm.entity = { ...result.data, requestMethods: result.data.requestMethods.split(',') }
            vm.grayScaleReleaseList = result.data.grayScaleReleaseDetails
          })
        }
      },
      /**
       * @param callback
       */
      saveConfig (callback) {
        const vm = this
        let config = {}
        if (vm.grayScaleRelease === '1') {
          config = {
            ...vm.entity,
            grayScaleRelease: vm.grayScaleRelease,
            requestMethods: '',
            grayScaleReleaseDetails: vm.grayScaleReleaseList,
          }
        } else {
          config = { ...vm.entity, requestMethods: vm.entity.requestMethods.join(',') }
        }
        vm.$$utils.eleFormSubmit({
          vueIns: vm,
          saveUrl: `${vm.msGatewayRouteConfigPrefix}/save`,
          formRef: 'msGatewayRouteConfigForm',
          info: '保存网关路由配置信息',
          callback,
          data: config,
        })
      },
      /**
       * 根据字段获取字典列表
       * @param field 字段
       * @returns {*} 字典列表
       */
      getDictByField (field) {
        const vm = this
        return vm.pageDictMap[vm.fieldDictTypeMap[field]]
      },
      /**
       * 检查服务安全策略是否存在
       */
      checkServiceSecStrategy: function (newValue) {
        if (newValue === '1') {
          const vm = this
          const { serviceId } = vm.entity
          if (!serviceId) {
            vm.$$utils.direwolfCommonTips('warning', '请选择路由指向服务')
            vm.entity.enableSecStrategy = '0'
            return
          }
          const url = vm.urlPrefix + '/msSecurityStrategyConfig/getMsSecurityStrategyConfigList?service.id=' +
            vm.entity.serviceId
          vm.$$utils.axiosRequest(url, '检查服务安全策略是否存在').then(function (page) {
            if (page.list.length > 0) {
              vm.entity.secStrategyId = page.list[0].id
            } else {
              vm.$$utils.direwolfCommonTips('warning', '选择的服务没有制定安全策略，无法启用')
              vm.entity.enableSecStrategy = '0'
            }
          })
        }
      },
      /**
       * 远程加载选择框默认不加载，添加焦点触发查询
       */
      handleSysParamFocus: function () {
        this.getSysListByUser()
      },
      /**
       * 根据用户和输入的系统名称获取系统列表
       * @param query
       */
      getSysListByUser (query = '') {
        const vm = this
        vm.sysLoading = true
        vm.$$utils.axiosRequest(vm.urlPrefix + '/msSystemAdmin/listSystemByCurrentUser?sysName=' + query,
          '获取系统列表').then(function (result) {
          vm.sysLoading = false
          vm.msSysList = result.data
        })
      },
      /**
       * 更改系统后清除服务和地址
       */
      handleSystemChange (value) {
        const sys = this.msSysList.find(sys => sys.id === value)
        this.entity.sysId = sys.id
        this.msServiceList = []
        this.entity.serviceId = ''
        this.entity.serviceName = ''
        this.entity.routePath = ''
      },
      /**
       * 远程加载选择框默认不加载，添加焦点触发查询
       */
      handleServiceParamFocus: function () {
        this.getServiceListByUser()
      },
      /**
       * 根据用户和输入的服务名称获取服务列表
       * @param query
       */
      getServiceListByUser (query = '') {
        const vm = this
        if (!vm.entity.sysId) {
          vm.$$utils.direwolfCommonTips('warning', '请先选择系统')
          return
        }
        vm.serviceLoading = true
        vm.$$utils.axiosRequest(
          vm.urlPrefix + '/msServiceInfo/getMsServiceInfoList?sysId=' + vm.entity.sysId +
          '&serviceName=' + query,
          '获取系统列表').then(function (result) {
          vm.serviceLoading = false
          vm.msServiceList = result.list
        })
      },
      /**
       * 选择服务后自动填写到路由地址
       */
      handleServiceChange (value) {
        const service = this.msServiceList.find(service => service.id === value)
        if (value) {
          this.routeProtocol = 'lb://'
          this.routePath = service.serviceCode.toLowerCase()
          this.entity.sysId = service.sysId
          this.entity.sysName = service.sysName
        }
        this.entity.serviceId = service.id
        this.entity.serviceName = service.serviceName
      },
      /**
       * 选择服务信息
       */
      selectService: function () {
        const vm = this
        const pageUrl = `/independentPage/platman-app/pages/msServiceInfoList.html?editType=view`
        top.layer.open({
          type: 2,
          title: '选择服务记录',
          area: ['900px', '500px'],
          content: pageUrl,
          btn: ['确定', '关闭'],
          zIndex: vm.$$utils.getTopIndex(),
          yes: function (index, layero) {
            const selection = layero.find(
              'iframe')[0].contentWindow.msServiceInfoListContentVm.$refs.msServiceInfoTable.selection
            if (selection.length !== 1) {
              direwolfCommonTips('warning', '请选择一条服务记录')
              return
            }
            const service = selection[0]
            vm.routeProtocol = 'lb://'
            vm.routePath = service.serviceCode.toLowerCase()
            vm.entity.sysId = service.sysId
            vm.entity.sysName = service.sysName
            vm.entity.serviceId = service.id
            vm.entity.serviceName = service.serviceName
            top.layer.close(index)
          },
        })
      },
      handleRouteProtocolChange: function (newValue) {
        if (newValue === 'lb://' || newValue === 'lb:ws://') {
          this.routePathDisabled = true
        } else {
          this.routePathDisabled = this.entity === 'view'
        }
      },
      addGrayScaleRelease () {
        const vm = this
        let weight = 0
        vm.grayScaleReleaseList.forEach(item => weight += Number(item.weight))
        const remainingWeight = 100 - weight
        vm.$$utils.showDialog({
          title: `新增路由地址`,
          contentHeight: '250px',
          width: '30%',
          vNode: vm.$createElement({ ...GrayScaleReleaseDetail }, { props: { remainingWeight } }),
          beforeClose: (action, content, instance, callback) => {
            if (action === 'confirm') {
              content.checkInput(() => {
                vm.grayScaleReleaseList.push(content.entity)
                callback()
              })
            } else {
              callback()
            }
          },
        })
      },
      deleteGrayScaleRelease (scope) {
        this.grayScaleReleaseList.splice(scope.$index, 1)
      },
      handleGrayScaleReleaseRowClick (row, event, column) {
        this.$$utils.eleTableClickSelection(this.$refs.grayScaleReleaseTable, row, column)
      },
    },
    created: function () {
      const vm = this
      // 请求所有字典，全部请求返回后再继续加载页面
      vm.$$utils.param.getDictByCodes('y_n,ms_gateway_predicate_type,ms_gateway_filter_type').
        then(function (result) {
          vm.pageDictMap = result.data
          vm.initFormData()
        })
    },
  }
</script>

<style scoped>

</style>
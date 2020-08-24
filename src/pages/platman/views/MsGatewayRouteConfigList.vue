<template>
    <div class="wrapper-cont">
        <el-card class="box-card search-content" shadow="hover">
            <el-form label-position="right" size="small" label-width="100px" id="msGatewayRouteConfigSearchForm"
                     :model="searchParams">
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item required label="系统">
                            <el-select v-model="searchParams.sysId" filterable :clearable="false" remote
                                       placeholder="输入关键字搜索系统" :remote-method="getSysListByUser" :loading="sysLoading"
                                       @focus="handleSysParamFocus">
                                <el-option v-for="item in msSysList" :key="item.id" :label="item.sysName"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="服务">
                            <el-select v-model="searchParams.serviceId" filterable :clearable="false" remote
                                       placeholder="输入关键字搜索服务" :remote-method="getServiceListByUser"
                                       :loading="serviceLoading"
                                       @focus="handleServiceParamFocus">
                                <el-option v-for="item in msServiceList" :key="item.id" :label="item.serviceName"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="路由名称">
                            <el-input placeholder="请输入路由名称" v-model="searchParams.routeName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="16" :span="8">
                        <el-form-item class="search-content-button-container">
                            <el-button-group>
                                <el-button type="primary" size="small" @click="refreshTable" icon="el-icon-search">查询
                                </el-button>
                                <el-button size="small" @click="resetSearchParam" icon="el-icon-refresh">重置
                                </el-button>
                            </el-button-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="box-card" shadow="hover">
            <el-button-group v-if="editType !== 'view'">
                <el-button @click="addNewMsGatewayRouteConfig" size="mini" icon="el-icon-plus">新增
                </el-button>
                <el-button @click="deleteSelectedMsGatewayRouteConfig" type="danger" size="mini"
                           icon="el-icon-delete">删除
                </el-button>
                <el-button @click="editSelectedMsGatewayRouteConfig" size="mini" icon="el-icon-edit">编辑
                </el-button>
                <el-button @click="viewDefaultGatewayRouteConfig" size="mini" icon="el-icon-tickets">查看默认路由配置
                </el-button>
            </el-button-group>
            <el-table size="medium" stripe border tooltip-effect="dark" v-loading="msGatewayRouteConfigTableLoading"
                      style="width: 100%;margin-top: 15px;margin-bottom: 15px;" ref="msGatewayRouteConfigTable"
                      :data="msGatewayRouteConfigTablePage.list" @row-click="handleRowClick"
                      @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="routeName" label="路由名称" width="140"></el-table-column>
                <el-table-column prop="sysName" label="系统" sortable="custom" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="serviceName" label="服务" sortable="custom" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="routeUri" label="路由地址" sortable="custom" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="requestUri" label="请求路径" sortable="custom" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="requestMethods" label="请求类型" sortable="custom" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="routeSort" label="顺序" sortable="custom" width="80">
                </el-table-column>
                <el-table-column prop="routeEnabled" label="启用" sortable="custom" width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.routeEnabled" active-value="1" inactive-value="0"
                                   @change="handleRouteEnabledChange(scope)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="total, sizes, ->, prev, pager, next, jumper"
                           :total="msGatewayRouteConfigTablePage.count" @size-change="handleTableSizeChange"
                           @current-change="handleTableCurrentChange" :page-sizes="[5, 10, 15, 20]"
                           :page-size="5" background></el-pagination>
            <!-- 子表列表 -->
            <el-tabs value="rateLimiterTab" style="margin-top: 15px;" type="border-card">
                <el-tab-pane label="API限流" name="rateLimiterTab">
                    <el-button-group v-if="!isViewing">
                        <el-button size="mini" icon="el-icon-edit" @click="editRateLimiter">修改
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="clearRateLimiter">清除
                        </el-button>
                        <el-button v-show="rateLimiterEditing" size="mini" icon="el-icon-check"
                                   @click="saveRateLimiter">
                            保存
                        </el-button>
                        <el-button v-show="rateLimiterEditing" size="mini" icon="el-icon-close"
                                   @click="cancelRateLimiter">
                            取消
                        </el-button>
                    </el-button-group>
                    <el-form class="with-border" label-position="right" size="small" label-width="180px"
                             ref="rateLimiterForm" style="width: 800px" :model="rateLimiter" :rules="rateLimiterRules">
                        <el-row type="flex" justify="center">
                            <el-col :span="12">
                                <el-form-item>
                                    <span slot="label">限流类型<el-tooltip content="请求分组依据，组内并发量达到最高值时将触发限流策略">
                                        <i class='el-icon-question'></i>
                                    </el-tooltip>
                                    </span>
                                    <el-select :disabled="!rateLimiterEditing" placeholder="请选择限流类型"
                                               v-model="rateLimiter.keyResolver" style="width: 200px;">
                                        <el-option v-for="param in pageDictMap['ms_rate_limiter_type']" :key="param.id"
                                                   :label="param.paramName" :value="param.paramCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="paramName" label="参数名称">
                                    <el-input placeholder="请输入参数名称" v-model="rateLimiter.paramName"
                                              :disabled="!rateLimiterEditing || rateLimiter.keyResolver === 'remoteAddrKeyResolver'"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <el-col :span="12">
                                <el-form-item prop="burstCapacity">
                                    <span slot="label">最高并发量（秒）<el-tooltip content="每秒并发请求数量达到输入数值时将触发限流策略">
                                        <i class='el-icon-question'></i>
                                    </el-tooltip>
                                    </span>
                                    <el-input placeholder="请输入最高并发量" v-model="rateLimiter.burstCapacity"
                                              :disabled="!rateLimiterEditing"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="replenishRate">
                                    <span slot="label">最高新增请求数（秒）<el-tooltip
                                            content="触发限流策略后允许用户每秒发起的请求数量，超出该数量的请求将被丢弃">
                                        <i class='el-icon-question'></i>
                                    </el-tooltip>
                                    </span>
                                    <el-input placeholder="请输入最高新增请求数" v-model="rateLimiter.replenishRate"
                                              :disabled="!rateLimiterEditing"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="API降级" name="fallbackTab">
                    <el-button-group v-if="!isViewing">
                        <el-button size="mini" icon="el-icon-edit" @click="editFallback">修改
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="clearFallback">清除
                        </el-button>
                        <el-button v-show="fallbackEditing" size="mini" icon="el-icon-check" @click="saveFallback">
                            保存
                        </el-button>
                        <el-button v-show="fallbackEditing" size="mini" icon="el-icon-close" @click="cancelFallback">
                            取消
                        </el-button>
                    </el-button-group>
                    <el-form class="with-border" label-position="right" size="small" label-width="180px"
                             style="width: 800px" :model="fallback" :rules="fallbackRules">
                        <el-row type="flex" justify="center">
                            <el-col :span="12">
                                <el-form-item prop="name" label="策略名称">
                                    <el-input placeholder="请输入降级策略名称"
                                              v-model="fallback.name" :disabled="!fallbackEditing"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="fallbackEnabled" label="启用降级策略">
                                    <el-switch :disabled="!fallbackEditing" v-model="fallback.fallbackEnabled"
                                               active-value="1" inactive-value="0">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <el-col :span="12">
                                <el-form-item prop="executionMaxRequests">
                                    <span slot="label">
                                        最高请求并发量
                                        <el-tooltip content="超出最高并发量的请求将被拒绝服务，直接触发降级策略">
                                            <i class='el-icon-question'></i>
                                        </el-tooltip>
                                    </span>
                                    <el-input placeholder="请输入最高请求并发量" v-model="fallback.executionMaxRequests"
                                              :disabled="!fallbackEditing"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="fallbackMaxRequests">
                                    <span slot="label">
                                        最高降级并发量
                                        <el-tooltip content="超出最高并发量的降级请求将被拒绝服务，直接抛出异常">
                                            <i class='el-icon-question'></i>
                                        </el-tooltip>
                                    </span>
                                    <el-input placeholder="最高降级并发量" v-model="fallback.fallbackMaxRequests"
                                              :disabled="!fallbackEditing"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <el-col :span="12">
                                <el-form-item prop="uri">
                                    <span slot="label">降级地址 <el-tooltip content="降级请求将被转发到该地址">
                                        <i class='el-icon-question'></i>
                                    </el-tooltip>
                                    </span>
                                    <el-input placeholder="请输入异常发生时服务降级地址"
                                              v-model="fallback.uri" :disabled="!fallbackEditing"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="circuitVolumeThreshold">
                                    <span slot="label">
                                        熔断最小阈值
                                        <el-tooltip content="请求失败次数达到设置阈值后才会触发熔断">
                                            <i class='el-icon-question'></i>
                                        </el-tooltip>
                                    </span>
                                    <el-input placeholder="请输入熔断最小阈值" v-model="fallback.circuitVolumeThreshold"
                                              :disabled="!fallbackEditing"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <el-col :span="12">
                                <el-form-item prop="executionEnabled" label="启用超时降级策略">
                                    <el-switch :disabled="!fallbackEditing" v-model="fallback.executionEnabled"
                                               active-value="1" inactive-value="0">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="executionTimeout">
                                    <span slot="label">
                                        请求超时（毫秒）
                                        <el-tooltip content="超时的请求将触发降级策略">
                                        <i class='el-icon-question'></i>
                                    </el-tooltip>
                                    </span>
                                    <el-input placeholder="请输入请求超时时间" v-model="fallback.executionTimeout"
                                              :disabled="!fallbackEditing"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="IP黑白名单" name="IPStrategyTab">
                    <el-button-group v-if="!isViewing">
                        <el-button size="mini" icon="el-icon-edit" @click="editIPStrategy">修改
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="clearIPStrategy">清除
                        </el-button>
                        <el-button v-show="IPStrategyEditing" size="mini" icon="el-icon-plus" @click="addIPStrategy">
                            新增地址
                        </el-button>
                        <el-button v-show="IPStrategyEditing" size="mini" icon="el-icon-check" @click="saveIPStrategy">
                            保存
                        </el-button>
                        <el-button v-show="IPStrategyEditing" size="mini" icon="el-icon-close"
                                   @click="cancelIPStrategy">
                            取消
                        </el-button>
                    </el-button-group>
                    <el-form class="with-border" label-position="right" size="small" label-width="100px"
                             style="width: 753px">
                        <el-row type="flex" justify="center">
                            <el-col :span="24">
                                <el-form-item label="类型">
                                    <el-select :disabled="!IPStrategyEditing" placeholder="请选择名单类型"
                                               v-model="IPStrategy.type" style="width: 200px;">
                                        <el-option v-for="param in pageDictMap['ip_filter_type']" :key="param.id"
                                                   :label="param.paramName" :value="param.paramCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <el-col :span="24">
                                <el-form-item label="地址列表">
                                    <el-table row-key="id" size="medium" stripe border tooltip-effect="dark"
                                              style="width: 100%;margin-top: 15px;margin-bottom: 15px;"
                                              :data="IPStrategy.strategyList">
                                        <el-table-column prop="beginIP" label="起始IP" width="150">
                                        </el-table-column>
                                        <el-table-column prop="endIP" label="结束IP" width="150">
                                        </el-table-column>
                                        <el-table-column prop="beginTime" label="开始时间" width="100">
                                        </el-table-column>
                                        <el-table-column prop="endTime" label="结束时间" width="100">
                                        </el-table-column>
                                        <el-table-column prop="operation" label="操作" width="130"
                                                         v-if="IPStrategyEditing">
                                            <template slot-scope="scope">
                                                <el-button size="mini" @click="editIPStrategyRecord(scope)"
                                                           icon="el-icon-edit"></el-button>
                                                <el-button size="mini" type="danger"
                                                           @click="deleteIPStrategy(scope)"
                                                           icon="el-icon-delete"></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="安全策略" name="securityStrategyTab">
                    <el-button-group v-if="!isViewing">
                        <el-button size="mini" icon="el-icon-edit" @click="editSecurityStrategy">修改
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="clearSecurityStrategy">清除
                        </el-button>
                        <el-button v-show="securityStrategyEditing" size="mini" icon="el-icon-check"
                                   @click="saveSecurityStrategy">
                            保存
                        </el-button>
                        <el-button v-show="securityStrategyEditing" size="mini" icon="el-icon-close"
                                   @click="cancelSecurityStrategy">
                            取消
                        </el-button>
                    </el-button-group>
                    <el-form class="with-border" label-position="right" size="small" label-width="100px"
                             ref="securityStrategyForm" style="width: 400px">
                        <el-row type="flex" justify="center">
                            <el-col :span="24">
                                <el-form-item>
                                    <span slot="label">安全策略<el-tooltip content="所有请求必须携带指定安全策略信息才能获得服务响应">
                                        <i class='el-icon-question'></i>
                                    </el-tooltip>
                                    </span>
                                    <el-select :disabled="!securityStrategyEditing" v-model="securityStrategy.id"
                                               filterable :clearable="false" remote
                                               placeholder="输入关键字搜索策略" :remote-method="getSecurityStrategyBySys"
                                               :loading="securityStrategyLoading" @focus="handleSecurityStrategyFocus">
                                        <el-option v-for="item in securityStrategyList" :key="item.id"
                                                   :label="item.strategyName" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
  import { backendContext } from '../config'
  import MsGatewayRouteConfigDetail from './MsGatewayRouteConfigDetail'
  import IPStrategyDetail from './IPStrategyDetail'

  /**
   * 默认参数
   */
  const defaultParams = {
    grayScaleRelease: '0',
    serviceId: '',
    serviceName: '',
    sysId: '',
    sysName: '',
    limit: 5,
    offset: 0,
    order: '',
    sort: '',
  }
  export default {
    name: 'msGatewayRouteConfigList',
    data () {
      const vm = this

      function checkReplenishRate (rule, value, callback) {
        const capacity = vm.rateLimiter.burstCapacity
        if (!capacity || Number(capacity) < Number(value)) {
          callback(new Error('新增请求数必须小于最高并发量'))
        } else {
          callback()
        }
      }

      return {
        /**
         * 查询参数，包含表格分页参数
         */
        searchParams: JSON.parse(JSON.stringify(defaultParams)), // 拷贝初始值
        /**
         * 字段字典类型集合
         */
        fieldDictTypeMap: {
          'predicateType': 'ms_gateway_predicate_type',
          'filterType': 'ms_gateway_filter_type',
          'routeType': 'ms_gateway_route_type',
          'enableSecStrategy': 'y_n',
          'IPStrategyType': 'ip_filter_type',
          'rateLimiterType': 'ms_rate_limiter_type',
        },
        /**
         * 页面字典集合
         */
        pageDictMap: {},
        /**
         * 页面编辑类型，为view时工具栏及操作列不出现
         */
        editType: this.$$utils.getQueryString('editType'),
        /**
         * 网关路由配置信息表格分页数据
         */
        msGatewayRouteConfigTablePage: {},
        /**
         * 网关路由配置信息表格加载状态
         */
        msGatewayRouteConfigTableLoading: false,
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
        /**
         * 被选中的唯一记录
         */
        selectedConfig: {},
        /**
         * 选中记录对应的限流设置
         */
        rateLimiter: {
          keyResolver: '',
          paramName: '',
          burstCapacity: '',
          replenishRate: '',
        },
        rateLimiterRules: {
          paramName: [
            { max: 50, message: '参数名称长度不得超过50个字符', trigger: 'blur' },
          ],
          burstCapacity: [
            { required: true, message: '桶容量不能为空', trigger: 'blur' },
            { validator: vm.$$utils.validator.checkNumber, max: 5, name: '桶容量', trigger: 'blur' },
          ],
          replenishRate: [
            { required: true, message: '每秒填充速率不能为空', trigger: 'blur' },
            { validator: checkReplenishRate, trigger: 'blur' },
          ],
        },
        /**
         * 限流修改状态
         */
        rateLimiterEditing: false,
        /**
         * 选中记录对应的降级地址
         */
        fallback: {
          name: '',
          executionTimeout: '',
          executionMaxRequests: '',
          executionEnabled: '',
          fallbackEnabled: '',
          fallbackMaxRequests: '',
          circuitVolumeThreshold: '',
          uri: '',
        },
        fallbackRules: {
          name: [
            { required: true, message: '策略名称不能为空', trigger: 'blur' },
            { pattern: /^[a-zA-Z]+$/, message: '策略名称仅支持英文字母', trigger: 'blur' },
          ],
          executionTimeout: [
            { required: true, message: '请求超时时间不能为空', trigger: 'blur' },
            { validator: vm.$$utils.validator.checkNumber, message: '请求超时时间仅支持数字', trigger: 'blur' },
          ],
          executionMaxRequests: [
            { required: true, message: '最高请求并发量不能为空', trigger: 'blur' },
            { validator: vm.$$utils.validator.checkNumber, message: '最高请求并发量仅支持数字', trigger: 'blur' },
          ],
          fallbackMaxRequests: [
            { required: true, message: '最高降级并发量不能为空', trigger: 'blur' },
            { validator: vm.$$utils.validator.checkNumber, message: '最高降级并发量仅支持数字', trigger: 'blur' },
          ],
          circuitVolumeThreshold: [
            { required: true, message: '熔断最小阈值不能为空', trigger: 'blur' },
            { validator: vm.$$utils.validator.checkNumber, message: '熔断最小阈值仅支持数字', trigger: 'blur' },
          ],
          uri: [
            { required: true, message: '降级地址不能为空', trigger: 'blur' },
            { validator: vm.$$utils.validator.checkURIPath, max: 100, name: '降级地址', trigger: 'blur' },
          ],
        },
        /**
         * 降级修改状态
         */
        fallbackEditing: false,
        /**
         * IP策略
         */
        IPStrategy: {
          type: '',
          strategyList: [],
        },
        /**
         * IP策略编辑状态
         */
        IPStrategyEditing: false,
        /**
         * 安全策略编辑状态
         */
        securityStrategyEditing: false,
        /**
         * 安全策略信息
         */
        securityStrategy: {
          id: '',
          strategyName: '',
        },
        /**
         * 安全策略加载状态
         */
        securityStrategyLoading: false,
        /**
         * 安全策略列表
         */
        securityStrategyList: [],
      }
    },
    computed: {
      /**
       * 页面是否处于查看模式
       */
      isViewing () {
        return this.editType === 'view'
      },
      msGatewayRouteConfigPrefix: function () {
        return `${backendContext}/platman/msGatewayRouteConfig`
      },
    },
    created: function () {
      const vm = this
      // 请求所有字典，全部请求返回后再继续加载页面
      vm.$$utils.param.getDictByCodes(
        'ms_gateway_route_type,y_n,ms_gateway_predicate_type,ms_gateway_filter_type,ip_filter_type,ms_rate_limiter_type').
        then(function (result) {
          vm.pageDictMap = result.data
          vm.getSysListByUser('', true)
        })
    },
    mounted: function () {
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
      refreshTable: function () {
        const vm = this
        if (!vm.searchParams.sysId) {
          vm.$$utils.direwolfCommonTips('warning', '查询条件中系统信息不能为空')
          return
        }
        vm.msGatewayRouteConfigTableLoading = true
        vm.$$utils.axiosRequest(
          vm.msGatewayRouteConfigPrefix + '/getMsGatewayRouteConfigList',
          '获取网关路由配置信息记录', 'GET', vm.searchParams).then(function (data) {
          vm.msGatewayRouteConfigTablePage = data
          vm.msGatewayRouteConfigTableLoading = false
          // 加载成功后自动选中第一行以刷新子表
          vm.$nextTick(function () {
            const table = vm.$refs.msGatewayRouteConfigTable
            if (table.tableData.length > 0) {
              table.toggleRowSelection(table.tableData[0], true)
            }
          })
        })
      },
      /**
       * 重置按钮点击事件
       */
      resetSearchParam: function () {
        this.searchParams = JSON.parse(JSON.stringify(defaultParams))
        const first = this.msSysList[0]
        this.searchParams.sysId = first.id
        this.searchParams.sysName = first.sysName
        this.refreshTable()
      },
      /**
       * 表格行点击事件
       * @param row 行数据
       * @param event 原生事件
       * @param column 点击位置所属列
       */
      handleRowClick: function (row, event, column) {
        this.$$utils.eleTableClickSelection(this.$refs.msGatewayRouteConfigTable, row, column)
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
      addNewMsGatewayRouteConfig: function () { // 新增记录
        this.showRouteConfigDialog({ editType: 'add' })
      },
      /**
       *  打开表单对话框
       *  @param props 表单参数
       */
      showRouteConfigDialog (props) {
        const vm = this
        vm.$$utils.showDialog({
          title: `${vm.$$utils.getEditTypeName(props.editType)}网关路由配置信息`,
          contentHeight: '340px',
          width: '60%',
          vNode: vm.$createElement({ ...MsGatewayRouteConfigDetail }, { props }),
          beforeClose: (action, content, instance, callback) => {
            if (action === 'confirm') {
              content.saveConfig(() => {
                callback()
                vm.refreshTable()
              })
            } else {
              callback()
            }
          },
        })
      },
      /**
       * 修改选中的记录
       */
      editSelectedMsGatewayRouteConfig: function () {
        const vm = this
        const selections = this.$refs.msGatewayRouteConfigTable.selection
        if (selections.length !== 1) {
          vm.$$utils.direwolfCommonTips('warning', '仅能选择一条记录进行修改')
          return
        }
        vm.showRouteConfigDialog({ editType: 'edit', id: selections[0].id })
      },
      /**
       * 删除选中记录
       */
      deleteSelectedMsGatewayRouteConfig: function () {
        const vm = this
        const selections = vm.$refs.msGatewayRouteConfigTable.selection
        if (selections.length === 0) {
          vm.$$utils.direwolfCommonTips('warning', '请选择要删除的记录')
          return
        }
        vm.$$utils.direwolfCommonConfirm({
          title: '删除提醒',
          message: '数据删除后不可恢复，确定继续删除吗?',
        }, () => {
          let ids = []
          selections.forEach(function (select) {
            if (select.id) {
              ids.push(select.id)
            }
          })
          if (ids.length > 0) {
            vm.$$utils.axiosRequest(vm.msGatewayRouteConfigPrefix + '/deleteAll?ids=' + ids.join(','),
              '批量删除网关路由配置信息', 'DELETE').then(function (result) {
              result.type === 'success' && vm.refreshTable()
            })
          }
        })
      },
      viewDefaultGatewayRouteConfig: function () {
        const vm = this
        vm.$$utils.axiosRequest('/route-discovery', '获取默认路由配置').then(result => {
          vm.$$utils.showDialog({
            title: `查看默认网关路由配置信息`,
            contentHeight: '340px',
            width: '60%',
            showCancelButton: false,
            vNode: vm.$createElement('el-table',
              { props: { size: 'medium', stripe: true, border: true, tooltipEffect: 'dark', data: result } },
              [
                vm.$createElement('el-table-column', { props: { prop: 'uri', label: '服务地址' } }),
                vm.$createElement('el-table-column', { props: { prop: 'predicates[0].args.pattern', label: '访问规则' } }),
                vm.$createElement('el-table-column', { props: { prop: 'order', label: '排序', width: '80px' } }),
              ],
            ),
          })
        })
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
       * @param triggerSearch
       */
      getSysListByUser (query = '', triggerSearch) {
        const vm = this
        vm.sysLoading = true
        vm.$$utils.axiosRequest(backendContext + '/platman/msSystemAdmin/listSystemByCurrentUser?sysName=' + query,
          '获取系统列表').then(function (result) {
          vm.sysLoading = false
          vm.msSysList = result.data
          if (triggerSearch) {
            const first = vm.msSysList[0]
            vm.searchParams.sysId = first.id
            vm.searchParams.sysName = first.sysName
            vm.refreshTable()
          }
        })
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
        vm.serviceLoading = true
        vm.$$utils.axiosRequest(
          backendContext + '/platman/msServiceInfo/getMsServiceInfoList?sysId=' + vm.searchParams.sysId +
          '&serviceName=' + query,
          '获取系统列表').then(function (result) {
          vm.serviceLoading = false
          vm.msServiceList = result.list
        })
      },
      handleRouteEnabledChange: function (scope) {
        const vm = this
        let action = '启用'
        const data = scope.row
        let desc = '确定要'
        const rollback = data.routeEnabled === '0' ? '1' : '0'
        if (scope.row.routeEnabled === '0') {
          action = '停用'
        }
        desc += action + '此路由吗？'
        vm.$$utils.direwolfCommonConfirm({
          message: desc,
          title: action + '路由提醒',
        }, function () {
          vm.$$utils.axiosRequest(vm.msGatewayRouteConfigPrefix + '/save', '保存网关路由配置信息', 'POST', data).
            then(result => {
              if (result.type !== 'success') {
                data.routeEnabled = rollback
              } else {
                vm.refreshTable()
              }
            }).catch(function () {
            data.routeEnabled = rollback
          })
        }, function () {
          data.routeEnabled = rollback
        })
      },
      /**
       * 主表当前行变更，刷新子表
       * @param selection 当前行
       */
      handleSelectionChange: function (selection) {
        if (selection.length === 1) {
          this.rateLimiterEditing = false
          this.fallbackEditing = false
          this.IPStrategyEditing = false
          this.selectedConfig = selection[0]
          this.securityStrategy.id = this.selectedConfig.secStrategyId
          this.getFilterList()
          this.getPredicateList()
          this.getSecurityStrategyBySys()
        } else {
          this.selectedConfig = null
        }
      },
      /**
       * 获取所有谓词
       */
      getPredicateList () {},
      /**
       * 获取所有过滤器
       */
      getFilterList () {
        const vm = this
        if (!vm.selectedConfig) {
          vm.$$utils.direwolfCommonTips('warning', '请选择配置记录来获取处理规则')
          return
        }
        const routeConfigId = vm.selectedConfig.id
        vm.$$utils.axiosRequest(
          backendContext + '/platman/msGatewayRouteFilter/getMsGatewayRouteFilterList?routeConfigId=' + routeConfigId,
          '获取处理规则').then(function (result) {
          vm.IPStrategy = { type: '', strategyList: [] }
          vm.fallback = {}
          vm.rateLimiter = {}
          if (result.list) {
            result.list.forEach(filter => {
              const { filterType, filterValue, routeConfigId, ...others } = filter
              if (filterType === 'RequestRateLimiter') {
                const rateObj = JSON.parse(filterValue)
                const values = rateObj['key-resolver'].split('|')
                vm.rateLimiter = {
                  id: filter.id,
                  replenishRate: rateObj['redis-rate-limiter.replenishRate'],
                  burstCapacity: rateObj['redis-rate-limiter.burstCapacity'],
                  keyResolver: values[0],
                  paramName: values[1] || '',
                  routeConfigId,
                  originFields: others,
                }
              } else if (filter.filterType === 'Hystrix') {
                vm.fallback = {
                  id: filter.id,
                  ...JSON.parse(filterValue),
                  routeConfigId,
                  originFields: others,
                }
              } else if (filter.filterType === 'IPStrategyFilter') {
                const value = JSON.parse(filterValue)
                vm.IPStrategy.type = value.type
                vm.IPStrategy.routeConfigId = routeConfigId
                vm.IPStrategy.strategyList.push({
                  id: filter.id,
                  ...value,
                  originFields: others,
                })
              }
            })
          }
          if (!vm.rateLimiter.id) {
            vm.rateLimiter = { routeConfigId }
          }
          if (!vm.fallback.id) {
            vm.fallback = { routeConfigId }
          }
          if (!vm.IPStrategy.type) {
            vm.IPStrategy = { routeConfigId, strategyList: [] }
          }
        })
      },
      /**
       * 修改限流规则
       */
      editRateLimiter () {
        if (this.rateLimiter.routeConfigId) {
          this.rateLimiterEditing = true
        } else {
          this.$$utils.direwolfCommonTips('error', '限流规则未获取到网关配置信息，无法编辑')
        }
      },
      cancelRateLimiter () {
        this.rateLimiterEditing = false
        this.getFilterList()
      },
      /**
       * 保存限流规则
       */
      saveRateLimiter () {
        const vm = this
        const { id, replenishRate, burstCapacity, routeConfigId, keyResolver, paramName } = vm.rateLimiter
        const filterValue = JSON.stringify({
          'redis-rate-limiter.replenishRate': replenishRate,
          'redis-rate-limiter.burstCapacity': burstCapacity,
          'key-resolver': `${keyResolver}${paramName ? ('|' + paramName) : ''}`,
        })
        vm.$refs['rateLimiterForm'].validate(valid => {
          if (valid) {
            if (id) {
              vm.$$utils.axiosRequest(
                backendContext + '/platman/msGatewayRouteFilter/getMsGatewayRouteFilterList',
                '获取API限流规则', 'GET', { id }, { showLoading: true }).
                then(function (result) {
                  vm.saveFilter('rateLimiter', {
                    ...result.list[0],
                    filterValue,
                  })
                })
            } else {
              vm.saveFilter('rateLimiter', {
                filterType: 'RequestRateLimiter',
                routeConfigId,
                filterValue,
              })
            }
            return
          }
          vm.$$utils.direwolfCommonTips('warning', '输入有误，请重新确认后再提交')
        })
      },
      /**
       * 保存过滤器记录
       */
      saveFilter (rule, filter) {
        const vm = this
        vm.$$utils.axiosRequest(
          backendContext + '/platman/msGatewayRouteFilter/save', '保存处理规则', 'POST',
          filter).then(function (result) {
          if (result.type === 'success') {
            vm[`${rule}Editing`] = false
            vm.getFilterList()
            vm.$$utils.direwolfCommonTips('success', '保存处理规则成功')
          }
        })
      },
      deleteFilter (rule) {
        const vm = this
        if (!vm.selectedConfig) {
          vm.$$utils.direwolfCommonTips('warning', '请选择要清除限流规则的配置记录')
          return
        }
        const filterId = vm[rule].id
        if (!filterId) {
          vm.$$utils.direwolfCommonTips('warning', '当前路由没有指定规则，无需清除')
          return
        }
        const routeConfigId = vm.selectedConfig.id
        vm.$$utils.direwolfCommonConfirm({
          message: '规则清除后不可恢复，确定继续清除吗?',
          title: '清除提醒',
        }, () => {
          vm.$$utils.axiosRequest(
            backendContext + '/platman/msGatewayRouteFilter/delete?id=' + filterId,
            '清除规则', 'DELETE').then(function (result) {
            if (result.type === 'success') {
              vm[rule] = { routeConfigId }
            }
          })
        })
      },
      /**
       * 清除限流规则
       */
      clearRateLimiter: function () {
        this.deleteFilter('rateLimiter')
      },
      editFallback () {
        if (this.fallback.routeConfigId) {
          this.fallbackEditing = true
          if (!this.fallback.name) {
            this.fallback = {
              name: '',
              executionTimeout: 1000,
              executionMaxRequests: 10,
              executionEnabled: '1',
              fallbackEnabled: '1',
              fallbackMaxRequests: 10,
              circuitVolumeThreshold: 20,
              uri: '',
              routeConfigId: this.fallback.routeConfigId,
            }
          }
        } else {
          this.$$utils.direwolfCommonTips('error', '降级规则未获取到网关配置信息，无法编辑')
        }
      },
      cancelFallback () {
        this.fallbackEditing = false
        this.getFilterList()
      },
      /**
       * 保存降级设置
       */
      saveFallback () {
        const vm = this
        const { id, routeConfigId, originFields, ...others } = vm.fallback
        if (id) {
          vm.saveFilter('fallback', {
            id, routeConfigId, ...originFields,
            filterValue: JSON.stringify(others),
          })
        } else {
          vm.saveFilter('fallback', {
            filterType: 'Hystrix',
            routeConfigId,
            filterValue: JSON.stringify(others),
          })
        }
      },
      clearFallback () {
        this.deleteFilter('fallback')
      },
      editIPStrategy () {
        if (this.IPStrategy.routeConfigId) {
          this.IPStrategyEditing = true
        } else {
          this.$$utils.direwolfCommonTips('error', '限流规则未获取到网关配置信息，无法编辑')
        }
      },
      /**
       * 新增IP策略
       */
      addIPStrategy () {
        const vm = this
        if (!vm.selectedConfig) {
          vm.$$utils.direwolfCommonTips('warning', '请选择要增加IP策略的配置记录')
          return
        }
        vm.showIPStrategyDialog({ editType: 'add' }, -1)
      },
      /**
       * 清除所有IP策略
       */
      clearIPStrategy () {
        this.deleteFilter('IPStrategy')
      },
      /**
       * 编辑IP策略记录
       */
      editIPStrategyRecord (scope) {
        this.showIPStrategyDialog({ editType: 'edit', data: scope.row }, scope.$index)
      },
      /**
       * 打开IP策略明细面板
       */
      showIPStrategyDialog (props, index) {
        const vm = this
        vm.$$utils.showDialog({
          title: `${vm.$$utils.getEditTypeName(props.editType)}IP地址`,
          contentHeight: '250px',
          width: '50%',
          vNode: vm.$createElement({ ...IPStrategyDetail },
            { props: { ...props, configId: vm.selectedConfig.id, type: vm.IPStrategy.type } }),
          beforeClose: (action, content, instance, callback) => {
            if (action === 'confirm') {
              content.saveConfig(data => {
                if (index > -1) {
                  vm.IPStrategy.strategyList.splice(index, 1, data)
                } else {
                  vm.IPStrategy.strategyList.push(data)
                }
                callback()
              })
            } else {
              callback()
            }
          },
        })
      },
      /**
       * 删除单条IP策略
       */
      deleteIPStrategy (scope) {
        const vm = this
        vm.$$utils.direwolfCommonConfirm({
          title: '删除提醒',
          message: '数据删除后不可恢复，确定继续删除吗?',
        }, () => {
          vm.$$utils.axiosRequest(
            backendContext + '/platman/msGatewayRouteFilter/delete?id=' + scope.row.id,
            '删除IP策略', 'DELETE').then(function (result) {
            result.type === 'success' && vm.getFilterList()
          })
        })
      },
      cancelIPStrategy () {
        this.IPStrategyEditing = false
        this.getFilterList()
      },
      /**
       * 保存IP策略
       */
      saveIPStrategy () {
        const vm = this
        let result = []
        vm.IPStrategy.strategyList.forEach(({ id, originFields, routeConfigId, type, ...others }) => {
          result.push({
            id, routeConfigId,
            filterType: 'IPStrategyFilter',
            filterValue: JSON.stringify({ ...others, type: vm.IPStrategy.type }),
            ...originFields,
          })
        })
        vm.$$utils.axiosRequest(`${backendContext}/platman/msGatewayRouteFilter/saveBatch`,
          '保存IP策略信息', 'POST', result).then(function (result) {
          if (result.type === 'success') {
            vm.$$utils.direwolfCommonTips('success', 'IP策略信息保存成功')
            vm.getFilterList()
            vm.IPStrategyEditing = false
          }
        })
      },
      editSecurityStrategy () {
        if (this.selectedConfig.id) {
          this.securityStrategyEditing = true
        } else {
          this.$$utils.direwolfCommonTips('error', '安全策略未获取到网关配置信息，无法编辑')
        }
      },
      clearSecurityStrategy () {
        const vm = this
        vm.$$utils.direwolfCommonConfirm({
          title: '清除提醒',
          message: '数据清除后不可恢复，确定继续吗?',
        }, () => {
          vm.$$utils.axiosRequest(
            vm.msGatewayRouteConfigPrefix + '/save',
            '清除安全策略', 'POST', {
              ...vm.selectedConfig,
              secStrategyId: null,
            }).then(result => result.type === 'success' && vm.refreshTable())
        })
      },
      saveSecurityStrategy () {
        const vm = this
        vm.$$utils.axiosRequest(vm.msGatewayRouteConfigPrefix + '/save',
          '保存安全策略', 'POST', {
            ...vm.selectedConfig,
            secStrategyId: vm.securityStrategy.id,
          }).then(result => {
          if (result.type === 'success') {
            vm.$$utils.direwolfCommonTips('success', '安全策略保存成功')
            vm.refreshTable()
            vm.securityStrategyEditing = false
          }
        })
      },
      cancelSecurityStrategy () {
        this.securityStrategyEditing = false
        this.refreshTable()
      },
      getSecurityStrategyBySys (query = '') {
        const vm = this
        vm.$$utils.axiosRequest(
          `${backendContext}/platman/msSecurityStrategyConfig/getMsSecurityStrategyConfigList?sysId=${vm.selectedConfig.sysId}&strategyName=${query}`,
          '获取安全策略信息记录').then(page => {
          vm.securityStrategyList = page.list
        })
      },
      handleSecurityStrategyFocus () {
        this.getSecurityStrategyBySys()
      },
    },
  }
</script>

<style scoped>

</style>
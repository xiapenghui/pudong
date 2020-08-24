<template>
    <div class="wrapper-cont">
        <el-card class="box-card search-content" shadow="hover">
            <el-form label-position="right" size="small" label-width="100px" id="msGatewayRouteConfigSearchForm"
                     :model="searchParams">
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="路由名称">
                            <el-input placeholder="请输入路由名称" v-model="searchParams.routeName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="8" :span="8">
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
            </el-button-group>
            <el-table size="medium" stripe border tooltip-effect="dark" v-loading="msGatewayRouteConfigTableLoading"
                      style="width: 100%;margin-top: 15px;margin-bottom: 15px;" ref="msGatewayRouteConfigTable"
                      :data="msGatewayRouteConfigTablePage.list" @row-click="handleRowClick"
                      @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="routeName" label="路由名称" width="300"></el-table-column>
                <el-table-column prop="requestUri" label="请求路径" sortable="custom" show-overflow-tooltip>
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
            <el-tabs value="grayScaleReleaseTab" style="margin-top: 15px;" type="border-card">
                <el-tab-pane label="地址列表" name="grayScaleReleaseTab">
                    <el-table size="medium" stripe border tooltip-effect="dark"
                              style="width: 100%;margin-top: 15px;margin-bottom: 15px;"
                              ref="grayScaleReleaseTable" :data="grayScaleReleaseList"
                              @row-click="handleGrayScaleReleaseRowClick">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="uri" label="地址" width="300">
                        </el-table-column>
                        <el-table-column prop="weight" label="权重" width="70">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
  import { backendContext } from '../config'
  import MsGatewayRouteConfigDetail from './MsGatewayRouteConfigDetail'
  import GrayScaleReleaseDetail from './GrayScaleReleaseDetail'

  /**
   * 默认参数
   */
  const defaultParams = {
    grayScaleRelease: '1',
    routeName: '',
    limit: 5,
    offset: 0,
    order: '',
    sort: '',
  }
  export default {
    name: 'msGatewayRouteConfigList',
    data () {
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
          'enableSecStrategy': 'y_n',
          'routeEnabled': 'y_n',
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
         * 被选中的唯一记录
         */
        selectedConfig: null,
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
      msGatewayRouteConfigPrefix: function () {
        return `${backendContext}/platman/msGatewayRouteConfig`
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
      refreshTable: function () {
        const vm = this
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
            } else {
              vm.grayScaleReleaseList = []
            }
          })
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
        this.showRouteConfigDialog({ editType: 'add', grayScaleRelease: '1' })
      },
      showRouteConfigDialog (props) {
        const vm = this
        vm.$$utils.showDialog({
          title: `${vm.$$utils.getEditTypeName(props.editType)}网关路由配置信息`,
          contentHeight: '340px',
          width: '60%',
          vNode: vm.$createElement({ ...MsGatewayRouteConfigDetail },
            { props }),
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
        vm.showRouteConfigDialog({ editType: 'edit', id: selections[0].id, grayScaleRelease: '1' })
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
            vm.$$utils.axiosRequest(
              vm.msGatewayRouteConfigPrefix + '/deleteAll?grayScaleRelease=1&ids=' + ids.join(','),
              '批量删除网关路由配置信息', 'DELETE').then(function (result) {
              result.type === 'success' && vm.refreshTable()
            })
          }
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
          this.selectedConfig = selection[0]
          // this.getPredicateList()
          this.grayScaleReleaseList = this.selectedConfig.grayScaleReleaseDetails
        } else {
          this.selectedConfig = null
        }
      },
      /**
       * 获取所有谓词
       */
      getPredicateList () {
        const vm = this
        if (!vm.selectedConfig) {
          vm.$$utils.direwolfCommonTips('warning', '请选择配置记录来获取访问规则')
          return
        }
        const routeConfigId = vm.selectedConfig.id
        vm.$$utils.axiosRequest(
          backendContext + '/platman/msGatewayRoutePredicate/getMsGatewayRoutePredicateList?routeConfigId=' +
          routeConfigId,
          '获取访问规则').then(function (result) {
          vm.IPWhiteList = []
          if (result.list) {
            result.list.forEach((predicate) => {
              if (predicate.predicateType === 'RemoteAddr') {
                vm.IPWhiteList.push(predicate)
              }
            })
          }
        })
      },
      addGrayScaleRelease () {
        const vm = this
        if (!vm.selectedConfig) {
          vm.$$utils.direwolfCommonTips('warning', '请选择要增加灰度发布规则的配置记录')
          return
        }
        vm.$$utils.showDialog({
          title: `新增灰度发布规则`,
          contentHeight: '250px',
          width: '30%',
          vNode: vm.$createElement({ ...GrayScaleReleaseDetail },
            { props: { editType: 'add', configId: vm.selectedConfig.id } }),
          beforeClose: (action, content, instance, callback) => {
            if (action === 'confirm') {
              content.saveConfig(() => {
                callback()
                this.getPredicateList()
              })
            } else {
              callback()
            }
          },
        })
      },
      deleteGrayScaleRelease () {

      },
      handleGrayScaleReleaseRowClick (row, event, column) {
        this.$$utils.eleTableClickSelection(this.$refs.grayScaleReleaseTable, row, column)
      },
    },
    created: function () {
      const vm = this
      // 请求所有字典，全部请求返回后再继续加载页面
      vm.$$utils.param.getDictByCodes('y_n,ms_gateway_predicate_type').
        then(function (result) {
          vm.pageDictMap = result.data
          vm.refreshTable()
        })
    },
    mounted: function () {
    },
  }
</script>

<style scoped>

</style>
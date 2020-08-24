<template>
    <div>
        <el-button-group v-if="editType !== 'view' && toolbar && toolbar.length > 0">
            <el-button v-for="(button, index) in toolbar" :key="index"
                       @click="handleToolbarButtonClick(button.name, index)"
                       size="mini"
                       :icon="button.icon" :type="button.type || 'default'">
                {{button.text}}
            </el-button>
        </el-button-group>
        <el-table size="medium" stripe border tooltip-effect="dark" v-loading="loading"
                  style="width: 100%;margin-top: 15px;margin-bottom: 15px;" :ref="tableRef"
                  :data="dataList" @row-click="handleRowClick"
                  @sort-change="handleSortChange" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="routeName" label="路由名称" width="140"></el-table-column>
            <el-table-column prop="routeSort" label="顺序" sortable="custom" width="80">
            </el-table-column>
            <el-table-column prop="sysName" label="系统" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="serviceName" label="服务" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="routeUri" label="路由地址" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="enableSecStrategy" label="启用安全策略" sortable="custom">
                <template slot-scope="scope">
                    {{ $$utils.eleTableColumnFormatter(scope, getDictByField(scope.column.property))}}
                </template>
            </el-table-column>
            <el-table-column prop="routeEnabled" label="路由启用" sortable="custom">
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
    </div>
</template>

<script>
  export default {
    name: 'DataTable',
    props: {
      editType: String,
      toolbar: [],
      loading: Boolean,
      tableRef: String,
      dataList: [],
      dataUrl: '',
    },
    methods: {
      handleToolbarButtonClick (event, buttonName, index) {
        this.$emit('toolbarButtonClick', event, buttonName, index)
      },
      /**
       * 表格行点击事件
       * @param row 行数据
       * @param event 原生事件
       * @param column 点击位置所属列
       */
      handleRowClick (row, event, column) {
        if (column.type !== 'selection') {
          const table = this.$refs[this.tableRef]
          table.clearSelection()
          table.toggleRowSelection(row, true)
        }
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
    },
  }
</script>

<style scoped>

</style>
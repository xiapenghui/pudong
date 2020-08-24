// 查询参数初始值，重置按钮将使用该值
var defaultParams = {
    application: "",
    profile: "",
    label: "",
    limit: 5,
    offset: 0,
    order: '',
    sort: '',
}
var serviceCode_serviceNameJson = {};

var msSecurityStrategyConfigListContentVm = new Vue({
    el: '#msSecurityStrategyConfigListContent',
    data: {
        /**
         * 查询参数，包含表格分页参数
         */
        searchParams: JSON.parse(JSON.stringify(defaultParams)), // 拷贝初始值
        /**
         * 配置项信息表格分页数据
         */
        msSecurityStrategyConfigTablePage: {},
        editType: GetQueryString('editType'),
        /**
         * 上个页面得来的sysId
         */
        sysId: GetQueryString('sysId'),
        /**
         * 页面加载状态
         */
        pageLoading: false,
        /**
         * 配置项信息表格加载状态
         */
        msSecurityStrategyConfigTableLoading: false,
        /**
         * 服务名称下拉框选项
         */
        applicationSelect: null,
        /**
         * 环境下拉框选项
         */
        profileSelect: null,
        /**
         * 分支下拉框选项
         */
        labelSelect: null,
    },
    created: function () {
        var vm = this;
        initConfig(function (data) {
            vm.msConfig = data;
            checkPagePermission(commonConfig.sysBackendContext + '/sys/sysParam/checkSysParamListPermission');
            vm.pageLoading = false;
            vm.getAllApplicationSelect();
        })
    },
    computed: {
        formBaseUrl: function () {
            return getRelativePath() + 'msSystemConfigCenterForm.html?editType='
        },
        requestPrefix: function () {
            return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
        },
    },
    methods: {
        /**
         * 根据上个页面传来的sysId得到所有serviceCode
         */
        getAllApplicationSelect: function () {
            var vm = this;
            var getMsServiceInfoListUrl = vm.requestPrefix + '/platman/msServiceInfo/getAllMsServiceInfoServiceCodeAndServiceNameBySysId?sysId=' + vm.sysId;
            //获取所有serviceCode并填充到applicationSelect，并且默认选择第一个serviceCode
            axiosRequest(getMsServiceInfoListUrl, '获取服务列表').then(function (data) {
                vm.applicationSelect = data;
                var firstService = vm.applicationSelect[0];
                if (firstService) {
                    vm.searchParams.application = firstService.serviceCode;
                }
                for (var i in data) {
                    serviceCode_serviceNameJson[data[i].serviceCode] = data[i].serviceName;
                }
                //刷新表格
                vm.refreshTable();
                //获得选中的第一个serviceCode的所有profile
                vm.getAllProfileSelect();
            });
        },
        /**
         * 根据选择的application得到所有profile
         */
        getAllProfileSelect: function () {
            var vm = this;
            var getAllProfileSelectUrl = commonConfig.sysBackendContext + '/sys/sysParam/getAllProfileAndLabelBySysParam?application=' + vm.searchParams.application;
            axiosRequest(getAllProfileSelectUrl, '获取当前服务的环境').then(function (data) {
                if (data)
                    vm.profileSelect = data.profileSelect;
            });
        },
        /**
         * 根据选择的profile得到所有label
         */
        getAllLabelSelect: function () {
            this.searchParams.label = "";
            this.labelSelect = null;
            var vm = this;
            var getAllLabelSelecttUrl = commonConfig.sysBackendContext + '/sys/sysParam/getAllProfileAndLabelBySysParam?application=' + vm.searchParams.application + "&profile=" + vm.searchParams.profile;
            axiosRequest(getAllLabelSelecttUrl, '获取当前服务和环境的分支').then(function (data) {
                if (data)
                    vm.labelSelect = data.labelSelect;
            });
        },
        /**
         * application下拉框改变事件
         */
        changeApplicationSelect: function () {
            this.searchParams.profile = "";
            this.searchParams.label = "";
            this.profileSelect = null;
            this.labelSelect = null;
            this.getAllProfileSelect();
        },
        /**
         * profile下拉框改变事件
         */
        changeProfileSelect: function () {
            this.getAllLabelSelect();
        },
        /**
         * 刷新表格，重新获取数据
         */
        refreshTable: function () {
            var vm = this;
            vm.msSecurityStrategyConfigTableLoading = true;
            var dataUrl = commonConfig.sysBackendContext + '/sys/sysParam/getSysParamList?' + jsonToSpringBinder(this.searchParams);
            axiosRequest(dataUrl, '获取SysParam信息记录').then(function (data) {
                vm.msSecurityStrategyConfigTablePage = data;
                var list = vm.msSecurityStrategyConfigTablePage.list;
                for (var i in list) {
                    if (list[i].application) {
                        list[i].application = serviceCode_serviceNameJson[list[i].application.toUpperCase()];
                    }
                }
                vm.msSecurityStrategyConfigTableLoading = false;
            });
        },
        /**
         * 重置按钮点击事件
         */
        resetSearchParam: function () {
            this.searchParams = JSON.parse(JSON.stringify(defaultParams));
            this.profileSelect = null;
            this.labelSelect = null;
            this.getAllApplicationSelect();
        },
        /**
         * 表格行点击事件
         * @param row 行数据
         * @param event 原生事件
         * @param column 点击位置所属列
         */
        handleRowClick: function (row, event, column) {
            eleTableClickSelection(this.$refs.msSecurityStrategyConfigTable, row, column)
        },
        /**
         * 分页大小切换事件
         * @param val 新值
         */
        handleTableSizeChange: function (val) {
            this.searchParams.limit = val;
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
                this.searchParams.sort = defaultParams.sort;
                this.searchParams.order = defaultParams.order
            } else {
                this.searchParams.sort = scope.prop;
                // 组件传递的order格式为'descending'/'ascending'
                this.searchParams.order = scope.order.split('ending')[0]
            }
            this.refreshTable()
        },
        /**
         * 新增记录
         */
        addNewSysParam: function () { // 新增记录
            var formUrl = this.formBaseUrl + 'add&sysId=' + this.sysId;
            var vm = this;
            openDialog('新增配置项信息', formUrl, {
                width: '700px',
                height: '350px',
                callback: function () {
                    //新增成功后刷新profile下拉框
                    vm.getAllProfileSelect();
                    // 新增成功后刷新表格
                    vm.refreshTable();
                },
            })
        },
        /**
         * 删除选中记录
         */
        deleteSelectedSysParam: function () {
            var vm = this;
            var selections = vm.$refs.msSecurityStrategyConfigTable.selection
            if (selections.length === 0) {
                direwolfCommonTips('warning', '请选择要删除的记录')
                return
            }
            direwolfCommonConfirm({
                message: '数据删除后不可恢复，确定继续删除吗?',
                title: '删除提醒',
            }, function () {
                var ids = '';
                selections.forEach(function (select) {
                    if (select.id) {
                        ids += select.id + ','
                    }
                });
                if (ids.length > 1) {
                    ids = ids.substr(0, ids.length - 1);
                    var formUrl = commonConfig.sysBackendContext + '/sys/sysParam/deleteAll?type=del&ids=' + ids;
                    axiosRequest(formUrl, '批量删除配置项信息', 'POST', null).then(function (data) {
                        if (data && data.type === 'success') {
                            //删除成功后刷新profile下拉框
                            vm.getAllProfileSelect();
                            // 删除成功后刷新表格
                            vm.refreshTable();
                        }
                    })
                }
            })
        },
        /**
         * 修改选中的记录
         */
        editSelectedSysParam: function () {
            var vm = this;
            var selections = this.$refs.msSecurityStrategyConfigTable.selection;
            if (selections.length !== 1) {
                direwolfCommonTips('warning', '仅能选择一条记录进行编辑');
                return
            }
            var formUrl = this.formBaseUrl + 'edit&sysParamCode=' + selections[0].sysParamCode + '&sysId=' + vm.sysId;
            openDialog('修改配置项信息', formUrl, {
                width: '700px',
                height: '350px',
                callback: function (result) {
                    vm.refreshTable();
                },
            })
        },
        backToLastHtml: function () {
            window.location.href = './msSystemInfoList.html';
        }
        // /**
        //  * 打开微服务选择面板
        //  */
        // selectService: function () {
        //     var vm = this;
        //     top.layer.open({
        //         type: 2,
        //         title: '选择服务记录',
        //         area: ['900px', '500px'],
        //         content: getRelativePath() + 'msServiceInfoList.html?editType=view',
        //         btn: ['确定', '关闭'],
        //         zIndex: 100,
        //         yes: function (index, layero) {
        //             var selection = layero.find(
        //                 'iframe')[0].contentWindow.msServiceInfoListContentVm.$refs.msServiceInfoTable.selection
        //             if (selection.length !== 1) {
        //                 direwolfCommonTips('warning', '请选择一条服务记录')
        //                 return
        //             }
        //             vm.searchParams.service.id = selection[0].id
        //             vm.searchParams.service.serviceName = selection[0].serviceName
        //             top.layer.close(index)
        //         },
        //     })
        // },
    }
});

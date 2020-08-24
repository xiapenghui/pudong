var validateForm;

/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var pageDictMap = {};
var fieldDictTypeMap = {
    'enableType': 'enable_type',
    'enTimeLimit': 'y_n',
};

var callActivitiDefForm = new Vue({
    el: '#callActivitiDefForm',
    data: function () {
        return {
            entity: {
                procDefId: getQueryString("procDefId"),
                modelNodeId: getQueryString("modelNodeId"),
                editType: getQueryString("editType"),
            },
            /**
             * 页面加载状态
             */
            pageLoading: true,
            requestUrlPrefix: requestUrlPrefix,
            editType: getQueryString("editType"),
            type: 1,
            pageDictMap: {}
        }
    },
    computed: {
        /**
         * 单位状态字典
         */
        timeUnitsDict: function () {
            return this.pageDictMap['time_units'];
        }
    },
    created: function () {
        //请求所有字典，全部请求返回后再继续加载页面
        var vm = this;
        var dictUrl = '/sys/a/sys/sysParam/getParamsByCodeStr?classCodes=y_n,time_units,' +
            'activiti_multi_decision_type,activiti_multi_condition_type';
        var info = '获取字典信息';
        axios.get(dictUrl).then(function (response) {
            pageDictMap = getDataFromAxiosResponse(response, info).data;
            vm.pageDictMap = pageDictMap;
            vm.pageLoading = false;
            vm.initFormData();
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        });
    },
    methods: {
        /**
         * 初始化表单数据
         */
        initFormData: function () {
            var vm = this;
            var pkValue = this.entity.procDefId;
            if (pkValue) {
                var url = '/activiti/a/activiti/callActivitiDef/getCallActivitiDefList?procDefId=' + pkValue + '&modelNodeId=' + vm.entity.modelNodeId;
                var info = '获取单条流程分类管理信息';
                axios.get(url).then(function (response) {
                    var page = getDataFromAxiosResponse(response, info)
                    if (page.list && page.list[0]) {
                        vm.entity = page.list[0];
                    }
                    setTimeout(() => {
                        initialTable();
                    })
                }).catch(function (error) {
                    axiosErrorTips(error, info + '异常')
                })
            }
        }
    },
    mounted: function () {
        validateForm = $("#callActivitiDefForm").validate({
            submitHandler: function (form) {
                loading('正在提交，请稍等...');
                form.submit();
            },
            errorContainer: "#messageBox",
            errorPlacement: function (error, element) {
                $("#messageBox").text("输入有误，请先更正。");
                if (element.is(":checkbox") || element.is(":radio") || element.parent().is(".input-append")) {
                    error.appendTo(element.parent().parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });
        // 消除不满窗时的滚动条
        if ($("#callActivitiDefForm").height() < $("#callActivitiDefForm").context.defaultView.innerHeight) {
            $($("#callActivitiDefForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }


        $(".addParamShuttleInBtn").click(function (e) {
            e.preventDefault();
            var source = $("#sourceOfShuttleIn").val();
            if (source == "") {
                toastr.error('source不能为空');
                return;
            }
            var target = $("#targetOfShuttleIn").val();
            if (target == "") {
                toastr.error('target不能为空');
                return;
            }
            $('#paramShuttleInTable').bootstrapTable('prepend', {source: source, target: target});
            $("#sourceOfShuttleIn").val("");
            $("#targetOfShuttleIn").val("");
        });
        $(".deleteParamShuttleInBtn").click(function (e) {
            e.preventDefault();
            var selections = $('#paramShuttleInTable').bootstrapTable('getAllSelections');
            var toRemoveSources = selections.map(function (item) {
                return item.source;
            });
            $('#paramShuttleInTable').bootstrapTable('remove', {field: "source", values: toRemoveSources});
        });
        $(".addParamShuttleOutBtn").click(function (e) {
            e.preventDefault();
            var source = $("#sourceOfShuttleOut").val();
            if (source == "") {
                toastr.error('source不能为空');
                return;
            }
            var target = $("#targetOfShuttleOut").val();
            if (target == "") {
                toastr.error('target不能为空');
                return;
            }
            $('#paramShuttleOutTable').bootstrapTable('prepend', {source: source, target: target});
            $("#sourceOfShuttleOut").val("");
            $("#targetOfShuttleOut").val("");
        });
        $(".deleteParamShuttleOutBtn").click(function (e) {
            e.preventDefault();
            var selections = $('#paramShuttleOutTable').bootstrapTable('getAllSelections');
            var toRemoveSources = selections.map(function (item) {
                return item.source;
            });
            $('#paramShuttleOutTable').bootstrapTable('remove', {field: "source", values: toRemoveSources});
        });
    }
});

function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        var selectionsIn = $('#paramShuttleInTable').bootstrapTable('getData');
        var shuttleInSource = selectionsIn.map(function (item) {
            return item.source;
        });
        var shuttleInTarget = selectionsIn.map(function (item) {
            return item.target;
        });
        var selectionsOut = $('#paramShuttleOutTable').bootstrapTable('getData');
        var shuttleOutSource = selectionsOut.map(function (item) {
            return item.source;
        });
        var shuttleOutTarget = selectionsOut.map(function (item) {
            return item.target;
        });
        $("#strShuttleInSource").val(shuttleInSource);
        $("#strShuttleInTarget").val(shuttleInTarget);
        $("#strShuttleOutSource").val(shuttleOutSource);
        $("#strShuttleOutTarget").val(shuttleOutTarget);

        formAjaxSubmit($("#callActivitiDefForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

function initialTable() {
    var paramShuttleInDataList = [];
    var paramShuttleOutDataList = [];

    // paramShuttleInDataList.push({source:"testSource", target:"testTarget"});
    $.ajax({
        type: "get",
        async: false,
        url: requestUrlPrefix + "/activiti/callActivitiDef/getShuttles?callActivitiDefId=" + callActivitiDefForm.entity.id + "&timestamp=" + new Date().getTime(),
        success: function (result) {
            var dataList = result.data;
            var paramShuttlesIn = dataList.filter(function (item) {
                return item.shuttleType == "0";
            });
            var paramShuttlesOut = dataList.filter(function (item) {
                return item.shuttleType == "1";
            });
            paramShuttleInDataList = paramShuttlesIn.map(function (item) {
                return {source: item.source, target: item.target};
            });
            paramShuttleOutDataList = paramShuttlesOut.map(function (item) {
                return {source: item.source, target: item.target};
            });
        }
    });

    $("#paramShuttleInTable").bootstrapTable({
        data: paramShuttleInDataList,
        cache: false,
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pagination: true,
        clickToSelect: true,//点击选中行
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5, 10, 20, 50]        //可供选择的每页的行数（*）
    });
    $("#paramShuttleOutTable").bootstrapTable({
        data: paramShuttleOutDataList,
        cache: false,
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pagination: true,
        clickToSelect: true,//点击选中行
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5, 10, 20, 50]        //可供选择的每页的行数（*）
    });
}

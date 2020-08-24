var validateForm;
var pageDictMap = {};
var procDefForm = new Vue({
    el: '#procDefForm',
    data: function () {
        return {
            entity: {
                id: getQueryString("id"),
                procKey: null,
                name: null,
                flowTypeName: null,
                flowTypeId: null,
                description: null,
                strListenerNames: null,
                limitDays: null,
                limitDaysType: "1",
                warningDays: null,
                warningDaysType: "1",
                workdayRuleName: null,
                workdayRuleId: null
            },
            /**
             * 页面加载状态
             */
            pageLoading: true,
            editType: getQueryString("editType"),
            type: 0,
            /**
             * 页面字典列表
             */
            pageDictMap: {},
            /**
             * 请求前缀
             */
            requestUrlPrefix: '/api/activiti/a',
            // timeUnitsDict: null
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
        var info = '获取字典信息';
        axios.get(dictUrl + 'y_n,time_units').then(function (response) {
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
            var pkValue = this.entity.id;
            if (pkValue) {
                var url = '/activiti/a/activiti/procDef/getProcDefList?id=' + pkValue;
                var info = '获取单条日志分类管理信息';
                axios.get(url).then(function (response) {
                    var page = getDataFromAxiosResponse(response, info)
                    if (page.list && page.list[0]) {
                        vm.entity = page.list[0];
                    }
                }).catch(function (error) {
                    axiosErrorTips(error, info + '异常')
                })
            }
        }
    },
    mounted: function () {
        validateForm = $("#procDefForm").validate({
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
        if ($("#procDefForm").height() < $("#procDefForm").context.defaultView.innerHeight) {
            $($("#procDefForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }


        var dataList = getAllListener(this.type);
        initial(dataList, "listenerTable");
        if (this.entity.id && this.entity.id != "") {
            var selectedListenerNames = getSelectedListenerNames(this.entity.id);
            //勾选原来的listener
            $("#listenerTable").bootstrapTable("checkBy", {field: "name", values: selectedListenerNames});
        }

        $("#workdayRuleSelectBtn").click(function () {
            selectWorkdayRule();
        });
    }
});


function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        var selections = $("#listenerTable").bootstrapTable('getSelections');
        $("#strListenerNames").val(selections.map(function (item) {
            return item.name;
        }));
        var reg = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        if (procDefForm.entity.procKey.match(reg) == null) {
            toastr.error("字母或下划线开头，不能带\\\\");
            return false;
        }
        formAjaxSubmit($("#procDefForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}


//表单选择
function selectWorkdayRule() {
    // 设置主表带入子表的值
    var formUrl = getRelativePath() + "workdayRuleSelect.html?timestamp=" + new Date().getTime();
    openDialog("工作日制度选择", formUrl, {
        width: "800px",
        height: "500px",
        callback: function (result) {
            return true;
        },
        yes: function (index, layero) {
            var iframeWin = layero.find('iframe')[0];
            var data = iframeWin.contentWindow.doSubmit(function (data) {
                setTimeout(function () {
                    if (!!config.callback)
                        config.callback();
                    top.layer.close(index);
                }, 100);
            });
            // $("#workdayRuleId").val(data.id);
            // $("#workdayRuleName").val(data.ruleName);
            procDefForm.entity.workdayRuleId = data.id;
            procDefForm.entity.workdayRuleName = data.ruleName;
            top.layer.close(index);
            return true;
        }
    });
}


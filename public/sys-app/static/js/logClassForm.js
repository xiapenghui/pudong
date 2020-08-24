var validateForm;

var alarm = {
    alarmLevel: ""
};
var logClassForm = new Vue({
    el: '#logClassForm',
    data: function () {
        return {
            entity: {
                id: GetQueryString('id'),
                classCode: GetQueryString('classCode'),
                enableType: "",
                enableAlarm: "0",
                alarm: JSON.parse(JSON.stringify(alarm)), // 拷贝初始值
            },
            /**
             * 页面加载状态
             */
            pageLoading: true,
            /**
             * 页面查看类型
             */
            editType: GetQueryString('editType'),
            /**
             * 页面字典列表
             */
            pageDictMap: {},
        }
    },
    computed: {
        /**
         * 启用类型字典
         */
        enableTypeDict: function () {
            return this.pageDictMap['enable_type']
        },
        /**
         * 是否类型字典
         */
        yNDict: function () {
            return this.pageDictMap['y_n']
        },
        /**
         * 是否类型字典
         */
        logAlarmLevelDict: function () {
            return this.pageDictMap['log_alarm_level']
        }
    },
    created: function () {
        var vm = this;
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,enable_type,log_alarm_level';
        var info = '获取字典信息';
        axios.get(dictUrl).then(function (response) {
            vm.pageDictMap = getDataFromAxiosResponse(response, info).data;
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
                var url = commonConfig.sysBackendContext + '/sys/logClass/getLogClassList?id=' + pkValue;
                var info = '获取单条日志分类管理信息';
                axios.get(url).then(function (response) {
                    var page = getDataFromAxiosResponse(response, info)
                    if (page.list && page.list[0]) {
                        vm.entity = page.list[0];
                        if (vm.entity.alarm == null) {
                            vm.entity.alarm = JSON.parse(JSON.stringify(alarm));
                            vm.entity.enableAlarm = "0";
                        } else {
                            vm.entity.enableAlarm = "1";
                        }
                        Vue.nextTick(function () {
                            $("#enableAlarm").change();
                        })
                    }
                }).catch(function (error) {
                    axiosErrorTips(error, info + '异常')
                })
            }
        }
    },
    mounted: function () {
        validateForm = $("#logClassForm").validate(
            {
                submitHandler: function (form) {
                    loading('正在提交，请稍等...');
                    form.submit();
                },
                errorContainer: "#messageBox",
                errorPlacement: function (error, element) {
                    $("#messageBox").text("输入有误，请先更正。");
                    if (element.is(":checkbox") || element.is(":radio")
                        || element.parent().is(".input-append")) {
                        error.appendTo(element.parent().parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
        // 消除不满窗时的滚动条
        if ($("#logClassForm").height() < $("#logClassForm").context.defaultView.innerHeight) {
            $($("#logClassForm").context.firstElementChild).height(
                $("#inputForm").context.defaultView.innerHeight);
        }

        $("#enableAlarm").change(function () {
            var value = $(this).val();
            if ("1" === value) {
                $(".alarmCfgArea").show();
                $("#alarm\\.alarmLevel").addClass("required");
                $("#alarm\\.alarmDesc").addClass("required");
                //$("#alarm\\.alarmEmails").addClass("required");
            } else {
                $(".alarmCfgArea").hide();
                $("#alarm\\.alarmLevel").removeClass("required");
                $("#alarm\\.alarmDesc").removeClass("required");
                //$("#alarm\\.alarmEmails").removeClass("required");
            }
        });
        // $("#enableAlarm").change();
    }
});


function doSubmit(callback) {// 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        formAjaxSubmit($("#logClassForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

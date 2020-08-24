var validateForm;
var procInstForm = new Vue({
    el: '#procInstForm',
    data: function () {
        return {
            /**
             * 页面加载状态
             */
            pageLoading: true,
            /**
             * 页面字典列表
             */
            pageDictMap: {}
        }
    },
    created: function () {
        //请求所有字典，全部请求返回后再继续加载页面
        var vm = this;
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,enable_type';
        var info = '获取字典信息';
        axios.get(dictUrl).then(function (response) {
            pageDictMap = getDataFromAxiosResponse(response, info).data;
            vm.pageDictMap = pageDictMap;
            vm.pageLoading = false;
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        });
    },
    computed: {
        /**
         * 启用类型字典
         */
        enableTypeDict: function () {
            return this.pageDictMap['enable_type']
        }
    },
    methods: {},
    mounted: function () {
        validateForm = $("#procInstForm").validate({
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
        if ($("#procInstForm").height() < $("#procInstForm").context.defaultView.innerHeight) {
            $($("#procInstForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }

    }
});


function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        formAjaxSubmit($("#procInstForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

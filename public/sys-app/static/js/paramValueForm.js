var validateForm;

function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        formAjaxSubmit($("#paramValueForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

var pageDictMap = {}
var fieldDictTypeMap = {
    'enTimeLimit': 'y_n',
}
var paramValueListContentVm = new Vue({
    el: '#paramValueForm',
    data: function () {
        return {
            entity: {
                id: GetQueryString('id'),
                classCode: GetQueryString('classCode'),		// 代码分类code
                paramCode: '',		// 代码code
                paramName: '',		// 代码名称
                codeExt: '',		// 扩展配置
                dispOrder: '',		// disp_order
                enable: '',		// 是否启用
                parentParamId: '',		// parent_param_id

            },
            /**
             * 页面查看类型
             */
            editType: GetQueryString('editType'),
            pageDictMap: {},
            urlPrefix: commonConfig.sysBackendContext + '/sys/paramValue',
        }
    },
    computed: {

        enTimeLimitDict() {
            return this.pageDictMap['y_n']
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
                var url = this.urlPrefix + '/getParamValueList?id=' + pkValue
                var info = '获取系统字典信息'
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

    },
    created: function () {
        checkPagePermission(commonConfig.sysBackendContext + '/sys/paramValue/checkParamValueFormPermission')
        // 请求所有字典，全部请求返回后再继续加载页面
        var vm = this
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,user_status,user_type'
        var info = '获取字典信息'
        axios.get(dictUrl).then(function (response) {
            vm.pageDictMap = getDataFromAxiosResponse(response, info).data
            vm.initFormData()
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        })
    },
    mounted: function () {
        validateForm = $("#paramValueForm").validate({
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
        if ($("#paramValueForm").height() < $("#paramValueForm").context.defaultView.innerHeight) {
            $($("#paramValueForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }
    }
})

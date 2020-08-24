var validateForm;
/**
 * 请求前缀
 */
var requestUrlPrefix = '/activiti/a';
var flowTypeForm = new Vue({
    el: '#flowTypeForm',
    data: function () {
        return {
            entity: {
                id: getQueryString("id"),
                flowTypeName: null,
                flowTypeCode: null,
                flowTypeDesc: null,
                parentId: getQueryString("parentId"),
                parentIds: getQueryString("parentIds"),
            },
            /**
             * 页面加载状态
             */
            pageLoading: true,
            editType: getQueryString("editType")
        }
    },
    created: function () {
        this.initFormData();
    },
    methods: {
        /**
         * 初始化表单数据
         */
        initFormData: function () {
            var vm = this;
            var pkValue = this.entity.id;
            if (pkValue) {
                var url = requestUrlPrefix + '/activiti/flowType/getFlowTypeList?id=' + pkValue;
                var info = '获取单条流程分类管理信息';
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
        validateForm = $("#flowTypeForm").validate({
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
        if ($("#flowTypeForm").height() < $("#flowTypeForm").context.defaultView.innerHeight) {
            $($("#flowTypeForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }
    }
});

function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        formAjaxSubmit($("#flowTypeForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

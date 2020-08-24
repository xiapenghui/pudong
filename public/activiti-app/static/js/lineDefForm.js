/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var validateForm;

var lineDefForm = new Vue({
    el: '#lineDefForm',
    data: function () {
        return {
            entity: {
                procDefId: getQueryString("procDefId"),
                modelNodeId: getQueryString("modelNodeId"),
            },
            /**
             * 页面加载状态
             */
            pageLoading: true,
            requestUrlPrefix: requestUrlPrefix,
            editType: getQueryString("editType"),
            type: 2,
        }
    },
    created: function () {
        var vm = this;
        var pkValue = this.entity.procDefId;
        if (pkValue) {
            var url = '/activiti/a/activiti/lineDef/getLineDefList?procDefId=' + pkValue + '&modelNodeId=' + vm.entity.modelNodeId;
            var info = '获取单条节点信息';
            axios.get(url).then(function (response) {
                var page = getDataFromAxiosResponse(response, info)
                if (page.list && page.list[0]) {
                    vm.entity = page.list[0];
                    if (vm.entity.id != "") {
                        var selectedListenerNames = getSelectedListenerNames(vm.entity.id);
                        //勾选原来的listener
                        $("#listenerTable").bootstrapTable("checkBy", {field: "name", values: selectedListenerNames});
                    }
                }
            }).catch(function (error) {
                axiosErrorTips(error, info + '异常')
            })
        }
    },
    methods: {},
    mounted: function () {
        validateForm = $("#lineDefForm").validate({
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
        if ($("#lineDefForm").height() < $("#lineDefForm").context.defaultView.innerHeight) {
            $($("#lineDefForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }

        var dataList = getAllListener(this.type);
        initial(dataList, "listenerTable");
        // if (this.entity.id != "") {
        //     var selectedListenerNames = getSelectedListenerNames(this.entity.id);
        //     //勾选原来的listener
        //     $("#listenerTable").bootstrapTable("checkBy", {field: "name", values: selectedListenerNames});
        // }
    }
});


function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        var selections = $("#listenerTable").bootstrapTable('getSelections');
        $("#strListenerNames").val(selections.map(function (item) {
            return item.name;
        }));
        formAjaxSubmit($("#lineDefForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

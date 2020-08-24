/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';

var myTabContent = new Vue({
    el: '#myTabContent',
    data: function () {
        return {
            entity: {
                id: getQueryString("id"),
                flowTypeName: null,
                flowTypeCode: null,
                flowTypeDesc: null
            },
            editType: getQueryString("editType"),
            /**
             * 页面加载状态
             */
            pageLoading: true,
            /**
             * 请求前缀
             */
            requestUrlPrefix: requestUrlPrefix

        }
    },
    created: function () {
    },
    methods: {},
    mounted: function () {
        // 消除不满窗时的滚动条
        if ($("#procInstForm").height() < $("#procInstForm").context.defaultView.innerHeight) {
            $($("#procInstForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }
    }
});


// 操作列定义
function operateFormatter(value, row, index) {
    var viewDetailBtn = "<button title='查看明细' style='margin:1px' class='viewDetail btn btn-primary btn-xs'>"
        + "<i class='fa fa-newspaper-o fa-fw'></i></button>";
    return viewDetailBtn;
}

window.operateEvents = {
    'click .viewDetail': function (e, value, row, index) {
        var findBizFormUrl = requestUrlPrefix + "/activiti/myDealPrcInst/findBizFormByTaskId?userTaskInstId=" + row.id;
        $.ajax({
            type: 'post',
            dataType: 'json',
            async: false,
            url: findBizFormUrl,
            success: function (result) {
                if (result.type == 'success') {
                    var bizFormPath = result.data.bizFormPath;
                    var formUrl = ctx + "/";
                    if (bizFormPath) {
                        formUrl += bizFormPath + "&editType=view";
                    } else {
                        formUrl += "error/404";
                    }

                    openDialogView("查看任务明细", formUrl, {
                        callback: function () {
                        }
                    });

                } else {
                    toastr.error(result.message || '打开表单失败!');
                }
            },
            error: function () {
                toastr.error("服务器内部错误,请稍后重试!");
            }
        });

    }
}

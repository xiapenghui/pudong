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
                procInstId: getQueryString("procInstId"),
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
        if ($("#userTaskInstForm").height() < $("#userTaskInstForm").context.defaultView.innerHeight) {
            $($("#userTaskInstForm").context.firstElementChild).height(
                $("#inputForm").context.defaultView.innerHeight);
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
        var formUrl = getRelativePath() + "businessTestForm.html?procInstId=" + row.procInstId
            + "&usertaskInstId=" + row.id
            + "&state=" + row.state
            + "&dealUserId=" + row.dealUserId
            + "&editType=view";
        openDialogView("查看任务明细", formUrl, {
            callback: function () {
            }
        });
    }
}

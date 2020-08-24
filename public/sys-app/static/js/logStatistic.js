var pageDictMap = {};
var logStatisticContent = new Vue({
    el: '#logStatisticContent',
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
        setTimeout(()=>{
            this.refreshTable();
        },0);
    },
    methods: {
        refreshTable: function () {
            var data_url = WEB_ROOT + "/sys/logInfo/statistic/list";
            $('#loginFaultTable').bootstrapTable(
                'refresh',
                {
                    url: data_url + "?statType=loginFault&"
                        + $("#logStatSearchForm").serialize()
                });
            $('#accessDeniedTable').bootstrapTable(
                'refresh',
                {
                    url: data_url + "?statType=accessDenied&"
                        + $("#logStatSearchForm").serialize()
                });
            $('#pwdResetTable').bootstrapTable(
                'refresh',
                {
                    url: data_url + "?statType=pwdReset&"
                        + $("#logStatSearchForm").serialize()
                });
            $('#resChgTable').bootstrapTable(
                'refresh',
                {
                    url: data_url + "?statType=resChg&"
                        + $("#logStatSearchForm").serialize()
                });
        },
        setDefaultValue: function () {
            // 今天：moment().format(daterangepickerLocale("YYYY-MM-DD").format)
            var begin = "";
            var end = "";
            var timeRange = "";
            if (begin.length > 0 && end.length > 0) {
                timeRange = begin + daterangepickerLocale().separator + end;
            }
            $("#logStatSearchForm #logDate").val(timeRange);
            $("#logStatSearchForm #beginLogDate").val(begin);
            $("#logStatSearchForm #endLogDate").val(end);
        }

    },
    mounted: function () {
        // 设置查询重置按钮点击方法
        var vm = this;
        var $searchBtn = $('#logStatSearchBtn');
        var $resetBtn = $('#logStatResetBtn');
        $searchBtn.click(vm.refreshTable);
        $resetBtn.click(function () {
            vm.setDefaultValue();
            vm.refreshTable();
        });
        // 绑定回车事件为搜索
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                $('#logStatSearchBtn').click();
            }
        });
    }
});


function loginFaultVisualBarFormatter(value, row, index) {
//  var renderHtml = visualBarFormatter(value, row, index, 'loginFault');
    var renderHtml = visualBarFormatter(row.times, row, index, 'loginFault');
    return renderHtml;
}

function accessDeniedVisualBarFormatter(value, row, index) {
//  var renderHtml = visualBarFormatter(value, row, index, 'accessDenied');
    var renderHtml = visualBarFormatter(row.times, row, index, 'accessDenied');
    return renderHtml;
}

function pwdResetVisualBarFormatter(value, row, index) {
    var renderHtml = visualBarFormatter(row.times, row, index, 'pwdReset');
    return renderHtml;
}
function resChgVisualBarFormatter(value, row, index) {
    var renderHtml = visualBarFormatter(row.times, row, index, 'resChg');
    return renderHtml;
}

var visualBarUnit = 20;

function visualBarFormatter(value, row, index, statType) {
    var num = Number.parseInt(value);
    if (index === 0) {
        visualBarUnit = 350 / num;
    }
    return "<div style='vertical-align: middle; display: inline-block; background: #ed5565; height: 20px; width: "
        + (visualBarUnit * num)
        + "px'></div><font style='vertical-align: middle; font-size: large; font-weight: 500; margin-left: 5px;'><a href='javascript:void(0)' onclick='return false;' class='statisticDetail' data-stat-type='"
        + statType + "'>" + value + "</a></font>";
}

window.viewEvents = {
    'click .statisticDetail': function (e, value, row, index) {
        var formUrl = getRelativePath() + "logInfoList.html?userId=" + row.userid
            + "&userName=" + row.username
            + "&statType=" + $(e.currentTarget).data('statType') + "&"
            + $("#logStatSearchForm").serialize();
        openDialogView("统计明细", formUrl, {
            width: "900px",
            height: "500px"
        });
    }
};



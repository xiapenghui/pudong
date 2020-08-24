/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var pageDictMap = {};
var fieldDictTypeMap = {
    'resCode': 'res_code',
    'resType': 'res_type',
    'visiable': 'y_n',
    'useTag': 'y_n',
};

var flowResListContent = new Vue({
    el: '#flowResListContent',
    data: function () {
        return {
            appId: getQueryString("appId"),
            parentId: getQueryString("parentId"),
            /**
             * 页面加载状态
             */
            pageLoading: true,
            requestUrlPrefix: requestUrlPrefix,
            editType: getQueryString("editType"),
            type: 2,
            pageDictMap: {}
        }
    },
    computed: {
        /**
         * 单位状态字典
         */
        resCodeDict: function () {
            return this.pageDictMap['res_code'];
        }
    },
    created: function () {
        //请求所有字典，全部请求返回后再继续加载页面
        var vm = this;
        var info = '获取字典信息';
        axios.get(dictUrl + 'y_n,res_code,res_type').then(function (response) {
            pageDictMap = getDataFromAxiosResponse(response, info).data;
            vm.pageDictMap = pageDictMap;
            vm.pageLoading = false;
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        });
    },
    methods: {},
    mounted: function () {
        resource = {
            appId: 1, // 默认appId
            /** *********************************以下为子节点的table*********************************** */
            resTable: {
                updateTable: function (parentId, appId) {
                    $('#resourceTable').bootstrapTable('refresh',
                        {
                            url: WEB_ROOT + "/sys/resource/getResourceList?parentId=2" + "&appId=" + appId,
                        }
                    );
                },

                // 设置查询项的默认值，在初始化及点击重置按钮时调用
                setDefaultValue: function () {
                    $("#resourceSearchForm #resName").val("");
                    $("#resourceSearchForm #resType").val("");
                    $("#resourceSearchForm #resCode").val("");
                },

                // 刷新表格公共方法
                refreshTable: function () {
                    var data_url = WEB_ROOT + "/sys/resource/getResourceList?parentId=2&appId=" + resource.appId + "&";
                    $('#resourceTable').bootstrapTable('refresh',
                        {
                            url: data_url + $("#resourceSearchForm").serialize(),
                        });
                },

            },
        };
        setTimeout(() => {
            resource.resTable.refreshTable();
        });


        /*---------------------------------------初始化---------------------------------------------*/

        // 初始化appId
        $.ajax({
            cache: false,
            type: 'GET',
            dataType: "json",
            url: WEB_ROOT + "/sys/app/getAppListOfUser?timestamp=" + Date.parse(new Date()),
            error: function () {
                alert('请求失败');
            },
            success: function (result) {
                var data = result.data;
                var appIds = data.map(function (item) {
                    return item.id
                });
                var appNames = data.map(function (item) {
                    return item.appName
                });
                $select_appId = $("#select_appId");
                for (var i = 0; i < data.length; i++) {
                    $select_appId.append("<option value='" + data[i].id + "'>" + data[i].appName + "</option>")
                }
                $select_appId.val(defaultAppId);
                $select_appId.change(function () {
                    resource.appId = $(this).children('option:selected').val();// 这就是selected的值
                    resource.resTable.setDefaultValue();
                    resource.resTable.updateTable("2", resource.appId);
                });

            }
        });


        // 初始化表
        resource.resTable.setDefaultValue();
        resource.resTable.updateTable("2", resource.appId); // 初始化表格，默认查询第一层节点

        // 设置查询重置按钮点击方法
        var $searchBtn = $('#resourceSearchBtn');
        var $resetBtn = $('#resourceResetBtn');

        $searchBtn.click(resource.resTable.refreshTable);
        $resetBtn.click(function () {
            resource.resTable.setDefaultValue();
            resource.resTable.refreshTable();
        });


        /*	$(window).bind("load resize scroll", function () {
                fix_height();
            });*/

        bindEnter("resSearchName", "resSearchBtn");
        bindEnter("resName", "resourceSearchBtn");
    }
});

function fix_height() {
    var winheight = $(window).height();
    var fbox = $('.ibox:first');
    var lbox = $('.ibox:last');
    var fheight = fbox.height();
    var lheight = lbox.height();
    var maxh = fheight > lheight ? fheight : lheight;
    if (maxh <= winheight || $(window).width() >= (fbox.width() + lbox.width())) {
        $('.ibox').css('min-height', (winheight - 30) + 'px');
        $('.ibox-content').css('min-height', (winheight - 50) + 'px');
    } else {
        $('.ibox').css('min-height', '');
        $('.ibox-content').css('min-height', '');
    }
}


//工作流资源表单添加确认自定义js
function doSubmit(callback) {
    var target;
    var selections = $('#resourceTable').bootstrapTable("getSelections");// 子页面
    var params;
    if (selections.length == 0) {
        toastr.warning('请选择工作流资源进行添加!');
    } else if (selections.length > 1) {
        toastr.warning('只能选择一条工作流资源进行添加!');
    } else {
        if (!$.isEmptyObject(selections)) {
            target = selections[0].target
        }
    }
    var data = {
        target: target,
        message: ""
    };

    return data;

}




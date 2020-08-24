var requestUrlPrefix = '/api/activiti/a';

function getAllListener(type) {
    var dataList = [];
    $.ajax({
        type: "get",
        async: false,
        url: requestUrlPrefix + "/activiti/listener/getAllListenerInfo?type=" + type + "&timestamp=" + new Date().getTime(),
        success: function (result) {
            dataList = result.data;
        }
    });
    return dataList;
}

function getSelectedListenerNames(ownerId) {
    var selectedListenerNames = [];
    $.ajax({
        type: "get",
        async: false,
        url: requestUrlPrefix + "/activiti/listener/getSelectedListenerNames?ownerId=" + ownerId + "&timestamp=" + new Date().getTime(),
        success: function (result) {
            selectedListenerNames = result.data;
        }
    });
    return selectedListenerNames;
}


function initial(dataList, tableId) {
    $("#" + tableId).bootstrapTable({
        data: dataList,
        cache: false,
        formatNoMatches: function () {
            return '无符合条件的记录';
        },
        //striped: true,                              //是否显示行间隔色
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pagination: true,
        clickToSelect: true,//点击选中行
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5, 10, 20, 50]        //可供选择的每页的行数（*）
    });
}

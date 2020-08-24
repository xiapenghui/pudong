/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';

var processedUserTaskInstListContent = new Vue({
    el: '#processedUserTaskInstListContent',
    data: function () {
        return {
            /**
             * 页面加载状态
             */
            pageLoading: true,
        }
    },
    created: function () {

    },
    methods: {},
    mounted: function () {
// 流程分类树配置相关
        var settings = {
            view: {
                removeHoverDom: removeHoverDom,
                selectedMulti: false,
                fontCss: setFontCss
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeDrag: beforeNodeDrag,// 节点拖拽事件
                onClick: onNodeClick
            }
        };
        var lastSearchNodes = [];
        $.get(requestUrlPrefix + "/activiti/flowType/getProcTypeTree?pId=0", function (
            result) {
            $.fn.zTree.init($("#flowTypeTree"), settings, result);
            var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
            // 获取根节点并且选中触发点击事件
            var nodes = treeObj.getNodes();
            if (nodes.length > 0) {
                treeObj.selectNode(nodes[0]);
                treeObj.setting.callback.onClick(null, treeObj.setting.treeId,
                    nodes[0]);// 调用事件
            } else {
                toastr.error('树加载失败或数据不存在', "树加载提醒");
            }
        });

        $("#flowTypeSearchBtn").click(function () {
            var tree = $.fn.zTree.getZTreeObj("flowTypeTree");
            var value = $("#flowTypeSearchName").val();
            if ($.isEmptyObject(value)) {
                return;
            }
            var nodes = tree.getNodesByParamFuzzy("name", value);
            if (lastSearchNodes !== null && lastSearchNodes.length > 0) {
                for (var i = 0; i < lastSearchNodes.length; i++) {
                    var node = lastSearchNodes[i];
                    node.highlight = false;
                    tree.updateNode(node);
                }
            }
            lastSearchNodes = nodes;
            if (nodes !== null && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    node.highlight = true;
                    tree.updateNode(node);
                    tree.expandNode(node.getParentNode(), true);
                    if (node.isParent) {
                        tree.expandNode(node, true);
                    }

                }
            }
        });

        // $(window).bind("load resize scroll", function () {
        //     fix_height();
        // });
        $('#userTaskInstTable').on('post-body.bs.table', function () {
            $(this).find(".dropdown-toggle").off('click').dropdown();
        });

        // 设置查询项的默认值，在初始化及点击重置按钮时调用
        function setDefaultValue() {
            $("#userTaskInstSearchForm #procInstName").val("");
            $("#userTaskInstSearchForm #actiName").val("");
        }

        setDefaultValue();
        // refreshTable();

        // 设置查询重置按钮点击方法
        var $searchBtn = $('#userTaskInstSearchBtn');
        var $resetBtn = $('#userTaskInstResetBtn');
        $searchBtn.click(refreshTable);
        $resetBtn.click(function () {
            setDefaultValue();
            refreshTable();
        });

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

// 操作列定义
function operateFormatter(value, row, index) {

    var recallTask = "<div style='position:relative;' class='btn-group-xs'><button title='撤回' style='margin:1px' class='recallTask btn btn-primary  btn-xs'>"
        + "<i class='fa fa-reply fa-fw'></i></button></div>";
    return recallTask;

}

window.operateEvents = {
    'click .recallTask': function (e, value, row, index) {
        $.ajax({
            type: "get",
            url: requestUrlPrefix
                + "/activiti/userTaskInst/recallTask?userTaskInstId="
                + row.id + "&timestamps=" + new Date().getTime(),
            success: function (result) {
                if (result.type === "success") {
                    toastr.success(result.message || '撤回任务成功!');
                    $('#userTaskInstTable').bootstrapTable('refresh');
                } else {
                    toastr.error(result.message || '撤回任务失败！');
                }
            }
        })
    }
}

// 节点点击事件
function onNodeClick(event, treeId, treeNode, clickFlag) {
    refreshTable();
}

// 刷新表格公共方法
function refreshTable() {
    var data_url = requestUrlPrefix + "/activiti/userTaskInst/getUserTaskInstList?";
    var tree = $.fn.zTree.getZTreeObj("flowTypeTree");
    if (tree != null) {
        var selNodes = tree.getSelectedNodes();
        if (selNodes.length > 0) {
            if (tree.getSelectedNodes()[0].parentIds == "") {
                data_url += "procDefId=" + tree.getSelectedNodes()[0].id + "&"
            } else {
                data_url += "flowTypeId=" + tree.getSelectedNodes()[0].id + "&";
            }
        }
    }

    $('#userTaskInstTable').bootstrapTable('refresh', {
        url: data_url + $("#userTaskInstSearchForm").serialize()
    });
}

function setFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {
        color: '#A60000',
        "font-weight": "bold"
    } : {
        color: "#333",
        "font-weight": "normal"
    };
}

// 用户禁止拖动节点
function beforeNodeDrag() {
    return false;
}

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
}

// 主表按钮点击前置回调结束


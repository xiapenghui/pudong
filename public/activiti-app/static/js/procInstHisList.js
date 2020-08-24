/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';

var procInstHisListContent = new Vue({
    el: '#procInstHisListContent',
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
        var treeUrl = requestUrlPrefix
            + "/activiti/flowType/getProcTypeTree?pId=0&loadType=allActive";
        $.get(treeUrl, function (result) {
            $.fn.zTree.init($("#flowTypeTree"), settings, result);
            var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
            // 获取根节点并且选中触发点击事件
            var nodes = treeObj.getNodes();
            if (nodes.length > 0) {
                treeObj.selectNode(nodes[0]);
                treeObj.expandNode(nodes[0], true);
                treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0]);// 调用事件
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

        // 设置查询项的默认值，在初始化及点击重置按钮时调用
        function setDefaultValue() {
            $("#procInstHisSearchForm #actProcInstId").val("");
            $("#procInstHisSearchForm #procName").val("");
            $("#procInstHisSearchForm #instName").val("");
            $("#procInstHisSearchForm #beginTime").val("");
            $("#procInstHisSearchForm #beginBeginTime").val("");
            $("#procInstHisSearchForm #endBeginTime").val("");
            $("#procInstHisSearchForm #endTime").val("");
            $("#procInstHisSearchForm #beginEndTime").val("");
            $("#procInstHisSearchForm #endEndTime").val("");
        }

        setDefaultValue();
        refreshTable();

        // 设置查询重置按钮点击方法
        var $searchBtn = $('#procInstHisSearchBtn');
        var $resetBtn = $('#procInstHisResetBtn');
        $searchBtn.click(refreshTable);
        $resetBtn.click(function () {
            setDefaultValue();
            refreshTable();
        });

        $("#viewProcBtn").click(viewProcessDetail);
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

// 刷新表格公共方法
function refreshTable() {
    var data_url = requestUrlPrefix + "/activiti/procInstHis/getProcInstHisList?";
    var tree = $.fn.zTree.getZTreeObj("flowTypeTree");
    if (tree != null) {
        var selNodes = tree.getSelectedNodes();
        if (selNodes.length > 0) {
            if (selNodes[0].parentIds == "") {
                data_url += "procDefId=" + selNodes[0].id + "&"
            } else if (selNodes[0].parentIds == "-1") {
            } else {
                data_url += "flowTypeId=" + tree.getSelectedNodes()[0].id + "&";
            }
        }
    }
    $('#procInstHisTable').bootstrapTable('refresh', {
        url: data_url + $("#procInstHisSearchForm").serialize()
    });
}

function viewProcessDetail() {
    var selections = $("#procInstHisTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    if (selections.length > 1) {
        toastr.warning("请至多选择一条数据");
        return;
    }
    var config = {
        width: '900px',
        height: '580px',
        full: false
    };
    var formUrl = getRelativePath() + "procInstHisForm.html?editType=view&id="
        + selections[0].id;
    openDialogView("查看用户任务实例", formUrl, config);
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingProcInstHis(args) {
    return args;
}

// 删除前触发
function deletingProcInstHis(args) {
    if (!!args.selections) {
        var ids = "";
        for (var i = 0; i < args.selections.length; i++) {
            if (!!args.selections[i].id) {
                ids += args.selections[i].id + ",";
            }
        }
        ids = ids.substr(0, ids.length - 1);
        if (!!ids) {
            args.params = "ids=" + ids;
        }
    }
    return args;
}

// 查看前触发
function viewingProcInstHis(args) {
    if (!!args.selections && args.selections.length == 1) {
        args.params = "id=" + args.selections[0].id;
    }
    return args;
}

// 操作列定义
function operateFormatter(value, row, index) {

    var editTable = "<div style='position:relative;' class='btn-group-xs'><button title='修改' style='margin:1px' class='edit btn btn-primary  btn-xs'>"
        + "<i class='fa fa-edit fa-fw'></i></button>";
    var deleteTable = "<button title='删除' style='margin:1px' class='btn btn-danger btn-xs remove' >"
        + "<i class='fa fa-trash fa-fw'></i></button></div>";
    return editTable + deleteTable;

}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        var formUrl = getRelativePath() + "procInstHisForm.html?editType=edit&id=" + row.id;
        openDialog("修改流程实例历史", formUrl, {
            callback: function () {
                $('#procInstHisTable').bootstrapTable('refresh');
            }
        });
    },
    'click .remove': function (e, value, row, index) {
        layer.confirm("删除数据不可恢复,确定要继续吗?", {
            icon: 3,
            title: "删除提醒"
        }, function (index) {
            var formUrl = window.location.pathname + "/delete?id=" + row.id;
            $.ajax(formUrl, {
                success: function (result) {
                    if (result.type == "success") {
                        toastr.success(result.message || '删除记录成功!');
                        $('#procInstHisTable').bootstrapTable('refresh');
                    } else {
                        toastr.error(result.message || '删除记录失败!');
                    }
                }
            });
            layer.close(index);
        });
    }

}

function ellipsisFormatter(value, row, index) {
    return "<span title='" + value + "'>" + value + "</span>";
}

function timeStyle() {
    return {
        css: {
            "min-width": "150px"
        }
    };
}

function ellipsisStyle() {
    return {
        css: {
            "text-overflow": "ellipsis",
            "overflow": "hidden",
            "max-width": "110px"
        }
    };
}

// 节点点击事件
function onNodeClick(event, treeId, treeNode, clickFlag) {
    refreshTable();
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


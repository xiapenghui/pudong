/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';

var flowTypeListContent = new Vue({
    el: '#flowTypeListContent',
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
        var lastSearchNodes = [];
        initTree();

        // 设置查询项的默认值，在初始化及点击重置按钮时调用
        function setDefaultValue() {
            $("#flowTypeSearchForm #flowTypeName").val("");
            $("#flowTypeSearchForm #flowTypeCode").val("");
        }

        setDefaultValue();


        // 设置查询重置按钮点击方法
        var $searchBtn = $('#flowTypeSearchBtn');
        var $resetBtn = $('#flowTypeResetBtn');
        var $addFlowTypeBtn = $('#addFlowTypeBtn');
        $searchBtn.click(function () {
            refreshTable();
        });
        $resetBtn.click(function () {
            setDefaultValue();
            refreshTable();
        });
        $addFlowTypeBtn.click(function () {
            addFlowType();
        });

        $("#flowTypeTreeSearchBtn").click(function () {
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

//工作流分类树初始化
function initTree() {
    $.get(requestUrlPrefix + "/activiti/flowType/getFlowTypeTree", function (result) {

        result.push({
            id: "0",
            pId: "0",
            name: "流程分类",
            parentIds: "0"
        });
        $.fn.zTree.init($("#flowTypeTree"), settings, result);
        var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
        //获取根节点并且选中触发点击事件
        var nodes = treeObj.getNodes();
        if (nodes.length > 0) {
            treeObj.selectNode(nodes[0]);
            treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0]);// 调用事件
        } else {
            toastr.error('树加载失败或数据不存在', "树加载提醒");
        }
    });
}

//工作流分类树刷新
function initTreeRefresh(selectedNodes) {
    $.get(requestUrlPrefix + "/activiti/flowType/getFlowTypeTree", function (result) {
        result.push({
            id: "0",
            pId: "0",
            name: "流程分类",
            parentIds: "0"
        });
        $.fn.zTree.init($("#flowTypeTree"), settings, result);
        var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
        //获取根节点并且选中触发点击事件
        var nodes = treeObj.getNodes();

        if (nodes.length > 0) {
            treeObj.selectNode(selectedNodes[0]);
            treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0]);// 调用事件
        } else {
            toastr.error('树加载失败或数据不存在', "树加载提醒");
        }
    });
}


//节点点击事件
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

//刷新Table
function refreshTable() {
    var data_url = requestUrlPrefix + "/activiti/flowType/getFlowTypeList?";
    var tree = $.fn.zTree.getZTreeObj("flowTypeTree");
    if (tree != null) {
        var selNodes = tree.getSelectedNodes();
        if (selNodes.length > 0) {
            data_url += "id=" + tree.getSelectedNodes()[0].id + "&";
        }
    }
    $('#flowTypeTable').bootstrapTable('refresh',
        {
            url: data_url + $("#flowTypeSearchForm").serialize()
        });
}

//获取选中节点的父级节点到根节点
function getParentPath(treeObj) {
    if (treeObj == null)
        return "";
    var parentIds = treeObj.id;
    var pNode = treeObj.getParentNode();
    if (pNode != null) {
        parentIds = getParentPath(pNode) + "," + parentIds;
    }
    return parentIds;
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingFlowType(args) {
    var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
    if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
        var nodes = treeObj.getSelectedNodes();
        var parentIds = getParentPath(nodes[0]);
        args.params = "parentIds=" + "0," + parentIds;
        args.params += "&parentId=" + treeObj.getSelectedNodes()[0].id;
    }
    return args;
}

// 删除前触发
function deletingFlowType(args) {
    if (!!args.selections) {
        var ids = "";
        for (var i = 0; i < args.selections.length; i++) {
            if (!!args.selections[i].flowTypeId) {
                ids += args.selections[i].flowTypeId + ",";
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
function viewingFlowType(args) {
    if (!!args.selections && args.selections.length == 1) {
        args.params = "id=" + args.selections[0].flowTypeId;
    }
    return args;
}


//操作列定义
function operateFormatter(value, row, index) {

    var editTable = "<div style='position:relative;' class='btn-group-xs'><button title='修改' style='margin:1px' class='edit btn btn-primary  btn-xs'>"
        + "<i class='fa fa-edit fa-fw'></i></button>";
    var deleteTable = "<button title='删除' style='margin:1px' class='btn btn-danger btn-xs remove' >"
        + "<i class='fa fa-trash fa-fw'></i></button></div>";
    return editTable + deleteTable;

}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        var formUrl = getRelativePath() + "flowTypeForm.html?editType=edit&id=" + row.id;
        openDialog("修改流程分类", formUrl, {
            callback: function () {
                $('#flowTypeTable').bootstrapTable('refresh');
            }
        });
    },
    'click .remove': function (e, value, row, index) {
        layer.confirm("删除数据不可恢复,确定要继续吗?", {
            icon: 3,
            title: "删除提醒"
        }, function (index) {
            var formUrl = requestUrlPrefix + "/activiti/flowType/delete?id=" + row.id;
            $.ajax(formUrl, {
                type: "POST",
                success: function (result) {
                    if (result.type == "success") {
                        toastr.success(result.message || '删除记录成功!');
                        $('#flowTypeTable').bootstrapTable('refresh');
                        var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
                        if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
                            var nodes = treeObj.getSelectedNodes();
                            initTreeRefresh(nodes);
                        }
                    } else {
                        toastr.error(result.message || '删除记录失败!');
                    }
                }
            });
            layer.close(index);
        });
    }

}

//在树上新增工作流分类
function addFlowType() {
    var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
    if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
        var nodes = treeObj.getSelectedNodes();
        var id = treeObj.getSelectedNodes()[0].id;
        var parentIds = "0," + getParentPath(nodes[0]);
        var formUrl = getRelativePath() + "flowTypeForm.html?editType=add&parentId=" + id + "&parentIds=" + parentIds;
        openDialog("新增工作流分类", formUrl, {
            width: "800px",
            height: "300px",
            callback: function () {
                $('#flowTypeTable').bootstrapTable('refresh');

                var treeObj = $.fn.zTree.getZTreeObj("flowTypeTree");
                if (!$.isEmptyObject(treeObj.getSelectedNodes()) && treeObj.getSelectedNodes().length == 1) {
                    var nodes = treeObj.getSelectedNodes();
                    initTreeRefresh(nodes);
                }
            }
        });
    }
}


// 主表按钮点击前置回调结束


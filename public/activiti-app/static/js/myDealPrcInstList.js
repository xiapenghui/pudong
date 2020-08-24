/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';

var myDealPrcInstListContent = new Vue({
    el: '#myDealPrcInstListContent',
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
        $.get(requestUrlPrefix + "/activiti/flowType/getDealProcTypeTree?pId=0",
            function (result) {
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
            $("#procInstSearchForm #id").val("");
            $("#procInstSearchForm #procName").val("");
            $("#procInstSearchForm #instName").val("");
            $("#procInstSearchForm #userName").val("");
        }

        setDefaultValue();
        // refreshTable();

        // 设置查询重置按钮点击方法
        var $searchBtn = $('#procInstSearchBtn');
        var $resetBtn = $('#procInstResetBtn');
        $searchBtn.click(refreshTable);
        $resetBtn.click(function () {
            setDefaultValue();
            refreshTable();
        });

        $("#viewPrcInstBtn").click(viewPrcInstDetail);

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

/**
 * 查看流程实例详情
 *
 * @returns
 */
function viewPrcInstDetail() {
    var selections = $("#procInstTable").bootstrapTable("getSelections");
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
    var formUrl = getRelativePath() + "myDealPrcInstForm.html?editType=view&id="
        + selections[0].id;

    openDialogView("查看流程实例", formUrl, config);
}


// 节点点击事件
function onNodeClick(event, treeId, treeNode, clickFlag) {
    refreshTable();
}

// 刷新表格公共方法
function refreshTable() {
    var data_url = requestUrlPrefix + "/activiti/myDealPrcInst/getDealProcInstList?";
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

    $('#procInstTable').bootstrapTable('refresh', {
        url: data_url + $("#procInstSearchForm").serialize()
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


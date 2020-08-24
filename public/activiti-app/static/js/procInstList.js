/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var pageDictMap = {};
var fieldDictTypeMap = {
    'state': 'flow_inst_status',
    'enTimeLimit': 'y_n',
};
var procInstListContent = new Vue({
    el: '#procInstListContent',
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
        //请求所有字典，全部请求返回后再继续加载页面
        var vm = this;
        var info = '获取字典信息';
        axios.get(dictUrl + 'y_n,flow_inst_status').then(function (response) {
            pageDictMap = getDataFromAxiosResponse(response, info).data;
            vm.pageDictMap = pageDictMap;
            vm.pageLoading = false;
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        });
    },
    computed: {
        /**
         * 流程实例状态字典
         */
        flowInstStatusDict: function () {
            return this.pageDictMap['flow_inst_status']
        }
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
            $("#procInstSearchForm #actProcInstId").val("");
            $("#procInstSearchForm #procName").val("");
            $("#procInstSearchForm #instName").val("");
            $("#procInstSearchForm #userName").val("");
            $("#procInstSearchForm #state").val("");
            $("#procInstSearchForm #beginTime").val("");
            $("#procInstSearchForm #beginBeginTime").val("");
            $("#procInstSearchForm #endBeginTime").val("");
        }

        setDefaultValue();
        refreshTable();

        // 设置查询重置按钮点击方法
        var $searchBtn = $('#procInstSearchBtn');
        var $resetBtn = $('#procInstResetBtn');
        $searchBtn.click(refreshTable);
        $resetBtn.click(function () {
            setDefaultValue();
            refreshTable();
        });

        $("#terminateProcBtn").click(terminateProc);
        $("#suspendProcBtn").click(suspendProc);
        $("#recoveryProcBtn").click(recoveryProc);
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
    var data_url = requestUrlPrefix + "/activiti/procInst/getProcInstList?";
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
    $('#procInstTable').bootstrapTable('refresh', {
        url: data_url + $("#procInstSearchForm").serialize()
    });
}

function terminateProc() {
    var selections = $("#procInstTable").bootstrapTable("getSelections");
    if (selections.length != 1) {
        toastr.warning("请选择一条数据且至多选择一条数据。");
        return;
    }
    var item = selections[0];
    if (item.state == "9") {
        toastr.warning("流程实例" + item.instName + "已处于终止状态！");
        return;
    }
    layer.confirm("流程终止后无法恢复，确认要终止选定的流程吗?", {
        icon: 3,
        title: "终止提醒"
    }, function (index) {
        $.ajax(requestUrlPrefix + "/activiti/procInst/terminateProc?id=" + item.id, {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success("终止流程实例成功！");
                    refreshTable();
                } else {
                    toastr.error("终止流程实例失败！" + (result.message || "请联系管理员。"));
                }
            }
        });
        layer.close(index);
    });
}

function suspendProc() {
    var selections = $("#procInstTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    var ids = "";
    for (var i = 0; i < selections.length; i++) {
        var item = selections[i];
        if (item.state !== "0") {
            toastr.warning("流程实例" + item.instName + "未处于正常状态！");
            break;
        }
        ids += item.id + ",";
    }
    layer.confirm("流程挂起后请使用恢复按钮恢复，确认要挂起所有选定的流程吗？", {
        icon: 3,
        title: "挂起提醒"
    }, function (index) {
        ids = ids.substr(0, ids.length - 1);
        $.ajax(requestUrlPrefix + "/activiti/procInst/suspendProc?ids=" + ids, {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success("挂起流程实例成功！");
                    refreshTable();
                } else {
                    toastr.error("挂起流程实例失败！" + (result.message || "请联系管理员。"));
                }
            }
        });
        layer.close(index);
    });
}

function recoveryProc() {
    var selections = $("#procInstTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    var ids = "";
    for (var i = 0; i < selections.length; i++) {
        var item = selections[i];
        if (item.state !== "1") {
            toastr.warning("流程实例" + item.instName + "未处于挂起状态！");
            return;
        }
        ids += item.id + ",";
    }
    layer.confirm("确认要恢复所有选定的流程吗？", {
        icon: 3,
        title: "恢复提醒"
    }, function (index) {
        ids = ids.substr(0, ids.length - 1);
        $.ajax(requestUrlPrefix + "/activiti/procInst/recoveryProc?ids=" + ids, {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success("恢复流程实例成功！");
                    refreshTable();
                } else {
                    toastr.error("恢复流程实例失败！" + (result.message || "请联系管理员。"));
                }
            }
        });
        layer.close(index);
    });
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

// 主表按钮点击前置回调开始
// 新增前触发
function addingProcInst(args) {
    return args;
}

// 删除前触发
function deletingProcInst(args) {
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
function viewingProcInst(args) {
    if (!!args.selections && args.selections.length == 1) {
        args.params = "id=" + args.selections[0].id;
    }
    return args;
}

// 操作列定义
function operateFormatter(value, row, index) {
    var destroyTable = "<button title='废止' style='margin:1px' class='destroy btn btn-danger btn-xs'>"
        + "<i class='fa fa-power-off fa-fw'></i></button>";
    var recoveryTable = "<button title='恢复' style='margin:1px' class='recovery btn btn-danger btn-xs'>"
        + "<i class='fa fa-registered fa-fw'></i></button>";
    return destroyTable + recoveryTable;

}

window.operateEvents = {
    'click .destroy': function (e, value, row, index) {
        var formUrl = requestUrlPrefix + "/activiti/procDef/destroy?procDefId=" + row.id;
        $.ajax(formUrl, {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success(result.message);
                    $('#procDefTable').bootstrapTable('refresh');
                } else {
                    toastr.error(result.message);
                }
            }
        });
    },
    'click .recovery': function (e, value, row, index) {
        var formUrl = requestUrlPrefix + "/activiti/procDef/recovery?procDefId=" + row.id;
        $.ajax(formUrl, {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success(result.message);
                    $('#procDefTable').bootstrapTable('refresh');
                } else {
                    toastr.error(result.message);
                }
            }
        });
    }
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


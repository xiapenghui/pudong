/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var pageDictMap = {};
var fieldDictTypeMap = {
    'state': 'flow_inst_status',
    'enTimeLimit': 'y_n',
};
var userTaskInstListContent = new Vue({
    el: '#userTaskInstListContent',
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
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,flow_inst_status';
        var info = '获取字典信息';
        axios.get(dictUrl).then(function (response) {
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
        var treeUrl = requestUrlPrefix + "/activiti/flowType/getProcTypeTree?pId=0";
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
        $('#userTaskInstTable').on('post-body.bs.table', function () {
            $(this).find(".dropdown-toggle").off('click').dropdown();
        });

        // 设置查询项的默认值，在初始化及点击重置按钮时调用
        function setDefaultValue() {
            $("#userTaskInstSearchForm #procInstName").val("");
            $("#userTaskInstSearchForm #actiName").val("");
            $("#userTaskInstSearchForm #fromTaskUserName").val("");
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

        $("#viewTaskBtn").click(viewProcessDetail);
        $("#lockUnlockTaskBtn").click(toggleLockStatus);
        $("#handleTaskBtn").click(handleTask);
        $("#handOverTaskBtn").click(handOverTask);
        $("#coOrganizeTaskBtn").click(coOrganizeTask);
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
 * 查看流程详情
 *
 * @returns
 */
function viewProcessDetail() {
    var selections = $("#userTaskInstTable").bootstrapTable("getSelections");
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
    var formUrl = getRelativePath() + "userTaskInstForm.html?editType=view&id="
        + selections[0].id + "&procInstId=" + selections[0].procInstId;
    openDialogView("查看用户任务实例", formUrl, config);
}

/**
 * 切换锁定状态
 *
 * @returns
 */
function toggleLockStatus() {
    var selections = $("#userTaskInstTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    if (selections.length > 1) {
        toastr.warning("请至多选择一条数据");
        return;
    }
    var item = selections[0];
    if (item.procInstState == "1") {
        toastr.warning("流程实例已被挂起，请联系管理员恢复！");
        return;
    }
    // 未锁定则进行锁定
    if (!item.lockerId) {
        $.ajax(requestUrlPrefix + "/activiti/userTaskInst/lockTaskInst?id=" + item.id, {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success("锁定数据成功！");
                    refreshTable();
                } else {
                    toastr.error("锁定数据失败！" + (result.message || "请联系管理员。"));
                }
            }
        });
        return;
    }
    // 已锁定则判断是否为自己锁定的
    if (item.lockerId !== LOGIN_ID) {
        toastr.warning("仅能解锁自己锁定的数据！");
        return;
    }
    $.ajax(requestUrlPrefix + "/activiti/userTaskInst/unlockTaskInst?id=" + item.id, {
        success: function (result) {
            if (result.type == "success") {
                toastr.success("解锁数据成功！");
                refreshTable();
            } else {
                toastr.error("解锁数据失败！" + (result.message || "请联系管理员。"));
            }
        }
    });
}

/**
 * 处理任务
 *
 * @returns
 */
function handleTask() {
    var selections = $("#userTaskInstTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    if (selections.length > 1) {
        toastr.warning("请至多选择一条数据");
        return;
    }
    var item = selections[0];
    if (item.procInstState == "1") {
        toastr.warning("流程实例已被挂起，请联系管理员恢复！");
        return;
    }
    if (!item.lockerId) {
        toastr.warning("请先锁定数据再进行处理！");
        return;
    }
    if (item.state != "4" && item.lockerId !== LOGIN_ID) {
        toastr.warning("数据已被其他用户锁定，请解锁后再进行处理！");
        return;
    }
    window.location.replace(getRelativePath() + "taskInstHandlePage.html?id="
        + item.id);
}

/**
 * 转办任务
 *
 * @returns
 */
function handOverTask() {
    var selections = $("#userTaskInstTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    if (selections.length > 1) {
        toastr.warning("请至多选择一条数据");
        return;
    }
    var item = selections[0];
    if (item.procInstState == "1") {
        toastr.warning("流程实例已被挂起，请联系管理员恢复！");
        return;
    }
    if (!item.lockerId) {
        toastr.warning("请先锁定数据再进行转办！");
        return;
    }
    if (item.lockerId !== LOGIN_ID) {
        toastr.warning("数据已被其他用户锁定，请解锁后再进行转办！");
        return;
    }
    popupCurTaskCandidate(item.id, "请选择转办对象", true, function (userIdArr) {
        $.ajax(requestUrlPrefix + "/activiti/userTaskInst/handOverTask?id=" + item.id
            + "&userId=" + userIdArr[0], {
            success: function (result) {
                if (result.type == "success") {
                    toastr.success("转办数据成功！");
                    refreshTable();
                } else {
                    toastr.error("转办数据失败！" + (result.message || "请联系管理员。"));
                }
            }
        });
    });
}

/**
 * 弹出当前环节的候选人树，供用户转办
 *
 * @param p_userTaskInstId
 * @param p_title
 * @param banMultiple
 *          是否禁止多选
 * @param p_callback
 * @returns
 */
function popupCurTaskCandidate(p_userTaskInstId, p_title, banMultiple,
                               p_callback) {
    var config = {
        height: "500px",
        width: "850px"
    };
    var paramUrl = requestUrlPrefix
        + "/activiti/userTaskDef/getCurTaskCandidate?userTaskInstId="
        + p_userTaskInstId;
    var url = getRelativePath() + "candidateSelection.html?url="
        + paramUrl;

    top.layer
        .open({
            type: 2,
            area: [config.width, config.height],
            title: p_title || "选择人员",
            maxmin: true, // 开启最大化最小化按钮
            content: url,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                var win = layero.find("iframe")[0].contentWindow;
                var selections = win.getSelectedCandidate();
                if (!selections || selections.length == 0) {
                    direwolfCommonTips('warning', "请选择至少一个任务下的候选对象。");
                    return false;
                }
                if (banMultiple
                    && (selections.length !== 1 || selections[0].candidateType != "0")) {
                    direwolfCommonTips('warning', "请选择且只能选择一个候选人员。");
                    return false;
                }
                var checkedIds = [];
                for (var i = 0; i < selections.length; i++) {
                    var item = selections[i];
                    if (item.candidateType == "0" && item.candidateId == LOGIN_ID) {
                        direwolfCommonTips('warning', "不允许选择自己。");
                        return false;
                    }
                    checkedIds.push(item.candidateId);
                }
                // 将所选候选人返回
                p_callback(checkedIds);
                top.layer.close(index);
            },
            cancel: function (index) {
                setTimeout(function () {
                    top.layer.close(index);
                }, 100);
            }
        });
}

/**
 * 协办任务
 *
 * @returns
 */
function coOrganizeTask() {
    var selections = $("#userTaskInstTable").bootstrapTable("getSelections");
    if (selections.length == 0) {
        toastr.warning("请至少选择一条数据");
        return;
    }
    if (selections.length > 1) {
        toastr.warning("请至多选择一条数据");
        return;
    }
    var item = selections[0];
    if (item.procInstState == "1") {
        toastr.warning("流程实例已被挂起，请联系管理员恢复！");
        return;
    }
    if (!item.lockerId) {
        toastr.warning("请先锁定数据再进行协办！");
        return;
    }
    if (item.lockerId !== LOGIN_ID) {
        toastr.warning("数据已被其他用户锁定，请解锁后再进行协办！");
        return;
    }
    popupCurTaskCandidate(item.id, "请选择协办对象", false, function (userIdArr) {
        $.ajax(requestUrlPrefix + "/activiti/userTaskInst/coOrganizeTask", {
            data: {
                id: item.id,
                userIds: userIdArr.join(",")
            },
            type: "POST",
            traditional: true, // 关键
            success: function (result) {
                if (result.type == "success") {
                    toastr.success("数据转协办成功！");
                    refreshTable();
                } else {
                    toastr.error("数据转协办失败！" + (result.message || "请联系管理员。"));
                }
            }
        });
    });
}

// 删除前触发
function deletingUserTaskInst(args) {
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
        var formUrl = getRelativePath() + "userTaskInstFrom.html?editType=edit&id=" + row.id;
        openDialog("修改用户任务实例", formUrl, {
            callback: function () {
                $('#userTaskInstTable').bootstrapTable('refresh');
            }
        });
    },
    'click .remove': function (e, value, row, index) {
        layer.confirm("删除数据不可恢复,确定要继续吗?", {
            icon: 3,
            title: "删除提醒"
        }, function (index) {
            var formUrl = requestUrlPrefix + "/activiti/userTaskInst/delete?id=" + row.id;
            $.ajax(formUrl, {
                success: function (result) {
                    if (result.type == "success") {
                        toastr.success(result.message || '删除记录成功!');
                        $('#userTaskInstTable').bootstrapTable('refresh');
                    } else {
                        toastr.error(result.message || '删除记录失败!');
                    }
                }
            });
            layer.close(index);
        });
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
            if (selNodes[0].parentIds == "") {
                data_url += "procDefId=" + selNodes[0].id + "&"
            } else if (selNodes[0].parentIds == "-1") {
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


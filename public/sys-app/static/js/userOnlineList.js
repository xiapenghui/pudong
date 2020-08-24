var pageDictMap = {}
var fieldDictTypeMap = {
    //'roleCode': 'role_code',
};


window.ajaxOptions = {
    beforeSend: function (xhr) {
        xhr.setRequestHeader('from', 'direwolf')
    }
};


/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/auth';


var userOnlineListContent = new Vue({
    el: '#userOnlineListContent',
    data: function () {
        return {
            /**
             * 页面加载状态
             */
            pageLoading: true,
            /**
             * 页面查看类型
             */
            editType: GetQueryString('editType'),
            /**
             * 页面字典列表
             */
            pageDictMap: {},
            backendContext: commonConfig.sysBackendContext,
        }
    },
    computed: {
        /**
         * 角色
         */
        roleCodeDict: function () {
            //return this.pageDictMap['role_code']
        },
    },
    methods: {},
    created: function () {
        // 请求所有字典，全部请求返回后再继续加载页面
        var vm = this
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=role_code'
        var info = '获取字典信息'
        axios.get(dictUrl).then(function (response) {
            pageDictMap = getDataFromAxiosResponse(response, info).data
            vm.pageDictMap = pageDictMap;
            vm.pageLoading = false;
            refreshTable();
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        })
    },
    mounted: function () {
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
        // $.get(WEB_ROOT + "/sys/org/getOrgTree?pId="
        //     + (LOGIN_USER == admin ? '0' : corpId), function (result) {
        //     $.fn.zTree.init($("#orgTree"), settings, result);
        //     var treeObj = $.fn.zTree.getZTreeObj("orgTree");
        //     // 获取根节点并且选中触发点击事件
        //     var nodes = treeObj.getNodes();
        //     if (nodes.length > 0) {
        //         treeObj.selectNode(nodes[0]);
        //         treeObj.setting.callback.onClick(null, treeObj.setting.treeId, nodes[0]);// 调用事件
        //     } else {
        //         toastr.error('树加载失败或数据不存在', "树加载提醒");
        //     }
        // });

        // 设置查询项的默认值，在初始化及点击重置按钮时调用
        function setDefaultValue() {
            $("#userSearchForm #userAccount").val("");
            $("#userSearchForm #userName").val("");
            $("#userSearchForm #orgId").val("");
            $("#userSearchForm #empNo").val("");
        }

        // 刷新表格公共方法
        setDefaultValue();
        refreshTable();

        // 设置查询重置按钮点击方法
        var $searchBtn = $('#userSearchBtn');
        var $resetBtn = $('#userResetBtn');
        var $viewInfoBtn = $('#viewOnlineInfoBtn');
        var $kickOutBtn = $('#kickOutBtn');
        $searchBtn.click(refreshTable);
        $resetBtn.click(function () {
            setDefaultValue();
            refreshTable();
        });
        $viewInfoBtn.click(viewOnlineInfo);
        $kickOutBtn.click(kickOut);

        $("#orgSearchBtn").click(function () {
            var tree = $.fn.zTree.getZTreeObj("orgTree");
            var value = $("#orgSearchName").val();
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
        $(window).bind("load resize scroll", function () {
            //fix_height();
        });
        $('#userTable').on('post-body.bs.table', function () {
            $(this).find(".dropdown-toggle").off('click').dropdown();
        });
    }
})

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

function refreshTable() {
    var data_url = requestUrlPrefix + "/oauth/listToken?";
    var tree = $.fn.zTree.getZTreeObj("orgTree");
    if (tree != null) {
        var selNodes = tree.getSelectedNodes();
        if (selNodes.length > 0) {
            // $("#userSearchForm #orgId
            // option:checked").attr("value",tree.getSelectedNodes()[0].id);
            $("#userSearchForm #orgId option:checked").prop("text",
                tree.getSelectedNodes()[0].name);
            data_url += "user.orgId=" + tree.getSelectedNodes()[0].id + "&";
        }
    }

    $('#userTable').bootstrapTable('refresh', {
        url: data_url + $("#userSearchForm").serialize(),
    });
}

// 主表按钮点击前置回调开始
// 新增前触发
function addingUser(args) {
    var treeObj = $.fn.zTree.getZTreeObj("orgTree");
    if (!$.isEmptyObject(treeObj.getSelectedNodes())
        && treeObj.getSelectedNodes().length == 1) {
        args.params = "user.orgId=" + treeObj.getSelectedNodes()[0].id;
    }
    return args;
}

// 删除前触发
function deletingUser(args) {
    if (!$.isEmptyObject(args.selections)) {
        var ids = "";
        for (var i = 0; i < args.selections.length; i++) {
            if (!$.isEmptyObject(args.selections[i].id)) {
                ids += args.selections[i].id + ",";
            }
        }
        ids = ids.substr(0, ids.length - 1);
        if (!$.isEmptyObject(ids)) {
            args.params = "ids=" + ids;
        }
    }
    return args;
}

// 修改前触发
function editingUser(args) {
    if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
        args.params = "id=" + args.selections[0].id;
    }
    return args;
}

// 查看前触发
function viewingUser(args) {
    if (!$.isEmptyObject(args.selections) && args.selections.length == 1) {
        args.params = "id=" + args.selections[0].id;
    }
    return args;
}

// 导出前触发
function exportingUser(args) {
    var $th = $('#userTable thead').children().children();
    var headers = [];
    $.each($th, function (i, item) {
        // 获取所有列信息
        if (!$(item).hasClass("bs-checkbox")) {
            headers.push({
                field: $(item).data("field"),// 列名称
                text: item.innerText, // 列注释
                colSpan: item.colSpan, // 列宽度
                rowSpan: item.rowSpan, // 列高度
                dictData: $(item).data("dictData")
                // 列码表
            })
        }
    });
    args.params = {
        queryParams: $("#userSearchForm").serialize(),
        headers: headers
    };
    return args;
}

/*
 * function viewFormatter(value, row, index) { return "<a href=\#\"
 * onclick=\"viewDetail('" + row.id + "')\">" + value + "</a>"; }
 */
function viewFormatter(value, row, index) {
    return "<a href='#' class='view'>" + row.userName + "</a>";
}

window.viewEvents = {
    'click .view': function (e, value, row, index) {
        var formUrl = getRelativePath() + "userForm.html?editType=view&id=" + row.userId;
        openDialogView("查看账户", formUrl, {
            width: "800px",
            height: "500px"
        });
    }
}

function viewOnlineInfo() {
    var selectId = $('#userTable').bootstrapTable('getSelections');
    if (selectId.length == 0) {
        toastr.error("请至少选择一行数据");
        return;
    }
    if (selectId.length > 1) {
        toastr.error("请至多选择一行数据");
        return;
    }
    var formUrl = window.location.pathname + "/form?id=" + selectId[0].id;
    openDialog("在线信息", formUrl, {
        width: "800px",
        height: "520px",
        callback: function () {

        }
    });
}

function kickOut() {
    var selections = $('#userTable').bootstrapTable('getSelections');
    if (selections.length == 0 || selections.length > 1) {
        toastr.error("请选择一行数据！");
        return;
    }

    layer.confirm("选中的用户将被强制退出，确定要继续吗？", {
        icon: 3,
        title: "强制退出提醒"
    }, function (index) {
        var ids = "";
        $.each(selections, function (i, item) {
            ids += item.accessToken + ",";
        });
        if (ids.endsWith(",")) {
            ids = ids.substr(0, ids.length - 1);
        }
        var formUrl = requestUrlPrefix + "/oauth/delToken/" + ids;
        $.ajax(formUrl, {
            headers: {"from": "dorewolf"},
            success: function (result) {
                if (result.code === 0) {
                    toastr.success('强制退出成功!');
                    $('#userTable').bootstrapTable('refresh');
                } else {
                    toastr.error(result.message || '强制退出失败！');
                }
            }
        });
        layer.close(index);
    });
}

// 子系统添加管理员确认自定义js
function doSubmit(callback) {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    var appId = theRequest.appId;

    var selections = $('#userTable').bootstrapTable("getSelections");// 子页面
    var params;
    if (selections.length == 0) {
        toastr.warning('请选择用户进行添加!');
    } else {
        if (!$.isEmptyObject(selections)) {
            var ids = "";
            for (var i = 0; i < selections.length; i++) {
                if (!$.isEmptyObject(selections[i].id)) {
                    ids += selections[i].id + ",";
                }
            }
            ids = ids.substr(0, ids.length - 1);
            if (!$.isEmptyObject(ids)) {
                params = ids;
            }

            var idx = layer.load(1, {
                shade: [0.4, '#FFF']
            });

            $.ajax({
                data: {
                    "appId": appId,
                    "params": params
                },
                type: 'post',
                dataType: 'json',
                url: WEB_ROOT + '/sys/userApp/save',
                success: function (data) {
                    layer.close(idx);
                    if (data.type == 'success') {
                        callback(data);
                    } else {
                        toastr.error(data.message);
                    }
                },
                error: function () {
                    layer.close(idx);
                    toastr.error("服务器内部错误,请稍后重试!");
                }
            })

        }
    }
}



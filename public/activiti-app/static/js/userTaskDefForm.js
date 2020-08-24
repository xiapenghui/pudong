var validateForm;
var selectedUsers = [];
var selectedRoles = [];
var selectedOrgs = [];
var strUserCheckIds;
var strRoleCheckIds;
var strOrgCheckIds;


/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var validateForm;
var pageDictMap = {};
var fieldDictTypeMap = {
    'enableType': 'enable_type',
    'enTimeLimit': 'y_n',
};

var userTaskDefForm = new Vue({
    el: '#userTaskDefForm',
    data: function () {
        return {
            entity: {
                procDefId: getQueryString("procDefId"),
                modelNodeId: getQueryString("modelNodeId"),
            },
            /**
             * 页面加载状态
             */
            pageLoading: true,
            requestUrlPrefix: requestUrlPrefix,
            editType: getQueryString("editType"),
            type: 1,
            pageDictMap: {}
        }
    },
    computed: {
        /**
         * 单位状态字典
         */
        timeUnitsDict: function () {
            return this.pageDictMap['time_units'];
        },
        /**
         * 单位状态字典
         */
        activitiMultiConditionTypeDict: function () {
            return this.pageDictMap['activiti_multi_condition_type'];
        },
        /**
         * 单位状态字典
         */
        activitiMultiDecisionTypeDict: function () {
            return this.pageDictMap['activiti_multi_decision_type'];
        }
    },
    created: function () {
        //请求所有字典，全部请求返回后再继续加载页面
        var vm = this;
        var info = '获取字典信息';
        axios.get(dictUrl + 'y_n,time_units,activiti_multi_decision_type,activiti_multi_condition_type').then(function (response) {
            pageDictMap = getDataFromAxiosResponse(response, info).data;
            vm.pageDictMap = pageDictMap;
            vm.pageLoading = false;
            vm.initFormData();
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        });
    },
    methods: {
        /**
         * 初始化表单数据
         */
        initFormData: function () {
            var vm = this;
            var pkValue = this.entity.procDefId;
            if (pkValue) {
                var url = '/activiti/a/activiti/userTaskDef/getUserTaskDefList?procDefId=' + pkValue + '&modelNodeId=' + vm.entity.modelNodeId;
                var info = '获取单条流程分类管理信息';
                axios.get(url).then(function (response) {
                    var page = getDataFromAxiosResponse(response, info)
                    if (page.list && page.list[0]) {
                        vm.entity = page.list[0];
                        vm.entity.decisionType == null ? vm.entity.decisionType = "" : "";
                        vm.entity.completeConditionType == null ? vm.entity.completeConditionType = "" : "";
                        vm.entity.warningDaysType == null ? vm.entity.warningDaysType = "1" : "";
                        vm.entity.limitDaysType == null ? vm.entity.limitDaysType = "1" : "";
                    }
                    if (vm.entity.id != "") {
                        var selectedListenerNames = getSelectedListenerNames(vm.entity.id);
                        //勾选原来的listener
                        $("#listenerTable").bootstrapTable("checkBy", {field: "name", values: selectedListenerNames});
                    }
                    setTimeout(() => {
                        //候选人
                        initOldCandidates();
                        //初始化checkbox
                        if ($("#needSelectUser").val() == "1") {
                            $("#checkbox_needSelectUser").attr("checked", 'checked');
                        }
                        if ($("#allowAllUser").val() == "1") {
                            $("#checkbox_allowAllUser").attr("checked", 'checked');
                        }
                        if ($("#allowJoin").val() == "1") {
                            $("#checkbox_allowJoin").prop("checked", true);
                        }
                        if ($("#allowTurn").val() == "1") {
                            $("#checkbox_allowTurn").prop("checked", true);
                        }
                        if ($("#isMultiNode").val() == "1") {
                            $("#checkbox_isMultiNode").prop("checked", true);
                            $("#div_condition").show();
                        } else {
                            $("#div_condition").hide();
                        }
                    });


                }).catch(function (error) {
                    axiosErrorTips(error, info + '异常')
                })
            }
        }
    },
    mounted: function () {
        var vm = this;
        validateForm = $("#userTaskDefForm").validate({
            submitHandler: function (form) {
                loading('正在提交，请稍等...');
                form.submit();
            },
            errorContainer: "#messageBox",
            errorPlacement: function (error, element) {
                $("#messageBox").text("输入有误，请先更正。");
                if (element.is(":checkbox") || element.is(":radio") || element.parent().is(".input-append")) {
                    error.appendTo(element.parent().parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });
        // 消除不满窗时的滚动条
        if ($("#userTaskDefForm").height() < $("#userTaskDefForm").context.defaultView.innerHeight) {
            $($("#userTaskDefForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }


        //listener
        var dataList = getAllListener(this.type);
        initial(dataList, "listenerTable");
        /* if (this.entity.id != "") {
             var selectedListenerNames = getSelectedListenerNames(this.entity.id);
             //勾选原来的listener
             $("#listenerTable").bootstrapTable("checkBy", {field: "name", values: selectedListenerNames});
         }*/


        //表单选择按钮
        $("#formResSelectBtn").click(function () {
            addResform();
        });
        $("#userIdsSelectBtn").click(function () {
            selectUsers();
        });
        $("#roleIdsSelectBtn").click(function () {
            selectRoles();
        });
        $("#orgIdsSelectBtn").click(function () {
            selectOrgs();
        });
        /* if (needSelectUser == "1") {
             $("#checkbox_needSelectUser").attr("checked", 'checked');
         }*/
        $("#checkbox_needSelectUser").change(function () {
            var checked = $(this).is(':checked');
            if (checked) {
                // $("#needSelectUser").val("1");
                vm.entity.needSelectUser = "1";
            } else {
                // $("#needSelectUser").val("0");
                vm.entity.needSelectUser = "0";
            }
        });
        /* if (allowAllUser == "1") {
             $("#checkbox_allowAllUser").attr("checked", 'checked');
         }*/
        $("#checkbox_allowAllUser").change(function () {
            var checked = $(this).is(':checked');
            if (checked) {
                // $("#allowAllUser").val("1");
                vm.entity.allowAllUser = "1";
            } else {
                // $("#allowAllUser").val("0");
                vm.entity.allowAllUser = "0";
            }
        });


        //其他配置
        $("#checkbox_allowJoin").change(function () {
            var checked = $(this).is(':checked');
            if (checked) {
                // $("#allowJoin").val("1");
                vm.entity.allowJoin = "1";
            } else {
                // $("#allowJoin").val("0");
                vm.entity.allowJoin = "0";
            }
        });
        $("#checkbox_allowTurn").change(function () {
            var checked = $(this).is(':checked');
            if (checked) {
                // $("#allowTurn").val("1");
                vm.entity.allowTurn = "1";
            } else {
                // $("#allowTurn").val("0");
                vm.entity.allowTurn = "0";
            }
        });
        $("#checkbox_isMultiNode").change(function () {
            var checked = $(this).is(':checked');
            if (checked) {
                // $("#isMultiNode").val("1");
                vm.entity.isMultiNode = "1"
                $("#div_condition").show();
            } else {
                // $("#isMultiNode").val("0");
                vm.entity.isMultiNode = "0"
                $("#div_condition").hide();
            }
        });
        /*//初始化checkbox
        if ($("#allowJoin").val() == "1") {
            $("#checkbox_allowJoin").prop("checked", true);
        }
        if ($("#allowTurn").val() == "1") {
            $("#checkbox_allowTurn").prop("checked", true);
        }
        if ($("#isMultiNode").val() == "1") {
            $("#checkbox_isMultiNode").prop("checked", true);
        } else {
            $("#div_condition").hide();
        }*/
    }
});

function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if ($("#allowAllUser").val() == "1" &&
        ($("#strUserIds").val() != "" || $("#strRoleIds").val() != "" || $("#strOrgIds").val() != "")) {
        toastr.error('选了允许所有人执行就不需要选择候选人');
        return false;
    }
    if ($("#allowAllUser").val() == "0" &&
        ($("#strUserIds").val() == "" && $("#strRoleIds").val() == "" && $("#strOrgIds").val() == "")) {
        toastr.error('请选择候选人或允许所有人执行');
        return false;
    }
    if (validateForm.form()) {
        var selections = $("#listenerTable").bootstrapTable('getSelections');
        $("#strListenerNames").val(selections.map(function (item) {
            return item.name;
        }));
        formAjaxSubmit($("#userTaskDefForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}


function initOldCandidates() {
    $.ajax({
        type: "get",
        async: false,
        url: requestUrlPrefix + "/activiti/userTaskDef/getSelectedCandidates?userTaskDefId=" + $("#id").val() + "&timestamp=" + new Date().getTime(),
        success: function (data) {
            var selectedCandidates = data.data; //结果中包含用户、角色、单位，以map形式展现
            if (selectedCandidates.user != undefined && selectedCandidates.user != null) {
                strUserCheckIds = selectedCandidates.user.toString();
                // $("#strUserIds").val(strUserCheckIds);
                userTaskDefForm.entity.strUserIds = strUserCheckIds;
            }
            if (selectedCandidates.role != undefined && selectedCandidates.role != null) {
                strRoleCheckIds = selectedCandidates.role.toString();
                // $("#strRoleIds").val(strRoleCheckIds);
                userTaskDefForm.entity.strRoleIds = strRoleCheckIds;
            }
            if (selectedCandidates.org != undefined && selectedCandidates.org != null) {
                strOrgCheckIds = selectedCandidates.org.toString();
                // $("#strOrgIds").val(strOrgCheckIds);
                userTaskDefForm.entity.strOrgIds = strOrgCheckIds;
            }
        }
    });

    $.ajax(requestUrlPrefix + "/activiti/userTaskDef/getUserNamesByUserIds", {
        type: "Post",
        data: {userIds: strUserCheckIds || ""},
        async: false,
        traditional: true, //关键
        success: function (result) {
            selectedUsers = result.data;
        }
    });

    $.ajax(requestUrlPrefix + "/activiti/userTaskDef/getRoleNamesByRoleIds", {
        type: "Post",
        data: {roleIds: strRoleCheckIds || ""},
        async: false,
        traditional: true, //关键
        success: function (result) {
            selectedRoles = result.data;
        }
    });

    $.ajax(requestUrlPrefix + "/activiti/userTaskDef/getOrgNamesByOrgIds", {
        type: "Post",
        data: {orgIds: strOrgCheckIds || ""},
        async: false,
        traditional: true, //关键
        success: function (result) {
            selectedOrgs = result.data;
        }
    });

    initViewDeleteSpan($("#result_users"), selectedUsers, "name", function (item) {
        strUserCheckIds = removeItemFromArrayString(strUserCheckIds, item.id);
        // $("#strUserIds").val(strUserCheckIds);
        userTaskDefForm.entity.strUserIds = strUserCheckIds;
    });
    initViewDeleteSpan($("#result_roles"), selectedRoles, "name", function (item) {
        strRoleCheckIds = removeItemFromArrayString(strRoleCheckIds, item.id);
        // $("#strRoleIds").val(strRoleCheckIds);
        userTaskDefForm.entity.strRoleIds = strRoleCheckIds;
    });
    initViewDeleteSpan($("#result_orgs"), selectedOrgs, "name", function (item) {
        strOrgCheckIds = removeItemFromArrayString(strOrgCheckIds, item.id);
        // $("#strOrgIds").val(strOrgCheckIds);
        userTaskDefForm.entity.strOrgIds = strOrgCheckIds;
    });
}


/**
 * 这里使用全加载树，看需求是否需要改成懒加载树
 * @returns
 */
function selectUsers() {
    var config = {height: "500px", width: "250px"};
    var paramUrl = requestUrlPrefix + "/activiti/userTaskDef/getAllBusinessUserTreeData";
    var url = getRelativePath() + "multiTreeSelect.html?url=" + paramUrl + "&checkedIds=" + strUserCheckIds;

    top.layer.open({
        type: 2,
        area: [config.width, config.height],
        title: "选择人员",
        maxmin: true, // 开启最大化最小化按钮
        content: url,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var tree = layero.find("iframe")[0].contentWindow.tree;
            var checkedNodes = tree.getCheckedNodes();
            //获取所有页节点
            var checkedIdsOfLeaf = [];
            selectedUsers = [];
            for (var i = 0; i < checkedNodes.length; i++) {
                if (!checkedNodes[i].isParent) {
                    checkedIdsOfLeaf.push(checkedNodes[i].id);
                    selectedUsers.push({id: checkedNodes[i].id, name: checkedNodes[i].name});
                }
            }
            var str_checkedIdsOfLeaf = "";
            for (var i = 0; i < checkedIdsOfLeaf.length; i++) {
                str_checkedIdsOfLeaf += checkedIdsOfLeaf[i] + ",";
            }
            str_checkedIdsOfLeaf = str_checkedIdsOfLeaf.substring(0, str_checkedIdsOfLeaf.length - 1);
            // $("#strUserIds").val(str_checkedIdsOfLeaf);
            userTaskDefForm.entity.strUserIds = str_checkedIdsOfLeaf;
            strUserCheckIds = str_checkedIdsOfLeaf;
            initViewDeleteSpan($("#result_users"), selectedUsers, "name", function (item) {
                strUserCheckIds = removeItemFromArrayString(strUserCheckIds, item.id);
                // $("#strUserIds").val(strUserCheckIds);
                userTaskDefForm.entity.strUserIds = strUserCheckIds;
            });
            setTimeout(function () {
                top.layer.close(index);
            }, 100);
        },
        cancel: function (index) {
            setTimeout(function () {
                top.layer.close(index);
            }, 100);
        }
    });
}

function selectRoles() {
    var config = {height: "500px", width: "250px"};
    var paramUrl = requestUrlPrefix + "/activiti/userTaskDef/getAllRoleTreeData";
    var url = getRelativePath() + "multiTreeSelect.html?url=" + paramUrl + "&checkedIds=" + strRoleCheckIds;

    top.layer.open({
        type: 2,
        area: [config.width, config.height],
        title: "选择角色",
        maxmin: true, // 开启最大化最小化按钮
        content: url,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var tree = layero.find("iframe")[0].contentWindow.tree;
            var checkedNodes = tree.getCheckedNodes();
            //获取所有页节点
            var checkedIdsOfLeaf = [];
            selectedRoles = [];
            for (var i = 0; i < checkedNodes.length; i++) {
                if (!checkedNodes[i].isParent) {
                    checkedIdsOfLeaf.push(checkedNodes[i].id);
                    selectedRoles.push({id: checkedNodes[i].id, name: checkedNodes[i].name});
                }
            }
            var str_checkedIdsOfLeaf = "";
            for (var i = 0; i < checkedIdsOfLeaf.length; i++) {
                str_checkedIdsOfLeaf += checkedIdsOfLeaf[i] + ",";
            }
            str_checkedIdsOfLeaf = str_checkedIdsOfLeaf.substring(0, str_checkedIdsOfLeaf.length - 1);
            // $("#strRoleIds").val(str_checkedIdsOfLeaf);
            userTaskDefForm.entity.strRoleIds = str_checkedIdsOfLeaf;
            strRoleCheckIds = str_checkedIdsOfLeaf;
            initViewDeleteSpan($("#result_roles"), selectedRoles, "name", function (item) {
                strRoleCheckIds = removeItemFromArrayString(strRoleCheckIds, item.id);
                // $("#strRoleIds").val(strRoleCheckIds);
                userTaskDefForm.entity.strRoleIds = strRoleCheckIds;
            });
            setTimeout(function () {
                top.layer.close(index);
            }, 100);
        },
        cancel: function (index) {
            setTimeout(function () {
                top.layer.close(index);
            }, 100);
        }
    });
}

function selectOrgs() {
    var str_selected = ""
    var config = {height: "500px", width: "250px"};
    var paramUrl = requestUrlPrefix + "/activiti/userTaskDef/getAllOrgTreeData";
    var url = getRelativePath() + "multiTreeSelect.html?url=" + paramUrl + "&checkedIds=" + strOrgCheckIds + "&chkboxType=" + escape("{'Y':'s','N':'p'}");

    top.layer.open({
        type: 2,
        area: [config.width, config.height],
        title: "选择单位",
        maxmin: true, // 开启最大化最小化按钮
        content: url,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var tree = layero.find("iframe")[0].contentWindow.tree;
            var checkedNodes = tree.getCheckedNodes();
            //获取所有全选的节点
            var selectedNodes = {};
            selectedOrgs = [];
            for (var i = 0; i < checkedNodes.length; i++) {
                var halfChecked = checkedNodes[i].getCheckStatus().half; //该节点是否是半选状态
                if (!halfChecked) {
                    selectedNodes[checkedNodes[i].id] = checkedNodes[i];
                }
            }
            //如果父节点为全选状态，则去掉子节点
            var toDeleteNodeKeys = [];
            for (var key in selectedNodes) {
                var parentNode = selectedNodes[key].getParentNode();
                if (parentNode != null && selectedNodes[parentNode.id] != undefined) {
                    toDeleteNodeKeys.push(key);
                }
            }
            for (var i = 0; i < toDeleteNodeKeys.length; i++) {
                delete selectedNodes[toDeleteNodeKeys[i]];
            }
            var str_selectedNodes = "";
            for (var key in selectedNodes) {
                str_selectedNodes += selectedNodes[key].id + ",";
                selectedOrgs.push({id: selectedNodes[key].id, name: selectedNodes[key].name});
            }
            str_selectedNodes = str_selectedNodes.substring(0, str_selectedNodes.length - 1);
            // $("#strOrgIds").val(str_selectedNodes);
            userTaskDefForm.entity.strOrgIds = str_selectedNodes;
            strOrgCheckIds = str_selectedNodes;
            initViewDeleteSpan($("#result_orgs"), selectedOrgs, "name", function (item) {
                strOrgCheckIds = removeItemFromArrayString(strOrgCheckIds, item.id);
                // $("#strOrgIds").val(strOrgCheckIds);
                userTaskDefForm.entity.strOrgIds = strOrgCheckIds;
            });
            setTimeout(function () {
                top.layer.close(index);
            }, 100);
        },
        cancel: function (index) {
            setTimeout(function () {
                top.layer.close(index);
            }, 100);
        }
    });
}

//表单选择
function addResform() {
    // 设置主表带入子表的值

    var formUrl = getRelativePath() + "flowResList.html?appId=1&parentId=2";
    openDialog("工作流资源选择", formUrl, {
        width: "800px",
        height: "500px",
        callback: function (result) {
            return true;
        },
        yes: function (index, layero) {
            var iframeWin = layero.find('iframe')[0];
            var data = iframeWin.contentWindow.doSubmit(function (data) {
                setTimeout(function () {
                    if (!!config.callback)
                        config.callback();
                    top.layer.close(index);
                }, 100);
            });
            $("#formResPath").val(data.target);
            //toastr.success(data.message);
            top.layer.close(index);
            return true;
        }
    });
}

/**
 * 从一个字符串形式的数组中删除一个元素
 * @param arrayString
 * @param item
 * @returns
 */
function removeItemFromArrayString(arrayString, item) {
    if (array == "")
        return "";
    var array = arrayString.split(',');
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            array.splice(i--, 1);
            break;
        }
    }
    return array.toString();
}

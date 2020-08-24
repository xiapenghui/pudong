/**
 * @file 此文件集成了工作流前端的工作方法，包括设置公共按钮的显隐、添加自定义按钮、发送流程、驳回用户任务等
 * @author Sec
 * @author 丁航
 */
/**
 * 请求前缀
 */
var requestUrlPrefix = '/api/activiti/a';
var ProcessUtil = (function () {
    var _btnCfg = {
        saveBtn: {
            visible: true
        },
        sendBtn: {
            visible: true
        },
        rejectBtn: {
            visible: true
        }
    };

    /**
     * 获取当前按钮的配置
     */
    function _getBtnCfg() {
        return _btnCfg;
    }

    /**
     * 设置指定按钮的显隐
     *
     * @param btnId
     *          按钮ID，saveBtn/sendBtn/rejectBtn
     * @param visible
     *          是否可见
     */
    function _setBtnVisible(btnId, visible) {
        if (Object.keys(_btnCfg).includes(btnId)) {
            _btnCfg[btnId].visible = visible;
        }
    }

    /**
     * 添加自定义按钮，默认按顺序添加到公共按钮后
     *
     * @param btnObj
     *          按钮对象，结构{id: "btnID", icon: "btnIcon", text: "btnText", onClick:
     *          function(){}}
     */
    function _addBtn(btnObj) {
        if ($("#taskHandleToolbar").length === 0) {
            direwolfCommonTips('error', "添加按钮失败！未找到待办页面工具栏。");
            return;
        }
        $("#taskHandleToolbar").append(
            '<a id="' + btnObj.id + '" href="javascript:void(0)"'
            + 'class="btn btn-sm btn-default"'
            + ' onclick="return false;"><i' + ' class="fa fa-fw fa-'
            + btnObj.icon + '" style="float: initial;"></i>'
            + (btnObj.text || '未设置') + ' </a>');
        $("#" + btnObj.id).click(btnObj.onClick);
    }

    /**
     * 发送流程，使用锚点传递流程事件监听和参数
     *
     * @param p_userTaskInstId
     *          任务实例ID
     * @param p_$processAnchor
     *          业务页面传递的流程锚点对象
     * @param p_callback
     *          发送回调
     */
    function _sendProcessUsingAnchor(p_userTaskInstId, p_$processAnchor,
                                     p_callback) {
        // 是否继续发送标记
        var proceed = false;
        // 默认流程事件
        var processEvent = function () {
            return true;
        };
        // 默认流程数据
        var processData = {};
        // 从业务对象取用户定义内容
        if (p_$processAnchor.length > 0) {
            if (typeof p_$processAnchor[0].processEvent === "function") {
                processEvent = p_$processAnchor[0].processEvent;
            }
        }
        // 首先调用发送前判断，如果用户需要异步处理，可先返回false，再调用processEvent的回调函数
        proceed = processEvent(true, "beforeSend", function (p_result) {
            // 根据异步返回结果判断是否继续发送
            if (p_result && p_result.proceed) {
                // 重新获取业务设置的参数
                processData = p_$processAnchor[0].processData;
                _selectCandidate(p_userTaskInstId, processEvent, processData,
                    p_callback);
            }
        });
        // 取得发送前事件的设置参数
        if (p_$processAnchor.length > 0) {
            processData = p_$processAnchor[0].processData;
        }
        // 根据同步返回结果判断是否继续发送
        if (proceed) {
            _selectCandidate(p_userTaskInstId, processEvent, processData, p_callback);
        }
    }

    /**
     * 发送流程通用方法
     *
     * @param p_userTaskInstId
     *          任务实例ID
     * @param p_processEvent
     *          流程处理事件
     * @param p_processData
     *          流程参数
     * @param p_callback
     *          发送回调
     */
    function _sendProcess(p_userTaskInstId, p_processEvent, p_processData,
                          p_callback) {
        // 是否继续发送标记
        var proceed = false;
        // 首先调用发送前判断，如果用户需要异步处理，可先返回false，再调用processEvent的回调函数
        proceed = p_processEvent(true, "beforeSend", function (p_result) {
            // 根据异步返回结果判断是否继续发送
            if (p_result && p_result.proceed) {
                // 重新获取业务设置的参数
                processData = p_result.processData;
                _selectCandidate(p_userTaskInstId, p_processEvent, processData,
                    p_callback);
            }
        });
        // 根据同步返回结果判断是否继续发送
        if (proceed) {
            _selectCandidate(p_userTaskInstId, p_processEvent, p_processData,
                p_callback);
        }
    }

    /**
     * 判断下一环节是否需要弹出候选人选择窗口
     *
     * @param p_userTaskInstId
     *          任务实例ID
     * @param p_variables
     *          用户自定义流程参数
     */
    function _isNeedSelCandidate(p_userTaskInstId, p_variables) {
        var url = requestUrlPrefix + "/activiti/userTaskInst/isNeedSelectUser";
        var taskParam = {
            id: p_userTaskInstId,
            // 流程参数
            processVars: JSON.stringify(p_variables)
        };
        var result = $.ajax(url, {
            async: false,
            type: "POST",
            traditional: true, // 关键
            data: taskParam
        }).responseJSON;
        if (result && result.type === "success") {
            return result.data;
        }
        // 判断流程流程候选人和下一环节任务失败
        var errorMsg = "判断下一流程任务失败！";
        // direwolfCommonTips('error', errorMsg, !result ? errorMsg : (result.message || errorMsg));
        // throw new Error(errorMsg)
        direwolfCommonTips('error', !result ? errorMsg : (result.message || errorMsg));
        return true;
    }

    /**
     * 判断是否需要弹出候选人选择窗口
     *
     * @param p_userTaskInstId
     *          任务实例ID
     * @param p_event
     *          用户自定义流程事件
     * @param p_data
     *          用户自定义流程数据
     * @param p_callback
     *          发送回调
     */
    function _selectCandidate(p_userTaskInstId, p_event, p_data, p_callback) {
        var variables = p_data.variables;
        if (_isNeedSelCandidate(p_userTaskInstId, variables)) {
            _popupNextTasksTree(p_userTaskInstId, variables, function (
                p_selections, p_candidateInfoList) {
                // 将选择的节点发送给用户进行判断，做发送前的最后确认
                var proceed = p_event(true, "sendConfirmed", null, p_selections);
                if (proceed) {
                    _completeUserTask(p_userTaskInstId, p_candidateInfoList, p_data,
                        p_event, p_callback);
                }
            });
            return false;
        }
        // 不需要选择候选人，则直接完成任务
        return _completeUserTask(p_userTaskInstId, null, p_data, p_event,
            p_callback);
    }

    /**
     * 完成用户任务
     *
     * @param p_userTaskInstId
     *          用户实例ID
     * @param p_candidateInfoList
     *          目标任务及候选参与信息，结构[{userTaskKey: '', candidateUserIds: [],
     *          candidateOrgIds: [], candidateRoleIds: []}]
     * @param p_data
     *          用户定义任务参数
     * @param p_event
     *          用户定义任务监听
     * @param p_callback
     *          任务完成回调
     */
    function _completeUserTask(p_userTaskInstId, p_candidateInfoList, p_data,
                               p_event, p_callback) {
        var completeUrl = requestUrlPrefix + "/activiti/userTaskInst/completeTask";
        var sendResult = $.ajax(completeUrl, {
            data: {
                id: p_userTaskInstId,
                businessDataId: p_data.businessId,
                suggestion: p_data.suggestion,
                processVars: JSON.stringify(p_data.variables),
                candidateInfoList: JSON.stringify(p_candidateInfoList)
            },
            type: "POST",
            traditional: true, // 关键
            async: false
        });
        var isSuccessful = sendResult.responseJSON
            && sendResult.responseJSON.type === "success";
        // 失败提示，成功提示由上层方法统一处理
        if (!isSuccessful) {
            direwolfCommonTips('error', sendResult.responseJSON
                ? (sendResult.responseJSON.message || "发送流程失败！") : "发送流程失败！");
        }
        p_event(isSuccessful, "afterSend"); // 触发用户定义发送完成事件
        p_callback(isSuccessful); // 触发待办页面发送完成回调
        return isSuccessful;
    }

    /**
     * 弹出可选任务树，一级节点为任务，下挂单位及候选人树
     *
     * @param p_userTaskInstId
     *          任务实例ID
     * @param p_variables
     *          用户自定义流程参数
     * @param p_callback
     *          选择回调
     */
    function _popupNextTasksTree(p_userTaskInstId, p_variables, p_callback) {
        var config = {
            height: "500px",
            width: "850px"
        };
        // 由于需要通过multiTreeSelect方法的URL将取值地址传递到页面，因此所有的传值方式失效，只能加密转换成纯字符串再到后台解密使用
        var aes = new AesUtil();
        var varsString = aes.aesEncrypt(JSON.stringify({
            id: p_userTaskInstId,
            processVars: JSON.stringify(p_variables)
        }), "DIREWOLF_KEY____", "DIREWOLF_IV_____");
        var paramUrl = requestUrlPrefix
            + "/activiti/userTaskDef/getNextTasksTree?p_procData="
            + varsString.replace(/\+/g, "_");// 加号会被Spring当作URL中的空格替换符而反向解析为空格，因此先替换加密串中的加号再传输
        var url = getRelativePath() + "candidateSelection.html?url="
            + paramUrl;

        top.layer.open({
            type: 2,
            area: [config.width, config.height],
            title: "选择候选人员/单位/部门/角色",
            maxmin: true, // 开启最大化最小化按钮
            content: url,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                var win = layero.find("iframe")[0].contentWindow;
                var selections = win.getSelectedCandidate();
                if (!selections || selections.length == 0) {
                    direwolfCommonTips('warning', "请选择至少一个任务下的候选人。");
                    return false;
                }
                // 将所选环节返回
                p_callback(selections, win.getUserTaskCandidateInfo());
                top.layer.close(index);
            },
            cancel: function (index) {
                setTimeout(function () {
                    top.layer.close(index);
                }, 100);
            }
        });
    }

    // 任务驳回
    function _rejectProcessTaskUsingAnchor(userTaskInstId, processAnchor) {

        if (processAnchor.length > 0
            && typeof processAnchor[0].processEvent === "function") {
            processEvent = processAnchor[0].processEvent;
        }

        top.layer.open({
            type: 0,
            title: "任务驳回",
            content: "是否驳回任务？",
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                var iframeWin = layero.find('iframe')[0]; // 得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                setTimeout(function () {
                    top.layer.close(index);
                }, 100);
                var rejectResult = _rejectTask(userTaskInstId);

                processEvent(rejectResult, "afterReject");
                return rejectResult;
            },
            cancel: function (index) {
                setTimeout(function () {
                    top.layer.close(index);
                }, 100);
            }
        });
    }

    // 任务驳回
    function _rejectProcessTask(userTaskInstId, processEvent) {
        top.layer.open({
            type: 0,
            title: "任务驳回",
            content: "是否驳回任务？",
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                var iframeWin = layero.find('iframe')[0]; // 得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                setTimeout(function () {
                    top.layer.close(index);
                }, 100);
                var rejectResult = _rejectTask(userTaskInstId);

                processEvent(rejectResult, "afterReject");
                return rejectResult;
            },
            cancel: function (index) {
                setTimeout(function () {
                    top.layer.close(index);
                }, 100);
            }
        });
    }

    function _rejectTask(userTaskInstId) {
        $.ajax({
            async: false,
            type: 'POST',
            url: requestUrlPrefix + "/activiti/userTaskInst/turnDownTask?userTaskInstId="
                + userTaskInstId,
            error: function () {
                direwolfCommonTips('error', '驳回任务失败!');
            },
            success: function (result) {
                var type = result.type;
                if (result.type === "success") {
                    window.location.replace(getRelativePath() + "userTaskInstList.html");
                    direwolfCommonTips('success', result.message);
                    return true;
                } else {
                    direwolfCommonTips('error', "驳回任务失败:" + result.message);
                    return false;
                }
            }
        });
    }

    return {
        getBtnCfg: _getBtnCfg,
        setBtnVisble: _setBtnVisible,
        addBtn: _addBtn,
        isNeedSelCandidate: _isNeedSelCandidate,
        popupCandidateSelWin: _popupNextTasksTree,
        sendProcessUsingAnchor: _sendProcessUsingAnchor,
        sendProcess: _sendProcess,
        rejectProcessTaskUsingAnchor: _rejectProcessTaskUsingAnchor,
        rejectProcessTask: _rejectProcessTask
    };
})();

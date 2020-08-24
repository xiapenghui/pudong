/**
 * 请求前缀
 */
var requestUrlPrefix = '/activiti/a';

var taskInstHandlePageContent = new Vue({
    el: '#taskInstHandlePageContent',
    data: function () {
        return {
            entity: {
                id: getQueryString("id")
            },
            editType: getQueryString("editType"),
            /**
             * 页面加载状态
             */
            pageLoading: true,
            /**
             * 请求前缀
             */
            requestUrlPrefix: requestUrlPrefix

        }
    },
    created: function () {
        this.initFormData();
    },
    methods: {
        /**
         * 初始化表单数据
         */
        initFormData: function () {
            var vm = this;
            var pkValue = this.entity.id;
            if (pkValue) {
                var url = requestUrlPrefix + '/activiti/userTaskInst/getUserTaskInstList?id=' + pkValue;
                var info = '获取单条流程分类管理信息';
                axios.get(url).then(function (response) {
                    var page = getDataFromAxiosResponse(response, info);
                    if (page.list && page.list[0]) {
                        vm.entity = page.list[0];
                        var url = getRelativePath() + "businessTestForm.html" + "?procInstId=" + vm.entity.procInstId
                            + "&userTaskInstId=" + vm.entity.id + "&state=" + vm.entity.state
                            + "&dealUserId=" + vm.entity.dealUserId + "&businessDataId=" + vm.entity.businessDataId;
                        $("#bizFormFrame")[0].contentWindow.location.replace(url);
                        $("#bizFormFrame").on("load", _afterFrameLoad);

                        /**
                         * 页面IFrame加载完成后，根据业务的设置修改待办页面
                         */
                        function _afterFrameLoad() {
                            var btnCfg = ProcessUtil.getBtnCfg();
                            var sendBtnCfg = btnCfg.sendBtn;
                            var rejectBtnCfg = btnCfg.rejectBtn;
                            $("#sendBtn").css("display", sendBtnCfg.visible ? "inline-block" : "none");
                            $("#rejectBtn").css("display",
                                rejectBtnCfg.visible ? "inline-block" : "none");

                            // 如果流程状态为协办，则仅显示保存按钮
                            if ($("#state").val() !== "4") {
                                $("#saveBtn").hide();
                                $("#sendBtn").show();
                                $("#rejectBtn").show();
                            } else {
                                $("#saveBtn").show();
                                $("#sendBtn").hide();
                                $("#rejectBtn").hide();
                            }
                            $("#bizFormFrame").height(
                                $("#bizFormFrame")[0].contentDocument.body.scrollHeight);
                        }
                    }
                }).catch(function (error) {
                    axiosErrorTips(error, info + '异常')
                })
            }
        }
    },
    mounted: function () {
        $("#backToList").click(_onBackClick);
        $("#saveBtn").click(_onSaveClick);
        $("#sendBtn").click(_onSendClick);
        $("#rejectBtn").click(_onRejectClick);
        // $("#bizFormFrame")[0].contentWindow.location.replace(url);
        // $("#bizFormFrame").on("load", _afterFrameLoad);

        /**
         * 返回按钮点击事件
         */
        function _onBackClick() {
            layer.confirm("返回待办列表后未保存的数据将丢失,确定要继续吗?", {
                icon: 3,
                title: "返回提醒"
            }, function (index) {
                // 返回待办列表页面并关闭弹窗
                window.location.replace(getRelativePath() + "userTaskInstList.html");
                layer.close(index);
            });
        }

        /**
         * 保存按钮点击事件
         */
        function _onSaveClick() {
            var processAnchor = $(
                document.getElementById("bizFormFrame").contentDocument).find(
                "#processAnchor");
            layer.confirm("确定要保存数据吗?", {
                icon: 3,
                title: "保存确认"
            }, function (index) {
                // 判断业务表单是否定义了流程事件
                if (processAnchor.length > 0
                    && typeof processAnchor[0].processEvent === "function") {
                    // 触发保存业务数据事件
                    processAnchor[0].processEvent(true, "saveBizData", function (p_result) {
                        if (p_result && p_result.proceed) {
                            direwolfCommonTips('success', "保存业务数据成功！");
                            layer.close(index);
                        }
                    });
                }
            });
        }

        /**
         * 发送按钮点击事件
         */
        function _onSendClick() {
            var $processAnchor = $(
                document.getElementById("bizFormFrame").contentDocument).find(
                "#processAnchor");
            // 发送回调，成功后返回待办列表
            var sendCallback = function (p_result) {
                if (p_result) {// 此处仅提示成功信息，错误信息需要在各处理环节自行提醒
                    window.location.replace(getRelativePath() + "userTaskInstList.html");
                    direwolfCommonTips('success', "流程发送成功！");
                }
            };
            // 调用工具的发送流程方法
            layer.confirm("确定要发送流程吗?", {
                icon: 3,
                title: "发送确认"
            }, function (index) {
                ProcessUtil.sendProcessUsingAnchor($("#id").val(), $processAnchor,
                    sendCallback);
                layer.close(index);
            });
        }

        /**
         * 页面IFrame加载完成后，根据业务的设置修改待办页面
         */
        function _afterFrameLoad() {
            var btnCfg = ProcessUtil.getBtnCfg();
            var sendBtnCfg = btnCfg.sendBtn;
            var rejectBtnCfg = btnCfg.rejectBtn;
            $("#sendBtn").css("display", sendBtnCfg.visible ? "inline-block" : "none");
            $("#rejectBtn").css("display",
                rejectBtnCfg.visible ? "inline-block" : "none");

            // 如果流程状态为协办，则仅显示保存按钮
            if ($("#state").val() !== "4") {
                $("#saveBtn").hide();
                $("#sendBtn").show();
                $("#rejectBtn").show();
            } else {
                $("#saveBtn").show();
                $("#sendBtn").hide();
                $("#rejectBtn").hide();
            }
            $("#bizFormFrame").height(
                $("#bizFormFrame")[0].contentDocument.body.scrollHeight);
        }

        /**
         * 驳回按钮点击事件
         */
        function _onRejectClick() {
            var proceed = false;
            var processAnchor = $(
                document.getElementById("bizFormFrame").contentDocument).find(
                "#processAnchor");
            // 判断业务表单是否定义了流程事件
            if (processAnchor.length > 0
                && typeof processAnchor[0].processEvent === "function") {
                // 如果需要异步判断是否驳回，则需要业务表单首先返回proceed为false
                proceed = processAnchor[0].processEvent(true, "beforeReject", function (
                    p_result) {
                    if (p_result && p_result.proceed) {
                        ProcessUtil.rejectProcessTaskUsingAnchor($("#id").val(),
                            processAnchor);
                    }
                });
            }
            if (proceed) {
                ProcessUtil.rejectProcessTaskUsingAnchor($("#id").val(), processAnchor);
            }
        }
    }
});


/**
 * @file 此文件为工作流待办页面的处理方法，包括各按钮的点击事件、IFrame加载完成后根据业务页面传值初始化待办页面设置等
 * @author Sec
 * @author 丁航
 */

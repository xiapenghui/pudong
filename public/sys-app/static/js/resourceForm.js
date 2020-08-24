var validateForm;

function doSubmit(callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
    if (validateForm.form()) {
        $("#resType").attr("disabled", false);
        formAjaxSubmit($("#resourceForm"), function (result) {
            callback(result);
        });
        return true;
    }
    return false;
}

/*function resTypeOnchange(selection){
    if(selection.value=="1"){
        $("#permission").addClass("required");
        $("#target").addClass("required");
    }else{
        $("#permission").removeClass("required");
        $("#target").removeClass("required");
    }
}*/
var pageDictMap = {}
var fieldDictTypeMap = {
    'enTimeLimit': 'y_n',
    'resType': 'res_type',
    'resCode': 'res_code',
}
var resourceListContentVm = new Vue({
    el: '#resourceForm',
    data: function () {
        return {
            entity: {
                id: GetQueryString('id'),
                resName: '', // 资源名称
                resType: '', // 1_ 菜单 2_ 按钮 3_接口
                menuIcon: '', // 图标
                visiable: '', // 是否显示 Y_N 0 否 1 是visiable
                useTag: '',// 是否使用 Y_N 0 否 1 是
                permission: '',// permission
                parentId: GetQueryString('parentId'), // parent_id
                parentIds: '', // 所有父级别编号
                menuOrder: '', // menu_order
                appId: GetQueryString('appId'), // app_id
                target: '', // target
                parentResName: GetQueryString('parentResName'),
                appName: GetQueryString('appName'),
                resCode: '', //将资源分类3类：系统资源、审计资源、业务资源，1表示系统类型，2表示审计类型，3表示业务类型
                menuType: '',
            },
            /**
             * 页面查看类型
             */
            editType: GetQueryString('editType'),
            pageDictMap: {},
            urlPrefix: commonConfig.sysBackendContext + '/sys/resource',
        }
    },
    computed: {
        resTypeDict: function () {
            return this.pageDictMap['res_type']
        },
        resCodeDict: function () {
            return this.pageDictMap['res_code']
        },
        menuTypeDict: function () {
            return this.pageDictMap['menu_type']
        },
        enTimeLimitDict: function () {
            return this.pageDictMap['y_n']
        },
    },
    methods: {

        initFormData: function () {
            var vm = this
            var pkValue = this.entity.id
            if (pkValue) {
                var url = this.urlPrefix + '/getResourceList?id=' + pkValue
                var info = '获取资源信息'
                axios.get(url).then(function (response) {
                    var page = getDataFromAxiosResponse(response, info)
                    if (page.list && page.list[0]) {
                        vm.entity = page.list[0]
                    }
                }).catch(function (error) {
                    axiosErrorTips(error, info + '异常')
                })
            }
        },
        handleResTypeChange: function (newData) {
            if (newData !== '1') {
                this.entity.menuType = ''
            }
        },


    },
    created: function () {
        checkPagePermission(commonConfig.sysBackendContext + '/sys/resource/checkResourceFormPermission')
        // 请求所有字典，全部请求返回后再继续加载页面
        var vm = this
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,res_type,res_code,menu_type'
        var info = '获取字典信息'
        axios.get(dictUrl).then(function (response) {
            vm.pageDictMap = getDataFromAxiosResponse(response, info).data
            vm.initFormData()
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        })
    },
    mounted: function () {
        var parentId = $("#parentId").val();
        if (parentId == "1") {//如果是接口
            var $resType = $("#resType");
            $resType.val("3");
            $resType.attr("disabled", true);
        } else if (parentId == "2") {//如果是工作流
            var $resType = $("#resType");
            $resType.val("4");
            $resType.attr("disabled", true);
        } else {
            $("#resType option[value='3']").remove();
            $("#resType option[value='4']").remove();
        }

        $("#selectMenu").click(function () {

            top.layer.open({
                type: 2,
                title: "选择图标",
                area: ['700px', '600px'],
                content:   '/common-assets/pages/iconSelect.html',
                btn: ['确定', '关闭'],
                yes: function (index, layero) { //或者使用btn1
                    var icon = layero.find("iframe")[0].contentWindow.$("#icon").val();
                    $("#menu-icon").attr("class", "fa " + icon);
                    $("#menu-label").text(icon);
                    $("#menu-value").val(icon);
                    top.layer.close(index);
                }, cancel: function (index) { //或者使用btn2
                    setTimeout(function () {
                        top.layer.close(index);
                    }, 100);
                }
            });
        });
        $("#clearMenu").click(function () {
            $("#menu-icon").attr("class", "icon- hide");
            $("#menu-label").text("无");
            $("#menu-value").val("");
        });


        validateForm = $("#resourceForm").validate({
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
    }
})

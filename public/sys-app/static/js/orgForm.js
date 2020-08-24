var validateForm;
		function doSubmit(callback){//回调函数，在编辑和保存动作时，供openDialog调用提交表单。

           $("#orgType").attr("disabled", false);
		  if(validateForm.form()){
			  formAjaxSubmit($("#orgForm"), function(result){
				  callback(result);
			  });
			  return true;
		  }
		  return false;
		}

var pageDictMap = {}
var fieldDictTypeMap = {
    'orgType': 'org_type',
    'orgClass': 'org_class',
}
var orgFormContentVm = new Vue({
    el: '#orgForm',
    data: function () {
        return {
            entity: {
                id: GetQueryString('id'),
                orgName: '',
                orgCode: '',
                orgType: '',
                orgClass: '',
                orgShortName: '',
                parentId: GetQueryString('parentId'),
                parentIds: GetQueryString('parentIds'),
            },
            /**
             * 页面查看类型
             */
            editType: GetQueryString('editType'),
            pageDictMap: {},
            urlPrefix: commonConfig.sysBackendContext + '/sys/org',
        }
    },
    computed: {
        orgTypeDict : function (){
            return this.pageDictMap['org_type']
        },
        orgClassDict : function () {
            return  this.pageDictMap['org_class']
        },
    },
    methods: {
        /**
         * 初始化表单数据
         */
        initFormData: function () {
            var vm = this
            var pkValue = this.entity.id
            if (pkValue) {
                var url = this.urlPrefix + '/getOrgList?id=' + pkValue
                var info = '获取微服务系统信息'
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
    },
    created: function () {
        // 请求所有字典，全部请求返回后再继续加载页面
        var vm = this
        var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=org_type,org_class'
        var info = '获取字典信息'
        axios.get(dictUrl).then(function (response) {
            vm.pageDictMap = getDataFromAxiosResponse(response, info).data
            vm.initFormData()
        }).catch(function (error) {
            axiosErrorTips(error, info + '异常')
        })
    },
    mounted: function () {
        validateForm = $("#orgForm").validate({
            submitHandler: function(form){
                loading('正在提交，请稍等...');
                form.submit();
            },
            errorContainer: "#messageBox",
            errorPlacement: function(error, element) {
                $("#messageBox").text("输入有误，请先更正。");
                if (element.is(":checkbox")||element.is(":radio")||element.parent().is(".input-append")){
                    error.appendTo(element.parent().parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });
        // 消除不满窗时的滚动条
        if($("#orgForm").height() < $("#orgForm").context.defaultView.innerHeight){
            $($("#orgForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
        }
    },
})

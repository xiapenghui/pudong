var validateForm

function doSubmit (callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
  if (validateForm.form()) {
    formAjaxSubmit($('#roleForm'), function (result) {
      callback(result)
    })
    return true
  }
  return false
}

var pageDictMap = {}
var fieldDictTypeMap = {
  'roleCode': 'role_code',
}
var roleFormContentVm = new Vue({
  el: '#roleForm',
  data: function () {
    return {
      entity: {
        id: GetQueryString('id'),
        appName: '',
        appId: '',
        roleName: '',
        roleCode: '',
        roleDesc: '',
        orgName: '',
        orgId: GetQueryString('orgId'),
      },
      /**
       * 页面查看类型
       */
      editType: GetQueryString('editType'),
      pageDictMap: {},
      urlPrefix: commonConfig.sysBackendContext + '/sys/role',
      orgTreeUrlPrefix: WEB_ROOT + '/sys/org/getOrgTree?pId=',//${dw:getUser().userAccount == admin ?'0': dw:getCurCorp().id}&type=0
      userOrgId: '',
    }
  },
  computed: {
    roleCode: function () {
      return this.pageDictMap['role_code']
    },
    orgTreeUrl: function () {
      return this.orgTreeUrlPrefix + this.userOrgId + '&type=0'
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
        var url = this.urlPrefix + '/getRoleList?id=' + pkValue
        var info = '获取微服务系统信息'
        axios.get(url).then(function (response) {
          var page = getDataFromAxiosResponse(response, info)
          if (page.rows && page.rows[0]) {
            vm.entity = page.rows[0]
          }
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      }
    },
    getUserOrgId: function () {
      var url = commonConfig.sysBackendContext + '/sys/sysParam/getSysParam?code=ADMIN_USER'
      var info = '获取管理员账号'
      var vm = this
      axios.get(url).then(function (response) {
        var adminAccount = getDataFromAxiosResponse(response, info)
        vm.userOrgId = LOGIN_USER === adminAccount ? '0' : corpId
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
  },
  created: function () {
    checkPagePermission(commonConfig.sysBackendContext + '/sys/role/checkRoleFormPermission')
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=role_code'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      vm.pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.initFormData()
      vm.getUserOrgId()
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })
  },
  mounted: function () {
    var vm = this
    //新增页面需要将角色职能类型中的超级系统类型去掉
    if (editType == 'add') {
      $('#roleCode option[value=\'11\']').remove()
    }

    /*	$("#lazy_multi_user_treebt").click(function(){
                var checkedIds = $("#userIds").val();
                var url = WEB_ROOT+"/sys/roleUser/lazyMultiUserTree?checkedIds=" + checkedIds;
                var config = {height:"500px",width:"250px"};
                config.yes=function(index, layero){
                    var tree = layero.find("iframe")[0].contentWindow.tree;
                    var checkedIdsOfLeaf = layero.find("iframe")[0].contentWindow.arr_checkedIds;
                    $("#userIds").val(checkedIdsOfLeaf);
                    top.layer.close(index);
                    return true;
                };
                openDialog("选择用户", url, config);
            });*/

    $.ajax({
      async: false,
      type: 'GET',
      url: WEB_ROOT + '/sys/app/getAppListOfUser?timestamp=' + Date.parse(new Date()),
      error: function () {
        alert('请求失败')
      },
      success: function (result) {
        var apps = result.data
        $appId = $('#appId')
        for (var i = 0; i < apps.length; i++) {
          $appId.append('<option value=\'' + apps[i].id + '\'>'
            + apps[i].appName + '</option>')
        }
        //vm.entity.appId = apps[0].id;
        //vm.entity.appName = apps[0].appName;
        /*$appId.change(function() {
          vm.entity.appId  = $(this).children('option:selected').val();// 这就是selected的值
          $("#appId").val(appId);
        });*/
      },
    })

    validateForm = $('#roleForm').validate(
      {
        ignore: '',
        submitHandler: function (form) {
          loading('正在提交，请稍等...')
          form.submit()
        },
        errorContainer: '#messageBox',
        errorPlacement: function (error, element) {
          $('#messageBox').text('输入有误，请先更正。')
          if (element.is(':checkbox') || element.is(':radio')
            || element.parent().is('.input-append')) {
            error.appendTo(element.parent().parent())
          } else {
            error.insertAfter(element)
          }
        },
      })
    // 消除不满窗时的滚动条
    if ($('#roleForm').height() < $('#roleForm').context.defaultView.innerHeight) {
      $($('#roleForm').context.firstElementChild).height(
        $('#inputForm').context.defaultView.innerHeight)
    }
  },
})
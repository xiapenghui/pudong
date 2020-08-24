var pageDictMap = {}
/**
 * 字段映射字典map
 */
var fieldDictTypeMap = {
  'resultCode': 'result_code',
  'clientType': 'client_type',
  'enTimeLimit': 'y_n',
}
/**
 * 日志统计页面查询次数详情携带相关参数映射map
 */
var statTypeAndClassCodeMap = {
  'loginFault': { classCode: 'BUSINESS.LOGIN', className: '登录', paramCode: '1' },
  'accessDenied': { classCode: 'BUSINESS.ACCESS_DENIED', className: '越权访问日志' },
  'pwdReset': { classCode: 'BUSINESS.PWD_RESET', className: '管理员重置密码' },
  'resChg': { classCode: 'BUSINESS.RES_CHG', className: '权限修改日志' },
}
var userListContentVm = new Vue({
  el: '#logInfoListContent',
  data: function () {
    return {
      /**
       * 页面加载状态
       */
      pageLoading: true,
      /**
       * 页面字典列表
       */
      pageDictMap: {},
      /**
       * 日志统计页面查询次数详情携带相关参数查询条件
       */
      searchParamsJson: {
        userId: getQueryString('userId'),
        userName: getQueryString('userName'),
        statType: statTypeAndClassCodeMap[getQueryString('statType')],
        beginLogDate: getQueryString('beginLogDate'),
        endLogDate: getQueryString('endLogDate'),
      },
    }
  },
  computed: {
    /**
     * 客户端类别字典
     */
    clientTypeDict: function () {
      return this.pageDictMap['client_type']
    },
    /**
     * 事件结果字典
     */
    resultCodeDict: function () {
      return this.pageDictMap['result_code']
    },
    /**
     * logDate日期根据日志统计页面传来的日期参数
     */
    logDateByBeginAndEndDate: function () {
      if (this.searchParamsJson.beginLogDate && this.searchParamsJson.endLogDate) {
        return this.searchParamsJson.beginLogDate + ' 至 ' + this.searchParamsJson.endLogDate
      }
      return null
    },
    /**
     * resultCode日期根据日志统计页面传来的resultCode参数
     */
    loginFaultResultCode: function () {
      if (this.searchParamsJson.statType && this.searchParamsJson.statType.paramCode) {
        return this.searchParamsJson.statType.paramCode
      }
      return ''
    },
  },
  created: function () {
    // 请求所有字典，全部请求返回后再继续加载页面
    var vm = this
    var dictUrl = commonConfig.sysBackendContext + '/sys/sysParam/getParamsByCodeStr?classCodes=y_n,client_type,result_code'
    var info = '获取字典信息'
    axios.get(dictUrl).then(function (response) {
      pageDictMap = getDataFromAxiosResponse(response, info).data
      vm.pageDictMap = pageDictMap
      vm.pageLoading = false
      setTimeout(() => refreshTable())
    }).catch(function (error) {
      axiosErrorTips(error, info + '异常')
    })

  },
  methods: {},
  mounted: function () {
    // setDefaultValue();
    // refreshTable();

    // 设置查询重置按钮点击方法
    var $searchBtn = $('#logInfoSearchBtn')
    var $resetBtn = $('#logInfoResetBtn')
    $searchBtn.click(refreshTable)
    $resetBtn.click(function () {
      setDefaultValue()
      refreshTable()
    })

    var $userId = $('#userId')
    var $userName = $('#userName')

    var $classCode = $('#classCode')
    var $className = $('#className')

    // 人员选择加载树
    $('.userTreeSelectBt').each(
      function () {
        var $bt = $(this)
        $bt.click(function () {
          var config = {
            height: '500px',
            width: '250px',
          }
          var params = {}
          if (!!$userId.val()) {
            params.checkedId = $userId.val()
          }
          // var url = WEB_ROOT
          //     + "/tag/lazyTreeSelect?"
          //     + "url="
          //     + WEB_ROOT
          //     + "/sys/org/getOrgList"
          //     + "&expendURL="
          //     + WEB_ROOT
          //     + "/sys/user/getUserTreeListOfExpand"
          //     + "&parentKeyOfLeaf=orgId"
          //     + "&searchUrl=" + WEB_ROOT
          //     + "/sys/role/searchUserList"
          //     + "&pIdKeyOfParent=parentId"
          //     + "&nameKeyOfParent=orgName" + "&"
          //     + $.param(params);
          var url = getRelativePath()
            + '/lazyTreeSelect.html?'
            + 'url='
            + WEB_ROOT
            + '/sys/org/getOrgList'
            + '&expendURL='
            + WEB_ROOT
            + '/sys/user/getUserTreeListOfExpand'
            + '&parentKeyOfLeaf=orgId'
            + '&searchUrl=' + WEB_ROOT
            + '/sys/role/searchUserList'
            + '&pIdKeyOfParent=parentId'
            + '&nameKeyOfParent=orgName' + '&'
            + $.param(params)
          top.layer.open({
            type: 2,
            area: [
              config.width,
              config.height],
            title: '选择用户',
            maxmin: true, // 开启最大化最小化按钮
            content: url,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
              var tree = layero.find('iframe')[0].contentWindow.tree
              var node = tree.getSelectedNodes()[0] // 获取到选择的节点
              if (node.isParent) {
                toastr.warning('不能选择父节点!')
                return
              }
              $userId.val(node.id)
              $userName.val(node.name)
              setTimeout(function () {
                top.layer.close(index)
              }, 100)
            },
            cancel: function (index) {
              setTimeout(function () {
                top.layer.close(index)
              }, 100)
            },
          })
        })
      })

    $('.logClassTreeSelectBt').each(
      function () {
        var $bt = $(this)

        $bt.click(function () {
          var config = {
            height: '500px',
            width: '250px',
          }
          var params = {}
          if (!!$userId.val()) {
            params.checkedId = $userId.val()
          }
          // var url = WEB_ROOT + "/tag/treeselect?url=" + WEB_ROOT + "/sys/logClass/getLogClassTree";
          var url = getRelativePath() + 'treeSelect.html?url=' + WEB_ROOT + '/sys/logClass/getLogClassTree'
          top.layer.open({
            type: 2,
            area: [
              config.width,
              config.height],
            title: '选择日志类型',
            maxmin: true, // 开启最大化最小化按钮
            content: url,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
              var tree = layero.find('iframe')[0].contentWindow.tree
              var node = tree.getSelectedNodes()[0] // 获取到选择的节点
              $classCode.val(node.id)
              $className.val(node.name)
              setTimeout(function () {
                top.layer.close(index)
              }, 100)
            },
            cancel: function (index) {
              setTimeout(function () {
                top.layer.close(index)
              }, 100)
            },
          })
        })
      })
  },
})

// 刷新表格公共方法
function refreshTable () {
  var data_url = WEB_ROOT + '/sys/logInfo/getLogInfoList?'
  $('#logInfoTable').bootstrapTable('refresh', {
    url: data_url + $('#logInfoSearchForm').serialize(),
  })
}

//设置查询项的默认值，在初始化及点击重置按钮时调用
function setDefaultValue () {
  $('#logInfoSearchForm #logDate').val('')
  $('#logInfoSearchForm #beginLogDate').val('')
  $('#logInfoSearchForm #endLogDate').val('')
  $('#logInfoSearchForm #clientType').val('')
  $('#logInfoSearchForm #resultCode').val('')
  $('#logInfoSearchForm #userId').val('')
  $('#logInfoSearchForm #userName').val('')
  $('#logInfoSearchForm #classId').val('')
  $('#logInfoSearchForm #classCode').val('')
  $('#logInfoSearchForm #className').val('')
}

function fix_height () {
  var winheight = $(window).height()
  var fbox = $('.ibox:first')
  var lbox = $('.ibox:last')
  var fheight = fbox.height()
  var lheight = lbox.height()
  var maxh = fheight > lheight ? fheight : lheight
  if (maxh <= winheight || $(window).width() >= (fbox.width() + lbox.width())) {
    $('.ibox').css('min-height', (winheight - 30) + 'px')
    $('.ibox-content').css('min-height', (winheight - 50) + 'px')
  } else {
    $('.ibox').css('min-height', '')
    $('.ibox-content').css('min-height', '')
  }
}

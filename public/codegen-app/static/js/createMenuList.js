var validForm

var resourceFormVm = new Vue({
  el: '#resourceForm',
  data: function () {
    return {
      msConfig: {},
      entity: {
        id: getQueryString('id'),
        genTable: {
          id: getQueryString('genTable.id'),
        },
        appId: '1',
        parentResName: '',
        resName: '',
        resType: '',
        menuOrder: '',
        menuIcon: '',
        visiable: '',
        useTag: '',
        permission: '',
        target: '',
        resCode: '',
        menuType: '',
      },
      /**
       * 页面字典列表
       */
      pageDictMap: {},
      showList: [],
      resource: {},
    }
  },
  computed: {
    resTypeDict: function () {
      return this.pageDictMap['res_type']
    },
    visiableDict: function () {
      return this.pageDictMap['y_n']
    },
    useTagDict: function () {
      return this.pageDictMap['y_n']
    },
    resCodeDict: function () {
      return this.pageDictMap['res_code']
    },
    menuTypeDict: function () {
      return this.pageDictMap['menu_type']
    },
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] + '/genScheme'
    },
    /**
     * 表单保存地址
     */
    saveUrl: function () {
      return WEB_ROOT + '/sys/resource/save'
    },
    /**
     * 表单保存地址
     */
    resourceTreeUrl: function () {
      return WEB_ROOT + '/sys/resource/selectResourceTree?appId=1'
    },
  },
  methods: {
    getShowList: function () {
      var vm = this
      var info = '获取样式列表'
      axios.get(vm.urlPrefix + '/getShowList?genTable.id=' + vm.entity.genTable.id).then(function (response) {
        vm.showList = getDataFromAxiosResponse(response, info)
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
    getResource: function () {
      var vm = this
      var info = '获取样式列表'
      axios.get(vm.urlPrefix + '/getMenuData?genTable.id=' + vm.entity.genTable.id).then(function (response) {
        vm.resource = getDataFromAxiosResponse(response, info)
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
    handleResTypeChange: function (newData) {
      if (newData !== '1') {
        this.entity.menuType = ''
      }
    },
    initFormData: function () {
      var vm = this
      var info = '获取信息'
      axios.get(vm.urlPrefix + '/getRecord?genTable.id=' + vm.entity.genTable.id).then(function (response) {
        var data = getDataFromAxiosResponse(response, info)
        if (data.id) {
          vm.entity = data
          vm.$nextTick(function () {
            schemeFormReload(data.category, data.style)
            // 切换显隐
            toggleRelationHidden()
          })
        }
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
  },
  created: function () {
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      checkPagePermission(vm.urlPrefix + '/checkCreateMenuPermission')
      vm.getShowList()
      vm.getResource()
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'res_type,y_n,res_code,menu_type').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        initDict()
        // vm.initFormData()
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    }).catch(function (error) {
      axiosErrorTips(error, '加载页面配置异常')
    })
  },
  mounted: function () {
    var vm = this
    var parentId = $('#parentId').val()
    if (parentId === '1') {// 如果是接口
      var $resType = $('#resType')
      $resType.val('3')
      $resType.attr('disabled', true)
    } else {
      $('#resType option[value=\'3\']').remove()
    }
    $('.select_chosen').select2()
    $('#selectMenu').click(
      function () {
        top.layer.open({
          type: 2,
          title: '选择图标',
          area: ['700px', '600px'],
          content: '/common-assets/pages/iconSelect.html',
          btn: ['确定', '关闭'],
          yes: function (index, layero) { // 或者使用btn1
            var icon = layero.find('iframe')[0].contentWindow.$(
              '#icon').val()
            $('#menu-icon').attr('class', 'fa ' + icon)
            $('#menu-label').text(icon)
            $('#menu-value').val(icon)
            top.layer.close(index)
          },
          cancel: function (index) { // 或者使用btn2
            setTimeout(function () {
              top.layer.close(index)
            }, 100)
          },
        })
      })
    $('#clearMenu').click(function () {
      $('#menu-icon').attr('class', 'icon- hide')
      $('#menu-label').text('无')
      $('#menu-value').val('')
    })

    // $('#selectAppId').change(function (event) {
    //   // 根据计划信息获取菜单数据
    //   var selValue = $(event.currentTarget).val()
    //   $('#resource').attr('data-url', '')
    //   $('#resource').attr('data-url', WEB_ROOT + '/sys/resource/selectResourceTree?appId=' + selValue)
    // })
    $('#schemeSelection').change(
      function (event) {
        // 根据计划信息获取菜单数据
        var selValue = $(event.currentTarget).val()
        var url = '/api' + vm.urlPrefix + '/refreshMenuForm?id=' + selValue + '&random=' + new Date()
        var result = $.parseJSON($.ajax({
          url: url,
          type: 'get',
          async: false,
        }).responseText)
        if (result != null && typeof (result.type) !== 'undefined'
          && result.type === 'success') {
          if (typeof (result.data.resource) !== 'undefined') {
            // 重置菜单数据
            var resData = result.data.resource
            $('#resName').val(resData.resName)
            $('#permission').val(resData.permission)
            $('#target').val(resData.target)
            $('#parentResName').val('')
            $('#parentId').val('')
            // $('#appId').val('')

          } else {
            toastr.error('获取菜单数据失败！')
          }
        } else {
          toastr.error(result.message || '重新菜单内容失败！')
        }
      })

    // 表单提交校验
    validForm = $('#resourceForm').validate(
      {
        rules: {
          target: {
            checkTarget: true,
          },
        },
        errorPlacement: function (error, element) {
          if (element.is(':checkbox') || element.is(':radio')
            || element.parent().is('.input-append')) {
            error.insertAfter(element.parent())
          } else {
            error.insertAfter(element)
          }
        },
      })
  },
})

// 自定义正则表达示验证方法
$.validator.addMethod('checkTarget', function (value, element, params) {
  if (!$.isEmptyObject(value) && resourceFormVm.entity.resType === '1') {
    if (resourceFormVm.entity.menuType === '03' && !value.startsWith('http')) {
      return false
    }
  }
  return true
}, '资源地址不正确')

function initDict () {
  $.ajax({
    url:  WEB_ROOT + '/sys/app/selectAppTree?time=' + new Date(),
    type: 'get',
    async: false,
    success: function (result) {
      $.each(result, function (i, item) {
        if (item.id === 1) {
          $('#selectAppId').append(
            $('<option selected = "selected" value="' + item.id + '">' + item.name
              + '</option>'))
        } else {
          $('#selectAppId').append(
            $('<option value="' + item.id + '">' + item.name
              + '</option>'))
        }
      })
    },
  })

}

/**
 * 表单提交事件
 *
 * @param callback
 * @returns {Boolean}
 */
function doSubmit (callback) {
  if (!validForm.form())
    return false
  $('input[type=checkbox]').each(
    function () {
      if (!$(this).prop('checked')) {
        $(this).after(
          '<input type="hidden" name="'
          + $(this).attr('name') + '" value=\'0\'>')

      } else {
        $(this).attr('value', '1')
      }
    })
  formAjaxSubmit($('#resourceForm'), callback)
}
var validForm

var inputForm = new Vue({
  el: '#inputForm',
  data: function () {
    return {
      entity: {
        dataLogicType: '',
        genDatasource: {
          id: '',
        },
        name: '',
        tableAlias: '',
      },
      /**
       * 页面字典列表
       */
      datasourceList: [],
      /**
       * 页面字典列表
       */
      pageDictMap: {},
    }
  },
  computed: {
    requestPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath']
    },
  },
  created: function () {
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      checkPagePermission(vm.requestPrefix + '/codegen/checkImportTablePermission')
      var dsInfo = '获取数据源列表'
      axios.get(vm.requestPrefix + '/codegen/getDatasourceList').then(function (response) {
        vm.datasourceList = getDataFromAxiosResponse(response, dsInfo).data
      }).catch(function (error) {
        axiosErrorTips(error, dsInfo + '异常')
      })
    }).catch(function (error) {
      axiosErrorTips(error, '加载页面配置异常')
    })
  },
  mounted: function () {
    var vm = this
    validForm = $('#inputForm').validate(
      {
        errorPlacement: function (error, element) {
          if (element.is(':checkbox') || element.is(':radio')
            || element.parent().is('.input-append')) {
            error.insertAfter(element.parent())
          } else {
            error.insertAfter(element)
          }
        },
      })
    var chosenOptions = {
      no_results_text: '没有找到',
      placeholder_text_single: '当前未选择记录',

    }
    // 绑定选择组件
    $('#selectName').chosen(chosenOptions)

    var tableList = null
    // 数据源变更事件
    $('#selectDataSource').change(
      function (event) {
        // 获取选择的值
        var dataSourceSel = event.currentTarget
        var newValue = dataSourceSel[dataSourceSel.selectedIndex].value
        if (newValue !== '') {
          // 此处发起请求，建立选中的数据库连接，获取表格列表
          var result = $.parseJSON($.ajax({
            url: '/api' + vm.requestPrefix + '/codegen/getTableList?genDatasourceId=' + newValue,
            async: false,
          }).responseText)
          // 获取返回结果中的表格列表
          if (result.type === 'success') {
            // 清空表格选择组件
            $('#selectName').chosen('destroy')
            $('#selectName').val('')
            $('#selectName').empty()
            tableList = result.data
            if (tableList.length > 0) {
              $.each(tableList, function (i, item) {
                $('#selectName').append(
                  $('<option value="' + item.name
                    + '">'
                    + item.nameAndComments
                    + '</option>'))
              })
            }
            // 重新绑定选择组件
            $('#selectName').chosen(chosenOptions)
            // 触发表格选择事件
            $('#selectName').trigger('change')
          } else {
            toastr.error('获取列表失败，请确认数据源配置是否正确！')
          }
        }
      })

    // 表格选择事件
    $('#selectName').change(function (event) {
      var dataSourceSel = event.currentTarget
      var newValue = dataSourceSel[dataSourceSel.selectedIndex].value
      if (newValue !== '') {
        vm.entity.name = newValue
        for (var i = 0; i < tableList.length; i++) {
          if (newValue === tableList[i].name) {// 根据选中的名称，设定数据逻辑类型
            vm.entity.dataLogicType = tableList[i].dataLogicType
          }
        }
      } else {// 清空数据逻辑类型
        vm.entity.dataLogicType = ''
        vm.entity.name = ''
      }
    })
  },
})

// 表格提交事件
function doSubmit (callback) {
  if (!validForm.form())
    return false
  // 自定义准备
  formAjaxSubmit($('#inputForm'), callback)
}
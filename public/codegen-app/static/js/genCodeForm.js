var validForm

function doSubmit (callback) {//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
  if (!validForm.form()) return false

  // 移除只读限制将主表关联字段传递至后台
  $('#inputForm select[id*=mainTableField]').removeAttr('disabled')

  formAjaxSubmit($('#inputForm'), function (result) {
    localStorage.packageName = $('#packageName').val()
    localStorage.functionAuthor = $('#functionAuthor').val()

    callback(result)
  })
}

var inputFormVm = new Vue({
  el: '#inputForm',
  data: function () {
    return {
      msConfig: {},
      entity: {
        id: getQueryString('id'),
        genTable: {
          id: getQueryString('genTable.id'),
        },
        category: 'single_table',
        style: '',
        packageName: '',
        moduleName: '',
        subModuleName: '',
        functionName: '',
        functionNameSimple: '',
        functionAuthor: '',
        maxQueryColumns: '3',
      },
      /**
       * 页面字典列表
       */
      pageDictMap: {},
      styleList: [],
      formLoading: true
    }
  },
  computed: {
    categoryDict: function () {
      return this.pageDictMap['gen_category']
    },
    maxQueryColumnsDict: function () {
      return this.pageDictMap['query_column_num']
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
      return '/api' + this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] +
        '/genScheme/genCode?needFetchRelation=F'
    },
  },
  methods: {
    getDefaultStyleList: function () {
      var vm = this
      var info = '获取默认样式列表'
      axios.get(vm.urlPrefix + '/getDefaultStyleList?genTable.id=' + vm.entity.genTable.id).then(function (response) {
        vm.styleList = getDataFromAxiosResponse(response, info).data
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
    initFormData: function () {
      var vm = this
      var info = '获取信息'
      axios.get(vm.urlPrefix + '/getRecord?genTable.id=' + vm.entity.genTable.id).then(function (response) {
        var data = getDataFromAxiosResponse(response, info)
        if (data.id) {
          vm.entity = data
        }
        vm.$nextTick(function () {
          schemeFormReload(data.category, data.style)
          // 切换显隐
          toggleRelationHidden()
        })
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    },
  },
  created: function () {
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      checkPagePermission(vm.urlPrefix + '/checkGenCodeFormPermission')
      vm.getDefaultStyleList()
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'gen_category,query_column_num').then(function (response) {
        vm.pageDictMap = getDataFromAxiosResponse(response, info).data
        vm.initFormData()
      }).catch(function (error) {
        axiosErrorTips(error, info + '异常')
      })
    }).catch(function (error) {
      axiosErrorTips(error, '加载页面配置异常')
    })
  },
  mounted: function () {
    var vm = this
    $('#name').focus()
    validForm = $('#inputForm').validate({
      submitHandler: function (form) {
        loading('正在提交，请稍等...')
      },
      errorContainer: '#messageBox',
      errorPlacement: function (error, element) {
        $('#messageBox').text('输入有误，请先更正。')
        if (element.is(':checkbox') || element.is(':radio') || element.parent().is('.input-append')) {
          error.appendTo(element.parent().parent())
        } else {
          error.insertAfter(element)
        }
      },
    })

    // 分类变更事件
    $('#category').change(function (event) {
      // 重加载表单
      schemeFormReload($('#category').val(), null)
      // 切换关联列表显隐
      toggleRelationHidden()
    })

    // 风格变更事件
    $('#style').change(function (event) {
      // 重新加载表单
      schemeFormReload($('#category').val(), $('#style').val())
    })

    // 默认绑定所有行组件事件
    $.each($('table#relationTable>tbody>tr'), function (i, item) {
      bindRowEvent($(item))
    })

    // 注入关联编辑按钮
    $('.relationEditBtnsTd').html(renderRowBtns())

    // 如果是新增记录，默认添加上次保存的包路径和作者
    if (!!!$('#id').val()) {
      $('#packageName').val(localStorage.packageName || '')
      $('#functionAuthor').val(localStorage.functionAuthor || '')
    }

  },
})

// 切换关联列表显隐
function toggleRelationHidden () {
  var selValue = $('#category').val()

  // 如果是多表关联场景，展示配置区域
  if (selValue === 'host_slave_table' || selValue === 'tree_table') {
    $('tr#relationROW').show()
  } else {
    $('tr#relationROW').hide()
  }
  // 树表场景仅支持一条关联关系，隐藏操作列
  if (selValue === 'tree_table') {
    $('table#relationTable>thead th').last().hide()
    $('table#relationTable>tbody td').last().hide()
  }
  inputFormVm.formLoading = false
}

// 删除关联按钮点击事件
function delRelationClicked (event) {
  // 获取当前行
  var relRow = $(event.currentTarget.parentElement.parentElement)
  // 如果只剩一条则不允许删除
  if (relRow.parent().children().length === 1) {
    toastr.info('当前仅存一条关联记录，不能删除。')
    return
  }
  // 删除行
  relRow.remove()
  // 重置行号
  resetRowNum()
}

// 新增关联按钮点击事件
function addRelationClicked (event) {
  // 获取当前行
  var relRow = $(event.currentTarget.parentElement.parentElement)
  // 克隆新行
  var newRelRow = relRow.clone()
  // 防止重复添加错误提示
  $('label').remove('.error')
  newRelRow.find('label').remove('.error')
  // 重新绑定事件
  bindRowEvent(newRelRow)
  // 选择新行
  $('table#relationTable>tbody').append(newRelRow)
  // 重置行号
  resetRowNum()
}

// 重新计算行序号
function resetRowNum () {
  $.each($('table#relationTable>tbody>tr'), function (i, row) {
    $(row).attr('id', i)
    $.each($(row).children(), function (j, cell) {
      // 重置前三列组件ID及组件name
      if (j < 3) {
        var component = cell.firstChild
        component.id = 'relationList' + i + component.id.substr(component.id.indexOf('.'))
        component.name = 'relationList[' + i + ']' + component.name.substr(component.name.indexOf('.'))
      }
    })
  })
}

// 从表变更事件
function refTableChanged (event) {
  var currentRow = event.data
  var selValue = $(event.currentTarget).val()
  var rows = $('table#relationTable>tbody>tr')
  // 提示用户表重复选择，不做处理
  for (var i = 0; i < rows.length; i++) {
    if ($(rows[i]).find('select[name*=refTable\\.id]').val() === selValue
      && $(rows[i]).attr('id') !== currentRow.attr('id')) {
      toastr.info('该表关联已添加！')
      return
    }
  }
  var fieldSel = $($(event.currentTarget).parent().next().children()[0])
  fieldSel.val('')
  fieldSel.empty()
  var hint = '--请先选择从表--'
  if (!!!selValue) {
    fieldSel.append($('<option value="">--请先选择从表--</option>'))
    return
  } else {
    fieldSel.append($('<option value="">--请选择从表字段--</option>'))
    // 获取从表字段列表
    var result = $.parseJSON($.ajax({
      url: '/api' + inputFormVm.msConfig['gatewayRoutePath'] + inputFormVm.msConfig['direwolfAdminPath'] +
        '/codegen/getColumnList?id=' +
        selValue,
      async: false,
    }).responseText)
    if (result != null && !typeof (result.type) !== 'undefined' && result.type === 'success') {
      $.each(result.data, function (i, item) {
        fieldSel.append($('<option value="' + item.name + '">' + item.name + '</option>'))
      })
    }
  }
}

// 重新绑定行内各组件事件
function bindRowEvent (newRow) {
  newRow.find('select[name*=refTable\\.id]').change(newRow, refTableChanged)
  newRow.find('div#addRelation').click(addRelationClicked)
  newRow.find('div#delRelation').click(delRelationClicked)
}

// 重新加载表单内容
function schemeFormReload (ctgValue, styleValue) {
  var url = '/api' + inputFormVm.urlPrefix + '/refreshSchemeForm?'
  // 三个条件唯一确定一条记录
  if (!!$('#genTable\\.id').val()) {
    url += '&genTable.id=' + $('#genTable\\.id').val()
  }
  if (!!ctgValue) {
    url += '&category=' + ctgValue
  }
  if (!!styleValue) {
    url += '&style=' + styleValue
  }
  var result = $.parseJSON($.ajax({ url: url, async: false }).responseText)
  if (result != null && typeof (result.type) !== 'undefined' && result.type === 'success') {
    // 刷新风格选择组件
    if (typeof (result.data.styleList) !== 'undefined' && result.data.styleList.length > 0) {
      $('#style').val('')
      $('#style').empty()
      $.each(result.data.styleList, function (i, item) {
        $('#style').append($('<option value="' + item.style + '">' + item.label + '</option>'))
      })
    } else {
      $('#style').val('')
      $('#style').empty()
      direwolfCommonTips('error', '选择的代码分类无对应风格的代码模板')
      return
    }
    if (!!styleValue) {
      $('#style').val(styleValue)
    }
    // 刷新计划其他字段
    if (typeof (result.data.genScheme) !== 'undefined') {
      var newScheme = result.data.genScheme
      $('#id').val(newScheme.id)// 重置ID
      $('#packageName').val(newScheme.packageName || localStorage.packageName || '')
      $('#moduleName').val(newScheme.moduleName)
      $('#subModuleName').val(newScheme.subModuleName)
      $('#functionName').val(newScheme.functionName)
      $('#functionNameSimple').val(newScheme.functionNameSimple)
      $('#functionAuthor').val(newScheme.functionAuthor || localStorage.functionAuthor || '')
      $('#maxQueryColumns').val(newScheme.maxQueryColumns || 3)
      // 刷新关联关系
      $('table#relationTable>tbody').empty()
      // 主表字段列表
      var mainTableFieldOption = ''
      $.each(newScheme.genTable.columnList, function (i, item) {
        mainTableFieldOption += '<option value="' + item.name + '">' + item.name + '</option>'
      })
      // 表格待选列表
      var refTableOption = '<option value=\'\'>--请选择从表--</option>'
      $.each(result.data.tableList, function (i, item) {
        refTableOption += '<option value="' + item.id + '">' + item.tableAlias + '</option>'
      })
      // 渲染关联关系
      $.each(newScheme.relationList, function (i, item) {
        var newRow = $('<tr id="' + i + '"></tr>')
        var mainTableField = $('<td><select  id="relationList' + i + '.mainTableField" name="relationList[' + i +
          '].mainTableField" class="required form-control"></select></td>')
        var refTableId = $('<td><select id="relationList' + i + '.refTable.id" name="relationList[' + i +
          '].refTable.id" class="required form-control"></select></td>')
        var refTableField = $('<td><select id="relationList' + i + '.refTableField" name="relationList[' + i +
          '].refTableField" class="required form-control"></select></td>')
        var rowBtns = $('<td>' + renderRowBtns() + '</td>')
        $(mainTableField.children()[0]).append($(mainTableFieldOption))
        $(refTableId.children()[0]).append($(refTableOption))
        newRow.append(mainTableField).append(refTableId).append(refTableField).append(rowBtns)
        // 重新绑定事件
        bindRowEvent(newRow)
        // 渲染新行
        $('table#relationTable>tbody').append(newRow)
        // 重新赋值
        if (!!item.mainTableField) {
          $(mainTableField.children()[0]).val(item.mainTableField)
        }
        if (!!item.refTable) {
          $(refTableId.children()[0]).val(item.refTable.id)
        } else {
          $(refTableId.children()[0]).val('')
        }
        // 触发从表变更事件以获取从表字段列表
        $(refTableId.children()[0]).trigger('change')
        if (!!item.refTableField) {
          $(refTableField.children()[0]).val(item.refTableField)
        } else {
          $(refTableField.children()[0]).val('')
        }
      })
    } else {
      toastr.error('获取计划数据失败！')
    }
  } else {
    toastr.error(result.message || '重新加载计划失败！')
  }
}

/**
 * 渲染关联关系编辑按钮
 *
 * @returns {String}
 */
function renderRowBtns () {
  var addRelation = '<div title=\'新增\' style=\'float: left; cursor: pointer;margin:10px 5px 10px 5px;\' id=\'addRelation\' class=\'ui-pg-div ui-inline-edit\'>'
    + '<span class=\'ui-icon fa fa-plus blue\' style=\'text-indent: initial;\'></span></div>'
  var delRelation = '<div title=\'删除\' style=\'float: left; cursor: pointer;margin:10px 5px 10px 5px;\' id=\'delRelation\' class=\'ui-pg-div ui-inline-edit\'>'
    + '<span class=\'ui-icon fa fa-trash red\' style=\'text-indent: initial;\'></span></div>'
  return addRelation + delRelation
}
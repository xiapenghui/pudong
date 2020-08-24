var validForm

var inputFormVm = new Vue({
  el: '#inputForm',
  data: function () {
    return {
      msConfig: {},
      editType: GetQueryString('viewType'),
      entity: {
        id: getQueryString('id'),
        name: '',
        comments: '',
        dataLogicType: '',
        tableAlias: '',
        genDatasource: {
          dsName: '',
          dbType: '',
        },
        className: '',
        primaryKey: '',
        pkField: '',
        idGenName: '',
        columnList: [],
        pkFieldType: '',
      },
      /**
       * 页面字典列表
       */
      pageDictMap: {},
    }
  },
  computed: {
    dataLogicTypeDict: function () {
      return this.pageDictMap['data_logic_type']
    },
    javaTypeDict: function () {
      return this.pageDictMap['gen_java_type']
    },
    queryTypeDict: function () {
      return this.pageDictMap['gen_query_type']
    },
    showTypeDict: function () {
      return this.pageDictMap['gen_show_type']
    },
    /**
     * 页面请求前缀
     */
    urlPrefix: function () {
      return this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] + '/codegen'
    },
    /**
     * 表单保存地址
     */
    saveUrl: function () {
      return '/api'+this.msConfig['gatewayRoutePath'] + this.msConfig['direwolfAdminPath'] +'/codegen/genTableForm/save'
    },
    /**
     * 是否需要主键自增长序列
     */
    needSequence: function () {
      return this.entity.pkFieldType === 'Long' &&
        (this.entity.genDatasource.dbType === '01' || this.entity.genDatasource.dbType === '03')
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
        var url = this.urlPrefix + '/getRecord?id=' + pkValue
        var info = '获取表单信息'
        axios.get(url).then(function (response) {
          var data = getDataFromAxiosResponse(response, info)
          if (data.id) {
            vm.entity = data
            vm.$nextTick(function () {
              $.each($('#pageTable>tbody tr'), function (i, item) {
                var showTypeSel = $(item).find('select[name*=showType]')[0]
                var javaFieldIpt = $(item).find('input[name*=javaField]')[0]
                disableCustomObjFields(showTypeSel.value, javaFieldIpt.value, i)
              })
            })
          }
        }).catch(function (error) {
          axiosErrorTips(error, info + '异常')
        })
      }
    },
    /**
     * 判断列的Java类型是否为自定义类型
     * @param column
     * @returns {boolean | *}
     */
    isCustomJavaType: function (column) {
      return column.javaType.indexOf('.') !== -1 || column.javaField.indexOf('|') !== -1
        && column.javaType !== 'com.set.direwolf.core.entity.Org'
        && column.javaType !== 'com.set.direwolf.api.entity.User'
    },
    /**
     * 根据类全限定名获取类名
     * @param fullClassName
     * @returns {string}
     */
    getClassName: function (fullClassName) {
      var arr = fullClassName.split('.')
      return arr[arr.length - 1]
    },
  },
  created: function () {
    var vm = this
    axios.get(getModuleConfigPath()).then(function (response) {
      vm.msConfig = response.data
      checkPagePermission(vm.urlPrefix + '/checkGenTableFormPermission')
      // 请求所有字典，全部请求返回后再继续加载页面
      var info = '获取字典信息'
      axios.get(dictUrl + 'data_logic_type,gen_java_type,gen_query_type,gen_show_type').then(function (response) {
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
    validForm = $('#inputForm').validate(
      {
        submitHandler: function (form) {
          loading('正在提交，请稍等...')
        },
        errorPlacement: function (error, element) {
          if (element.is(':checkbox') || element.is(':radio')
            || element.parent().is('.input-append')) {
            error.appendTo(element.parent())
          } else {
            error.insertAfter(element)
          }
        },
      })
    resetColumnNo()
    // debugger;
    var fromIndex, toIndex
    $('#dataProTable').tableDnD(
      {// 支持拖拽
        onDragClass: 'myDragClass',
        onDrop: function (table, row) {
          // alert(123);

          toIndex = $(row).index()// 移动后的位置
          var targetTR2 = $('#pageProperty #pageTable tbody tr:eq('
            + toIndex + ')')// 同步页面属性,目标元素位置（移动到该元素后面）
          var objTR2 = $('#pageProperty #pageTable tbody tr:eq('
            + fromIndex + ')')// 同步页面属性,

          var targetTR3 = $('#gridProperty #gridTable tbody tr:eq('
            + toIndex + ')')// 同步页面属性,目标元素位置（移动到该元素后面）
          var objTR3 = $('#gridProperty #gridTable tbody tr:eq('
            + fromIndex + ')')// 同步页面属性,
          // 需要移动的元素
          if (fromIndex < toIndex) {
            objTR2.insertAfter(targetTR2)
            objTR3.insertAfter(targetTR3)
          } else {
            objTR2.insertBefore(targetTR2)
            objTR3.insertBefore(targetTR3)
          }
          resetColumnNo()
        },
        onDragStart: function (table, row) {
          fromIndex = $(row).index()// 移动前的位置
        },
      })
  },
})

function doSubmit (callback) {
  if (!validForm.form())
    return false
  var advancedSort = $('#advancedProperty>tbody input[name*=Sort]')
  for (var i = 0; i < advancedSort.length; i++) {
    if (!!!advancedSort[i].value) {
      toastr.error('高级属性排序字段不能为空，请填写后再保存！', '校验失败')
      $(javaFieldIpt).focus()
      $(advancedSort[i]).focus()
      return false
    }
  }

  var pageBody = $('#pageTable>tbody')
  var showTypeList = pageBody.find('select[name*=showType]')
  for (var i = 0; i < showTypeList.length; i++) {
    var item = showTypeList[i]
    // 字段校验
    if (item.value === 'orgselect' || item.value === 'userselect'
      || item.value === 'gridselect' || item.value === 'treeselect') {
      var javaFieldIpt = pageBody.find('input[name*=javaField]')[i]
      if (javaFieldIpt.value.indexOf('|') === -1) {
        toastr.error('java属性名称格式不正确，请修正后再保存！', '校验失败')
        $(javaFieldIpt).focus()
        return false
      }
    } else if (item.value === 'select' || item.value === 'multipleselect'
      || item.value === 'radiobox' || item.value === 'checkbox') {
      var dictTypeIpt = pageBody.find('input[name*=dictType]')[i]
      if (!!!dictTypeIpt.value) {
        toastr.error('字典类型不能为空，请填写后再保存！', '校验失败')
        $(dictTypeIpt).focus()
        return false
      }
    }

    // 表格选择及树选择自定义内容校验
    var propBody = $('#gridTable>tbody')
    if (item.value === 'gridselect' || item.value === 'treeselect') {
      var tableNameIpt = propBody.find('input[name*=tableName]')[i]
      if (!!!tableNameIpt.value) {
        toastr.error('自定义Java对象来源表未定义，请添加后再保存！', '校验失败')
        $(tableNameIpt).focus()
        return false
      }
      var fieldKeysIpt = propBody.find('input[name*=fieldKeys]')[i]
      if (!!!fieldKeysIpt.value) {
        toastr.error('自定义Java对象字段未指定，请添加后再保存！', '校验失败')
        $(fieldKeysIpt).focus()
        return false
      }
      if (item.value === 'gridselect') {
        var fieldLabelsIpt = propBody.find('input[name*=fieldLabels]')[i]
        if (!!!fieldLabelsIpt.value) {
          toastr.error('自定义Java对象字段说明未填写，请添加后再保存！', '校验失败')
          $(fieldLabelsIpt).focus()
          return false
        }
        var searchLabelIpt = propBody.find('input[name*=searchLabel]')[i]
        if (!!!searchLabelIpt.value) {
          toastr.error('自定义Java对象查询字段说明未填写，请添加后再保存！', '校验失败')
          $(searchLabelIpt).focus()
          return false
        }
        var searchKeyIpt = propBody.find('input[name*=searchKey]')[i]
        if (!!!searchKeyIpt.value) {
          toastr.error('自定义Java对象查询字段未填写，请添加后再保存！', '校验失败')
          $(searchKeyIpt).focus()
          return false
        }
      }
    }
  }

  // 其他自定义Java类型校验
  var javaFieldList = pageBody.find('select[name*=javaField]')
  for (var i = 0; i < javaFieldList.length; i++) {
    var item = javaFieldList[i]
    var showType = pageBody.find('select[name*=showType]')[i]
    if (item.value.indexOf('|') != -1 && showType != 'orgselect'
      && showType != 'userselect') {
      var tableNameIpt = propBody.find('input[name*=tableName]')[i]
      if (!!!tableNameIpt.value) {
        toastr.error('自定义Java对象来源表未定义，请添加后再保存！', '校验失败')
        $(tableNameIpt).focus()
        return false
      }
    }
  }

  // 修改主键
  var primaryKey = $('form#inputForm select#primaryKey')
  var pkField = primaryKey[0].selectedOptions[0].text
  if (!!primaryKey.val()) {
    var isPkList = pageBody.find('input[type=checkbox][name*=isPk]')
    for (var i = 0; i < isPkList.length; i++) {
      var nameList = pageBody.find('input[name*=name]')
      if (nameList[i].value === pkField) {
        isPkList[i].checked = true
      } else {
        isPkList[i].checked = false
      }
    }
  } else {
    toastr.error('主键字段不能为空！', '校验失败')
    primaryKey.focus()
    return false
  }

  // 自定义准备
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
  formAjaxSubmit($('#inputForm'), callback, inputFormVm.entity)
}

function resetColumnNo () {
  $('#dataProperty #dataProTable tbody tr').each(
    function (index, element) {
      $(this).find(
        'span[name*=columnList],select[name*=columnList],input[name*=columnList]').each(
        function () {
          var name = $(this).attr('name')
          var names = name.split('.')
          var attr_name = names[1]
          if (names.length > 2)
            attr_name = attr_name + '.'
              + names[2]
          var newName = 'columnList[' + index
            + '].' + attr_name
          $(this).attr('name', newName)// 重新对name排序
          if (name.indexOf('.sort') >= 0) {
            $(this).val(index + 1)
            $(this).next().text(index + 1)
          }
        })
    })
}

/**
 * javaType自定义方法
 *
 * @param selection
 */
function javaTypeChanged (selection) {
  if (selection.value === 'Custom') {
    var prompt = null
    top.layer.open({
      title: '请输入自定义的类全名',
      btn: ['确定'],
      content: '<input type="text" class="layui-layer-input" value="">',
      skin: 'layui-layer-prompt layer-ext-moon layer-ext-moon-prompt',
      success: function (layero) {
        prompt = layero.find('.layui-layer-input')
        prompt.focus()
      },
      yes: function (index) {
        var value = prompt.val()
        if ('' === value) {
          prompt.focus()
        } else if (value.length > 500) {
          layer.tips('类全名长度不得超过500字符', prompt, {
            tips: 1,
          })
        } else {
          $customClass = $('<option value=\'\' selected></option>')
          // 设置填写的自定义类名
          $customClass.val(value)
          $customClass.text(value.substr(value.lastIndexOf('.') + 1,
            value.length))
          $($(selection)[0]).append($customClass)
          top.layer.close(index)
        }
      },
      cancel: function (index) {
        selection.selectedIndex = getOptionIndex(selection, 'String')
        top.layer.close(index)
      },
    })
  }
}

/**
 * showType自定义方法
 *
 * @param selection
 */
function showTypeChanged (selection) {
  // 获取当前行
  var index = selection.name.split('[')[1].split(']')[0]
  var column = inputFormVm.entity.columnList[index]
  var currentRow = $(selection.parentElement.parentElement)
  var javaTypeSel = currentRow.find('select[name*=javaType]')[0]
  var javaFieldIpt = currentRow.find('input[name*=javaField]')[0]
  // 设置单位、用户、表格及树选择组件的自动修正
  if (selection.value === 'orgselect') {
    column.javaType = 'com.set.direwolf.sys.entity.Org'
    column.javaField = 'org.id|orgName'
  } else if (selection.value === 'userselect') {
    column.javaType = 'com.set.direwolf.sys.entity.User'
    column.javaField = 'user.id|userName'
  } else {
    if (column.javaField.indexOf('|') !== -1) {
      column.javaField = ''
    }
    if (selection.value === 'webuploader') {
      column.genTableColumnUi.isList = '0'
      column.genTableColumnUi.isQuery = '0'
      column.javaType = 'String'
    } else if (selection.value === 'textarea') {
      column.javaType = 'String'
      column.genTableColumnUi.isList = '0'
    } else if (selection.value === 'dateselect') {
      column.javaType = 'java.util.Date'
    } else if (selection.value === 'gridselect' || selection.value === 'treeselect') {
      var customIndex = getOptionIndex(javaTypeSel, 'Custom')
      if (javaTypeSel.selectedIndex < customIndex) {// 大于等于7表示用户已自行修改过该值，无需自动修正
        column.javaType = 'Custom'
        $(javaTypeSel).trigger('change')
      }
    } else {
      column.javaType = 'String'
    }
  }
  disableCustomObjFields(selection.value, javaFieldIpt.value, index)
}

/**
 * 对自定义Java对象页签的填写进行限制
 *
 * @param showType
 * @param javaField
 * @param index
 */
function disableCustomObjFields (showType, javaField, index) {
  var propBody = $('#gridTable>tbody')
  var tableNameIpt = propBody.find('input[name*=tableName]')[index]
  var fieldLabelsIpt = propBody.find('input[name*=fieldLabels]')[index]
  var fieldKeysIpt = propBody.find('input[name*=fieldKeys]')[index]
  var searchLabelIpt = propBody.find('input[name*=searchLabel]')[index]
  var searchKeyIpt = propBody.find('input[name*=searchKey]')[index]
  if (showType === 'treeselect') {
    tableNameIpt.disabled = ''
    fieldLabelsIpt.disabled = 'disabled'
    fieldKeysIpt.disabled = ''
    searchLabelIpt.disabled = 'disabled'
    searchKeyIpt.disabled = 'disabled'
  } else if (showType === 'gridselect') {
    tableNameIpt.disabled = ''
    fieldLabelsIpt.disabled = ''
    fieldKeysIpt.disabled = ''
    searchLabelIpt.disabled = ''
    searchKeyIpt.disabled = ''
  } else {
    if (javaField.indexOf('|') !== -1 && showType !== 'orgselect'
      && showType !== 'userselect') {
      tableNameIpt.disabled = ''
    } else {
      tableNameIpt.disabled = 'disabled'
    }
    fieldLabelsIpt.disabled = 'disabled'
    fieldKeysIpt.disabled = 'disabled'
    searchLabelIpt.disabled = 'disabled'
    searchKeyIpt.disabled = 'disabled'
  }
}

/**
 * 获取指定类型在下拉框列表中的位置
 *
 * @param selection
 * @param type
 * @returns {Number}
 */
function getOptionIndex (selection, type) {
  var typeIndex = -1
  $.each(selection.options, function (i, item) {
    if (item.text === type) {
      typeIndex = item.index
    }
  })
  return typeIndex
}
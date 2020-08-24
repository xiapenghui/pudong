var url = location.search; // 获取url中"?"符后的字串
var ipLimit = getQueryString("ipLimit", url);

var ipLimitArry = new Array();
if (ipLimit != "") {
	ipLimitArry = ipLimit.split(",");
}

var ipLimitJson = new Array();
for (var i = 0; i < ipLimitArry.length; i++) {
	var ipObject = new Object();
	ipObject.ip = ipLimitArry[i];
	ipLimitJson.unshift(ipObject);
}
var ipLimitSelectContentVm = new Vue({
  el: '#ipLimitSelectContent',
  data: function () {
    return {
      /**
       * 页面加载状态
       */
      pageLoading: true,
      /**
       * 页面查看类型
       */
      editType: GetQueryString('editType'),
      /**
       * 页面字典列表
       */
      pageDictMap: {},
    }
  },
  methods: {},
  mounted: function () {
    window.operateEvents = {
      'click .remove' : function(e, value, row, index) {
        $('#ipTable').bootstrapTable('remove', {
          field : 'ip',
          values : [ row.ip ]
        });
      }
    };

    var $addIpBtn = $('#addIpBtn');
    $addIpBtn.click(function() {
      addIPBtnHandler();
    });

    $('#ipTable').bootstrapTable({
      columns : [ {
        field : 'ip',
        title : 'IP',
        align: 'center',
        valign: 'middle'
      }, {
        field : 'operate',
        title : '操作',
        align : 'center',
        valign: 'middle',
        events : operateEvents,
        formatter : operateFormatter
      } ],
      data : ipLimitJson
    });
	}
})


//新增ip地址
function addIPBtnHandler() {
	var ipStr = $("#ipTxt").val();
	if (ipStr == "") {
		toastr.warning("IP地址不能为空！");
		return;
	} else if (!/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/.test(ipStr)) {
		toastr.warning("非法的IP地址！");
		return;
	}
	var ipStrObject = new Object();
	ipStrObject.ip = ipStr;

	var isIn = contains(ipLimitJson, ipStrObject);
	if (isIn) {
		toastr.warning('该IP已经存在，请不要重复添加！');
	} else {
		 ipLimitJson.unshift(ipStrObject);
		 $('#ipTable').bootstrapTable("load",ipLimitJson);
		/*$("#ipTable").bootstrapTable('insertRow', {
			index : 0,
			row : {
				ip : ipStr
			}
		});*/
	}
	$("#ipTxt").val("");
}

function operateFormatter(value, row, index) {
	var deleteTable = "<div title='删除' style='float: center; cursor: pointer;margin:3px;'	class='ui-pg-div ui-inline-edit' "
			+ " onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') >"
			+ "<span class='ui-icon glyphicon glyphicon-remove red remove' style='text-indent: 0px;'></span></div>";
	return deleteTable;
}

// 确认
// 子系统添加管理员确认自定义js
function doSubmit(callback) {
	var ipLimitback = "";
	for (var i = 0; i < ipLimitJson.length; i++) {
		if (i == 0) {
			ipLimitback = ipLimitback + ipLimitJson[i].ip;
		} else {
			ipLimitback = ipLimitback + "," + ipLimitJson[i].ip;
		}
	}
	var data = {
		ipLimitback : ipLimitback,
		message : "IP限制调整成功"
	};
	return data;
	// var idx = layer.load(1, {
	// shade : [ 0.4, '#FFF' ]
	// });
	// layer.close(idx);
}

//判断ip是否已存在
function contains(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i].ip === obj.ip) {
			return true;
		}
	}
	return false;
}

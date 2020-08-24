var validateForm;
		function doSubmit(callback){//回调函数，在编辑和保存动作时，供openDialog调用提交表单。
		  if(validateForm.form()){
			  formAjaxSubmit($("#orgResForm"), function(result){
				  callback(result);
			  });
			  return true;
		  }
		  return false;
		}
		$(function() {
			validateForm = $("#orgResForm").validate({
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
	if($("#orgResForm").height() < $("#orgResForm").context.defaultView.innerHeight){
		$($("#orgResForm").context.firstElementChild).height($("#inputForm").context.defaultView.innerHeight);
	}
	
	
		});
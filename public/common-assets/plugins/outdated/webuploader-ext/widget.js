/**
 * 封装dialog
 */
var Platform = function(config){
	this.initImgMapping();
};
Platform.prototype={
	/**
	 * 初始化图片映射文件
	 */
	initImgMapping:function(){
		this.mappingArray=[],this.imgArray=['jpg','bmp','png','gif','jpeg','icon'];
		this.mappingArray['docx']=this.mappingArray['doc']="/common-assets/plugins/outdated/webuploader-ext/img/filetype/docx.png";
		this.mappingArray['xlsx']=this.mappingArray['xls']="/common-assets/plugins/outdated/webuploader-ext/filetype/xlsx.png";
		this.mappingArray['pptx']=this.mappingArray['ppt']="/common-assets/plugins/outdated/webuploader-ext/filetype/pptx.png";
		this.mappingArray['accdb']="/common-assets/plugins/outdated/webuploader-ext/filetype/accdb.png";
		this.mappingArray['avi']="/common-assets/plugins/outdated/webuploader-ext/filetype/avi.png";
		this.mappingArray['css']="/common-assets/plugins/outdated/webuploader-ext/filetype/css.png";
		this.mappingArray['eml']="/common-assets/plugins/outdated/webuploader-ext/filetype/eml.png";
		this.mappingArray['eps']="/common-assets/plugins/outdated/webuploader-ext/filetype/eps.png";
		this.mappingArray['fla']="/common-assets/plugins/outdated/webuploader-ext/filetype/fla.png";
		this.mappingArray['html']="/common-assets/plugins/outdated/webuploader-ext/filetype/html.png";
		this.mappingArray['ind']="/common-assets/plugins/outdated/webuploader-ext/filetype/ind.png";
		this.mappingArray['ini']="/common-assets/plugins/outdated/webuploader-ext/filetype/ini.png";
		this.mappingArray['jsf']="/common-assets/plugins/outdated/webuploader-ext/filetype/jsf.png";
		this.mappingArray['midi']="/common-assets/plugins/outdated/webuploader-ext/filetype/midi.png";
		this.mappingArray['mov']="/common-assets/plugins/outdated/webuploader-ext/filetype/mov.png";
		this.mappingArray['mp3']="/common-assets/plugins/outdated/webuploader-ext/filetype/mp3.png";
		this.mappingArray['mpeg']="/common-assets/plugins/outdated/webuploader-ext/filetype/mpeg.png";
		this.mappingArray['pdf']="/common-assets/plugins/outdated/webuploader-ext/filetype/pdf.png";
		this.mappingArray['proj']="/common-assets/plugins/outdated/webuploader-ext/filetype/proj.png";
		this.mappingArray['psd']="/common-assets/plugins/outdated/webuploader-ext/filetype/psd.png";
		this.mappingArray['pst']="/common-assets/plugins/outdated/webuploader-ext/filetype/pst.png";
		this.mappingArray['pub']="/common-assets/plugins/outdated/webuploader-ext/filetype/pub.png";
		this.mappingArray['rar']="/common-assets/plugins/outdated/webuploader-ext/filetype/rar.png";
		this.mappingArray['readme']="/common-assets/plugins/outdated/webuploader-ext/filetype/readme.png";
		this.mappingArray['settings']="/common-assets/plugins/outdated/webuploader-ext/filetype/settings.png";
		this.mappingArray['text']="/common-assets/plugins/outdated/webuploader-ext/filetype/text.png";
		this.mappingArray['tiff']="/common-assets/plugins/outdated/webuploader-ext/filetype/tiff.png";
		this.mappingArray['url']="/common-assets/plugins/outdated/webuploader-ext/filetype/url.png";
		this.mappingArray['vsd']="/common-assets/plugins/outdated/webuploader-ext/filetype/vsd.png";
		this.mappingArray['wav']="/common-assets/plugins/outdated/webuploader-ext/filetype/wav.png";
		this.mappingArray['wma']="/common-assets/plugins/outdated/webuploader-ext/filetype/wma.png";
		this.mappingArray['wmv']="/common-assets/plugins/outdated/webuploader-ext/filetype/wmv.png";
		this.mappingArray['zip']="/common-assets/plugins/outdated/webuploader-ext/filetype/zip.png";
		this.mappingArray['default']="/common-assets/plugins/outdated/webuploader-ext/filetype/default.png";
	},
	/**
	*	参数为{}包括属性：
	*		beforDeleteHandler:$.noop 回调参数为当前dialog的jquery对象
	*/
	showDeleteDialog:function(deleteDialogParam){
		var self = this;
		deleteDialogParam = !!deleteDialogParam?deleteDialogParam:{};
		deleteDialogParam = $.extend({},{
			beforDeleteHandler:$.noop
		},deleteDialogParam);
		$( "#dialog-delete-confirm" ).removeClass('hide').dialog({
			resizable: false,
			modal: true,
			title_html: true,
			title:"<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-warning red'></i> 删除提示</h4></div>",
			buttons: [
				{
					html: "<i class='icon-trash bigger-110'></i>&nbsp;删除",
					"class" : "btn btn-danger btn-xs",
					click: function() {
						if(!!deleteDialogParam.beforDeleteHandler){
							var cb = deleteDialogParam.beforDeleteHandler.call(self,$( this ));
							if(typeof cb==='boolean'&&!cb){
								return false;
							}
						}
						$( this ).dialog( "close" );
					}
				},{
					html: "<i class='icon-remove bigger-110'></i>&nbsp;取消",
					"class" : "btn btn-xs",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});
	},
	/**
	*	参数为{}包括属性：
	*		selectedHandler:(选则之后的回调)$.noop 回调参数为当前dialog的jquery对象
	*		title:弹出框显示的标题
	*		content:显示的内容
	*/
	showContentDialog:function(param){
		var self = this,dialog = $('#dialog-template').clone();
		param = !!param?param:{};
		param = $.extend(true,{},{
			title:'提示！',
			content:'',
			selectedHandler:$.noop,
			cancleHandler:$.noop,
			option:{}
		},param);
		dialog.append((typeof param.content==='string'?$(param.content):param.content).removeClass('hide')).removeClass('hide').dialog($.extend(true,{},{
			resizable: false,
			modal: true,
			title_html: true,
			title:"<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-info-circle blue'></i>"+param.title+"</h4></div>",
			buttons: [
				{
					html: "<i class='ace-icon fa fa-check'></i>&nbsp;确定",
					"class" : "btn btn-danger btn-xs",
					click: function() {
						if(!!param.selectedHandler){
							var cb = param.selectedHandler.call(self,$( this ));
							if(typeof cb==='boolean'&&!cb){
								return false;
							}
						}
						$( this ).dialog( "close" );
					}
				},{
					html: "<i class='icon-remove bigger-110'></i>&nbsp;取消",
					"class" : "btn btn-xs",
					click: function() {
						if(!!param.selectedHandler){
							var cb = param.cancleHandler.call(self,$( this ));
							if(typeof cb==='boolean'&&!cb){
								return false;
							}
						}
						$( this ).dialog( "close" );
					}
				}
			]
		},param.option));
	},
	/**
	 * 按照文件后缀名获取文件类型
	 */
	getImgMapingImg:function(attach){
		if(this.imgArray.join(' ').indexOf(attach.ext)!=-1){
			return WEB_ROOT+"/sys/attachment/readImageStreamId?id="+attach.id;
		}else if(!!this.mappingArray[attach.ext]){
			return this.mappingArray[attach.ext];
		}else{
			return this.mappingArray['default'];
		}
	},
	/**
	 * 按照URL生成缩略图
	 */
	generateThumbnails:function(attach,cwidth,cheight,callback){
		var url = this.getImgMapingImg(attach),
			task = new $.Deferred(),dataURL,self=this;
		if(this.imgArray.join(' ').indexOf(attach.ext)!=-1){
			var canvas = document.createElement('canvas'),
			context,
			img = new Image();
			context = canvas.getContext('2d');
			img.onload=function(){
				var scale = Math[ true ? 'max' : 'min' ]( cwidth / img.width,cheight / img.height );
				// 不允许放大。
                false || (scale = Math.min( 1, scale ));
                canvas.width = cwidth;
				canvas.height = cheight;
                cwidth = img.width * scale;
                cheight = img.height * scale;
                
				var cropX = (canvas.width-cwidth)/2,
					cropY = (canvas.height-cheight)/2;
//				context.drawImage(img,cropX,cropY,cwidth,cheight,0,0,cwidth,cheight); 
				context.drawImage.apply( context, [img,cropX,cropY,cwidth,cheight] );
				dataURL = canvas.toDataURL('image/jpeg'); 
				task.resolve();
			};
			img.src=url;
		}else{
			dataURL = url;
			task.resolve();
		}
		$.when(task).done(function(){
			callback.call(self, dataURL); 
		});
	},
	/**
	 * 获取cookie中的url
	 */
	getCookieUrl:function(){
		var menu = getCookie('currentMenu');
		if(!!menu){
			return menu.split('&')[1];
		}
		return undefined;
	}
};

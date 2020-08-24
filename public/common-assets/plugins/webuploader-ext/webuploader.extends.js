(function( $ ){
	platform = new Platform();
	$.fn.webuploader=function(options){
		return new widget.webuploader(options,$(this));
	};
	var requestAuth = 'Bearer ' + sessionStorage.getItem('Authorization')
	var widget = widget||{};   // 用户会话信息
	widget.webuploader = function(options,container){
		var uploaderOptions = $.extend(true,widget.webuploader.defaults,options);
		
		$.extend(true,this,{
				'container':container,
				'uploaderOptions':uploaderOptions,
				// 图片容器
	            $queue : $( '<ul class="ace-thumbnails clearfix"></ul>' )
	                .appendTo( container.find( '.queueList' ) ),
	                /*
                   * $queue : $( '<ul class="filelist"></ul>' ) .appendTo(
                   * container.find( '.queueList' ) ),
                   */
	            // 状态栏，包括进度和控制按钮
	            $statusBar : container.find( '.statusBar' ),
	            // 文件总体选择信息。
	            $info : container.find( '.statusBar' ).find( '.info' ),
	            // 上传按钮
	            $upload : $( '.uploadBtn',container.closest('.wrapper_wu') ),
	            // 没选择文件之前的内容。
	            $placeHolder : container.find( '.placeholder' ),
	            $progress : container.find( '.statusBar' ).find( '.progress' ).hide(),
	            // 添加的文件数量
	            fileCount : 0,
	            // 添加的文件总大小
	            fileSize : 0,
	            // 优化retina, 在retina下这个值是2
	            // ratio : window.devicePixelRatio || 1,
	            // 缩略图大小
	            thumbnailWidth : 100 * (window.devicePixelRatio || 1),
	            thumbnailHeight : 100 * (window.devicePixelRatio || 1),
	            // 可能有pedding, ready, uploading, confirm, done.
	            state : 'pedding',
	            // 所有文件的进度信息，key为file id
	            percentages : {},
	            $itemLi : $('<li id="">\
								<a href="" data-rel="colorbox">\
									<img src="" onerror="this.src=\'/common-assets/plugins/webuploader-ext/profile-pic.jpg\'"/>\
									<div class="text">\
										<div class="inner"></div>\
									</div>\
								</a>\
								<div class="tools tools-bottom">\
									<a href="javascript:void(0);" title="下载">\
										<i class="ace-icon fa fa-download"></i>\
									</a>\
									<a href="javascript:void(0);" title="向左转">\
									<i class="ace-icon fa fa-rotate-left"></i>\
									</a>\
									<a href="javascript:void(0);" title="向右转" style="display:none">\
										<i class="ace-icon fa fa-rotate-right"></i>\
									</a>\
									<a href="javascript:void(0);" title="确定" style="display:none">\
										<i class="ace-icon fa fa fa-check"></i>\
									</a>\
									\
								</div>\
								<div class="progress progress-striped pos-rel" data-percent="0%">\
									<div class="progress-bar progress-bar-success"></div>\
								</div>\
							</li>'),
				// 图片上进度条类型，取值有[small_process:附属在缩略图底部小进度条模式,适合图片上传,
				// pull_curtain:拉幕模式,上传进度从缩略图底部出现一个遮罩层]
				processType:''
			});
		this.init();
	};
	// 图片上进度条类型
	widget.webuploader.processType={
		SMALL_PROCESS:'small_process',
		PULL_CURTAIN:'pull_curtain'
	};
	widget.webuploader.prototype={
		/**
     * 初始化webuploader控件
     */
		init:function(){
			var self = this;
			
			// 检测浏览器是否支持flash
			self.checkFlashSupport();
			
			// 设置上传进度条类型
			self.processTypeEvent();
			// 选择上传模式
			self.uploadModeTypeEvent();
			
			// 注册上传事件
			self.webuploaderRegister();
            // WebUploader实例
            self.uploader = WebUploader.create(self.uploaderOptions);
            // 绑定各种事件
            self.bindEvent();
            
			self.$upload.addClass( 'state-' + self.state );
			self.updateTotalProgress();
			
			var delNode;
			if(self.uploaderOptions.viewDel=="true"){
				delNode=$('<a href="javascript:void(0);" title="删除" style="display:none">\
					<i class="ace-icon fa fa-times red"></i>\
				</a>');
			}else{
				delNode=$('<a href="javascript:void(0);" title="删除">\
					<i class="ace-icon fa fa-times red"></i>\
				</a>');
			}
			self.$itemLi.find(".tools-bottom").append(delNode);
		},
		/**
     * 处理上传进度条展示类型
     */
		processTypeEvent:function(){
			var self=this,processTypeEventObj=[];
			processTypeEventObj[widget.webuploader.processType.SMALL_PROCESS]=function(){
				$('.progress',self.$itemLi).height(18);
			};
			processTypeEventObj[widget.webuploader.processType.PULL_CURTAIN]=function(){
				$('.progress-bar',self.$itemLi).css({
					width:'100%'
				});
				$('.progress',self.$itemLi).css({
	        		  position: 'absolute',
	            	  bottom: 0,
	            	  width: '100%',
	            	  opacity: 0.5,
	            	  height:'0px',
	            	  'margin-bottom': '0px'
	        	});
			};
			// 设置默认小进度条模式
			self.processType=self.uploaderOptions.processType||widget.webuploader.processType.SMALL_PROCESS;
			processTypeEventObj[self.processType]&&processTypeEventObj[self.processType]();
		},
		/**
     * 设置模式
     */
		uploadModeTypeEvent:function(){
			var self = this,modeTypeProcess=[];
			// 定义类型处理事件
			modeTypeProcess['thumbnails']=function(){
				self.$itemLi.css({
					'max-width':'150px',
					'max-height':'100px'
				});
			};
			// 头像模式
			modeTypeProcess['single_pic']=function(){ 
				$( '.btn_p',self.container.closest('.wrapper_wu') ).hide(); 
				self.$statusBar.remove();
				self.$itemLi.find('.tools-bottom').css({
					'padding-top':'0px'
				}).find('a').eq(2).show();
				self.container.closest('.wrapper_wu').css({'width':'180px'});
				self.$placeHolder.css({
					'background-position-y':'20px',
					'min-height':'0px',
					'padding-top':'100px'
				});
				$.extend(self.uploaderOptions,{pick:{
					id:'#'+self.uploaderOptions.dataField+'filePicker',
					button:$('#'+self.uploaderOptions.dataField+'single_pic_btn').show()
				}});
				self.thumbnailWidth=160;
				self.thumbnailHeight=180;
			};
			modeTypeProcess['process']=function(){
				var processContainer = $('<div class="col-xs-10"></div>'),
					toolContainer = $('<div class="col-xs-1"></div>'),
					liContainer = $('<div class="row"></div>');
				$('a[data-rel="colorbox"]',self.$itemLi).wrap('<div class="col-xs-1"></div>');
				$('div.text',self.$itemLi).insertAfter(
					$('.progress',self.$itemLi).css({
						position:'relative'
					}).wrap(processContainer)
				);
				$('div.tools',self.$itemLi)
				.remove().appendTo(self.$itemLi)
				.wrap(toolContainer)
				.find('a').hide().eq(3).show();
				self.$itemLi.css({
					width:'100%',
					border:'0px',
					'border-bottom':'1px solid #838383'
				}).children().wrapAll(liContainer.css({
										'z-index':2
									})
				);
				self.$placeHolder.css({
					border:'0px',
					'min-height':'0px',
					'padding-top':'0px'
				});
				self.container.find( '.queueList' ).css({'margin':'0px'});
			};
			// 执行模式选择
			modeTypeProcess[self.uploaderOptions.modeType]&&modeTypeProcess[self.uploaderOptions.modeType]();
		},
		/**
     * 加载初始化文件列表
     */
		loadingItems:function(items){
			var webUploaderFile,self = this,files=[];
			// 增加文件加载状态
			WebUploader.File.Status.LOADING='loading';
			if(items.length>0){
				for(var i = 0 ; i < items.length ; i++){
					// items[i].lastModifiedDate = new
          // Date(items[i].lastModifiedDate.time);
					webUploaderFile = new WebUploader.File(items[i]);
					webUploaderFile.id = items[i]['id'];
					webUploaderFile.setStatus(WebUploader.File.Status.LOADING);
		        	files.push(webUploaderFile);
				}
				self.uploader.addFiles(files);
			}
		},
		/**
     * 增加文件方法
     */
		addFile:function(file){
			var self = this,
			$li = this.$itemLi.clone();
			$li.find("a[data-rel]").attr("href","javascript:void(0)");
			$li.find("a[data-rel]").on("click",function(){
				var imgid=$(this).closest('li').attr('id'); 
				if(!imgid||imgid.startsWith('WU_FILE')){
					top.layer.msg("已上传文件才可预览或下载!");
					return
				}
				if (file.type.startsWith("image") || file.ext == "png"
								|| file.ext == "jpg") { 
					var imgUrl=WEB_ROOT+'/sys/attachment/readImageStreamId?id='+imgid;
					top.layer.open({
						type : 2,
						title : "查看图片",
						shadeClose : true,
						maxmin:true,
						shade : 0.3,
						area : [ '480px', '380px' ],
						content : imgUrl
					});
				}else{
					window.location=WEB_ROOT+'/sys/attachment/download?id='+$(this).closest('li').attr('id');
				}
			});
			$li.attr('id',file.id);
			var $imgA=$('<a href="javascript:void(0)" class="downloada">'+file.name+'</a>');
			$li.find('div.inner').append($imgA);
			
			self.processFile(file,$li);

            file.rotation = 0;
            
			$li.find('.tools-bottom a').on( 'click', 'i', function() {
                var index = $(this).parent().index(),
                    deg;

                switch ( index ) {
                    case 4:
                        self.uploader.removeFile( file );
                        return;
                    case 2:
                    	self.uploader.upload();
                        return;
                        
                    case 1:
                        file.rotation += 90;
                        break;

                    case 0:
// file.rotation -= 90;
                    	var fileId=$(this).closest('li').attr('id');
                    	if(fileId.indexOf("WU_FILE")>-1){
                    		top.layer.msg("该文件还没有上传，不能从服务器下载");
                    		break;
                    	}
                    	window.location=WEB_ROOT+'/sys/attachment/download?id='+$(this).closest('li').attr('id');
                        break;
                }

                if ( self.supportTransition() ) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $li.find('img').css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                	$li.find('img').css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                }
            });
            
            $li.appendTo( self.$queue );
		},
		/**
     * 增加文件时处理文件信息
     */
		processFile:function(file,$li){
			var self = this;
			file.on('statuschange', function( cur, prev ) {
                if ( prev === 'progress' ) {
                	// self.updateProgress($('.progress',$li),0);
                }

                // 成功
                if ( cur === 'error' || cur === 'invalid' ) {
                    self.showError( file.statusText,$li.find('.info'));
                    self.percentages[ file.id ][ 1 ] = 1;
                } else if ( cur === 'interrupt' ) {
                    self.showError( 'interrupt',$li.find('.info'));
                } else if ( cur === 'queued' ) {
                	self.percentages[ file.id ][ 1 ] = 0;
                } else if ( cur === 'progress' ) {
                	$li.find('.info').remove();
                } else if ( cur === 'complete' ) {
                    $li.append( '<span class="success"></span>' );
                }
            });

            // 如果是初始化已上传文件列表时
            if ( !(file.getStatus() === WebUploader.File.Status.LOADING) ) {
            	self.percentages[ file.id ] = [ file.size, 0 ];
            	self.setState( 'ready' );
            	if ( file.getStatus() === 'invalid' ) {
                    self.showError( file.statusText,$info);
                } else {
                    self.uploader.makeThumb( file, function( error, src ) {

                        if ( error ) {
                            $('img',$li).attr('src',platform.getImgMapingImg({ext:file.ext}));
                            return;
                        }

                        if( self.isSupportBase64() ) {
                            $('img',$li).attr('src',src);
                        }
                    }, self.thumbnailWidth, self.thumbnailHeight );
                }
            }else{
            	platform.generateThumbnails(file,self.thumbnailWidth,self.thumbnailHeight,function(thum){
            		$('img',$li).attr('src',thum);
            	})
            	self.percentages[ file.id ] = [ file.size, file.size ];
            	self.uploader.skipFile(file);
            	self.setState( 'confirm' );
            	self.updateProgress($('.progress',$li), 100);
				self.setAttachmentId(file.id);
            }
		},
		/**
     * 设置上传成功的文件ID
     */
		setAttachmentId:function(fileId){
			var self = this;
			// 初始化已上传的id值
			var fileIds = $(self.uploaderOptions.fileIdContainer).val();
			if(!!!fileIds||fileIds.indexOf(fileId)==-1)
				$(self.uploaderOptions.fileIdContainer).val(fileIds===''?fileId:(fileIds+','+fileId));
		},
		/**
     * 上传成功回调函数
     */
		uploadSuccessEvent:function(file,response){
			if(!!!response)return false;
			var self = this;
			file.path = response.path;
			$('li#'+file.id).attr('id',response.id);
			file.updateFileId(response.id);
		},
		/**
     * 绑定各种事件
     */
		bindEvent:function(){
			var self = this;
			// 拖拽时不接受 js, txt 文件。
	        self.uploader.on( 'dndAccept', function( items ) {
	            var denied = false,
	                len = items.length,
	                i = 0,
	                // 修改js类型
	                unAllowed = 'text/plain;application/javascript ';
	
	            for ( ; i < len; i++ ) {
	                // 如果在列表里面
	                if ( ~unAllowed.indexOf( items[ i ].type ) ) {
	                    denied = true;
	                    break;
	                }
	            }
	
	            return !denied;
	        });
	
	        self.uploader.on('ready', function() {
	            window.uploader = self.uploader;
	        });
	
	        self.uploader.onUploadProgress = function( file, percentage ) {
	            var $li = $('#'+file.id),
	                $percent = $li.find('.progress');
	            self.updateProgress($percent,Math.round( percentage * 100 ));
	            self.percentages[ file.id ][ 1 ] = percentage;
	            self.updateTotalProgress();
	        };
	        
	        self.uploader.onFileQueued = function( file ) {
	        	self.fileCount++;
	        	self.fileSize += parseInt(file.size);
	
	            if ( self.fileCount === 1 ) {
	            	self.$placeHolder.addClass( 'element-invisible' );
	            	self.$statusBar.show();
	            }
	
	            self.addFile( file );
	            self.updateTotalProgress();
	        };
	
	        self.uploader.onUploadBeforeSend = function(object,data,headers) {
	        	$.extend(true,data,self.uploaderOptions.overFormData);
	        };
	        
	        self.uploader.onUploadSuccess = function(file,response) {
                self.uploadSuccessEvent(file,response);
	        };
	        
	        self.uploader.onUploadFinished = function() {
	        	var completeFils = self.uploader.getFiles(WebUploader.File.Status.COMPLETE),fileIdArray=[];
	        	for(var i=0; i<completeFils.length; i++){
					if(fileIdArray.indexOf(completeFils[i]['id'])==-1)
						fileIdArray.push(completeFils[i]['id']);
	        	}
	        	$(self.uploaderOptions.fileIdContainer).val(fileIdArray.join(','));
	        };
	        
	        self.uploader.onFileDequeued = function( file ) {
	        	self.fileCount--;
	        	self.fileSize -= parseInt(file.size);
	
	            if ( !self.fileCount ) {
	            	self.setState( 'pedding' );
	            }
	
	            self.removeFile( file );
	            self.updateTotalProgress();
	
	        };
	
	        self.uploader.on( 'all', function( type ) {
	            var stats;
	            switch( type ) {
	                case 'uploadFinished':
	                	self.setState( 'confirm' );
	                    break;
	
	                case 'startUpload':
	                	self.setState( 'uploading' );
	                    break;
	
	                case 'stopUpload':
	                	self.setState( 'paused' );
	                    break;
	
	            }
	        });
	
	        self.uploader.onError = function( code ) {
	        	switch(code){
	        		case 'F_DUPLICATE':
	        			alert( 'Error:不能选择重复的文件！');
	        			break;
	        		case 'F_EXCEED_SIZE':
	        			alert('Error:上传的单个文件大小超过限制');
	        			break;
	        		case 'Q_EXCEED_SIZE_LIMIT':
	        			alert('Error:上传的总文件大小超过限制');
	        			break;
	        		default:
	        			alert('未知错误！');
	        	}
	        };
	        
	        self.$upload.on('click', function() {
	            if ( $(this).hasClass( 'disabled' ) ) {
	                return false;
	            }
	
	            if ( self.state === 'ready' ) {
	                self.uploader.upload();
	            } else if ( self.state === 'paused' ) {
	                self.uploader.upload();
	            } else if ( self.state === 'uploading' ) {
	                self.uploader.stop(true);
	            }
	        });
	
	        self.$info.on( 'click', '.retry', function() {
	            self.uploader.retry();
	        } );
	
	        self.$info.on( 'click', '.ignore', function() {
	            alert( 'todo' );
	        } );
// $(document).on('click','.downloada',function(e){
// if(!$(e.target).text()==$(this).text()){
// return;
// }
// window.location=WEB_ROOT+'/sys/attachment/download?id='+$(this).closest('li').attr('id');
//	        	
// });
		},
		/**
     * 按照上传状态控制样式的展示
     */
		setState:function(val){
			var file, stats,self=this;
			
            if ( val === self.state ) {
                return;
            }

            self.$upload.removeClass( 'state-' + self.state );
            self.$upload.addClass( 'state-' + val );
            self.state = val;

            switch ( self.state ) {
                case 'pedding':
                	self.$placeHolder.removeClass( 'element-invisible' );
                	self.$queue.hide();
                	self.$statusBar.addClass( 'element-invisible' );
                    self.uploader.refresh();
                    break;

                case 'ready':
                	self.$placeHolder.addClass( 'element-invisible' );
                    $( '#input-upload' ).removeClass( 'element-invisible');
                    self.$queue.show();
                    self.$statusBar.removeClass('element-invisible');
                    self.uploader.refresh();
                    break;

                case 'uploading':
                    $( '#input-upload' ).addClass( 'element-invisible' );
                    self.$progress.show();
                    $('#upload-type',self.$upload).text( '暂停上传' );
                    break;

                case 'paused':
                	self.$progress.show();
                	$('#upload-type',self.$upload).text( '继续上传' );
                    break;

                case 'confirm':
                	self.$progress.hide();
                    $( '#input-upload' ).removeClass( 'element-invisible' );
                    $('#upload-type',self.$upload).text( '开始上传' );

                    stats = self.uploader.getStats();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                    	self.setState( 'finish' );
                        return;
                    }
                    break;
                case 'finish':
                    if ( self.fileCount>0 ) {
                    	
                    }
                    break;
            }

            self.updateStatus();
		},
		/**
     * 修改上传之后的提示信息
     */
		updateStatus:function(){
			var text = '', stats;
			
            if ( this.state === 'ready' ) {
                text = '选中' + this.fileCount + '个文件，共' +
                        WebUploader.formatSize( this.fileSize ) + '。';
            } else if ( this.state === 'confirm' ) {
                stats = this.uploader.getStats();
                if ( stats.uploadFailNum ) {
                    text = '已成功上传' + stats.successNum+ '个文件到服务器，'+
                        stats.uploadFailNum + '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
                }

            } else {
                stats = this.uploader.getStats();
                text = '共' + this.fileCount + '个（' +
                        WebUploader.formatSize( this.fileSize )  +
                        '），已上传' + stats.successNum + '个';

                if ( stats.uploadFailNum ) {
                    text += '，失败' + stats.uploadFailNum + '个';
                }
            }

            this.$info.html( text );
		},
		/**
     * 修改上传文件总大小，修改进度条展示上传进度
     */
		updateTotalProgress:function(){
			var loaded = 0,
            total = 0,
            percent;

	        $.each( this.percentages, function( k, v ) {
	            total += v[ 0 ];
	            loaded += v[ 0 ] * v[ 1 ];
	        } );
	
	        percent = total ? loaded / total : 0;
	
	
	        this.updateProgress(this.$progress,Math.round( percent * 100 ),true);
	        this.updateStatus();
		},
		/**
     * 修改上传进度展示 processType进度条类型，默认是小进度条
     */
		updateProgress:function(progress,num,total){
			if(this.processType===widget.webuploader.processType.SMALL_PROCESS||total){
				$('.progress-bar',progress).css('width',num+'%');
			}else if(this.processType===widget.webuploader.processType.PULL_CURTAIN){
				progress.height(num+'%');
				if(num===100){
					progress.css({
						opacity:0
					});
				}
			}
			progress.attr('data-percent',num+'%');
        	return progress;
		},
		/**
     * 删除上传文件
     */
		removeFile:function(file){
			var self = this;
			if(!!file.id&&file.id.indexOf('WU_FILE')==-1)
				$.ajax({
	                type: "POST"
	                , url: self.uploaderOptions.deleteServer
	                , data: {
	                    id: file.id
	                },
					headers: { Authorization: requestAuth},
	                async:false
	            }).done(function(data){
	            });
			var $li = $('#'+file.id);
			
			// 上传字段处减少删除的fild id
			var fileIds=$(self.uploaderOptions.fileIdContainer).val().split(",");
			$(self.uploaderOptions.fileIdContainer).val(fileIds.filter(function(elem, pos){
				return elem!=file.id;
			}).join(","));
			
            delete self.percentages[ file.id ];
            self.updateTotalProgress();
            $li.off().find('.tools-bottom a').off().end().remove();
		},
		/**
     * 队列数据重置
     */
		queueReset:function(){
			this.$queue.html('');
			this.setState('pedding');
			this.uploader.reset();
		},
		/**
     * 展现错误信息
     */
		showError:function(code,$info){
			switch( code ) {
	            case 'exceed_size':
	                text = '文件大小超出';
	                break;
	            case 'interrupt':
	                text = '上传暂停';
	                break;
	            default:
	                text = '上传失败，请重试';
	                break;
	        }
	
	        $info.text( text ).appendTo( this.$li );
		},
		/**
     * 预处理webuploader的设置选项
     */
		pretreatmentOptions:function(file){
			// 如果开启了智能上传和分片上传并且上传文件大小已满足分片条件则选择分片上传
			if(this.uploaderOptions.autoSelectServer
					&&this.uploaderOptions.chunked
					&&(file.size>=this.uploaderOptions.chunkedMaximumSize)){
				this.uploader['options']['chunked']=true;
			}else{
				this.uploader['options']['chunked']=false;
			}
		},
		webuploaderRegister:function(){
			var self = this,startDate;
			WebUploader.Uploader.register({
	            "before-send-file": "beforeSendFile"
	            , "before-send": "beforeSend"
	            , "after-send-file": "afterSendFile"
	        }, {
	            beforeSendFile: function(file){
	            	startDate = new Date().getTime();
	                // 秒传验证
	                var task = new $.Deferred();
	                (new WebUploader.Uploader()).md5File(file, 0, 10*1024*1024).progress(function(percentage){
	                    // console.log(percentage);
	                }).then(function(val){
	                    self.uploader['options']['formData']['md5'] = file['md5Mark'] = val;
	
	                    $.ajax({
	                        type: "POST"
	                        , url: WEB_ROOT+'/sys/attachment/md5Check'
	                        , data: {
	                            md5: val,
	                            chunked:self.uploader['options']['chunked']||false
	                        },
	                        headers: { Authorization: requestAuth},
												cache: false
	                        , timeout: 1000 // todo 超时的话，只能认为该文件不曾上传过
	                        , dataType: "json"
	                    }).then(function(data, textStatus, jqXHR){
	
	
	                        if(!!data){   // 若存在，这返回失败给WebUploader，表明该文件不需要上传
	                            task.resolve();
	                            self.uploader.skipFile(file);
	                            file.path = data.path;
	                            self.updateProgress($('.progress',$('li#'+file.id)), 100);
								self.uploadSuccessEvent(file,data);
	                            // UploadComlate(file);
	                        }else{
	                            task.resolve();
	                            self.pretreatmentOptions(file);
	                        }
	                    }, function(jqXHR, textStatus, errorThrown){    // 任何形式的验证失败，都触发重新上传
	                        task.resolve();
	                    });
	                });
	                return $.when(task);
	            }
	            , beforeSend: function(block){
	            	if(self.uploader['options']['chunked']){
	            		// 分片验证是否已传过，用于断点续传
	                    var task = new $.Deferred();
	                    $.ajax({
	                        type: "POST"
	                        , url: WEB_ROOT+'/sys/attachment/chunkCheck'
	                        , data: {
	                            chunkIndex: block.chunk
	                            , chunkSize: block.end - block.start
	                            , name: block.file.name
	                            , lastModifiedDate:block.file.lastModifiedDate 
	                            , type:block.file.type
	                            , size:block.file.size
	                        }
	                        , cache: false
	                        ,
												headers: { Authorization: requestAuth}, timeout: 1000 // todo 超时的话，只能认为该分片未上传过
	                        , dataType: "json"
	                    }).then(function(data, textStatus, jqXHR){
	                        if(data){   // 若存在，返回失败给WebUploader，表明该分块不需要上传
	                            task.reject();
	                        }else{
	                            task.resolve();
	                        }
	                    }, function(jqXHR, textStatus, errorThrown){    // 任何形式的验证失败，都触发重新上传
	                        task.resolve();
	                    });
	
	                    return $.when(task);
	            	}
	            }
	            , afterSendFile: function(file){
	            	if(self.uploader['options']['chunked']){
	            		var chunksTotal = 0;
	                    if((chunksTotal = Math.ceil(file.size/self.uploader['options']['chunkSize'])) > 1){
	                        // 合并请求
	                        var task = new $.Deferred();
	                        $.ajax({
	                            type: "POST"
	                            , url: WEB_ROOT+'/sys/attachment/chunksMerge'
	                            , data: {
	                            	name:file.name
	                                , chunks: chunksTotal
	                                , ext: file.ext
	                                , md5: file['md5Mark']
	                                , type:file.type
	                                , superId:self.uploaderOptions.superId
	                                , lastModifiedDate:file.lastModifiedDate
	                                , size:file.size
	                            }
	                            ,
														headers: { Authorization: requestAuth}, cache: false
	                            , dataType: "json"
	                        }).then(function(data, textStatus, jqXHR){
	
	                            // todo 检查响应是否正常
	                            task.resolve();
	                            
                                // console.log("上传文件'"+file.name+"'总耗时: "+((new
                                // Date().getTime()) - startDate)/1000+'秒');
	                            // UploadComlate(file);
	
	                        }, function(jqXHR, textStatus, errorThrown){
	                            task.reject();
	                        });
	
	                        return $.when(task);
	                    }else{
	                        // UploadComlate(file);
	                    }
	            	}
	            }
	        });
		},
		isSupportBase64:function(){
			// 判断浏览器是否支持图片的base64
			var data = new Image();
            var support = true;
            data.onload = data.onerror = function() {
                if( this.width != 1 || this.height != 1 ) {
                    support = false;
                }
            }
            data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
		},
		flashVersion:function(){
			// 检测是否已经安装flash，检测flash的版本
			var version;

            try {
                version = navigator.plugins[ 'Shockwave Flash' ];
                version = version.description;
            } catch ( ex ) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                            .GetVariable('$version');
                } catch ( ex2 ) {
                    version = '0.0';
                }
            }
            version = version.match( /\d+/g );
            return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
		},
		supportTransition:function(){
			var s = document.createElement('p').style,
            r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
	        s = null;
	        return r;
		},
		checkFlashSupport:function(){
			if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {
				var $wrap=$().wrap;
	            // flash 安装了但是版本过低。
				// if (flashVersion) {
	            if (this.flashVersion()) {
	                (function(container) {
	                    window['expressinstallcallback'] = function( state ) {
	                        switch(state) {
	                            case 'Download.Cancelled':
	                                alert('您取消了更新！')
	                                break;
	
	                            case 'Download.Failed':
	                                alert('安装失败')
	                                break;
	
	                            default:
	                                alert('安装已成功，请刷新！');
	                                break;
	                        }
	                        delete window['expressinstallcallback'];
	                    };
	
	                    var swf = WEB_ROOT+'/static/webuploader/webuploader-0.1.5/examples/image-upload/expressInstall.swf';
	                    // insert flash object
	                    var html = '<object type="application/' +
	                            'x-shockwave-flash" data="' +  swf + '" ';
	
	                    if (WebUploader.browser.ie) {
	                        html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
	                    }
	
	                    html += 'width="100%" height="100%" style="outline:0">'  +
	                        '<param name="movie" value="' + swf + '" />' +
	                        '<param name="wmode" value="transparent" />' +
	                        '<param name="allowscriptaccess" value="always" />' +
	                    '</object>';
	
	                    $(container).html(html);
	
	                })($wrap);
	
	            // 压根就没有安转。
	            } else {
	                $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
	            }
	
	            return false;
	        } else if (!WebUploader.Uploader.support()) {
	            alert( 'Web Uploader 不支持您的浏览器！');
	            return false;
	        }
		},
		getImgMapingImg:function(attach){
			if(this.imgArray.join(' ').indexOf(attach.ext)!=-1){
				return WEB_ROOT+"/sys/attachment/readImageStreamId?id="+attach.id;
			}else if(!!this.mappingArray[attach.ext]){
				return this.mappingArray[attach.ext];
			}else{
				return this.mappingArray['default'];
			}
		}
	};
	widget.webuploader.defaults={
		swf: '/common-assets/plugins/webuploader-0.1.5/Uploader.swf',
		pick: {
            id: '#input-upload',
            label: '点击选择文件'
        },
        fileIdContainer:''
	};
		
})( jQuery );

function initWebUploader() {
	$(".uploader-container").each(function(){
		var $container=$(this);
		var field=$container.attr("data-field");
		var config = $.extend({
			// 展现方式(类型有['thumbnails:缩略图模式','single_pic:单图片模式','process:进度条模式'])
			// 当设置single_pic模式时，auto属性设置为true，否则无法自动触发上传操作
			modeType:'thumbnails',
			dataField:field,
			// 进度条类型,详细参数见js
			processType:'',
			// 初始化或者上传完之后文件id隐藏容器(自定义)
			fileIdContainer:$("#"+field),
			method:'post',
			// 设置的formData值都要覆盖默认的上传自带值
			overFormData:{
				workspace:$("#"+field+"-workspace").val(),
				storeType:$("#"+field+"-storeType").val(),
				path:$("#"+field+"-path").val()
			},
			// 文件上传过程中每次都提交的数据
			formData:{},
			// 文件上传过程中文件所属ID(自定义)
			superId:'',
			auto:false,
			fileVal:'fileInput',
			dnd: '#'+field+'dndArea',
			paste: $('#'+field+'-input-upload'),
			chunked: false,
			// 默认分片大小
			chunkSize:5 * 1024 * 1024,
			// 智能选择server上传(如果是上传文件有可能小于指定分片大小的话必须开启智能上传)(自定义)
			autoSelectServer:'true',
			// 大于指定文件大小之后才用分片进行上传(默认5M)(自定义)
			chunkedMaximumSize:5 * 1024 * 1024,
			// 上传服务
			server:WEB_ROOT+"/sys/attachment/uploadFile",
			// 删除服务(自定义)
			deleteServer:WEB_ROOT+"/sys/attachment/deleteAttachment",
			// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
			disableGlobalDnd: false,
			fileNumLimit: 50,
			fileSizeLimit: 2*1024 * 1024 * 1024,
			fileSingleSizeLimit: 1*1024 * 1024 * 1024,
			prepareNextFile: true,
			threads:6,
			duplicate: false,
			thumb:{
				// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
				allowMagnify: false,
				// 是否允许裁剪。
				crop: true
			},
			compress:false,
			pick: {
				id:'#'+field+'-input-upload',
				innerHTML: '<i class="el-icon-plus"></i><span>选择文件</span>'
			}
		}, $container.data());
		var webuploader =$container.webuploader(config);
		$('#'+field+'-cancle-upload').on('click',function(){
			// webuploader.queueReset();
			// 移除所有缩略图并将上传文件移出上传序列
			for (var i = 0; i < uploader.getFiles().length; i++) {
				// 将图片从上传序列移除
// uploader.removeFile(uploader.getFiles()[i]); // 发送删除图片请求到后台
// uploader.removeFile(uploader.getFiles()[i], true);
				// delete uploader.getFiles()[i];
				// 将图片从缩略图容器移除
				var $li = $('#' + uploader.getFiles()[i].id);
				$li.off().remove();
			}

			webuploader.setState('pedding');


			// 重置uploader，目前只重置了文件队列
			uploader.reset();
			// 更新状态等，重新计算文件总个数和总大小
			webuploader.updateStatus();
			// 重置文件总个数和总大小
			webuploader.fileCount = 0;
			webuploader.fileSize = 0;
		});
		// 初始化上传文件信息列表
		var ids=$("#"+field).val();
		if(!!ids){
			$.ajax({
				url: WEB_ROOT+"/sys/attachment/findByIds?ids="+ids,
				headers: { Authorization: requestAuth},
				method: 'get',
				success: function (data) {
					if(!!data) {webuploader.loadingItems(data);}
				}
			})
			// $.get(WEB_ROOT+"/sys/attachment/findByIds?ids="+ids,function(data){
			// 	if(!!data) {webuploader.loadingItems(data);}
			// });
		}

	}) ;
}

$(function() {

	/** ****webuploader 初始化****** */
	initWebUploader()


})

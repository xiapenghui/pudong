//浦东二期外网
bigScreen：
		api:
		   apiData.js  //前台接口方法名文件
		   apis.js     //前台接口路径
		   backApuData.js //后台接口方法名文件
		   backApis.js //后台接口路径
		components:    //共用组件
					baidumap:
							assets:
								  mock: //静态json资源文件
							control: //地图按钮控制组件	
							detailed:
									DetailInfo.vue   //表格弹窗组件 
							 layerYS://地图弹窗业务层
							 tables://表格表头封装文件
							 tips://地图弹窗组件
								 bzdxInfo.vue://保障对象通道监拍弹框
								 ErrorTips.vue://错误信息弹框
								 HplcInfo.vue://智能电表弹出框
								 LunboInfo.vue://附件上传轮播信息弹窗
								 NopicInfo.vue://通道监拍异常画面弹框
								 PicInfo.vue://通道监正常正常拍弹框
								 ShowInfo.vue://tips弹框
								 WarnInfo.vue://错误信息弹框		 
				BzgkListSection.vue://保障概况模块（左上部分）
				BzgkSenction.vue://保障概况模块（左下部分）
				BzrwSection.vue://保障对象模块
				CarDetailed.vue://车辆信息弹窗模块
				CenterControl.vue://地图中控模块父组件
				CenterOne.vue: //组件设备综合监控
				CenterTwo.vue: //智能风险监测
				CenterThree.vue: //作业安全管控
				CenterFour.vue: //资源集约管控
				GzpSection.vue://作业安全管控工作票情况模块
				Header.vue://头部轮播组件
				JpzzSection.vue://行为检测模块
				JrgzSection.vue://今日工作情况模块
				MapSection.vue://地图组件
				messageTotal.vue://弹窗统计信息模块（已注释--暂时不用）
				SbjcSection.vue://设备感知模块
				SgdwSection.vue://资源集约管控，施工队伍模块
				TdjpSection.vue://通道监拍轮播模块
				WarnLine.vue://地图中控数据进度条模块
				XczySection.vue://作业安全管控父组件（包含今日工作情况和工作票组件）
				XsqxSection.vue://缺陷监控模块
				XsyhSection.vue://隐患监控模块
				YchmSection.vue://异常画面模块
				ZnbdDetailed.vue://保电弹窗（东郊宾馆）
				ZnjgSection.vue://智能井盖轮播
				ZyjkSection.vue://资源集约管控下半部分
		mixins:                    
			  table.js  //分页封装
		
 //城运中心项目
cityRunCenter：同上结构一样
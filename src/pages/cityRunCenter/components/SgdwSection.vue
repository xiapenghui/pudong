<template>
	<div class="sourceBox">
		<div class="sourceHead">施工队伍</div>
		<div class="sourceBody">
			<div class="echartsTitle">总数：<strong>{{ constAll }}</strong></div>
			<div id="constEchart" class="forEcharts etype5"></div>
		</div>
		<detail-info :columns="tableColumns" :dataSource="tableData" :currentPage="currentPage" :hasIndex="true" :isShow="isShow"
		 :handTitle="handTitle" :loading="loading" :total="total" :pageSize="pageSize" @showClose="onClose" @current-change="onCurrentChange" @onhand-click="onhandClick"></detail-info>
	</div>
</template>

<script>
	import {
		wgs2bd
	} from "./baidumap/utils/Convert"; //坐标转换
	import eventBus from "./baidumap/base/EventBus";
	import DetailInfo from "./baidumap/detailed/DetailInfo"; //工作票情况信息弹窗,
	import table from "../mixins/table" //引入表格混入
	export default {
		mixins: [table],
		components: {
			DetailInfo
		},
		name: 'zyjkSection',
		data() {
			return {
				handTitle: '标题',
				loading: false, //加载中...
				tableData: [],
				tableColumns: [], 
				isShow: false,
				// 施工队伍echarts options
				constOption: {
					backgroundColor: '',
					tooltip: {
						// trigger: 'axis',
						trigger: 'item',
						axisPointer: {
							type: 'shadow'
						},
					},
					legend: {
						data: ['出动'],
						orient: 'horizontal',          // 布局方式，默认为水平布局，可选为：
						x: 'center',                // 水平安放位置，默认为全图居中，可选为：
						y: 'top',              // 垂直安放位置，默认为全图顶端，可选为：

						itemWidth: 25,             // 图例图形宽度
						itemHeight: 15,            // 图例图形高度
						textStyle: {
							color: '#fff',
						    fontSize: 15// 图例文字颜色
						}
					},
					grid: {
						top: 10,
						left: 140
					},
					xAxis: [{
						type: 'value',
						splitLine: {
							show: false,
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#FFFFFF',
							}
						},
						axisLabel: {
							show: false,
						}
					}, ],
					yAxis: [{
						type: 'category',
						data: ['查岗人', '管理人', '工作许可人', '工作负责人'],

						axisLabel: {
							show: true,
							color: '#fff',
							fontSize: 16,
						},
						splitLine: {
							show: false,
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#fff',
							},
						},
						axisTick: {
							show: false
						},
					}, {
						type: 'category',
						data: ['查岗人', '管理人', '工作许可人', '工作负责人'],
						axisLabel: {
							show: false,
							color: '#fff',
							fontSize: 14,
						},
						splitLine: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#fff',
							},
						},
						axisTick: {
							show: false
						},
					}, ],
					series: [{
						    name: '出动',
							type: 'bar',
							data: [20, 30, 10, 25],
							barWidth: '20%',
							z: 2,
							itemStyle: {
								barBorderRadius: 50,
								color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: 'rgba(239,76,134,1)'
								}, {
									offset: 1,
									color: 'rgba(246,201,62,1)'
								}]),
								label: {
									show: true,
									position: 'right',
									textStyle: {
										color: '#ffffff',
										fontSize: 12
									}
								}
							},
						},
						{

							type: 'bar',
							yAxisIndex: 1,
							// barGap: '-100%',
							data: [79, 82, 90, 101],
							barWidth: '20%',
							z: 0,
							itemStyle: {
								barBorderRadius: 50,
								color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: 'rgba(109,76,239,1)'
								}, {
									offset: 1,
									color: 'rgba(62,145,246,1)'
								}]),
							},
							label: {
								normal: {
									show: true,
									position: 'right',
									color: '#ffffff',
									fontSize: 16
								}
							}
						},
					]
				},

				// 施工队伍echarts data
				constData: [
					[20, 30, 10, 22],
					[79, 82, 90, 101]
				],
				// 施工队伍总数
				constAll: 0,
			
				sgdwtableColumns: [
					{
					    hasSort: false, //<Boolean> 是否排序
						isCustomize: true, //<Boolean> 是否自定义
						prop: 'operate', //<String>  对应属性名
						label: '操作', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'personName', //<String>  对应属性名
						label: '姓名', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketNum', //<String>  对应属性名
						label: '工作完成量', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_class_name', //<String>  对应属性名
						label: '完成任务数', //<String>   表头标签
					}
				
				],
				
				
				tableData: [
				],

			}

		},

		methods: {
			// echarch图点击明细
			onClickNum(obj) {
				this.newObj = obj;
				this.isShow = true;
				this.loading = true;
				this.tableColumns = this.sgdwtableColumns;
				let  personType;
				if (obj == "工作负责人") {
                    this.handTitle = "工作负责人";
					personType="wkresponser"
				}
				else if (obj=="工作许可人") {
                    this.handTitle = "工作许可人";
					personType="wkapprover"
				}
				else if (obj=="管理人") {
				    this.handTitle = "管理人";
					personType="manage"
				}
				else if (obj=="查岗人") {
				    this.handTitle = "查岗人";
					personType="supervisor"
				}
			   this.$$utils.axiosRequest(
			   	'/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?status=-1&limit=' +
			   	this.pageSize + '&offset=' + this.offset + '&personType=' + personType, '施工队伍明细').then(
			   	result => {
			   		console.log('施工队伍明细', result)
			   		this.tableData = result.data.list;
			   		this.total = result.data.count;
			   		this.loading = false;
			   
			   	});
			},



			//页面echarts图表渲染事件
			renderEchart(el, option, data) {
				if (el && option) {
					if (data) {
						for (let i = 0; i < data.length; i++) {
							option.series[i].data = data[i];
						}
					}
					// 基于准备好的dom，初始化echarts实例
					let myChart = this.$echarts.init(document.getElementById(el));
					myChart.setOption(option);
					let _this = this;
					myChart.on("click", function(params) {
						console.log("paramssss", params)
						_this.onClickNum(params.name)
					})
				}
			},
			
			
			// 施工队伍坐标定位
			onhandClick(row) {
				console.log(row)
				console.log(row.longitude)
				console.log(row.latitude)
				let layer = {
					id: row.personName, //定位对象id
					layerName: "ConstructionSiteLayer", //定位图层
					zoom: 18, //定位图层
					point: {
						lng: row.longitude,
						lat: row.latitude
					}
				}
				eventBus.emit("layer-flyClickTips", {
					layer
				}); //隐患缺陷图层定位
			},
			
			
		},

		mounted() {
			//施工队伍echarts图表---echarts
			this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorStats', '获取当前施工现场人员出动情况').then(result => {
				console.log("result",result)
				let wkresponser = result.data.onlineMap.wkresponser;
				let supervisor = result.data.onlineMap.supervisor;
				let wkapprover = result.data.onlineMap.wkapprover;
				let manage = result.data.onlineMap.manage;
				let wkresponser_total = result.data.totalMap.wkresponser;
				let supervisor_total = result.data.totalMap.supervisor;
				let wkapprover_total = result.data.totalMap.wkapprover;
				let manage_total = result.data.totalMap.manage;
				manage_total = isNaN(manage_total) ? 0 : manage_total;
				supervisor_total = isNaN(supervisor_total) ? 0 : supervisor_total;
				wkapprover_total = isNaN(wkapprover_total) ? 0 : wkapprover_total;
				wkresponser_total = isNaN(wkresponser_total) ? 0 : wkresponser_total;
				
				this.constAll = wkresponser_total +supervisor_total + wkapprover_total + manage_total;
				
				this.constData = [
					[supervisor, manage, wkapprover, wkresponser],
					[supervisor_total, manage_total, wkapprover_total, wkresponser_total]
				];
				this.renderEchart('constEchart', this.constOption, this.constData);
			});

		}
	}
</script>

<style scoped>
	.subSourceBox {
		width: 50%;
		height: 100%;
		float: left;
	}

	.subSourceHead {
		height: 69px;
		padding-top: 25px;
		box-sizing: border-box;
		line-height: 44px;
		background: url("../assets/images/ic_4G.png") no-repeat left 10px bottom;
	}

	.subSourceBox:nth-of-type(2) .subSourceHead {
		background: url("../assets/images/ic_AR.png") no-repeat left 10px bottom;
		box-sizing: border-box;
		margin-left: 30px;
		width: calc(100% - 30px);
	}

	.subSourceBox:nth-of-type(2) .subSourceHead .subTitle {
		margin-left: 70px;
	}

	.subSourceHead span {
		display: inline-block;
		float: left;
	}

	.subSourceHead .subTitle {
		margin-left: 60px;
		color: #ffffff;
		font-size: 26px;
	}

	.subSourceHead .titleTail {
		width: 2px;
		height: 28px;
		background: #ffffff;
		margin: 9px 14px 0 9px;
	}

	.subSourceHead .subText {
		font-size: 18px;
		color: #ffffff;
		padding-right: 10px;
		height: 44px;
		padding-top: 10px;
		line-height: 34px;
	}

	.subSourceHead .subNum {
		font-size: 22px;
		color: #00a0e9;
		font-weight: bold;
		padding-right: 20px;
		height: 44px;
		padding-top: 10px;
		line-height: 38px;
	}

	.subSourceBody {
		width: 100%;
		height: calc(100% - 69px);
		position: relative;
	}

	.sourceUl {
		width: 100%;
		height: 187px;
		position: absolute;
		left: 0;
		top: 50%;
		-webkit-transform: translateY(-50%);
		-moz-transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		-o-transform: translateY(-50%);
		transform: translateY(-50%);
		box-sizing: border-box;
		padding-left: 44px;
	}

	.sourceLi {
		width: 146px;
		height: 100%;
		margin-right: 32px;
		float: left;
	}

	.sourceLiCon {
		background: rgba(37, 62, 106, 0.5);
		border: 1px solid #2b73bf;
		box-sizing: border-box;
		width: 100%;
		height: 134px;
		line-height: 132px;
		text-align: center;
		font-size: 48px;
		color: #13b6ff;
	}

	.sourceLiText {
		font-size: 18px;
		color: #ffffff;
		height: 40px;
		line-height: 40px;
		margin-top: 12px;
		text-align: center;
	}

	/* 明细弹出框 */
	.sectionBody8 {
		position: relative;
	}

	.sectionBody8 .workBox {
		position: absolute;
		top: 0;
		left: 40px;
		width: 1160px;
		height: 410px;
	}

	.workBox /deep/ .el-table th, 
	.workBox /deep/ .el-table td{
			padding: 17px 0;
		}
</style>

<template>
	<div class="sourceBlock">
		<div class="sourceHead">今日工作情况</div>
		<div class="sourceBody">
			<div class="sourceSplit">
				<div class="todayWorkBox">

					<div style="width: 110px;height: 220px; position: absolute;left: 200px; top: 100px;">
						<div class="histogram_box">
							<div class="histogram_tp">

								<div class="histogram_bin">
									<div class="dgsbox" @click="onClickNum('dgsbox')">
										<div class="dgstext">到岗数</div>
										<div class="dgsnumber">{{ todaySumm.manage }}</div>
									</div>
								</div>
							</div>
							<div class="bottoms">
								<div class="histogram_md" style="height: 0%">
									<div class="histogram_bin top">
										<div class="cgsbox" @click="onClickNum('cgsbox')">
											<div class="cgstext">查岗数</div>
											<div class="cgsnumber">{{ todaySumm.supervisor }}</div>
										</div>
									</div>
									<div class="histogram_bin bottom">
									</div>
									<div class="left_box">
										<div class="left_box_len">
											<span></span>
										</div>
										<div class="planbox" @click="onClickNum('planbox')">
											<div class="planone">今日临时</div>
											<div class="plantwo">开工数</div>
											<div class="plannumber">{{ todaySumm.temporaryNum }}</div>
										</div>
									</div>
								</div>
								<div class="histogram_bo" style="height: 0%">
									<div class="histogram_bin">
									</div>
									<div class="right_box">
										<div class="right_box_len">
											<span></span>
										</div>
										<div class="txt_box">
											<div class="newbox" @click="onClickNum('newbox')">
												<div class="newone">今日计划</div>
												<div class="newtwo">开工数</div>
												<div class="newnumber">{{ todaySumm.planNum }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bottom_box" @click="onClickNum('bottom_box')">
					<div class="bottom_text">今日计划数</div><span class="dian">:</span>
					<div class="bottom_number"><span>{{ planTotal[0] }}</span><span>{{ planTotal[1] }}</span><span>{{ planTotal[2] }}</span></div>
				</div>
			</div>
			<div class="sourceSplit" id="yibiaoEcharts"></div>
		</div>

		<detail-info :columns="tableColumns" :dataSource="tableData" :currentPage="currentPage" :hasIndex="true" :isShow="isShow"  :handTitle="handTitle"
		:loading="loading"	:total="total" :pageSize="pageSize" @showClose="onClose" @current-change="onCurrentChange" @onhand-click="onhandClick"></detail-info>

		<div class="shixuBtn" @click="controlShixu">时序图</div>
		<div class="shixuBox" :class="{active: shixuActive}">
			<div class="shixuHead">分时工作量</div>
			<div id="shixuEcharts" class="shixuEcharts"></div>
		</div>
	</div>
</template>
<script>
	$(window).load(function() {
		$(".histogram_md").css("height", "30%");
		$(".histogram_bo").css("height", "30%");
	});
	import DetailInfo from "./baidumap/detailed/DetailInfo"; //工作票情况信息弹窗,
	import table from "../mixins/table" //引入表格混入
	import {
		wgs2bd
	} from "./baidumap/utils/Convert"; //坐标转换
	import eventBus from "./baidumap/base/EventBus";
	export default {
		mixins: [table],
		components: {
			DetailInfo
		},
		name: 'jrgzSection',
		data() {
			return {
				handTitle:'标题',
				loading:false,//加载中...
				tableData: [],
				tableColumns: [],
				todaySumm: {
					manage: 24,
					planNum: 0,
					planTotal: 124,
					signStats: 10,
					supervisor: 13,
					temporaryNum: 10,
				},
				// 控制时序图的展示
				shixuActive: false,

				// 时序图echarts options
				shixuOptions: {
					backgroundColor: '',
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#57617B'
							}
						}
					},
					color: ['#A12CDD', '#0163F8', '#47FFFF'],
					legend: {
						icon: 'rect',
						itemWidth: 14,
						itemHeight: 5,
						itemGap: 13,
						data: ['工作量', '到岗数', '查岗数'],
						textStyle: {
							fontSize: 12,
							color: '#FFFFFF'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#FFFFFF'
							}
						},
						data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
					}],
					yAxis: [{
						type: 'value',
						name: '单位（%）',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#FFFFFF'
							}
						},
						axisLabel: {
							margin: 10,
							textStyle: {
								fontSize: 14
							}
						},
						splitLine: {
							show: false,
							lineStyle: {
								color: '#F03738'
							}
						}
					}],
					series: [{
						name: '工作量',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 5,
						showSymbol: false,
						lineStyle: {
							normal: {
								//color:'rgba(71, 255, 255, 1)',
								width: 0.1
							}
						},
						areaStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: 'rgba(161, 44, 221, 1)'
								}, {
									offset: 0.8,
									color: 'rgba(161, 44, 221, 0.1)'
								}], false),
								shadowColor: 'rgba(161, 44, 221, 0.5)',
								shadowBlur: 10
							}
						},
						data: [320, 332, 301, 334, 390, 330, 300]
					}, {
						name: '到岗数',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 5,
						showSymbol: false,
						lineStyle: {
							normal: {
								//color:'rgba(71, 255, 255, 1)',
								width: 0.1
							}
						},
						areaStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: 'rgba(1, 99, 248, 1)'
								}, {
									offset: 0.8,
									color: 'rgba(1, 99, 248, 0.1)'
								}], false),
								shadowColor: 'rgba(1, 99, 248, 0.5)',
								shadowBlur: 10
							}
						},
						data: [150, 232, 201, 154, 190, 330, 200]
					}, {
						name: '查岗数',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 5,
						showSymbol: false,
						lineStyle: {
							normal: {
								//color:'rgba(71, 255, 255, 1)',
								width: 0.1
							}
						},
						areaStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: 'rgba(71, 255, 255, 1)'
								}, {
									offset: 1,
									color: 'rgba(71, 255, 255, 0.1)'
								}], false),
								shadowColor: 'rgba(71, 255, 255, 0.5)',
								shadowBlur: 10
							}
						},
						data: [290, 330, 220, 182, 191, 234, 100]
					}]
				},

				shixuData: [
					[320, 332, 301, 334, 390, 330, 300],
					[150, 232, 201, 154, 190, 330, 200],
					[290, 330, 220, 182, 191, 234, 100]
				],

				// 仪表盘echarts options
				yibiaoOptions: {
					backgroundColor: '',
					title: [{
						x: "13.5%",
						y: "60%",
						//bottom: 100,
						text: '今日到岗率',
						textStyle: {
							fontWeight: 'normal',
							fontSize: 20,
							color: "#fff"
						},
					}, {
						x: "65.5%",
						y: "94%",
						//bottom: 100,
						text: '今日查岗率',
						textStyle: {
							fontWeight: 'normal',
							fontSize: 20,
							color: "#fff"
						},
					}],
					series: [{
							name: '速度',
							type: 'gauge',
							min: 0,
							max: 100,
							center: ['24%', '38%'], // 默认全局居中
							//splitNumber:11,
							radius: '60%',
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									color: [
										[0.1, '#ff4500'],
										[0.8, '#4EE3FF'],
										[1, 'lime']
									],
									width: 5,
									//shadowColor : '#fff', //默认透明
									shadowBlur: 10
								}
							},
							axisLabel: { // 坐标轴小标记
								textStyle: { // 属性lineStyle控制线条样式
									fontWeight: 'bolder',
									color: '#fff',
									//shadowColor : '#fff', //默认透明
									shadowBlur: 10
								}
							},
							axisTick: { // 坐标轴小标记
								length: 15, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: 'auto',
									width: 3,
									//shadowColor : '#fff', //默认透明
									shadowBlur: 10
								}
							},
							splitLine: { //橙色分割线
								length: 25,
								lineStyle: {
									width: 3,
									color: '#FCD209',
								}
							},
							itemStyle: { //指针颜色
								color: '#1e90ff',
							},
							pointer: { //指针长短
								length: 70
							},
							detail: {
								formatter: '{value}%',
								fontSize: 22,
								fontWeight: 'bold',
								offsetCenter: [0, "60%"],
							},
							data: [{
								value: 40
							}]
						},
						{
							name: '速度',
							type: 'gauge',
							min: 0,
							max: 100,
							center: ['76%', '72%'], // 默认全局居中
							//splitNumber:11,
							radius: '60%',
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									color: [
										[0.1, '#ff4500'],
										[0.8, '#4EE3FF'],
										[1, 'lime']
									],
									width: 5,
									shadowColor: '#fff', //默认透明
									shadowBlur: 10
								}
							},
							axisLabel: { // 坐标轴小标记
								textStyle: { // 属性lineStyle控制线条样式
									fontWeight: 'bolder',
									color: '#fff',
									//shadowColor : '#fff', //默认透明
									shadowBlur: 10
								}
							},
							axisTick: { // 坐标轴小标记
								length: 15, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: 'auto',
									width: 3,
									//shadowColor : '#fff', //默认透明
									shadowBlur: 10
								}
							},
							splitLine: { //橙色分割线
								length: 25,
								lineStyle: {
									width: 3,
									color: '#FCD209',
								}
							},
							itemStyle: { //指针颜色
								color: '#1e90ff',
							},
							pointer: { //指针长短
								length: 70
							},
							detail: {
								formatter: '{value}%',
								fontSize: 22,
								fontWeight: 'bold',
								offsetCenter: [0, "60%"],
							},
							data: [{
								value: '100'
							}]
						}
					]
				},

				// 今日工作情况
				// 到岗数表格
				dgsColumns: [{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'personName', //<String>  对应属性名
						label: '姓名', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: ' ticketType', //<String>  对应属性名
						label: '工作票分类', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'workDate', //<String>  对应属性名
						label: '到岗时间', //<String>   表头标签
					}
				],

				// 今日临时开工数
				planColumns: [{
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
						prop: 'ticketType', //<String>  对应属性名
						label: '工作票分类', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketNo', //<String>  对应属性名
						label: '工作票编号', //<String>   表头标签
					}
				],

				//查岗数
				cgsColumns: [{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'personName', //<String>  对应属性名
						label: '姓名', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketType', //<String>  对应属性名
						label: '工作票分类', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketNo', //<String>  对应属性名
						label: '工作票编号', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'workDate', //<String>  对应属性名
						label: '查岗时间', //<String>   表头标签
					}
				],



				//今日计划开工数
				newColumns: [{
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
						prop: 'ticketType', //<String>  对应属性名
						label: '工作票分类', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketNo', //<String>  对应属性名
						label: '工作票编号', //<String>   表头标签
					}
				],



				// 今日计划数
				bottomColumns: [{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'personName', //<String>  对应属性名
						label: '工作负责人', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketType', //<String>  对应属性名
						label: '工作票分类', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'ticketNo', //<String>  对应属性名
						label: '工作票编号', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'beginTime', //<String>  对应属性名
						label: '计划开工时间', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'endTime', //<String>  对应属性名
						label: '计划结束时间', //<String>   表头标签
					}

				],
			}
		},
		methods: {
			// 修改工作票情况
			rowStyle({
				row,
				rowIndex
			}) {
				if (rowIndex % 2 == 1) {
					return 'color:white;background-color: #122140';
				} else {
					return 'color:white;background-color: #0c1a34';
				}
			},
			// 修改table header的背景色
			tableHeaderColor({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (rowIndex === 0) {
					return 'background-color: #102a4f;color: #a1cbf1;font-size: 14px;'
				}
			},
			onClickNum(obj) {
				this.newObj = obj;
				this.isShow = true;
				this.loading=true;
				let statsType;
				if (obj == 'dgsbox') {
					this.handTitle='到岗数';
					this.tableColumns = this.dgsColumns
					statsType = 'manage'
				} else if (obj == 'cgsbox') {
					this.handTitle='查岗数';
					this.tableColumns = this.cgsColumns
					statsType = 'supervisor'
				} else if (obj == 'planbox') {
					this.handTitle='今日临时开工数';
					this.tableColumns = this.planColumns
					statsType = 'temporaryNum'
				} else if (obj == 'newbox') {
					this.handTitle='今日计划开工数';
					this.tableColumns = this.newColumns
					statsType = 'planNum'
				} else {
					this.handTitle='今日计划数';
					this.tableColumns = this.bottomColumns
					statsType = 'planTotal'
				}
				this.$$utils.axiosRequest(
					'/pdaqfh_Web_exploded/f/sggk/getTodayWorkList?statsType='+statsType+ '&limit=' +
					this.pageSize +'&offset=' + this.offset, '获取今日工作列表').then(result => {
					console.log('获取今日工作列表', result)
					this.total = result.count
					this.tableData = result.list;
					this.loading=false;
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
					
					})
				}
			},


			// 今日临时开工数坐标定位
			onhandClick(row) {
				console.log(row)
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

			controlShixu() {
				this.shixuActive = !this.shixuActive;
				if (this.shixuActive) {
					this.renderEchart('shixuEcharts', this.shixuOptions, this.shixuData);
				}
			},
		},
		computed: {
			planTotal() {
				let str = String(this.todaySumm.planTotal);
				if (str.length === 1) {
					return [0, 0, str];
				} else if (str.length === 2) {
					return [0, str[0], str[1]];
				} else {
					return [str[0], str[1], str[2]];
				}
			},
			yiBiaoData() {
				let manage =  this.todaySumm.manage;
				let supervisor = this.todaySumm.supervisor;
				let planTotal = this.todaySumm.planTotal;
				let temporaryNum = this.todaySumm.temporaryNum;
				manage = isNaN(manage) ? 0 : manage;
				supervisor = isNaN(supervisor) ? 0 : supervisor;
				planTotal = isNaN(planTotal) ? 0 : planTotal;
				temporaryNum = isNaN(temporaryNum) ? 0 : temporaryNum;
				this.todaySumm.manage = manage
				this.todaySumm.supervisor = supervisor
				// let a = Math.floor(parseFloat(this.todaySumm.planTotal/ this.todaySumm.manage) * 100);
				// let b = Math.floor(parseFloat(this.todaySumm.supervisor / this.todaySumm.manage) * 100);
				let a = Math.floor(parseFloat(temporaryNum / manage ) * 100);
				let b = Math.floor(parseFloat(supervisor / manage) * 100);
				a = isNaN(a) ? 0 : a;
				b = isNaN(b) ? 0 : b;
				if(b==Infinity){
					return b=0
				}
				return [
					[{
						value: a
					}],
					[{
						value: b
					}]
				];
			}
		},
		mounted() {

			this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getTodayWorkSummary', '获取今日工作汇总情况').then(result => {		
				this.todaySumm = result.data;
				this.renderEchart('yibiaoEcharts', this.yibiaoOptions, this.yiBiaoData);
			});

			this.$$utils.axiosRequest(
				'/pdaqfh_Web_exploded/f/sggk/getTimeRangeOnlineStats?Date=2018-01-22&beginTime=0&endTime=24', '获取某个时间段内在线人员统计情况').then(
				result => {

					let getShixuData = function(item) {
						let a = item['0'] + item['1'] + item['2'] + item['3'];
						let b = item['4'] + item['5'] + item['6'] + item['7'];
						let c = item['8'] + item['9'] + item['10'] + item['11'];
						let d = item['12'] + item['13'] + item['14'] + item['15'];
						let e = item['16'] + item['17'] + item['18'] + item['19'];
						let f = item['20'] + item['21'] + item['22'] + item['23'];
						return [a, b, c, d, e, f];
					};

					let construct = result.data.construct;
					let manage = result.data.manage;
					let supervisor = result.data.supervisor;

							
					
					this.shixuData = [
						getShixuData(construct),
						getShixuData(manage),
						getShixuData(supervisor),
					];

				});



		},




	}
</script>
<style scoped>
	@import "../../bigScreen/components/baidumap/assets/css/echarts.css";

	.shixuBtn {
		width: 128px;
		height: 36px;
		line-height: 36px;
		text-indent: 54px;
		color: #ffffff;
		font-size: 18px;
		background: #153663 url("../assets/images/ic_sxt.png") no-repeat left 13px center;
		border: 1px solid #2d86c4;
		position: absolute;
		right: 0;
		top: 20px;
		cursor: pointer;
	}

	.shixuBox {
		width: 0;
		height: 0;
		position: absolute;
		right: 0;
		top: 70px;
		background: #0c1a34;
		transition: 0.3s;
		overflow: hidden;
	}

	.shixuBox.active {
		border: 1px solid #2d86c4;
		width: 100%;
		height: 370px;
	}

	.shixuHead {
		width: 100%;
		height: 32px;
		line-height: 32px;
		padding-top: 16px;
		text-indent: 36px;
		color: #00ffff;
		font-size: 20px;
		font-weight: bold;
		position: relative;
		box-sizing: content-box;
	}

	.shixuHead:before {
		display: block;
		content: "";
		width: 8px;
		height: 22px;
		background: #00ffff;
		position: absolute;
		left: 20px;
		bottom: 5px;
	}

	.shixuEcharts {
		width: 898px;
		height: 320px;
	}


	#yibiaoEcharts {
		width: 520px;
		height: 370px;
	}

	.detailContextWrap {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.detailContext {
		position: absolute;
		left: 0;
		top: 0;
		transition: 1.2s linear;
	}

	.detailContext2 {
		top: 100%;
	}


	/* 柱形数据图 */
	.histogram_box .dgsbox {
		position: absolute;
		top: 10px;
		right: 130px;
		width: 80px;
		height: 80px;
		color: #3faa7c;
		text-align: center;
		background-image: url(../assets/images/round_1.png);
		background-repeat: no-repeat;
		background-size: cover;
		font-size: 15px;
	}

	.histogram_box .dgsbox .dgstext {
		padding-top: 25px;
		margin-bottom: 5px;
	}

	.histogram_box .cgsbox {
		position: absolute;
		top: 10px;
		left: 120px;
		width: 60px;
		height: 60px;
		color: #3faa7c;
		text-align: center;
		background-image: url(../assets/images/round_2.png);
		background-repeat: no-repeat;
		background-size: cover;
		font-size: 15px;
	}

	.histogram_box .cgsbox .cgstext {
		padding-top: 15px;
		margin-bottom: 2px;
		font-size: 14px;
	}

	.planbox {
		position: absolute;
		left: 0px;
		top: -20px;
		width: 80px;
		height: 100px;
		color: #3faa7c;
		font-size: 16px;
		line-height: 23px;
		text-align: right;
	}

	.planbox .plannumber,
	.newbox .newnumber {
		font-weight: bold;
		font-size: 18px;
	}

	.newbox {
		position: absolute;
		right: 0px;
		top: -20px;
		width: 80px;
		height: 100px;
		color: #00236e;
		font-size: 16px;
		line-height: 23px;
		text-align: left;
	}

	.bottom_box {
		position: absolute;
		right: 70px;
		bottom: 0;
		font-size: 16px;
		line-height: 23px;
	}

	.bottom_box .bottom_text {
		display: inline-block;
		width: 136px;
		height: 38px;
		background-image: url(../assets/images/square_1.png);
		background-size: contain;
		background-repeat: no-repeat;
		color: #297b90;
		text-align: center;
		line-height: 35px;
		font-weight: 500;
	}

	.bottom_box .dian {
		display: inline-block;
		color: #297b90;
		margin: 0 10px;
		font-size: 25px;
	}

	.bottom_box .bottom_number {
		display: inline-block;
		vertical-align: middle;
	}

	.bottom_box .bottom_number span {
		display: inline-block;
		width: 30px;
		height: 35px;
		background-image: url(../assets/images/square_2.png);
		background-repeat: no-repeat;
		background-size: contain;
		margin: 0 5px;
		text-align: center;
		line-height: 35px;
		color: #fff;
	}

	.detailHeadItemWrap .detailHeadItem {
		cursor: pointer;
	}

	/* 工作票明细 */
	.sourceBlock {
		position: relative;
	}

	.sourceBlock .twoInfo {
		position: absolute;
		right: 30px;
		top: 65px;

	}

	.workBox {
		width: 910px;
		height: 355px;
		position: absolute;
		right: 30px;
		bottom: 0;
		background: #0c1a34;
		transition: 0.3s;
		border: 1px solid #2d86c4;
		z-index: 999;
		padding: 0 10px;
	}

	.workBox .close {
		float: right;
		width: 30px;
		height: 30px;
		margin-right: 10px;
		background: url(../assets/images/ic_close.png) no-repeat center;
		background-size: cover;
		transition: all .6s;
	}

	.workBox i:hover {
		transform: rotate(180deg);
		transition: all .6s;
	}


	.workBox.active {
		border: 1px solid #2d86c4;
		width: 100%;
		height: 370px;
	}

	.my-class /deep/ .el-table__body tr:hover>td {
		background-color: #122140 !important;
	}

	.my-class /deep/ .el-table__body tr.current-row>td {
		background-color: transparent !important;
	}

	.my-class /deep/ .el-table th.gutter {
		display: table-cell !important;
	}

	.my-class,
	.my-class /deep/ th,
	.my-class /deep/ td,
	.my-class /deep/ th.is-leaf {
		border: none;
	}


	.my-class /deep/ .cell {
		line-height: 14px;
	}

	.my-class /deep/ th,
	.my-class /deep/ td {
		padding: 8px 0;
	}

	.my-class /deep/ thead tr th {
		padding: 15px 0;
	}



	.el-table--enable-row-transition {
		height: 284px;
		overflow-y: auto;
		margin-top: 10px;
	}

	.el-table--group::after,
	.el-table--border::after,
	.el-table::before {
		display: none;
	}

	.el-table {
		background: none !important;

	}

	.el-table__row .el-tooltip p:first-child {
		margin-bottom: 5px;
	}
</style>

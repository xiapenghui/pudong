<template>
	<div class="sourceBlock">
		<div class="sourceHead">今日工作情况</div>
		<div class="sourceBody">
			<div class="sourceSplit">
				<div class="todayWorkBox">
					<div class="workTop" @click="onClickNum('bottom_box')">
						<b class="jrtitle">今日计划数</b>
						<span>{{ planTotal[0] }}</span>
						<span>{{ planTotal[1] }}</span>
						<span>{{ planTotal[2] }}</span>
					</div>
					<div class="workCenter">
						<div class="workNumber oneNumber" @click="onClickNum('planbox')">
							<div class="workImg"></div>
							<div class="workWenzi">
								<p>临时开工数</p>
								<p>{{ todaySumm.temporaryNum }}</p>
							</div>
						</div>
						<div class="workNumber twoNumber" @click="onClickNum('newbox')">
							<div class="workImg"></div>
							<div class="workWenzi">
								<p>计划开工数</p>
								<p>{{ todaySumm.planNum }}</p>
							</div>
						</div>
						<div class="workNumber threeNumber" @click="onClickNum('cgsbox')">
							<div class="workImg"></div>
							<div class="workWenzi">
								<p>查岗数</p>
								<p>{{ todaySumm.supervisor }}</p>
							</div>
						</div>
						<div class="workNumber fourNumber" @click="onClickNum('dgsbox')">
							<div class="workImg"></div>
							<div class="workWenzi">
								<p>到岗数</p>
								<p>{{ todaySumm.manage }}</p>
							</div>
						</div>
					</div>
					<div class="workBottom"></div>
				</div>
			</div>
			<div class="sourceSplit" id="yibiaoEcharts"></div>
		</div>

		<detail-info
			:columns="tableColumns"
			:dataSource="tableData"
			:currentPage="currentPage"
			:hasIndex="true"
			:isShow="isShow"
			:handTitle="handTitle"
			:loading="loading"
			:total="total"
			:pageSize="pageSize"
			@showClose="onClose"
			@current-change="onCurrentChange"
			@onhand-click="onhandClick"
		></detail-info>

		<div class="shixuBtn" @click="controlShixu">时序图</div>
		<div class="shixuBox" :class="{ active: shixuActive }">
			<div class="shixuHead">分时工作量</div>
			<div id="shixuEcharts" class="shixuEcharts"></div>
		</div>
	</div>
</template>
<script>
$(window).load(function() {
	$('.histogram_md').css('height', '30%');
	$('.histogram_bo').css('height', '30%');
});
import DetailInfo from './baidumap/detailed/DetailInfo'; //工作票情况信息弹窗,
import table from '../mixins/table'; //引入表格混入
import { wgs2bd } from './baidumap/utils/Convert'; //坐标转换
import eventBus from './baidumap/base/EventBus';
import dgsTable from './baidumap/tables/zyaqgkJs/dgsTable'; // 到岗数Table
import jrlskgsTable from './baidumap/tables/zyaqgkJs/jrlskgsTable'; // 今日临时开工数Table
import cgsTable from './baidumap/tables/zyaqgkJs/cgsTable'; // 查岗数Table
import jrjhkgsTable from './baidumap/tables/zyaqgkJs/jrjhkgsTable'; // 今日计划开工数Table
import jrjhsTable from './baidumap/tables/zyaqgkJs/jrjhsTable'; // 今日计划数Table
import * as dataApi from '../api/apiData.js';
export default {
	mixins: [table],
	components: {
		DetailInfo
	},
	name: 'jrgzSection',
	data() {
		return {
			handTitle: '标题',
			loading: false, //加载中...
			tableData: [],
			tableColumns: [],
			todaySumm: {
				manage: 24,
				planNum: 0,
				planTotal: 124,
				signStats: 10,
				supervisor: 13,
				temporaryNum: 10
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
				xAxis: [
					{
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
					}
				],
				yAxis: [
					{
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
					}
				],
				series: [
					{
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
								color: new this.$echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: 'rgba(161, 44, 221, 1)'
										},
										{
											offset: 0.8,
											color: 'rgba(161, 44, 221, 0.1)'
										}
									],
									false
								),
								shadowColor: 'rgba(161, 44, 221, 0.5)',
								shadowBlur: 10
							}
						},
						data: [320, 332, 301, 334, 390, 330, 300]
					},
					{
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
								color: new this.$echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: 'rgba(1, 99, 248, 1)'
										},
										{
											offset: 0.8,
											color: 'rgba(1, 99, 248, 0.1)'
										}
									],
									false
								),
								shadowColor: 'rgba(1, 99, 248, 0.5)',
								shadowBlur: 10
							}
						},
						data: [150, 232, 201, 154, 190, 330, 200]
					},
					{
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
								color: new this.$echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: 'rgba(71, 255, 255, 1)'
										},
										{
											offset: 1,
											color: 'rgba(71, 255, 255, 0.1)'
										}
									],
									false
								),
								shadowColor: 'rgba(71, 255, 255, 0.5)',
								shadowBlur: 10
							}
						},
						data: [290, 330, 220, 182, 191, 234, 100]
					}
				]
			},

			shixuData: [[320, 332, 301, 334, 390, 330, 300], [150, 232, 201, 154, 190, 330, 200], [290, 330, 220, 182, 191, 234, 100]],

			// 仪表盘echarts options
			yibiaoOptions: {
				backgroundColor: '',
				title: [
					{
						x: '13.5%',
						y: '60%',
						//bottom: 100,
						text: '今日到岗率',
						textStyle: {
							fontWeight: 'normal',
							fontSize: 20,
							color: '#fff'
						}
					},
					{
						x: '65.5%',
						y: '94%',
						//bottom: 100,
						text: '今日查岗率',
						textStyle: {
							fontWeight: 'normal',
							fontSize: 20,
							color: '#fff'
						}
					}
				],
				series: [
					{
						name: '速度',
						type: 'gauge',
						min: 0,
						max: 100,
						center: ['24%', '38%'], // 默认全局居中
						//splitNumber:11,
						radius: '60%',
						axisLine: {
							// 坐标轴线
							lineStyle: {
								// 属性lineStyle控制线条样式
								color: [[0.1, '#ff4500'], [0.8, '#4EE3FF'], [1, 'lime']],
								width: 5,
								//shadowColor : '#fff', //默认透明
								shadowBlur: 10
							}
						},
						axisLabel: {
							// 坐标轴小标记
							textStyle: {
								// 属性lineStyle控制线条样式
								fontWeight: 'bolder',
								color: '#fff',
								//shadowColor : '#fff', //默认透明
								shadowBlur: 10
							}
						},
						axisTick: {
							// 坐标轴小标记
							length: 15, // 属性length控制线长
							lineStyle: {
								// 属性lineStyle控制线条样式
								color: 'auto',
								width: 3,
								//shadowColor : '#fff', //默认透明
								shadowBlur: 10
							}
						},
						splitLine: {
							//橙色分割线
							length: 25,
							lineStyle: {
								width: 3,
								color: '#FCD209'
							}
						},
						itemStyle: {
							//指针颜色
							color: '#1e90ff'
						},
						pointer: {
							//指针长短
							length: 70
						},
						detail: {
							formatter: '{value}%',
							fontSize: 22,
							fontWeight: 'bold',
							offsetCenter: [0, '60%']
						},
						data: [
							{
								value: 40
							}
						]
					},
					{
						name: '速度',
						type: 'gauge',
						min: 0,
						max: 100,
						center: ['76%', '72%'], // 默认全局居中
						//splitNumber:11,
						radius: '60%',
						axisLine: {
							// 坐标轴线
							lineStyle: {
								// 属性lineStyle控制线条样式
								color: [[0.1, '#ff4500'], [0.8, '#4EE3FF'], [1, 'lime']],
								width: 5,
								shadowColor: '#fff', //默认透明
								shadowBlur: 10
							}
						},
						axisLabel: {
							// 坐标轴小标记
							textStyle: {
								// 属性lineStyle控制线条样式
								fontWeight: 'bolder',
								color: '#fff',
								//shadowColor : '#fff', //默认透明
								shadowBlur: 10
							}
						},
						axisTick: {
							// 坐标轴小标记
							length: 15, // 属性length控制线长
							lineStyle: {
								// 属性lineStyle控制线条样式
								color: 'auto',
								width: 3,
								//shadowColor : '#fff', //默认透明
								shadowBlur: 10
							}
						},
						splitLine: {
							//橙色分割线
							length: 25,
							lineStyle: {
								width: 3,
								color: '#FCD209'
							}
						},
						itemStyle: {
							//指针颜色
							color: '#1e90ff'
						},
						pointer: {
							//指针长短
							length: 70
						},
						detail: {
							formatter: '{value}%',
							fontSize: 22,
							fontWeight: 'bold',
							offsetCenter: [0, '60%']
						},
						data: [
							{
								value: '100'
							}
						]
					}
				]
			},

			// 今日工作情况
			// 到岗数表格
			dgsColumns: dgsTable,
			// 今日临时开工数
			planColumns: jrlskgsTable,
			//查岗数
			cgsColumns: cgsTable,
			//今日计划开工数
			newColumns: jrjhkgsTable,
			// 今日计划数
			bottomColumns: jrjhsTable
		};
	},
	methods: {
		// 修改工作票情况
		rowStyle({ row, rowIndex }) {
			if (rowIndex % 2 == 1) {
				return 'color:white;background-color: #122140';
			} else {
				return 'color:white;background-color: #0c1a34';
			}
		},
		// 修改table header的背景色
		tableHeaderColor({ row, column, rowIndex, columnIndex }) {
			if (rowIndex === 0) {
				return 'background-color: #102a4f;color: #a1cbf1;font-size: 14px;';
			}
		},
		onClickNum(obj) {
			this.newObj = obj;
			this.isShow = true;
			this.loading = true;
			let statsType;
			if (obj == 'dgsbox') {
				this.handTitle = '到岗数';
				this.tableColumns = this.dgsColumns;
				statsType = 'manage';
			} else if (obj == 'cgsbox') {
				this.handTitle = '查岗数';
				this.tableColumns = this.cgsColumns;
				statsType = 'supervisor';
			} else if (obj == 'planbox') {
				this.handTitle = '今日临时开工数';
				this.tableColumns = this.planColumns;
				statsType = 'temporaryNum';
			} else if (obj == 'newbox') {
				this.handTitle = '今日计划开工数';
				this.tableColumns = this.newColumns;
				statsType = 'planNum';
			} else {
				this.handTitle = '今日计划数';
				this.tableColumns = this.bottomColumns;
				statsType = 'planTotal';
			}

			let params = {
				statsType: statsType,
				limit: this.pageSize,
				offset: this.offset
			};
			dataApi.gettodayDetail(params).then(result => {
				this.total = result.data.count;
				this.tableData = result.data.list;
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
				myChart.on('click', function(params) {
					console.log('paramssss', params);
				});
			}
		},

		// 今日临时开工数坐标定位
		onhandClick(row) {
			console.log(row);
			let layer = {
				id: row.personName, //定位对象id
				layerName: 'ConstructionSiteLayer', //定位图层
				zoom: 18, //定位图层
				point: {
					lng: row.longitude,
					lat: row.latitude
				}
			};
			eventBus.emit('layer-flyClickTips', {
				layer
			}); //隐患缺陷图层定位
		},

		controlShixu() {
			this.shixuActive = !this.shixuActive;
			if (this.shixuActive) {
				this.renderEchart('shixuEcharts', this.shixuOptions, this.shixuData);
			}
		},
		// 获取今日工作汇总情况
		getTodayWorkSummary() {
			dataApi.getcenterWarNumber().then(result => {
				this.todaySumm = result.data.data;
				this.renderEchart('yibiaoEcharts', this.yibiaoOptions, this.yiBiaoData);
			});
		},
		// 获取某个时间段内在线人员统计情况
		getTimeRangeOnlineStats() {
			let params = {
				Date: '2020-3-12',
				beginTime: '0',
				endTime: '24'
			};
			dataApi.getonlineTime(params).then(result => {
				let getShixuData = function(item) {
					let a = item['0'] + item['1'] + item['2'] + item['3'];
					let b = item['4'] + item['5'] + item['6'] + item['7'];
					let c = item['8'] + item['9'] + item['10'] + item['11'];
					let d = item['12'] + item['13'] + item['14'] + item['15'];
					let e = item['16'] + item['17'] + item['18'] + item['19'];
					let f = item['20'] + item['21'] + item['22'] + item['23'];
					return [a, b, c, d, e, f];
				};

				let construct = result.data.data.construct;
				let manage = result.data.data.manage;
				let supervisor = result.data.data.supervisor;
				this.shixuData = [getShixuData(construct), getShixuData(manage), getShixuData(supervisor)];
			});
		}
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
			let manage = this.todaySumm.manage;
			let supervisor = this.todaySumm.supervisor;
			let planTotal = this.todaySumm.planTotal;
			let temporaryNum = this.todaySumm.temporaryNum;
			manage = isNaN(manage) ? 0 : manage;
			supervisor = isNaN(supervisor) ? 0 : supervisor;
			planTotal = isNaN(planTotal) ? 0 : planTotal;
			temporaryNum = isNaN(temporaryNum) ? 0 : temporaryNum;
			this.todaySumm.manage = manage;
			this.todaySumm.supervisor = supervisor;
			// let a = Math.floor(parseFloat(this.todaySumm.planTotal/ this.todaySumm.manage) * 100);
			// let b = Math.floor(parseFloat(this.todaySumm.supervisor / this.todaySumm.manage) * 100);
			let a = Math.floor(parseFloat(temporaryNum / manage) * 100);
			let b = Math.floor(parseFloat(supervisor / manage) * 100);
			a = isNaN(a) ? 0 : a;
			b = isNaN(b) ? 0 : b;
			if (b == Infinity) {
				return (b = 0);
			}
			return [
				[
					{
						value: a
					}
				],
				[
					{
						value: b
					}
				]
			];
		}
	},
	mounted() {
		this.getTodayWorkSummary();
		this.getTimeRangeOnlineStats();
	}
};
</script>
<style scoped>
@import 'baidumap/assets/css/echarts.css';

.shixuBtn {
	width: 128px;
	height: 36px;
	line-height: 36px;
	text-indent: 54px;
	color: #ffffff;
	font-size: 18px;
	background: #153663 url('../assets/images/ic_sxt.png') no-repeat left 13px center;
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
	content: '';
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
	top: 70px;
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
	transition: all 0.6s;
}

.workBox i:hover {
	transform: rotate(180deg);
	transition: all 0.6s;
}

.workBox.active {
	border: 1px solid #2d86c4;
	width: 100%;
	height: 370px;
}

/* 今日工作情况echarts图修改变更样式 */
.todayWorkBox {
	position: relative;
}
.todayWorkBox .workTop {
	width: 100%;
	height: 40px;
	line-height: 40px;
	margin: 60px auto 30px;
	text-align: center;
	color: #28e3db;
}
.todayWorkBox .workTop .jrtitle {
	font-weight: normal;
}
.todayWorkBox .workTop span {
	width: 30px;
	height: 40px;
	display: inline-block;
	background-color: #142646;
	font-weight: bold;
	margin-left: 10px;
}

.todayWorkBox .workCenter {
	width: 100%;
	height: auto;
	margin-left: 30px;
}
.todayWorkBox .workCenter .workNumber {
	width: 48.5%;
	height: 80px;
	margin-bottom: 20px;
	background: url(../assets/images/ic_box.png) no-repeat center;
	background-size: contain;
}
.todayWorkBox .workCenter .workNumber:nth-child(even) {
	float: right;
}
.todayWorkBox .workCenter .workNumber:nth-child(odd) {
	float: left;
}
.todayWorkBox .workCenter .workNumber .workImg {
	float: left;
	width: 32%;
	height: 45px;
	margin: 18px 5px 0 10px;
}
.todayWorkBox .workCenter .workNumber .workWenzi {
	width: 50%;
	height: 50px;
	float: left;
	line-height: 40px;
}
.todayWorkBox .workCenter .workNumber .workWenzi p:nth-child(1) {
	color: #ffffff;
	font-size: 15px;
}
.todayWorkBox .workCenter .workNumber .workWenzi p:nth-child(2) {
	color: #28e3db;
	font-weight: bold;
}
.todayWorkBox .workCenter .oneNumber .workImg {
	background: url(../assets/images/ic_llkg.png) no-repeat center;
	background-size: contain;
}
.todayWorkBox .workCenter .twoNumber .workImg {
	background: url(../assets/images/ic_jhkg.png) no-repeat center;
	background-size: contain;
}
.todayWorkBox .workCenter .threeNumber .workImg {
	background: url(../assets/images/ic_cgs.png) no-repeat center;
	background-size: contain;
}
.todayWorkBox .workCenter .fourNumber .workImg {
	background: url(../assets/images/ic_dgs.png) no-repeat center;
	background-size: contain;
}
.todayWorkBox .workBottom {
	position: absolute;
	left: 20px;
	bottom: 0;
	width: 100%;
	height: 100px;
	background: url(../assets/images/ic_bottom.png) no-repeat center;
	background-size: contain;
}

.my-class /deep/ .el-table__body tr:hover > td {
	background-color: #122140 !important;
}

.my-class /deep/ .el-table__body tr.current-row > td {
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

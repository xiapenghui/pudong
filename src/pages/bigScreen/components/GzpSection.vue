<template>
	<div class="sourceBlock">
		<div class="sourceHead">工作票情况</div>
		<div class="sourceBody">
			<div class="sectionSplit3">
				<div class="sectionTab">
					<a
						class="sectionTabLink"
						:class="{ active: item.display }"
						href="javascript:;"
						v-for="(item, index) in workingTabData"
						:key="index"
						@click="tabChange(workingTabData, index)"
					>
						{{ item.text }}
					</a>
				</div>
				<div class="sectionBody">
					<div class="sectionCons">
						<div class="sectionConInner" v-show="item.display" v-for="(item, index) in workingTabData" :key="index">
							<div :id="setId('cc', index)" class="forEcharts etype3"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="sectionSplit3">
				<div class="sectionBody sectionBody11">
					<div class="detailHead">
						<div class="detailHeadItemWrap">
							<div class="detailHeadItem detailHeadItemOne" :class="{ orange: isOrange }">
								<span @click="onClickNum('cskg')">超时开工：</span>
								<span>{{ cskg }}</span>
							</div>
						</div>
						<div class="detailHeadItemWrap">
							<div class="detailHeadItem detailHeadItemTwo" :class="{ red: isRed }">
								<span @click="onClickNum('yshb')">延时汇报：</span>
								<span>{{ yshb }}</span>
							</div>
						</div>
						<div class="detailHeadItemWrap">
							<div class="detailHeadItem detailHeadItemThree">
								<span @click="onClickNum('clz')">处理中：</span>
								<span>{{ clz }}</span>
							</div>
						</div>
						<div class="detailHeadItemWrap">
							<div class="detailHeadItem detailHeadItemFour">
								<span @click="onClickNum('over')">已完成：</span>
								<span>{{ over }}</span>
							</div>
						</div>
					</div>
					<div class="detailContextWrap" id="detailContextWrap" ref="detailContextWrap">
						<div class="detailContentMove" ref="detailContentMove">
							<div ref="detailContext" class="detailContext">
								<div v-for="(item, index) in detailTableData" :key="index" class="detailContextItemWrap">
									<div class="detailContextItem">
										<table class="detailTable" cellpadding="0" cellspacing="0">
											<tr>
												<td>处理中</td>
												<td>{{ item.ticketType }} {{ item.personName }}</td>
											</tr>
											<tr>
												<td>计划开工</td>
												<td>
													{{ item.jhkgsj }}
													<template v-if="!item.jhkgsj">
														无
													</template>
												</td>
											</tr>
											<tr>
												<td>计划完工</td>
												<td>
													{{ item.jhjssj }}
													<template v-if="!item.jhjssj">
														无
													</template>
												</td>
											</tr>
											<tr>
												<td>实际开工</td>
												<td>{{ item.workDate }} {{ item.beginTime }}</td>
											</tr>
										</table>
									</div>
								</div>
							</div>
							<div ref="detailContext2" class="detailContext detailContext2" v-if="isShowDetail">
								<div v-for="(item, index) in detailTableData" :key="index" class="detailContextItemWrap">
									<div class="detailContextItem">
										<table class="detailTable" cellpadding="0" cellspacing="0">
											<tr>
												<td>处理中</td>
												<td>{{ item.ticketType }} {{ item.personName }}</td>
											</tr>
											<tr>
												<td>计划开工</td>
												<td>
													{{ item.jhkgsj }}
													<template v-if="!item.jhkgsj">
														无
													</template>
												</td>
											</tr>
											<tr>
												<td>计划完工</td>
												<td>
													{{ item.jhjssj }}
													<template v-if="!item.jhjssj">
														无
													</template>
												</td>
											</tr>
											<tr>
												<td>实际开工</td>
												<td>{{ item.workDate }} {{ item.beginTime }}</td>
											</tr>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<detail-info
				class="twoInfo"
				:columns="tableColumns"
				:dataSource="tableData"
				:currentPage="currentPage"
				:hasIndex="true"
				:isShow="isShow"
				:total="total"
				:pageSize="pageSize"
				@showClose="onClose"
				:handTitle="handTitle"
				:loading="loading"
				@current-change="onCurrentChange"
				@onhand-click="onhandClick"
			></detail-info>
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
import detailTable from './baidumap/tables/zyaqgkJs/detailTable'; // 线程作业Table
import cskgTable from './baidumap/tables/zyaqgkJs/cskgTable'; // 工作票Table
import * as dataApi from '../api/apiData.js';
export default {
	mixins: [table],
	components: {
		DetailInfo
	},
	name: 'gzpSection',
	data() {
		return {
			isShowDetail: true,
			typeClass: 0, //默认本日
			loading: false, //加载中...
			handTitle: '工作票情况', //标题
			isOrange: false,
			isRed: false,
			tableData: [],
			tableColumns: [],
			cskg: '0',
			yshb: '0',
			clz: '0',
			over: '0',
			workingTabData: [
				{
					text: '本日',
					display: true
				},
				{
					text: '本周',
					display: false
				},
				{
					text: '本月',
					display: false
				}
			],

			// 工作情况echarts options
			workingOption: {
				backgroundColor: '',
				tooltip: {
					trigger: 'item',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					data: ['已完成', '未完成'],
					align: 'left',
					textStyle: {
						fontSize: 14,
						color: '#ffffff'
					},
					left: '4%',
					top: '0%'
				},
				grid: {
					top: '15%',
					left: '22%'
				},
				xAxis: [
					{
						type: 'value',
						splitLine: {
							show: false
						},
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
							show: false
						}
					}
				],
				yAxis: [
					{
						type: 'category',
						data: ['抢修任务', '工作任务', '低压工作', '带电作业', '第二种工作', '第一种工作'],

						axisLabel: {
							show: true,
							color: '#fff',
							fontSize: 16
						},
						splitLine: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#fff'
							}
						},
						axisTick: {
							show: false
						}
					},
					{
						type: 'category',
						data: ['抢修任务', '工作任务', '低压工作', '带电作业', '第二种工作', '第一种工作'],
						axisLabel: {
							show: false,
							color: '#fff',
							fontSize: 15
						},
						splitLine: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#fff'
							}
						},
						axisTick: {
							show: false
						}
					}
				],

				series: [
					{
						name: '已完成',
						type: 'bar',
						stack: '1',
						barWidth: '50%',
						data: [320, 302, 301, 334, 390, 330, 320],
						barGap: '100%', // 柱间距离，默认为柱形宽度的30%，可设固定值
						barCategoryGap: '100%', // 类目间柱形距离，默认为类目间距的20%，可设固定值
						itemStyle: {
							color: '#29e2db'
						},
						label: {
							normal: {
								show: true,
								formatter: function(params) {
									console.log('params', params.value);
									if (params.value == 0) {
										return '';
									}
								},
								position: 'insideRight',
								color: '#ffffff',
								fontSize: 20
							}
						}
					},
					{
						name: '未完成',
						type: 'bar',
						stack: '1',
						barWidth: '50%',
						data: [120, 132, 101, 134, 90, 230, 210],
						itemStyle: {
							color: '#0174ad'
						},
						label: {
							normal: {
								show: true,
								formatter: function(params) {
									console.log('params', params.value);
									if (params.value == 0) {
										return '';
									}
								},
								position: 'insideRight',
								color: '#ffffff',
								fontSize: 20
							}
						}
					}
				]
			},

			// 工作情况echarts data
			workingTodayData: [[20, 30, 10, 22, 10, 29], [79, 82, 90, 101, 88, 70]],

			// 工作情况echarts data
			workingWeekData: [[20, 30, 10, 22, 10, 29], [79, 82, 90, 101, 88, 70]],

			// 工作情况echarts data
			workingMonthData: [[20, 30, 10, 22, 10, 29], [79, 82, 90, 101, 88, 70]],
			// 线程作业右下角
			detailTableData: detailTable,
			// 工作票情况
			cskgColumns: cskgTable
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
			this.tableColumns = this.cskgColumns;
			this.loading = true;
			let ticketType;
			let status = obj.seriesName == '已完成' ? '1' : '0';
			if (obj == 'cskg') {
				this.handTitle = '超时开工';
				status = '888';
				ticketType = -1;
			} else if (obj == 'yshb') {
				this.handTitle = '延时汇报';
				status = '999';
				ticketType = -1;
			} else if (obj == 'clz') {
				this.handTitle = '处理中';
				status = '0';
				ticketType = -1;
			} else if (obj == 'over') {
				this.handTitle = '已完成';
				status = '1';
				ticketType = -1;
			}
			if (obj.name == '第一种工作') {
				this.handTitle = '第一种工作';
				ticketType = '1';
			} else if (obj.name == '第二种工作') {
				this.handTitle = '第二种工作';
				ticketType = '2';
			} else if (obj.name == '带电作业') {
				this.handTitle = '带电作业';
				ticketType = '3';
			} else if (obj.name == '低压工作') {
				this.handTitle = '低压工作';
				ticketType = '4';
			} else if (obj.name == '工作任务') {
				this.handTitle = '工作任务';
				ticketType = '5';
			} else if (obj.name == '抢修任务') {
				this.handTitle = '抢修任务';
				ticketType = '6';
			}
			let rangeType;
			if (this.typeClass == 1) {
				//周
				rangeType = 'week';
			} else if (this.typeClass == 2) {
				//月
				rangeType = 'month';
			} else {
				rangeType = 'today';
			}
			let params = {
				rangeType: rangeType,
				ticketType: ticketType,
				status: status,
				limit: this.pageSize,
				offset: this.offset
			};
			dataApi.getgzpDetail(params).then(result => {
				this.total = result.data.data.count;
				this.tableData = result.data.data.list;
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
					_this.onClickNum(params);
				});
			}
		},
		tabChange(data, index) {
			this.typeClass = index;
			this.$parent.$parent.tabChange(data, index);
			if (index === 1) {
				//渲染页面echarts图表---本周echarts
				this.renderEchart('echarts-cc-2', this.workingOption, this.workingWeekData);
			}
			if (index === 2) {
				//渲染页面echarts图表---本月echarts
				this.renderEchart('echarts-cc-3', this.workingOption, this.workingMonthData);
			}
		},
		setId(pid, id) {
			return this.$parent.setId(pid, id);
		},

		// 工作票情况坐标定位
		onhandClick(row) {
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
		// 今日工作票
		today() {
			let params = {
				rangeType: 'today',
				status: '1'
			};
			let params1 = {
				rangeType: 'today',
				status: '0'
			};
			dataApi.getgzpOver(params).then(result => {
				if (result.data.data == null) {
					this.workingTodayData[0] = [0, 0, 0, 0, 0, 0];
				} else {
					this.workingTodayData[0] = [
						result.data.data['6'],
						result.data.data['5'],
						result.data.data['4'],
						result.data.data['3'],
						result.data.data['2'],
						result.data.data['1']
					];
				}
				dataApi.getgzpOver(params1).then(result => {
					if (result.data.data == null) {
						this.workingTodayData[1] = [0, 0, 0, 0, 0, 0];
					} else {
						this.workingTodayData[1] = [
							result.data.data['6'],
							result.data.data['5'],
							result.data.data['4'],
							result.data.data['3'],
							result.data.data['2'],
							result.data.data['1']
						];
					}
					//渲染页面echarts图表---今日工作情况echarts
					this.renderEchart('echarts-cc-1', this.workingOption, this.workingTodayData);
				});
			});
		},
		// 本周工作票
		week() {
			let params = {
				rangeType: 'week',
				status: '1'
			};
			let params1 = {
				rangeType: 'week',
				status: '0'
			};
			dataApi.getgzpOver(params).then(result => {
				if (result.data.data == null) {
					this.workingWeekData[0] = [0, 0, 0, 0, 0, 0];
				} else {
					this.workingWeekData[0] = [
						result.data.data['6'],
						result.data.data['5'],
						result.data.data['4'],
						result.data.data['3'],
						result.data.data['2'],
						result.data.data['1']
					];
				}
				dataApi.getgzpOver(params1).then(result => {
					if (result.data.data == null) {
						this.workingWeekData[1] = [0, 0, 0, 0, 0, 0];
					} else {
						this.workingWeekData[1] = [
							result.data.data['6'],
							result.data.data['5'],
							result.data.data['4'],
							result.data.data['3'],
							result.data.data['2'],
							result.data.data['1']
						];
					}
				});
			});
		},
		month() {
			// 本月工作票
			let params = {
				rangeType: 'month',
				status: '1'
			};
			let params1 = {
				rangeType: 'month',
				status: '0'
			};
			dataApi.getgzpOver(params).then(result => {
				if (result.data.data == null) {
					this.workingMonthData[0] = [0, 0, 0, 0, 0, 0];
				} else {
					this.workingMonthData[0] = [
						result.data.data['6'],
						result.data.data['5'],
						result.data.data['4'],
						result.data.data['3'],
						result.data.data['2'],
						result.data.data['1']
					];
				}
				dataApi.getgzpOver(params1).then(result => {
					if (result.data.data == null) {
						this.workingMonthData[1] = [0, 0, 0, 0, 0, 0];
					} else {
						this.workingMonthData[1] = [
							result.data.data['6'],
							result.data.data['5'],
							result.data.data['4'],
							result.data.data['3'],
							result.data.data['2'],
							result.data.data['1']
						];
					}
				});
			});
		},
		// 获取工作票跑马灯数据
		swiper() {
			let params = {
				rangeType: 'today',
				ticketType: '-1',
				limit: '-1',
				offset: '0',
				status: '0'
			};
			dataApi.getgzpDetail(params).then(result => {
				let length = result.data.data.list.length;
				this.detailTableData = result.data.data.list;
				let wrapper = this.$refs.detailContextWrap;
				let move = this.$refs.detailContentMove;
				let height = 160;
				var initTop = 0;
				function moverFn() {
					initTop++;
					if (initTop >= move.offsetHeight / 2) {
						initTop = 0;
					}
					move.style = 'transform: translateY(-' + initTop + 'px)';
				}

				if (wrapper.offsetHeight > move.offsetHeight / 2) {
					this.isShowDetail = false;
					return;
				}
				if (length > 2) {
					this.stop = setInterval(moverFn, 30);
				}
			});
		},
		//超时开工
		cskgNumber() {
			let params = {
				rangeType: 'today',
				ticketType: '-1',
				limit: '-1',
				offset: '0',
				status: '888'
			};
			dataApi.getgzpDetail(params).then(result => {
				this.cskg = result.data.data.list.length;
				if (this.cskg > 0) {
					this.isOrange = true;
				}
			});
		},
		// 延时汇报
		yshbNumber() {
			let params = {
				rangeType: 'today',
				ticketType: '-1',
				limit: '-1',
				offset: '0',
				status: '999'
			};
			dataApi.getgzpDetail(params).then(result => {
				this.yshb = result.data.data.list.length;
				if (this.yshb > 0) {
					this.isOrange = true;
				}
			});
		},
		//处理中
		clzNumber() {
			let params = {
				rangeType: 'today',
				ticketType: '-1',
				limit: '-1',
				offset: '0',
				status: '0'
			};
			dataApi.getgzpDetail(params).then(result => {
				this.clz = result.data.data.list.length;
			});
		},
		// 已完成
		ywcNumber() {
			let params = {
				rangeType: 'today',
				ticketType: '-1',
				limit: '-1',
				offset: '0',
				status: '1'
			};
			dataApi.getgzpDetail(params).then(result => {
				this.over = result.data.data.list.length;
			});
		}
	},

	mounted() {
		this.today();
		this.week();
		this.month();
		this.swiper();
		this.cskgNumber();
		this.yshbNumber();
		this.clzNumber();
		this.ywcNumber();
		//超时开工
		// this.$$utils.axiosRequest('/pdaqfh/a/sys/sysParam/getSysParam?code=WORK_TICKET_BEGIN_DELAY', '获取工作票汇总列表--超时开工').then(
		// 	result => {
		// 		this.cskg = result;
		// 		console.log("获取工作票汇总列表--超时开工",result)
		// 	});
		//
		// // 延时汇报
		// this.$$utils.axiosRequest('/pdaqfh/a/sys/sysParam/getSysParam?code=WORK_TICKET_END_DELAY', '获取工作票汇总列表--延时汇报').then(
		// 	result => {
		// 		this.yshb = result
		// 		console.log("获取工作票汇总列表--延时汇报",result)
		// 	});
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
.detailHeadItemOne {
	background: #5d564a;
}
.detailHeadItemTwo {
	background: #5d564a;
}
.detailHeadItemThree {
	background: #024e74;
}
.detailHeadItemFour {
	background: #0174ad;
}

.orange {
	background: orange;
}
.red {
	background: red;
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
	height: auto;
}
/* .detailContext {
	position: absolute;
	left: 0;
	top: 0;
	transition: 1.2s linear;
}

.detailContext2 {
	top: 100%;
} */

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

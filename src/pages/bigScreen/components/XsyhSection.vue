<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="sectionSplit2 icon_parent">
				<div class="smallTitle onetitle">
					<i class="icon_right"></i>
					统计
				</div>
				<div class="sectionTab tab2">
					<a
						class="sectionTabLink"
						:class="{ active: item.display }"
						href="javascript:;"
						v-for="(item, index) in defectTabDataTwo"
						@click="tabChange(defectTabDataTwo, index)"
					>
						{{ item.text }}
					</a>
				</div>
				<div class="sectionHead">
					<div class="sectionTop"><div class="sectiontitle">隐患监控</div></div>
				</div>
				<div class="sectionBody sectionBody5">
					<div class="sectionCons">
						<div class="sectionConInner" v-show="item.display" v-for="(item, index) in defectTabDataTwo">
							<div :id="setId('bb', index)" class="forEcharts etype2"></div>
						</div>
					</div>

					<detail-info
						:class="{ noworkBox: noworkBox }"
						:columns="tableColumns"
						:dataSource="tableData"
						:currentPage="currentPage"
						:hasIndex="true"
						:isShow="isShow"
						:total="total"
						:pageSize="pageSize"
						:handTitle="handTitle"
						:loading="loading"
						@showClose="onClose"
						@current-change="onCurrentChange"
						@onhand-click="onhandClick"
					></detail-info>
				</div>
			</div>
			<div class="sectionSplit2">
				<div class="sectionHead smallTitle">
					<i class="icon_right"></i>
					明细
					<p class="wenzi_right">
						<b @click="onClickGrade('ybnumber')">
							<i></i>
							一般:
							<font>{{ oneNumber }}</font>
							条
						</b>
						<b @click="onClickGrade('yznumber')">
							<i></i>
							严重:
							<font>{{ twoNumber }}</font>
							条
						</b>
						<b @click="onClickGrade('wjnumber')">
							<i></i>
							危急:
							<font>{{ threeNumber }}</font>
							条
						</b>
					</p>
				</div>
				<div class="sectionBody sectionBody6">
					<div class="sectionCons">
						<div class="detailUlWrap">
							<ul ref="troubleUl" class="detailUl troubleUl">
								<li class="detailLi type2" v-for="item in troubleDetail" @click="locationYhqx(item.id, item.lon, item.lat)">
									<div class="detailLiCon" :class="item.type">{{ item.classify }}</div>
									<div class="detailLiCon detailBugPro" :class="{ detailBug: item.title == '危急', detailBugWar: item.title == '严重' }">{{ item.title }}</div>
									<div class="detailLiCon" :class="item.type">{{ item.mark }}</div>
									<div class="detailLiCon">{{ item.time }}</div>
									<div class="detailLiCon width300">{{ item.message }}</div>
								</li>
							</ul>
							<ul ref="troubleUl2" class="detailUl troubleUl2">
								<li class="detailLi type2" v-for="item in troubleDetail" @click="locationYhqx(item.id, item.lon, item.lat)">
									<div class="detailLiCon" :class="item.type">{{ item.classify }}</div>
									<div class="detailLiCon detailBugPro" :class="{ detailBug: item.title == '危急', detailBugWar: item.title == '严重' }">{{ item.title }}</div>
									<div class="detailLiCon" :class="item.type">{{ item.mark }}</div>
									<div class="detailLiCon">{{ item.time }}</div>
									<div class="detailLiCon width300">{{ item.message }}</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from './baidumap/base/EventBus';
import DetailInfo from './baidumap/detailed/DetailInfo'; //设备感知弹窗
import OnlineUrl from './baidumap/base/OnlineUrl'; //在线接口地址
import { wgs2bd } from './baidumap/utils/Convert'; //坐标转换
import table from '../mixins/table'; //引入表格混入
import swiperTable from './baidumap/tables/yhjkJs/swiperTable'; // 巡视隐患明细列表数据Table
import yhjkTable from './baidumap/tables/yhjkJs/yhjkTable'; // 隐患监控表头Table
import allBugTable from './baidumap/tables/yhjkJs/allBugTable'; // 缺陷监控--明细一般Table
import * as dataApi from '../api/apiData.js';
export default {
	mixins: [table],
	components: {
		DetailInfo
	},
	name: 'xsyhSection',
	props: {
		width: {
			type: Number,
			default: 670
		},
		height: {
			type: Number,
			default: 940
		},
		left: {
			type: Number,
			default: 2928
		},
		top: {
			type: Number,
			default: 126
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			activeTypeName: 'statistics',
			colorTodayData: [],
			colorWeekData: [],
			colorMonthData: [],
			colorNewData: [],
			handTitle: '标题',
			loading: false, //加载中...
			tableData: [],
			tableColumns: [],
			isShow: false,
			typeClass: 0,
			oneNumber: 0,
			twoNumber: 0,
			threeNumber: 0,
			noworkBox: false,
			// 巡视隐患echarts options
			troubleOption: {
				legend: {
					x: 'center',
					top: 30,
					itemGap: 20,
					textStyle: {
						color: 'rgba(255,255,255,0.5)',
						fontSize: 18
					}
				},
				color: ['#F1BB4C', '#3EEFD5', '#3AAFFF'],
				tooltip: {},
				dataset: {
					source: [
						['product', '2012', '2013', '2014', '2015', '2016'],
						['已发现', 41.1, 30.4, 65.1, 53.3, 83.9],
						['已审核', 86.5, 92.1, 85.7, 83.1, 73.4],
						['已结单', 24.1, 67.2, 79.5, 86.4, 65.2]
					]
				},
				series: [
					{
						type: 'pie',
						radius: [55, 70],
						center: ['20%', '35%'],
						encode: {
							itemName: 'product',
							value: '2012'
						},
						label: {
							normal: {
								formatter: '变电',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18
							}
						},
						itemStyle: {
							normal: {
								color: ''
							}
						}
					},
					{
						type: 'pie',
						radius: [55, 70],
						center: ['50%', '35%'],
						encode: {
							itemName: 'product',
							value: '2013'
						},
						label: {
							normal: {
								formatter: '配电自动化',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 16
							}
						},

						itemStyle: {
							normal: {
								color: ''
							}
						}
					},
					{
						type: 'pie',
						radius: [55, 70],
						center: ['80%', '35%'],
						encode: {
							itemName: 'product',
							value: '2014'
						},
						label: {
							normal: {
								formatter: '配电',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18
							}
						},
						itemStyle: {
							normal: {
								color: ''
							}
						}
					},
					{
						type: 'pie',
						radius: [55, 70],
						center: ['20%', '70%'],
						encode: {
							itemName: 'product',
							value: '2015'
						},
						label: {
							normal: {
								formatter: '线路',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18
							}
						},
						itemStyle: {
							normal: {
								color: ''
							}
						}
					},
					{
						type: 'pie',
						radius: [55, 70],
						center: ['50%', '70%'],
						encode: {
							itemName: 'product',
							value: '2016'
						},
						label: {
							normal: {
								formatter: '电缆',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18
							}
						},
						itemStyle: {
							normal: {
								color: ''
							}
						}
					}
				]
			},
			troubleNewOption: {},

			defectTabDataTwo: [
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

			troubleTodayData: [[12, 5, 7, 6, 9], [12, 5, 7, 6, 9], [12, 5, 7, 6, 9]],

			troubleWeekData: [[12, 5, 7, 6, 9], [12, 5, 7, 6, 9], [12, 5, 7, 6, 9]],

			troubleMonthData: [[5, 7, 6, 24, 19], [5, 7, 6, 24, 19], [5, 7, 6, 24, 19]],
			// 巡视隐患明细列表数据
			troubleDetail: swiperTable,
			// 隐患监控表头
			yhjktableColumns: yhjkTable,
			// 缺陷监控--明细一般
			allColumns: allBugTable
		};
	},
	methods: {
		tabChange(data, index) {
			this.$parent.tabChange(data, index);
			this.typeClass = index;
			this.troubleNewOption = JSON.parse(JSON.stringify(this.troubleOption));
			if (index === 0) {
				//渲染页面echarts图表---本日echarts
				this.colorNewData = this.colorTodayData;
				this.colorFn(this.colorNewData);
				this.renderEchart('echarts-bb-1', this.troubleNewOption, this.troubleTodayData);
			}
			if (index === 1) {
				//渲染页面echarts图表---本周echarts
				this.colorNewData = this.colorWeekData;
				this.colorFn(this.colorNewData);
				this.renderEchart('echarts-bb-2', this.troubleNewOption, this.troubleWeekData);
			}
			if (index === 2) {
				//渲染页面echarts图表---本月echarts
				this.colorNewData = this.colorMonthData;
				this.colorFn(this.colorNewData);
				this.renderEchart('echarts-bb-3', this.troubleNewOption, this.troubleMonthData);
			}
		},
		setId(pid, id) {
			return this.$parent.setId(pid, id);
		},

		onClickNum(obj, name) {
			this.activeTypeName = 'statistics';
			this.isShow = true;
			this.newObj = obj;
			this.name = name;
			this.tableColumns = this.yhjktableColumns;
			this.loading = true;
			let professional, status;
			if (obj == 2) {
				professional = 2;
				this.handTitle = '配电';
				if (name == '已发现') {
					status = 'yfx';
				} else if (name == '已审核') {
					status = 'ysh';
				} else if (name == '已结单') {
					status = 'yjd';
				}
			} else if (obj == 1) {
				professional = 7;
				this.handTitle = '配电自动化';
				if (name == '已发现') {
					status = 'yfx';
				} else if (name == '已审核') {
					status = 'ysh';
				} else if (name == '已结单') {
					status = 'yjd';
				}
			} else if (obj == 0) {
				professional = 4;
				this.handTitle = '变电';
				if (name == '已发现') {
					status = 'yfx';
				} else if (name == '已审核') {
					status = 'ysh';
				} else if (name == '已结单') {
					status = 'yjd';
				}
			} else if (obj == 3) {
				professional = 1;
				this.handTitle = '线路';
				if (name == '已发现') {
					status = 'yfx';
				} else if (name == '已审核') {
					status = 'ysh';
				} else if (name == '已结单') {
					status = 'yjd';
				}
			} else if (obj == 4) {
				professional = 3;
				this.handTitle = '电缆';
				if (name == '已发现') {
					status = 'yfx';
				} else if (name == '已审核') {
					status = 'ysh';
				} else if (name == '已结单') {
					status = 'yjd';
				}
			}
			let rangeType;
			if (this.typeClass == 0) {
				rangeType = 'today';
				this.handTitle = '本日' + this.handTitle;
			} else if (this.typeClass == 1) {
				rangeType = 'week';
				this.handTitle = '本周' + this.handTitle;
			} else {
				rangeType = 'month';
				this.handTitle = '本月' + this.handTitle;
			}

			let params = {
				rangeType: rangeType,
				bugType: '2',
				limit: this.pageSize,
				offset: this.offset,
				professional: professional,
				status: status
			};
			dataApi.getqxjkDetail(params).then(result => {
				this.tableData = result.data.data.page.list;
				this.total = result.data.data.page.count;
				this.loading = false;
			});
		},

		onCurrentChange(page) {
			//分页切换时
			this.currentPage = page;
			this.offset = (page - 1) * this.pageSize;
			if (this.activeTypeName == 'details') {
				this.onClickGrade(this.newObj);
			} else {
				this.onClickNum(this.newObj, this.name);
			}
		},
		//关闭弹窗重置分页1
		onClose() {
			this.isShow = !this.isShow;
			this.noworkBox = false;
			this.currentPage = 1;
		},

		// 状态等级判断
		onClickGrade(status) {
			this.activeTypeName = 'details';
			this.isShow = true;
			this.loading = true;
			this.noworkBox = true;
			let danger;
			this.tableColumns = this.allColumns;
			this.newObj = status;
			if (status == 'ybnumber') {
				this.handTitle = '一般';
				danger = '41238B3E2AE6405AB53BF5AB57C3A1A8';
			} else if (status == 'yznumber') {
				this.handTitle = '严重';
				danger = 'E241024163114CD78B0352A41A1B4B66';
			} else if (status == 'wjnumber') {
				this.handTitle = '危急';
				danger = 'E55393188F774708BB83EC052E6FE30E';
			}
			let params = {
				rangeType: 'today',
				bugType: '2',
				limit: this.pageSize,
				offset: this.offset,
				danger: danger
			};
			dataApi.getswiperList(params).then(result => {
				this.tableData = result.data.data.page.list;
				this.total = result.data.data.page.count;
				this.loading = false;
			});
		},

		locationYhqx(id, lon, lat) {
			let layer = {
				id: id, //定位对象id
				layerName: 'HiddenHefectsLayer', //定位图层
				zoom: 18, //定位图层
				point: {
					lng: lon,
					lat: lat
				}
			};
			eventBus.emit('layer-flyClickTips', {
				layer
			}); //隐患缺陷图层定位
		},

		// 隐患监控坐标定位

		onhandClick(row) {
			let layer = {
				id: row.id, //定位对象id
				layerName: 'HiddenHefectsLayer', //定位图层
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

		//页面echarts图表渲染事件
		renderEchart(el, option, data) {
			if (el && option) {
				if (data) {
					option.dataset.source = data;
					// for (let i = 0; i < data.length; i++) {
					//     option.dataset.source = data[i];
					// }
				}
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById(el));

				myChart.setOption(option);
				myChart.clear();
				myChart.setOption(option);
				let _this = this;
				myChart.on('click', function(params) {
					if (params.color != '#182c41') {
						_this.onClickNum(params.componentIndex, params.name);
					}
				});
			}
		},
		colorFn(resData) {
			let total = 0;
			for (var key in resData) {
				total = 0;
				for (var i = 0; i < resData[key].length; i++) {
					total += parseInt(resData[key][i]);
					if (total == 0) {
						if (key == 'bdNum') {
							this.troubleNewOption.series[0].itemStyle.normal.color = '#182c41';
						} else if (key == 'pdzdhNum') {
							this.troubleNewOption.series[1].itemStyle.normal.color = '#182c41';
						} else if (key == 'pdNum') {
							this.troubleNewOption.series[2].itemStyle.normal.color = '#182c41';
						} else if (key == 'xlNum') {
							this.troubleNewOption.series[3].itemStyle.normal.color = '#182c41';
						} else if (key == 'dlNum') {
							this.troubleNewOption.series[4].itemStyle.normal.color = '#182c41';
						}
					}
				}
			}
		},
		//获取隐患缺陷列表
		dssx() {
			let params = {
				rangeType: 'today',
				bugType: '2',
				offset: '0',
				limit: '1000'
			};
			dataApi.getqxjkDetail(params).then(result => {
				let one = 0;
				let two = 0;
				let three = 0;
				for (let i = 0; i < result.data.data.page.list.length; i++) {
					let name = result.data.data.page.list[i].bug_property_name;
					if (name == '一般') {
						one++;
						this.oneNumber = one;
					} else if (name == '严重') {
						two++;
						this.twoNumber = two;
					} else if (name == '危急') {
						three++;
						this.threeNumber = three;
					}
				}
			});
		},
		// 根据类型统计今日隐患缺陷
		getTodayBugSummary() {
			let params = {
				rangeType: 'today',
				bugType: '2'
			};
			dataApi.getcensusList(params).then(result => {
				if (result.data.data) {
					let resData = result.data.data;
					this.colorTodayData = resData;
					this.colorNewData = resData;
					this.colorFn(resData);
					this.troubleTodayData = [
						['product', '2012', '2013', '2014', '2015', '2016'],
						['已发现', resData.bdNum[0], resData.pdzdhNum[0], resData.pdNum[0], resData.xlNum[0], resData.dlNum[0]],
						['已审核', resData.bdNum[1], resData.pdzdhNum[1], resData.pdNum[1], resData.xlNum[1], resData.dlNum[1]],
						['已结单', resData.bdNum[2], resData.pdzdhNum[2], resData.pdNum[2], resData.xlNum[2], resData.dlNum[2]]
					];
					this.renderEchart('echarts-bb-1', this.troubleNewOption, this.troubleTodayData);
				} else {
					return;
				}
			});
		},
		// 根据类型统计本周隐患缺陷
		getWeekBugSummary() {
			let params = {
				rangeType: 'week',
				bugType: '2'
			};
			dataApi.getcensusList(params).then(result => {
				if (result.data.data) {
					let resData = result.data.data;
					this.colorWeekData = resData;
					this.troubleWeekData = [
						['product', '2012', '2013', '2014', '2015', '2016'],
						['已发现', resData.bdNum[0], resData.pdzdhNum[0], resData.pdNum[0], resData.xlNum[0], resData.dlNum[0]],
						['已审核', resData.bdNum[1], resData.pdzdhNum[1], resData.pdNum[1], resData.xlNum[1], resData.dlNum[1]],
						['已结单', resData.bdNum[2], resData.pdzdhNum[2], resData.pdNum[2], resData.xlNum[2], resData.dlNum[2]]
					];
				} else {
					return;
				}
			});
		},
		// 根据类型统计本月隐患缺陷
		getMonthBugSummary() {
			let params = {
				rangeType: 'month',
				bugType: '2'
			};
			dataApi.getcensusList(params).then(result => {
				if (result.data.data) {
					let resData = result.data.data;
					this.colorMonthData = resData;
					this.troubleMonthData = [
						['product', '2012', '2013', '2014', '2015', '2016'],
						['已发现', resData.bdNum[0], resData.pdzdhNum[0], resData.pdNum[0], resData.xlNum[0], resData.dlNum[0]],
						['已审核', resData.bdNum[1], resData.pdzdhNum[1], resData.pdNum[1], resData.xlNum[1], resData.dlNum[1]],
						['已结单', resData.bdNum[2], resData.pdzdhNum[2], resData.pdNum[2], resData.xlNum[2], resData.dlNum[2]]
					];
				} else {
					return;
				}
			});
		},
		// 获取缺陷隐患列表
		getBugLists() {
			let params = {
				rangeType: 'today',
				bugType: '2',
				offset: '0',
				limit: '10'
			};
			dataApi.getswiperList(params).then(result => {
				let dataList = result.data.data.page.list;
				if (dataList.length) {
					this.troubleDetail = [];
					for (let i = 0; i < dataList.length; i++) {
						let classify = 'type1';
						if (dataList[i].bug_property_name == '严重') {
							classify = 'type2';
						} else if (dataList[i].bug_property_name == '危急') {
							classify = 'type3';
						}

						if (dataList[i].doc_status == '待审核') {
							dataList[i].type = 'type2';
						} else if (dataList[i].doc_status == '已完结') {
							dataList[i].type = 'type3';
						} else {
							dataList[i].type = 'type1';
						}

						this.troubleDetail.push({
							type: dataList[i].type,
							classify: classify,
							// classify: dataList[i].bug_type_name,
							mark: dataList[i].doc_status,
							title: dataList[i].bug_property_name,
							// time:dataList[i].create_on.slice(12),  //截取年月日
							time: dataList[i].create_on,
							message: dataList[i].create_address,
							id: dataList[i].id, //定位参数
							lon: dataList[i].longitude, //定位参数
							lat: dataList[i].latitude //定位参数
						});
					}
					//巡视隐患消息走马灯
					this.$parent.msgInterval(this.$refs.troubleUl, this.$refs.troubleUl2, 3000);
				}
			});
		}
	},
	mounted() {
		this.troubleNewOption = JSON.parse(JSON.stringify(this.troubleOption));
		this.renderEchart('echarts-bb-1', this.troubleNewOption, this.troubleTodayData);
		this.getTodayBugSummary();
		this.getWeekBugSummary();
		this.getMonthBugSummary();
		this.getBugLists();
		//获取隐患缺陷列表
		this.dssx();
		setInterval(this.dssx, 30000);
	}
};
</script>

<style scoped>
.icon_parent {
	position: relative;
}

.icon_parent .onetitle {
	display: inline-block;
	color: #ffffff;
	position: absolute;
	top: 65px;
	left: -5px;
	font-size: 18px;
}

.smallTitle {
	font-size: 18px;
}

.smallTitle .icon_right {
	width: 30px;
	height: 30px;
	background: url(../assets/images/ic_triangle.png) no-repeat;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	display: inline-block;
	vertical-align: middle;
	margin-right: 2px;
	margin-left: 35px;
}

.section,
.sectionMain {
	z-index: inherit !important;
}

/* 弹窗定位 */
.sectionBody5 {
	position: relative;
}

.sectionBody5 .workBox {
	position: absolute;
	width: 1190px;
	height: 415px;
	top: 0;
	left: 35px;
}
.sectionBody5 .noworkBox {
	position: absolute;
	width: 1190px;
	height: 415px;
	top: 430px;
	left: 35px;
}

.sectionBody5 .workBox /deep/ .el-table th,
.sectionBody5 .workBox /deep/ .el-table td {
	padding: 14px 0;
}

.smallTitle .wenzi_right {
	display: inline-block;
	float: right;
}
.smallTitle .wenzi_right b {
	font-weight: normal;
	display: inline-block;
	margin-left: 20px;
}
.smallTitle .wenzi_right b font {
	margin: 0 3px;
}
.smallTitle .wenzi_right b i {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin: 2px 10px;
}
.smallTitle .wenzi_right b:nth-child(1) i {
	background: #33c172;
}
.smallTitle .wenzi_right b:nth-child(1) font {
	color: #33c172;
}
.smallTitle .wenzi_right b:nth-child(2) i {
	background: yellow;
}
.smallTitle .wenzi_right b:nth-child(2) font {
	color: yellow;
}
.smallTitle .wenzi_right b:nth-child(3) i {
	background: orange;
}
.smallTitle .wenzi_right b:nth-child(3) font {
	color: orange;
}

/* 覆盖样式 */
.detailLi.type2 .detailLiCon:nth-of-type(1) {
	display: none;
}
.detailLi.type2 .detailLiCon:nth-of-type(4) {
	width: auto;
}
.detailLi.type2 .detailLiCon:nth-of-type(3) {
	text-align: center;
	width: 50px;
	height: 22px;
	line-height: 22px;
	display: inline-block;
	vertical-align: middle;
	font-size: 12px;
	text-align: center;
	border-radius: 3px;
	margin: 5px;
}
.detailLiCon.detailBugPro {
	color: #33c172 !important;
	border: 1px solid #33c172 !important;
}
.detailLiCon.detailBug {
	color: orange !important;
	border: 1px solid orange !important;
}
.detailLiCon.detailBugWar {
	color: yellow !important;
	border: 1px solid yellow !important;
}
.sectionBody6 .sectionCons .detailUlWrap .detailUl .width300 {
	width: 300px;
}
</style>

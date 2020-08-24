<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop"><div class="sectiontitle">资源集约管控</div></div>
			</div>
			<div class="sectionBody sectionBody8">
				<div class="sourceBox">
					<div class="sourceHead">运维队伍</div>
					<div class="sourceBody"><div id="operEchart" class="forEcharts etype4"></div></div>
				</div>
				<!-- 施工队伍组件 -->
				<sgdw-section></sgdw-section>

				<div class="sourceBox">
					<div class="subSourceBox">
						<div class="subSourceHead">
							<span class="subTitle">4G单兵</span>
							<span class="titleTail"></span>
							<span class="subText">总数</span>
							<span class="subNum">0</span>
							<span class="subText">在线数</span>
							<span class="subNum">0</span>
						</div>
						<div class="subSourceBody">
							<ul class="sourceUl">
								<li class="sourceLi">
									<div class="sourceLiCon">0</div>
									<div class="sourceLiText">施工现场管控</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">0</div>
									<div class="sourceLiText">网格化运维</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">0</div>
									<div class="sourceLiText">其他</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="subSourceBox">
						<div class="subSourceHead">
							<span class="subTitle">AR眼镜</span>
							<span class="titleTail"></span>
							<span class="subText">总数</span>
							<span class="subNum">0</span>
							<span class="subText">在线数</span>
							<span class="subNum">0</span>
							<!-- <span class="floatRight">待开发</span> -->
						</div>
						<div class="subSourceBody">
							<ul class="sourceUl">
								<li class="sourceLi">
									<div class="sourceLiCon">0</div>
									<div class="sourceLiText">施工现场管控</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">0</div>
									<div class="sourceLiText">网格化运维</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">0</div>
									<div class="sourceLiText">其他</div>
								</li>
							</ul>
						</div>
					</div>
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
			</div>
		</div>
	</div>
</template>

<script>
import { wgs2bd } from './baidumap/utils/Convert'; //坐标转换
import eventBus from './baidumap/base/EventBus';
import DetailInfo from './baidumap/detailed/DetailInfo'; //工作票情况信息弹窗,
import SgdwSection from './SgdwSection'; //引入施工队伍组件
import table from '../mixins/table'; //引入表格混入
import ywdwTable from './baidumap/tables/zyjygkJs/ywdwTable'; // 环形图弹出数据明细Table
import * as dataApi from '../api/apiData.js';
export default {
	mixins: [table],
	components: {
		DetailInfo,
		SgdwSection
	},
	name: 'zyjkSection',
	props: {
		width: {
			type: Number,
			default: 1242
		},
		height: {
			type: Number,
			default: 940
		},
		left: {
			type: Number,
			default: 2924
		},
		top: {
			type: Number,
			default: 114
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			handTitle: '标题',
			loading: false, //加载中...
			tableData: [],
			tableColumns: [],
			isShow: false,
			xianLu: [],
			bianDian: [],
			peiDian: [],
			dianLan: [],
			staticObj: [],
			list: [],
			// 运维队伍echarts options
			operOption: {
				title: [
					{
						text: '342',
						x: 'center',
						y: '32%',
						textStyle: {
							fontSize: 30,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#4bb5ff'
						}
					},
					{
						text: '总数',
						x: 'center',
						y: '42%',
						textStyle: {
							fontSize: 20,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#ffffff'
						}
					}
				],
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					bottom: '10%',
					itemGap: 25,
					// formatter: function (name) {
					//   return 'Legend ' + name;
					// },
					textStyle: {
						fontSize: 16,
						padding: [0, 0, 0, 4],
						color: '#ffffff'
					},
					data: ['线路', '电缆', '变电', '配电']
				},
				color: ['#13b6ff', '#05fbaa', '#10f2ea', '#fec612'],
				series: [
					{
						name: '运维统计',
						type: 'pie',
						center: ['50%', '40%'],
						radius: ['45%', '55%'],
						startAngle: 360,
						avoidLabelOverlap: false
					}
				]
			},
			// 运维队伍echarts data
			operData: [
				[
					{
						value: 100,
						name: '线路'
					},
					{
						value: 90,
						name: '电缆'
					},
					{
						value: 80,
						name: '变电'
					},
					{
						value: 72,
						name: '配电'
					}
				]
			],
			// 环形图弹出数据明细
			tableColumns: ywdwTable
		};
	},

	methods: {
		// echarch图点击明细
		onClickNum(obj) {
			this.newObj = obj;
			this.isShow = true;
			this.loading = true;
			this.offset = 0;
			this.tableColumns = this.tableColumns;
			let data = [];
			if (obj == '变电') {
				this.handTitle = '变电';
				data = this.bianDian;
			} else if (obj == '配电') {
				this.handTitle = '配电';
				data = this.peiDian;
			} else if (obj == '线路') {
				this.handTitle = '线路';
				data = this.xianLu;
			} else if (obj == '电缆') {
				this.handTitle = '电缆';
				data = this.dianLan;
			}
			this.onall(data);
			// this.total = this.tableData.length;
			this.loading = false;
		},
		onall(obj) {
			//初始化显示默认条数和总条数
			console.log('onall', obj);
			this.total = obj.length;
			this.staticObj = obj;
			this.list = [];
			obj.map((dom, index) => {
				if (index >= this.offset && index < this.currentPage * this.pageSize) {
					this.list.push(dom);
				}
			});
			console.log('obj', this.list);
			this.tableData = this.list;
		},

		onCurrentChange(page) {
			//分页切换时
			this.currentPage = page;
			this.offset = (page - 1) * this.pageSize;
			this.onall(this.staticObj);
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
					_this.onClickNum(params.name);
				});
			}
		},

		// 资源监控坐标定位
		onhandClick(row) {
			console.log(row);
			console.log(row.realtime_point.location[0]);
			console.log(row.realtime_point.location[1]);
			let layer = {
				id: row.entity_name, //定位对象id
				layerName: 'GridPersonnelLayer', //定位图层
				zoom: 18, //定位图层
				point: {
					lng: row.realtime_point.location[0],
					lat: row.realtime_point.location[1]
				}
			};
			eventBus.emit('layer-flyClickTips', {
				layer
			}); //隐患缺陷图层定位
		}
	},

	mounted() {
		//运维队伍echarts图表---echarts
		let params = {
			limit: '-1'
		};
		dataApi.getywdwOnline(params).then(result => {
			let xlCount = 0;
			let bdCont = 0;
			let dlCont = 0;
			let pdCont = 0;
			for (let i = 0; i < result.data.data.length; i++) {
				let type = result.data.data[i].dept_name;
				if (type == '线路') {
					xlCount++;
					this.xianLu.push(result.data.data[i]);
				} else if (type == '变电') {
					bdCont++;
					this.bianDian.push(result.data.data[i]);
				} else if (type == '电缆') {
					dlCont++;
					this.dianLan.push(result.data.data[i]);
				} else if (type == '配电') {
					pdCont++;
					this.peiDian.push(result.data.data[i]);
				}
			}
			this.operOption.title[0].text = xlCount + bdCont + dlCont + pdCont;
			this.operData = [
				[
					{
						value: xlCount,
						name: '线路'
					},
					{
						value: dlCont,
						name: '电缆'
					},
					{
						value: bdCont,
						name: '变电'
					},
					{
						value: pdCont,
						name: '配电'
					}
				]
			];
			this.renderEchart('operEchart', this.operOption, this.operData);
		});
	}
};
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
	background: url('../assets/images/ic_4G.png') no-repeat left 10px bottom;
}

.subSourceBox:nth-of-type(2) .subSourceHead {
	background: url('../assets/images/ic_AR.png') no-repeat left 10px bottom;
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
.subSourceHead .floatRight {
	float: right;
	color: #13b6ff;
	font-size: 20px;
	font-weight: bold;
	vertical-align: ;
	margin-top: 5px;
	padding-right: 15px;
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
.workBox /deep/ .el-table td {
	padding: 17px 0;
}
/deep/ .el-table {
	overflow: hidden;
}
</style>

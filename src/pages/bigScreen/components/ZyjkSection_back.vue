<template>
	<div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop">
					<div class="sectiontitle">资源监控</div>
				</div>
			</div>
			<div class="sectionBody sectionBody8">
				<div class="sourceBox">
					<div class="sourceHead">运维队伍</div>
					<div class="sourceBody">
						<div id="operEchart" class="forEcharts etype4"></div>
					</div>
				</div>
				<!-- <div class="sourceBox">
					<div class="sourceHead">施工队伍</div>
					<div class="sourceBody">
						<div class="echartsTitle">总数：<strong>{{ constAll }}</strong></div>
						<div id="constEchart" class="forEcharts etype5"></div>
					</div>
				</div> -->
				<!-- 施工队伍组件 -->
				<sgdw-section></sgdw-section>
				
				<div class="sourceBox">
					<div class="subSourceBox">
						<div class="subSourceHead">
							<span class="subTitle">4G单兵</span><span class="titleTail"></span><span class="subText">总数</span><span class="subNum">126</span><span
							 class="subText">在线数</span><span class="subNum">105</span>
						</div>
						<div class="subSourceBody">
							<ul class="sourceUl">
								<li class="sourceLi">
									<div class="sourceLiCon">23</div>
									<div class="sourceLiText">施工现场管控</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">15</div>
									<div class="sourceLiText">网格化运维</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">9</div>
									<div class="sourceLiText">其他</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="subSourceBox">
						<div class="subSourceHead">
							<span class="subTitle">AR眼镜</span><span class="titleTail"></span><span class="subText">总数</span><span class="subNum">126</span><span
							 class="subText">在线数</span><span class="subNum">105</span>
						</div>
						<div class="subSourceBody">
							<ul class="sourceUl">
								<li class="sourceLi">
									<div class="sourceLiCon">23</div>
									<div class="sourceLiText">施工现场管控</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">15</div>
									<div class="sourceLiText">网格化运维</div>
								</li>
								<li class="sourceLi">
									<div class="sourceLiCon">9</div>
									<div class="sourceLiText">其他</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<detail-info :columns="tableColumns" :dataSource="tableData" :currentPage="currentPage" :hasIndex="true" :isShow="isShow"
				 :handTitle="handTitle" :loading="loading" :total="total" :pageSize="pageSize" @showClose="onClose" @current-change="onCurrentChange"  @onhand-click="onhandClick"></detail-info>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		wgs2bd
	} from "./baidumap/utils/Convert"; //坐标转换
	import eventBus from "./baidumap/base/EventBus";
	import DetailInfo from "./baidumap/detailed/DetailInfo"; //工作票情况信息弹窗,
	import SgdwSection from "./SgdwSection"; //引入施工队伍组件
	import table from "../mixins/table" //引入表格混入
	
	export default {
		mixins: [table],
		components: {
			DetailInfo,SgdwSection
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
			},
		},
		data() {
			return {
				handTitle: '标题',
				loading: false, //加载中...
				tableData: [],
				tableColumns: [],
				isShow: false,
				// 运维队伍echarts options
				operOption: {
					title: [{
						text: '342',
						x: 'center',
						y: '32%',
						textStyle: {
							fontSize: 30,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#4bb5ff'
						}
					}, {
						text: '总数',
						x: 'center',
						y: '42%',
						textStyle: {
							fontSize: 20,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#ffffff'
						}
					}],
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
					color: ['#13b6ff', '#fec612', '#ff4c47', '#05fbaa'],
					series: [{
						name: '运维统计',
						type: 'pie',
						center: ['50%', '40%'],
						radius: ['45%', '55%'],
						startAngle: 360,
						avoidLabelOverlap: false,
					}]
				},

				// 运维队伍echarts data
				operData: [
					[{
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
				tableColumns: [{
						hasSort: false, //<Boolean> 是否排序
						isCustomize: true, //<Boolean> 是否自定义
						prop: 'operate', //<String>  对应属性名
						label: '操作', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'full_name', //<String>  对应属性名
						label: '用户名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'working_team_name', //<String>  对应属性名
						label: '班组名称', //<String>   表头标签
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
				this.tableColumns = this.tableColumns;
				let professional;
				if (obj == '变电') {
					this.handTitle = "变电";
					professional = '4'
				} else if (obj == '配电') {
					this.handTitle = "配电";
					professional = '2'
				} else if (obj == '线路') {
					this.handTitle = "线路";
					professional = '1'
				} else if (obj == '电缆') {
					this.handTitle = "电缆";
					professional = '3'
				}
				this.$$utils.axiosRequest(
					'/pdaqfh_war_exploded/f/wgyw/getWgywPersonList?isOnline=true&limit=' +
					this.pageSize+'&offset='+this.offset+'&professional='+professional, '获取网格化人员列表').then(
					result => {
						console.log('获取网格化人员列表--明细',result)
						this.tableData = result.data.page.list;
						this.total = result.data.page.count;
						this.loading = false;
					});
					
					this.$$utils.axiosRequest(
						'/pdaqfh_Web_exploded/f/wgyw/getOnlinePeopleLocations?limit=-1', '获取今日工作列表').then(result => {
						console.log('获取今日工作列表', result)
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
			
			// 资源监控坐标定位
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

			//运维队伍echarts图表---echarts
			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getCurrentPersonSummary', '获取当前人员统计信息').then(result => {
				console.log('获取当前人员统计信息--统计',result)
				let xl = result.data[0].online_users;
				let pd = result.data[1].online_users;
				let dl = result.data[2].online_users;
				let bd = result.data[3].online_users;
				this.operOption.title[0].text = xl + pd + dl + bd;
				this.operData = [
					[{
							value: xl,
							name: '线路'
						},
						{
							value: dl,
							name: '电缆'
						},
						{
							value: bd,
							name: '变电'
						},
						{
							value: pd,
							name: '配电'
						}
					]
				];
				this.renderEchart('operEchart', this.operOption, this.operData);
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

<template>
	<div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
		<div class="sectionMain">
			<div class="sectionSplit icon_parent">
				<div class="smallTitle onetitle"><i class="icon_right"></i>统计</div>
				<div class="sectionTab">
					<a class="sectionTabLink" :class="{active: item.display}" href="javascript:;" v-for="(item,index) in defectTabData"
					 :key="index" @click="tabChange(defectTabData,index)">{{ item.text }}</a>
				</div>
				<div class="sectionHead">
					<div class="sectionTop">
						<div class="sectiontitle">隐患监控</div>
					</div>
				</div>
				<div class="sectionBody sectionBody3">
					<div class="sectionCons">
						<div class="sectionConInner" v-show="item.display" v-for="(item,index) in defectTabData" :key="index">
							<div :id="setId('aa',index)" class="forEcharts etype1"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="sectionSplit">
				<div class="sectionHead smallTitle">
					<i class="icon_right"></i>明细
					<p class="wenzi_right">
						<b><i></i>一般:<font>{{oneNumber}}</font>条</b>
						<b><i></i>严重:<font>{{twoNumber}}</font>条</b>
						<b><i></i>危急:<font>{{threeNumber}}</font>条</b>
					</p>
					</div>
				<div class="sectionBody sectionBody4">
					<div class="sectionCons">
						<!-- 后面待删除部分 --> 
						<p class="test" @click="waitDelete">
							<span class="dengji">严重</span>
							<span class="status">待审核</span>
							<span class="time">2019-09-16 10:36:34</span>
							<span class="detali">汇芦1510线</span>
						</p>
						
						
						<div class="detailUlWrap">
							<ul ref="detailUl" class="detailUl">
								<li class="detailLi" v-for="(item,index) in defectDetail" :key="index" @click="onDefect(item.id,item.longitude,item.latitude)">
									<div class="detailLiCon detailBug" :class="{'detailBugPro':item.bug_property_name == '一般','detailBugWar':item.bug_property_name == '严重'}">{{item.bug_property_name}}</div>
									<div class="detailLiCon detailMark" :class="item.type">{{ item.mark }}</div>
									<div class="detailLiCon">{{ item.time }}</div>
									<div class="detailLiCon detailMessage">{{ item.message }}</div>
								</li>
							</ul>
							<ul ref="detailUl2" class="detailUl detailUl2">
								<li class="detailLi" v-for="(item,index) in defectDetail" :key="index" @click="onDefect(item.id,item.longitude,item.latitude)">
									<div class="detailLiCon detailBug" :class="{'detailBugPro':item.bug_property_name == '一般','detailBugWar':item.bug_property_name == '严重'}">{{item.bug_property_name}}</div>
									<div class="detailLiCon detailMark" :class="item.type">{{ item.mark }}</div>
									<div class="detailLiCon">{{ item.time }}</div>
									<div class="detailLiCon detailMessage">{{ item.message }}</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 缺陷监控弹窗 -->
		<detail-info :columns="tableColumns" :dataSource="tableData" :currentPage="currentPage" :hasIndex="true" :isShow="isShow"  :handTitle="handTitle"
	 :loading="loading"	 :total="total" :pageSize="pageSize" @showClose="onClose" @current-change="onCurrentChange"  @onhand-click="onhandClick"></detail-info>

	</div>      



</template>


<script>
	import eventBus from "./baidumap/base/EventBus";
	import DetailInfo from "./baidumap/detailed/DetailInfo"; //缺陷监控信息弹窗
	import { wgs2bd } from "./baidumap/utils/Convert";//坐标转换
	import table from "../mixins/table" //引入表格混入
	export default {
		mixins: [table],
		components: {
			DetailInfo
		},
		name: 'xsqxSection',
		props: {
			width: {
				type: Number,
				default: 1010
			},
			height: {
				type: Number,
				default: 428
			},
			left: {
				type: Number,
				default: 74
			},
			top: {
				type: Number,
				default: 630
			},
			show: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				// 弹框默认关闭
				isShow: false,
				handTitle:'缺陷监控统计',
				loading:false,//加载中...
				tableData: [],
				tableColumns: [],
				typeClass:0,
				oneNumber:0,
				twoNumber:0,
				threeNumber:0,
				// 巡视缺陷echarts options
				defectOption: {
					backgroundColor: '',
					title: {
						textStyle: {
							color: '#00FFFF',
							fontSize: 24
						}
					},
					legend: {
						top: 20,
						itemGap: 20,
						textStyle: {
							color: '#fff',
						}
					},
					grid: {
						left: '5%',
						right: '8%',
						bottom: '10%',
						height: "70%",
						containLabel: true
					},
					yAxis: {
						type: 'value',
						gridIndex: 0,
						nameLocation: 'start',
						nameTextStyle: {
							color: '#979797',
							fontSize: 14,
							padding: [-21, 65, 0, 0]
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#979797',
							}
						},
						splitLine: {
							// interval:1,
							show: false,
							lineStyle: {
								color: '#071f2a',
								width: 1,
								type: 'solid'
							}
						},
						axisLabel: {
							show: false,
							textStyle: {
								color: '#979797',
								fontWeight: 'normal',
								fontSize: '14',
							},
						},
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#0d5672',
							}
						},
						axisLabel: {
							inside: false,
							interval:0,//横轴信息全部显示 
							textStyle: {
								color: '#ffffff',
								fontWeight: 'normal',
								fontSize: '16',
							},
							margin: 15,
						},
						data: ['线路', '电缆', '变电', '配电', '配电自动化'],
					}],
					series: [{
							name: '已发现',
							type: 'bar',
							itemStyle: {
								normal: {
									show: true,
									color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(74,196,253,1)'
									}, {
										offset: 1,
										color: 'rgba(24,46,85,1)'
									}]),
									borderWidth: 0,
									label: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#ffffff',
											fontSize: 12
										}
									}
								},
							},
							zlevel: 2,
							barWidth: '15',
							data: [8, 15, 10, 14, 19]
						}, {
							name: '已审核',
							type: 'bar',
							barWidth: '15',
							itemStyle: {
								normal: {
									show: true,
									color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(215,213,36,1)'
									}, {
										offset: 1,
										color: 'rgba(70,74,6,1)'
									}]),
									borderWidth: 0,
									label: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#ffffff',
											fontSize: 12
										}
									}
								}
							},
							zlevel: 2,
							barGap: '30%',
							data: [8, 17, 26, 19, 22]
						}, {
							name: '已结单',
							type: 'bar',
							barWidth: '15',
							itemStyle: {
								normal: {
									show: true,
									color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(82,220,150,1)'
									}, {
										offset: 1,
										color: 'rgba(1,116,77,1)'
									}]),
									borderWidth: 0,
									label: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#ffffff',
											fontSize: 12
										}
									}
								}
							},
							zlevel: 2,
							barGap: '30%',
							data: [8, 17, 26, 21, 27]
						}

					]
				},
				defectTabData: [{
						text: '当日',
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
				// 本日data
				defectTodayData: [
					[8, 15, 10, 14, 19],
					[8, 15, 10, 14, 19],
					[8, 15, 10, 14, 19]
				],
				// 本周data
				defectWeekData: [
					[8, 15, 10, 14, 19],
					[8, 15, 10, 14, 19],
					[8, 15, 10, 14, 19]
				],
				// 本月data
				defectMonthData: [
					[88, 45, 34, 56, 19],
					[88, 45, 33, 56, 19],
					[88, 45, 66, 56, 19]
				],
				// 巡视缺陷明细列表数据
				defectDetail: [{
						type: 'type1',
						mark: '已发现',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '一般'
					},
					{
						type: 'type2',
						mark: '已审核',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '一般'
					},
					{
						type: 'type3',
						mark: '已结单',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '严重'
					},
					{
						type: 'type1',
						mark: '已发现',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '一般'
					},
					{
						type: 'type2',
						mark: '已审核',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '危急'
					},
					{
						type: 'type3',
						mark: '已结单',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '一般'
					},
					{
						type: 'type1',
						mark: '已发现',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '严重'
					},
					{
						type: 'type2',
						mark: '已审核',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '一般'
					},
					{
						type: 'type3',
						mark: '已结单',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '一般'
					},
					{
						type: 'type1',
						mark: '已发现',
						time: '2019-05-17 14:00:28',
						message: '浦东新区杨高南路XXX小区线路缺陷',
						bug_property_name: '危急'
					}
					
				],


				// 缺陷监控--今日
				todayColumns: [{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						isCustomize: true, //<Boolean> 是否自定义
						prop: 'operate', //<String>  对应属性名
						label: '操作', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_type_name', //<String>  对应属性名
						label: '单据类别', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_property_name', //<String>  对应属性名
						label: '危险程度', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_class_name', //<String>  对应属性名
						label: '性质', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'voltage_class_name', //<String>  对应属性名
						label: '电压级别', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'device_name', //<String>  对应属性名
						label: '设备名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'line_name', //<String>  对应属性名
						label: '线路名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'remark', //<String>  对应属性名
						label: '情况描述', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'create_address', //<String>  对应属性名
						label: '地址', //<String>   表头标签
					}
				],
				// 缺陷监控--本周
				monthColumns: [
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_type_name', //<String>  对应属性名
						label: '单据类别', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_property_name', //<String>  对应属性名
						label: '危险程度', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_class_name', //<String>  对应属性名
						label: '性质', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'voltage_class_name', //<String>  对应属性名
						label: '电压级别', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'device_name', //<String>  对应属性名
						label: '设备名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'line_name', //<String>  对应属性名
						label: '线路名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'remark', //<String>  对应属性名
						label: '情况描述', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'create_address', //<String>  对应属性名
						label: '地址', //<String>   表头标签
					}
				],
				// 缺陷监控--本月
				weekColumns: [
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_type_name', //<String>  对应属性名
						label: '单据类别', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_property_name', //<String>  对应属性名
						label: '危险程度', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'bug_class_name', //<String>  对应属性名
						label: '性质', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'voltage_class_name', //<String>  对应属性名
						label: '电压级别', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'device_name', //<String>  对应属性名
						label: '设备名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'line_name', //<String>  对应属性名
						label: '线路名称', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'remark', //<String>  对应属性名
						label: '情况描述', //<String>   表头标签
					},
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
						prop: 'create_address', //<String>  对应属性名
						label: '地址', //<String>   表头标签
					}
				],
				tableData: [
				// 	{
				// 	bug_type_name:'缺陷',
				// 	bug_property_name:'一般',
				// 	bug_class_name:'设备类',
				// 	voltage_class_name:'10kv',
				// 	device_name:'蔷20唐陆乔亭',
				// 	line_name:'蔷20唐陆乔亭',
				// 	remark:'蔷20唐陆乔亭',
				// 	create_address: '上海市普陀区金沙江路 1518 弄'
				// }
				],

			}
		},
		methods: {
			tabChange(data, index) {
				this.typeClass=index
				this.$parent.tabChange(data, index);
				if (index === 1) {
					//渲染页面echarts图表---本周echarts
					this.renderEchart('echarts-aa-2', this.defectOption, this.defectWeekData);
				}
				if (index === 2) {
					//渲染页面echarts图表---本月echarts
					this.renderEchart('echarts-aa-3', this.defectOption, this.defectMonthData);
				}
			},
			setId(pid, id) {
				return this.$parent.setId(pid, id)
			},
			onClickNum(obj) {
				this.isShow = true;
				this.newObj = obj;
				this.loading=true;
				let ticketType,professional;
				if(obj == '线路'){
					this.handTitle="线路";
					professional =1
				}else if(obj == '电缆'){
					this.handTitle="电缆";
					professional =3
				}else if(obj == '变电'){
					this.handTitle="变电";
					professional =4
				}else if(obj == '配电'){
					this.handTitle="配电";
					professional =2
				}else {
					this.handTitle="配电自动化";
					professional =7
				}
				let rangeType;
				if(this.typeClass==1){//周
					rangeType="week"
					this.handTitle="本周"+this.handTitle;
					this.tableColumns = this.weekColumns;
				}else if(this.typeClass==2){//月
					rangeType="month"
					this.handTitle="本月"+this.handTitle
					this.tableColumns = this.monthColumns;
				}else{
					rangeType="today"
					this.handTitle="当日"+this.handTitle;
					this.tableColumns = this.todayColumns;
				}
				this.$$utils.axiosRequest(
					'/pdaqfh_war_exploded/f/wgyw/getBugList?rangeType='+rangeType+'&bugType=1&limit=' +
					this.pageSize+'&offset='+this.offset+'&professional='+professional, '获取缺陷隐患列表').then(
					result => {
						console.log('获取缺陷隐患列表', result)
						this.tableData = result.data.page.list;
						this.total = result.data.page.count;
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
						_this.onClickNum(params.name)
					})
				}
			},

            // 坐标定位(缺陷监控统计)
            onhandClick(row){
            	let layer = {
					id: row.id, //定位对象id
					layerName: "HiddenHefectsLayer", //定位图层
					zoom: 18, //定位图层
					point: {
						lng: row.longitude,
						lat:row.latitude
					}
				}
				eventBus.emit("layer-flyClickTips", {
					layer
				}); //隐患缺陷图层定位
           },
		    // 坐标定位(缺陷监控明细)
		   onDefect(id, lon, lat) {
				let layer = {
					id: id, //定位对象id
					layerName: "HiddenHefectsLayer", //定位图层
					zoom: 18, //定位图层
					point: {
						lng: lon,
						lat: lat
					}
				}
				eventBus.emit("layer-flyClickTips", {
					layer
				}); //隐患缺陷图层定位
			},
			
			
			// 演示弹窗待删除
			waitDelete(){
				eventBus.emit("graphic-click-WaitDelete", {
					layer
				}); //隐患缺陷图层定位
			}
			
		 
		
		   
		   
		   
		},
		mounted() {
			this.renderEchart('echarts-aa-1', this.defectOption, this.defectTodayData);
			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=today&bugType=1',
				'根据类型统计今日隐患缺陷').then(result => {
					console.log('根据类型统计今日隐患缺陷',result)
				let resData = result.data;
				this.defectTodayData = [
					[resData.xlNum[0], resData.dlNum[0], resData.bdNum[0], resData.pdNum[0], resData.pdzdhNum[0]],
					[resData.xlNum[1], resData.dlNum[1], resData.bdNum[1], resData.pdNum[1], resData.pdzdhNum[1]],
					[resData.xlNum[2], resData.dlNum[2], resData.bdNum[2], resData.pdNum[2], resData.pdzdhNum[2]],
				];
				this.renderEchart('echarts-aa-1', this.defectOption, this.defectTodayData);
			});

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=week&bugType=1', '根据类型统计本周隐患缺陷')
				.then(result => {
					let resData = result.data;
					this.defectWeekData = [
						[resData.xlNum[0], resData.dlNum[0], resData.bdNum[0], resData.pdNum[0], resData.pdzdhNum[0]],
						[resData.xlNum[1], resData.dlNum[1], resData.bdNum[1], resData.pdNum[1], resData.pdzdhNum[1]],
						[resData.xlNum[2], resData.dlNum[2], resData.bdNum[2], resData.pdNum[2], resData.pdzdhNum[2]],
					];
				});

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=month&bugType=1',
				'根据类型统计本月隐患缺陷').then(result => {
				let resData = result.data;
				this.defectMonthData = [
					[resData.xlNum[0], resData.dlNum[0], resData.bdNum[0], resData.pdNum[0], resData.pdzdhNum[0]],
					[resData.xlNum[1], resData.dlNum[1], resData.bdNum[1], resData.pdNum[1], resData.pdzdhNum[1]],
					[resData.xlNum[2], resData.dlNum[2], resData.bdNum[2], resData.pdNum[2], resData.pdzdhNum[2]],
				];
			});

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugList?rangeType=today&bugType=1&offset=0&limit=10',
				'获取缺陷隐患列表').then(result => {
				let dataList = result.data.page.list;
				if (dataList.length) {
					this.defectDetail = [];
					for (let i = 0; i < dataList.length; i++) {
						if (dataList[i].doc_status == "待审核") {
							dataList[i].type = 'type2';
						} else if (dataList[i].doc_status == "已完结") {
							dataList[i].type = 'type3';
						} else {
							dataList[i].type = 'type1';
						}
						dataList[i].mark = dataList[i].doc_status
						dataList[i].time = dataList[i].create_on
						dataList[i].message = dataList[i].device_name
					}
					this.defectDetail = dataList
					//巡视缺陷消息走马灯
					this.$parent.msgInterval(this.$refs.detailUl, this.$refs.detailUl2, 3000);
				}
			});
			
			//获取缺陷缺陷列表
			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugList?rangeType=today&bugType=1&offset=0&limit=1000',
				'获取缺陷隐患列表').then(result => {
					console.log('获取缺陷隐患列表2',result)
					let one=0;
					let two=0;
					let three=0;
					for(let i=0;i<result.data.page.list.length;i++){
						let name=result.data.page.list[i].bug_property_name;
						if(name=="一般"){
							one++;
							this.oneNumber=one
						}else if(name=="严重"){
							two++;
							this.twoNumber=two
						}else if(name=="危急"){
							three++;
							this.threeNumber=three
						}
					}
				});
				
				
				
				 
				 
		}
	}
</script>

<style scoped>
	
	/* 暂时使用,后面需删除部分 */
    .sectionBody4 .detailUlWrap {
		 top: 10px;
		 height: 248px;
	}
	.sectionBody4 .sectionCons .test{
		padding: 0 30px;
		color: #fff;
	}
	.sectionBody4 .sectionCons .test .dengji{
		color: yellow;
		border: 1px solid yellow;
		width: 44px;
		height: 22px;
		font-size: 12px;
		text-align: center;
		border-radius: 3px;
		margin: 0 5px;
		padding: 2px 8px;
	}
	 .sectionBody4 .sectionCons .test .status{
		 width: 50px;
		 font-size: 12px;
		 text-align: center;
		 border-radius: 3px;
		 height: 22px;
		 margin: 0 5px;
		 padding: 2px 8px;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 white-space: nowrap;
		 background: #825384;
	 }
	.sectionBody4 .sectionCons .test .time,
	.sectionBody4 .sectionCons .test .detali{
		font-size: 16px;
	}   
    .sectionBody4 .sectionCons .test .detali{
		margin-left:20px;
	}  
		
		
		
	
	
	.detailUl .detailLiCon {
		font-size: 16px;
	}

	.detailUl .detailBug {
		width: 44px;
		height: 22px;
		font-size: 12px;
		text-align: center;
		color: orange;
		border: 1px solid orange;
		background: none;
	}

	.detailUl .detailBugPro {
		color: #33c172;
		border: 1px solid #33c172;
	}
	.detailUl .detailBugWar{
		color: yellow;
		border: 1px solid yellow;
	}

	.detailUl .detailMark {
		width: 50px;
		font-size: 12px;
		text-align: center;
		border-radius: 3px;
	}
	.detailUl .detailMessage{
		width: 130px;
	}

	.smallTitle {
		margin-top: 30px;
		font-size: 18px;
	}

	.icon_parent {
		position: relative;
	}

	.icon_parent .onetitle {
		display: inline-block;
		color: #ffffff;
		position: absolute;
		top: 30px;
		left: 30px;
	}

	.detailUlWrap {
		height: 285px;
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
	}
  .smallTitle  .wenzi_right{
	  display: inline-block;
	  float: right;
  }
 .smallTitle  .wenzi_right b{
	 font-weight: normal;
	 display: inline-block;
	 margin-left: 25px;
 }
  .smallTitle  .wenzi_right  b font{
	  margin: 0 3px;
  }
  .smallTitle  .wenzi_right  b i{
	  display: inline-block;
	  width: 10px;
	  height: 10px;
	  border-radius: 50%;
	  margin: 2px 10px;
  }
 .smallTitle  .wenzi_right  b:nth-child(1) i{
	 background: #33c172;
 }
 .smallTitle  .wenzi_right  b:nth-child(1) font{
 	 color: #33c172;
 }
 .smallTitle  .wenzi_right  b:nth-child(2) i{
 	 background: yellow;
 }
 .smallTitle  .wenzi_right  b:nth-child(2) font{
 	 color: yellow;
 }
 .smallTitle  .wenzi_right  b:nth-child(3) i{
 	 background: orange;
 }
 .smallTitle  .wenzi_right  b:nth-child(3) font{
 	 color: orange;
 }

	/* 缺陷监控弹窗 */
	.workBox {
		top: 53px;
	}
</style>

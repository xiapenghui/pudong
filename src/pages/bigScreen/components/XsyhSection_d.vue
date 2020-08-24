<template>
	<div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
		<div class="sectionMain">
			<div class="sectionSplit2 icon_parent">
				<div class="smallTitle onetitle"><i class="icon_right"></i>统计</div>
				<div class="sectionTab tab2">
					<a class="sectionTabLink" :class="{active: item.display}" href="javascript:;" v-for="(item,index) in defectTabDataTwo"
					 @click="tabChange(defectTabDataTwo,index)">{{ item.text }}</a>
				</div>
				<div class="sectionHead">
					<div class="sectionTop">
						<div class="sectiontitle">隐患监控</div>
					</div>
				</div>
				<div class="sectionBody sectionBody5">
					<div class="sectionCons">
						<div class="sectionConInner" v-show="item.display" v-for="(item,index) in defectTabDataTwo">
							<div :id="setId('bb',index)" class="forEcharts etype2"></div>
						</div>
					</div>

					<detail-info :columns="tableColumns" :dataSource="tableData" :currentPage="currentPage" :hasIndex="true" :isShow="isShow"
					 :total="total" :pageSize="pageSize" :handTitle="handTitle" :loading="loading" @showClose="onClose"
					 @current-change="onCurrentChange" @onhand-click="onhandClick"></detail-info>

				</div>
			</div>
			<div class="sectionSplit2">
				<div class="sectionHead smallTitle"><i class="icon_right"></i>明细</div>
				<div class="sectionBody sectionBody6">
					<div class="sectionCons">
						<div class="detailUlWrap">
							<ul ref="troubleUl" class="detailUl troubleUl">
								<li class="detailLi type2" v-for="item in troubleDetail" @click="locationYhqx(item.id,item.lon,item.lat)">
									<div class="detailLiCon" :class="item.type">{{ item.classify }}</div>
									<div class="detailLiCon" :class="item.classify">{{ item.title }}</div>
									<div class="detailLiCon" :class="item.type">{{ item.mark }}</div>
									<div class="detailLiCon">{{item.time}}</div>
									<div class="detailLiCon width300">{{ item.message }}</div>
								</li>
							</ul>
							<ul ref="troubleUl2" class="detailUl troubleUl2">
								<li class="detailLi type2" v-for="item in troubleDetail" @click="locationYhqx(item.id,item.lon,item.lat)">
									<div class="detailLiCon" :class="item.type">{{ item.classify }}</div>
									<div class="detailLiCon" :class="item.classify">{{ item.title }}</div>
									<div class="detailLiCon" :class="item.type">{{ item.mark }}</div>
									<div class="detailLiCon">{{item.time}}</div>
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
	import eventBus from "./baidumap/base/EventBus";
	import DetailInfo from "./baidumap/detailed/DetailInfo"; //设备感知弹窗
	import OnlineUrl from "./baidumap/base/OnlineUrl" //在线接口地址
	import {
		wgs2bd
	} from "./baidumap/utils/Convert"; //坐标转换
	import table from "../mixins/table" //引入表格混入

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
			},
		},
		data() {
			return {
				colorTodayData:[],
				colorWeekData:[],
				colorMonthData:[],
				colorNewData:[],
				handTitle: '标题',
				loading: false, //加载中...
				tableData: [],
				tableColumns: [],
				isShow: false,
				typeClass:0,
				// 巡视隐患echarts options
				troubleOption: {
					legend: {
						x: 'center',
						top: 30,
						itemGap: 20,
						textStyle: {
							color: 'rgba(255,255,255,0.5)',
							fontSize: 18
						},
						// data: ['已发现', '已审核', '已结单']
					},
					color: ['#f4e15e', '#e19839', '#e7532b'],
					tooltip: {

					},
					dataset: {
						source: [
							['product', '2012', '2013', '2014', '2015', '2016'],
							['已发现', 41.1, 30.4, 65.1, 53.3, 83.9],
							['已审核', 86.5, 92.1, 85.7, 83.1, 73.4],
							['已结单', 24.1, 67.2, 79.5, 86.4, 65.2],
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
								// formatter: ['线路'].join('\n'),
								formatter: '线路',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18,
							},
						},
						itemStyle: { 
							normal: {
							 color:this.colorFn(this.colorNewData) 
							}
						},

						
					}, {
						type: 'pie',
						radius: [55, 70],
						center: ['50%', '35%'],
						encode: {
							itemName: 'product',
							value: '2013'
						},
						label: {
							normal: {
								// formatter：: ['配电自动化'].join('\n'),
								formatter: '配电自动化',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 16,
							},
						},
						
						itemStyle: { 
							normal: {
							 color:this.colorFn(this.colorNewData) 
							}
						},
						
					}, {
						type: 'pie',
						radius: [55, 70],
						center: ['80%', '35%'],
						encode: {
							itemName: 'product',
							value: '2014'
						},
						label: {
							normal: {
								// formatter: ['变电'].join('\n'),
								formatter: '变电',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18,
							},
						},
						itemStyle: { 
							normal: {
							 color:this.colorFn(this.colorNewData) 
							}
						},
					}, {
						type: 'pie',
						radius: [55, 70],
						center: ['20%', '70%'],
						encode: {
							itemName: 'product',
							value: '2015'
						},
						label: {
							normal: {
								// formatter: ['配电'].join('\n'),
								formatter: '配电',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18,
							},
						},
						itemStyle: { 
							normal: {
							 color:this.colorFn(this.colorNewData) 
							}
						},
					}, {
						type: 'pie',
						radius: [55, 70],
						center: ['50%', '70%'],
						encode: {
							itemName: 'product',
							value: '2016'
						},
						label: {
							normal: {
								// formatter: ['电缆'].join('\n'),
								formatter: '电缆',
								position: 'center', //让文字居中
								show: true,
								color: 'white',
								fontSize: 18,
							},
						},
						itemStyle: { 
							normal: {
							 color:this.colorFn(this.colorNewData) 
							}
						},
					}]
				},


				defectTabDataTwo: [{
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

				troubleTodayData: [
					[12, 5, 7, 6, 9],
					[12, 5, 7, 6, 9],
					[12, 5, 7, 6, 9],
				],

				troubleWeekData: [
					[12, 5, 7, 6, 9],
					[12, 5, 7, 6, 9],
					[12, 5, 7, 6, 9],
				],

				troubleMonthData: [
					[5, 7, 6, 24, 19],
					[5, 7, 6, 24, 19],
					[5, 7, 6, 24, 19],
				],
				// 巡视隐患明细列表数据
				troubleDetail: [{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '严重',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type2',
						classify: '缺陷',
						mark: '已发现',
						title: '危急',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01 10:00:00',
						message: '修剪树枝 杜尹路168号'
					},
					{
						type: 'type1',
						classify: '缺陷',
						mark: '已发现',
						title: '一般',
						time:'2019-06-01',
						message: '修剪树枝 杜尹路168号'
					},
				],



				// 隐患监控表头
				yhjktableColumns: [{
						hasSort: false, //<Boolean> 是否排序
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
						label: '电压等级', //<String>   表头标签
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
				tableData: [],

			}
		},
		methods: {
			tabChange(data, index) {
				this.$parent.tabChange(data, index);
				this.typeClass=index;
				if (index === 0) {
					//渲染页面echarts图表---本日echarts
					this.colorNewData = this.colorTodayData
					this.renderEchart('echarts-bb-1', this.troubleOption, this.troubleTodayData);
				}
				if (index === 1) {
					//渲染页面echarts图表---本周echarts
					this.colorNewData = this.colorWeekData
					this.renderEchart('echarts-bb-2', this.troubleOption, this.troubleWeekData);
				}
				if (index === 2) {
					//渲染页面echarts图表---本月echarts
					this.colorNewData = this.colorMonthData
					this.renderEchart('echarts-bb-3', this.troubleOption, this.troubleMonthData);
				}
			},
			setId(pid, id) {
				return this.$parent.setId(pid, id)
			},


			onClickNum(obj) {
				this.isShow = true;
				this.newObj = obj;
				this.tableColumns = this.yhjktableColumns;
				this.loading = true;
				let professional;
				if (obj == 0) {
					professional = 1;
					this.handTitle = "线路"
				} else if (obj == 1) {
					professional = 7;
					this.handTitle = "配电自动化"
				} else if (obj == 2) {
					professional = 4;
					this.handTitle = "变电";
				} else if (obj == 3) {
					professional = 2;
					this.handTitle = "配电"
				} else if (obj == 4) {
					professional = 3;
					this.handTitle = "电缆"
				}
				let rangeType;
				if(this.typeClass==0){
					rangeType="today"
					this.handTitle="本日"+this.handTitle
				}else if(this.typeClass==1){
					rangeType="week"
					this.handTitle="本周"+this.handTitle
				}else{
					rangeType="month" 
					this.handTitle="本月"+this.handTitle
				}
				this.$$utils.axiosRequest(
					'/pdaqfh_war_exploded/f/wgyw/getBugList?rangeType='+rangeType+'&bugType=2&limit=' +
					this.pageSize+'&offset='+this.offset+'&professional='+professional, '获取缺陷隐患列表').then(
					result => {
						this.tableData = result.data.page.list;
						this.total = result.data.page.count;
						this.loading = false;
					});

			},


			locationYhqx(id, lon, lat) {
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

			// 隐患监控坐标定位

			onhandClick(row) {
				let layer = {
					id: row.id, //定位对象id
					layerName: "HiddenHefectsLayer", //定位图层
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

			//页面echarts图表渲染事件
			renderEchart(el, option, data) {
				if (el && option) {
					if (data) {
						option.dataset.source = data
						// for (let i = 0; i < data.length; i++) {
						//     option.dataset.source = data[i];
						// }
					}
					// 基于准备好的dom，初始化echarts实例
					let myChart = this.$echarts.init(document.getElementById(el));
					myChart.setOption(option);
					let _this = this;
					myChart.on("click", function(params) {
						console.log("paramssss", params)
						console.log("paramssss", params.color)
						_this.onClickNum(params.componentIndex)
					})
				}
			},
			colorFn(resData){
				let total =0;
				for(var key in resData){
				  total = 0;
				  for(var i=0;i<resData[key].length;i++){
					 console.log("resData[key]",resData[key][i])
					 total+=parseInt(resData[key][i]);
					 if(total == 0){
						 console.log('key',key)
						 if(key == 'xlNum'){
							this.troubleOption.series[0].itemStyle.normal.color = '#182c41'
						 }else if(key == 'pdzdhNum'){
							 this.troubleOption.series[1].itemStyle.normal.color = '#182c41'
						 }else if(key == 'bdNum'){
							 this.troubleOption.series[2].itemStyle.normal.color = '#182c41'
						 }else if(key == 'pdNum'){
							 this.troubleOption.series[3].itemStyle.normal.color = '#182c41'
						 }else if(key == 'dlNum'){
							 this.troubleOption.series[4].itemStyle.normal.color = '#182c41'
						 }
					 }
				  }
				  console.log("total",total)
				}
			}
		},
		mounted() {

			this.renderEchart('echarts-bb-1', this.troubleOption, this.troubleTodayData);

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=today&bugType=2',
				'根据类型统计今日隐患缺陷').then(result => {
				let resData = result.data;
				this.colorTodayData = resData
				this.colorNewData = resData
				console.log("resData",resData)
				console.log("troubleOption",this.troubleOption)
				this.colorFn(resData)
				 console.log("troubleOption",this.troubleOption)
				this.troubleTodayData = [
					['product', '2012', '2013', '2014', '2015', '2016'],
					['已发现', resData.xlNum[0], resData.pdzdhNum[0], resData.bdNum[0], resData.pdNum[0], resData.dlNum[0]],
					['已审核', resData.xlNum[1], resData.pdzdhNum[1], resData.bdNum[1], resData.pdNum[1], resData.dlNum[1]],
					['已结单', resData.xlNum[2], resData.pdzdhNum[2], resData.bdNum[2], resData.pdNum[2], resData.dlNum[2]],
				];
				
				this.renderEchart('echarts-bb-1', this.troubleOption, this.troubleTodayData);
			});

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=week&bugType=2', '根据类型统计本周隐患缺陷')
				.then(result => {
					let resData = result.data;
					this.colorWeekData = resData
					console.log("resData1",resData)
					this.troubleWeekData = [
						['product', '2012', '2013', '2014', '2015', '2016'],
						['已发现', resData.xlNum[0], resData.pdzdhNum[0], resData.bdNum[0], resData.pdNum[0], resData.dlNum[0]],
						['已审核', resData.xlNum[1], resData.pdzdhNum[1], resData.bdNum[1], resData.pdNum[1], resData.dlNum[1]],
						['已结单', resData.xlNum[2], resData.pdzdhNum[2], resData.bdNum[2], resData.pdNum[2], resData.dlNum[2]],
					];
				});

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=month&bugType=2',
				'根据类型统计本月隐患缺陷').then(result => {
				let resData = result.data;
				this.colorMonthData = resData
				console.log("resData2",resData)
				this.troubleMonthData = [
					['product', '2012', '2013', '2014', '2015', '2016'],
					['已发现', resData.xlNum[0], resData.pdzdhNum[0], resData.bdNum[0], resData.pdNum[0], resData.dlNum[0]],
					['已审核', resData.xlNum[1], resData.pdzdhNum[1], resData.bdNum[1], resData.pdNum[1], resData.dlNum[1]],
					['已结单', resData.xlNum[2], resData.pdzdhNum[2], resData.bdNum[2], resData.pdNum[2], resData.dlNum[2]],
				];
			});

			this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugList?rangeType=today&bugType=2&offset=0&limit=10',
				'获取缺陷隐患列表').then(result => {
				let dataList = result.data.page.list;
				if (dataList.length) {
					this.troubleDetail = [];
					for (let i = 0; i < dataList.length; i++) {
						
						let classify = 'type1';
						if (dataList[i].bug_property_name != "一般") {
							classify = 'type2';
						};

						if (dataList[i].doc_status == "待审核") {	
							dataList[i].type = 'type2';
						} else if (dataList[i].doc_status == "已完结") {
							dataList[i].type = 'type3';
						} else {
							dataList[i].type = 'type1';
						};
											
						this.troubleDetail.push({
							type: dataList[i].type,
							classify: classify,
							// classify: dataList[i].bug_type_name,
							mark: dataList[i].doc_status,
							title: dataList[i].bug_property_name,
							// time:dataList[i].create_on.slice(12),  //截取年月日
							time:dataList[i].create_on,
							message: dataList[i].create_address,
							id: dataList[i].id, //定位参数
							lon: dataList[i].longitude, //定位参数
							lat: dataList[i].latitude, //定位参数
						});

					}
					//巡视隐患消息走马灯
					this.$parent.msgInterval(this.$refs.troubleUl, this.$refs.troubleUl2, 3000);
				}
			});
		}
	}
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
		top: 0;
		left: 35px;
	}
	
	
  /* 覆盖样式 */
  .detailLi.type2 .detailLiCon:nth-of-type(1){
	  display: none;
  }
.detailLi.type2 .detailLiCon:nth-of-type(4){
	width: auto;
}
.detailLi.type2 .detailLiCon:nth-of-type(3){
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

.sectionBody6  .sectionCons .detailUlWrap .detailUl .width300{
	width: 300px;
}

</style>

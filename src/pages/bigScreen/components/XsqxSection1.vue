<template>
    <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
        <div class="sectionMain">
            <div class="sectionSplit icon_parent">
				<div class="smallTitle onetitle"><i class="icon_right"></i>统计</div>
                <div class="sectionTab">
                    <a class="sectionTabLink" :class="{active: item.display}" href="javascript:;" v-for="(item,index) in defectTabData" :key="index" @click="tabChange(defectTabData,index)">{{ item.text }}</a>
                </div>
                <div class="sectionHead">
                    <div class="sectionTop">
                      <div class="sectiontitle">缺陷监控</div>
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
                <div class="sectionHead smallTitle"><i class="icon_right"></i>明细</div>
                <div class="sectionBody sectionBody4">
                    <div class="sectionCons">
                        <div class="detailUlWrap">
                            <ul ref="detailUl" class="detailUl">
                                <li class="detailLi" v-for="(item,index) in defectDetail" :key="index">
									<!-- <div class="detailLiCon" :class="item.type" @click="locationYhqx(item.id,item.lon,item.lat)">1</div> -->
                                    <div class="detailLiCon" :class="item.type">{{ item.mark }}</div>
                                    <div class="detailLiCon">{{ item.time }}</div>
                                    <div class="detailLiCon">{{ item.message }}</div>
                                </li>
                            </ul>
                            <ul ref="detailUl2" class="detailUl detailUl2">
                                <li class="detailLi" v-for="(item,index) in defectDetail" :key="index">
									<!-- <div class="detailLiCon" :class="item.type" @click="locationYhqx(item.id,item.lon,item.lat)">1</div> -->
                                    <div class="detailLiCon" :class="item.type">{{ item.mark }}</div>
                                    <div class="detailLiCon">{{ item.time }}</div>
                                    <div class="detailLiCon">{{ item.message }}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		
		<!-- 缺陷监控弹窗 -->
		<detail-info :columns="columns" :dataSource="tableData" :hasIndex="true" :isShow="isShow" 
		:total="total" :pageSize="pageSize" @current-change="onCurrentChange"  :handTitle="handTitle"
		@showClose="onClose"></detail-info>
		
    </div>
	
	
	
</template>

<script>
import DetailInfo from "./baidumap/detailed/DetailInfo";//缺陷监控信息弹窗,
    export default{
		components: {DetailInfo},
        name: 'xsqxSection',
        props:{
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
        data(){
            return {
				// 弹框默认关闭
				handTitle:'缺陷监控统计',
				isShow: false,
				total:0,
				offset:0,
				pageSize:5,
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
                            textStyle: {
                                color: '#ffffff',
                                fontWeight: 'normal',
                                fontSize: '16',
                            },
                            margin: 15,
                        },
                        data: ['线路', '电缆', '变电', '配电', '配电自动化'],
                    } ],
                    series: [{
                            name: '已发现',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    show: true,
                                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(241,104,62,1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(143,32,71,1)'
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
                defectTabData: [
                    {text: '本日', display: true},
                    {text: '本周', display: false},
                    {text: '本月', display: false}
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
                defectDetail: [
                    {type: 'type1',mark: '已发现', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type2',mark: '已审核', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type3',mark: '已结单', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type1',mark: '已发现', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type2',mark: '已审核', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type3',mark: '已结单', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type1',mark: '已发现', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type2',mark: '已审核', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type3',mark: '已结单', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'},
                    {type: 'type1',mark: '已发现', time: '2019-05-17 14:00:28', message: '浦东新区杨高南路XXX小区线路缺陷'}
                ],
				
				
				// 缺陷监控
				columns: [
					{
						hasSort: false, //<Boolean> 是否排序
						isShow: true, //<Boolean> 是否展示
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
						prop: 'start', //<String>  对应属性名
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
					{
					// operate: require("../assets/images/ic_location_blue.png"),
					bug_type_name: '王小虎',
					create_address: '上海市普陀区金沙江路 1518 弄'
				  }],
				
            }
        },
        methods: {
            tabChange(data, index){
                this.$parent.tabChange(data, index);
                if(index === 1){
                    //渲染页面echarts图表---本周echarts
                    this.renderEchart('echarts-aa-2', this.defectOption, this.defectWeekData);
                }
                if(index === 2){
                    //渲染页面echarts图表---本月echarts
                    this.renderEchart('echarts-aa-3', this.defectOption, this.defectMonthData);
                }
            },
			setId(pid, id){
			    return this.$parent.setId(pid, id)
			},
			onCurrentChange(page){
				this.offset = (page-1)*this.pageSize;
				// this.onClickNum(this.newObj)
			},
			onShowTable(obj){
				this.isShow = true
				if(obj != ""){
					 //获取缺陷隐患列表(p_f_004)
					  this.$$utils.axiosRequest("/pdaqfh_war_exploded/f/wgyw/getBugList?offset=0&limit=1000&rangeType=today&professional=1", '获取缺陷隐患列表').then(result => {
                     console.log(result) 
					});
					
				}
			},
			onClose(){
				this.isShow = false
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
			         let myChart =  this.$echarts.init(document.getElementById(el));
			        myChart.setOption(option);
					let _this = this;
					myChart.on("click",function(params){
						console.log("paramssss",params)
						_this.onShowTable(params.name)
					})
			    }
			},
			
        },
        mounted(){
            this.renderEchart('echarts-aa-1', this.defectOption, this.defectTodayData);
            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=today&bugType=1', '根据类型统计今日隐患缺陷').then(result => {
				let resData = result.data;
                this.defectTodayData = [
                    [resData.xlNum[0],resData.dlNum[0],resData.bdNum[0],resData.pdNum[0],resData.pdzdhNum[0]],
                    [resData.xlNum[1],resData.dlNum[1],resData.bdNum[1],resData.pdNum[1],resData.pdzdhNum[1]],
                    [resData.xlNum[2],resData.dlNum[2],resData.bdNum[2],resData.pdNum[2],resData.pdzdhNum[2]],
                ];
                this.renderEchart('echarts-aa-1', this.defectOption, this.defectTodayData);
           });

            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=week&bugType=1', '根据类型统计本周隐患缺陷').then(result => {
                let resData = result.data;
                this.defectWeekData = [
                    [resData.xlNum[0],resData.dlNum[0],resData.bdNum[0],resData.pdNum[0],resData.pdzdhNum[0]],
                    [resData.xlNum[1],resData.dlNum[1],resData.bdNum[1],resData.pdNum[1],resData.pdzdhNum[1]],
                    [resData.xlNum[2],resData.dlNum[2],resData.bdNum[2],resData.pdNum[2],resData.pdzdhNum[2]],
                ];
           });

            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType?rangeType=month&bugType=1', '根据类型统计本月隐患缺陷').then(result => {
                let resData = result.data;
                this.defectMonthData = [
                    [resData.xlNum[0],resData.dlNum[0],resData.bdNum[0],resData.pdNum[0],resData.pdzdhNum[0]],
                    [resData.xlNum[1],resData.dlNum[1],resData.bdNum[1],resData.pdNum[1],resData.pdzdhNum[1]],
                    [resData.xlNum[2],resData.dlNum[2],resData.bdNum[2],resData.pdNum[2],resData.pdzdhNum[2]],
                ];
           });

           this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getBugList?rangeType=today&offset=0&limit=10', '获取缺陷隐患列表').then(result => {
                let dataList = result.data.page.list;
                if(dataList.length){
                    this.defectDetail = [];
                    for(let i=0; i<dataList.length; i++){
                        let type = 'type1';
                        if(dataList[i].doc_status === "待审核"){
                            type = 'type2';
                        }else if(dataList[i].doc_status === "已完结"){
                            type = 'type3';
                        }
                        this.defectDetail.push({
                            type: type,
                            mark: dataList[i].doc_status,
                            time: dataList[i].create_on,
                            message: dataList[i].device_name
                        });
                    }
                    //巡视缺陷消息走马灯
                    this.$parent.msgInterval(this.$refs.detailUl, this.$refs.detailUl2, 3000);
                }
           });
        }
    }

</script>

<style scoped>
  .smallTitle{
	  margin-top: 30px;
	  font-size: 18px;
  }
  
  .icon_parent{
	  position: relative;
  }
  .icon_parent .onetitle{
	  display: inline-block;
	  color: #ffffff;
	  position: absolute;
	  top: 30px;
      left: 30px;
  }
  .detailUlWrap{
	  height: 285px;
  }
  .smallTitle .icon_right{
	  width: 30px;
	  height: 30px;
	  background: url(../assets/images/ic_triangle.png) no-repeat;
	  background-repeat: no-repeat;
	  background-size: contain;
	  background-position: center;
	  display: inline-block;
      vertical-align: middle;
	  margin-right:2px;
  }
  
/* 缺陷监控弹窗 */
  .workBox{
	 top: 53px;
  }
</style>


<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop"><div class="sectiontitle">保障概况</div></div>
			</div>
			<div class="sectionBody sectionBody1">
				<div class="BZleft">
					<span class="imgFixed"></span>
					<div class="BZleftImg">
					</div>
				</div>
				<div class="BZright">
					<div class="goBack" @click="goBack"><img :src="BackImg">返回</div>
					<h2><span>保障任务：</span><b>{{bzrwTitle}}</b></h2>
					<h3><span>保障时间：</span><b>{{bzTime}}</b></h3>
					<!-- <h3><span>当前保障等级：</span><input type="text" v-model="bzGrade" id="lacal_storage" name="lacal_storage" @change="onInputChange"></h3> -->
					<h3><span>当前保障等级：</span>
					<select v-model="bzGrade"  id="lacal_storage" name="lacal_storage" @change="onInputChange">
					    　　<option v-for="item in optList">{{ item }}</option>
					　　</select>
					</h3>
					<h3><span>已安全保障：</span><b><i v-for="(item,index) in timeData" :key="index">{{item}}</i>时</b></h3>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from './baidumap/base/EventBus';
export default {
	name: 'BzgkSection',
	data() {
		return {
			bzrwTitle:'2019年第二届中国国际进口博览会',
			bzTime:'11月1日 8:00:00-11月11日 18:00:00',
			bzGrade:'特级保障',
			timeData:'0',
			timeFn:null,
			BackImg:require('../components/baidumap/assets/images/bdstatus/icon_back.png'),
			optList: ['特级保障', '一级保障', '二级保障', '三级保障','正常'],    
		};
	
	},
	props: {
		width: {
			type: Number,
			default: 1010
		},
		height: {
			type: Number,
			default: 420
		},
		left: {
			type: Number,
			default: 74
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

	methods: {
		//保障任务返回按钮
		goBack(){
			this.$parent.allShow=true;
			this.$parent.bzgkShowOff=false;
			this.$parent.zkCenter=true;
		},
		//保障任务本地存储保障等级
		onInputChange(){
			localStorage.setItem("local_test", this.bzGrade)
		},
		localStor(){
			this.bzGrade = localStorage.getItem("local_test") || this.bzGrade
		},
		siteTime(){
            var today = new Date();
            var todayYear = today.getFullYear();
            var todayMonth = today.getMonth()+1;
            var todayDate = today.getDate();
            var todayHour = today.getHours();
            var todayMinute = today.getMinutes();
            var todaySecond = today.getSeconds();
			var startTime = Date.parse(new Date(2019,11,1,8,0,0));  //开始时间
            var systemTime = Date.parse(new Date(todayYear,todayMonth,todayDate,todayHour,todayMinute,todaySecond)); //系统时间
            var endTime = Date.parse(new Date(2019,11,11,18,0,0)); //结束时间

            if(systemTime >= endTime){
                clearInterval(this.timeFn)
                systemTime = endTime
            }
			var diff = systemTime-startTime;
            var hours =parseInt(diff/3600000)+"";  //运行总的时间
            if(hours<10 && hours >=0){
                hours = '00'+hours
            }else if(hours <100 && hours >=10){
                hours = '0'+hours
            }else if(hours<0){
                hours = '000'
			}
			
            this.timeData = hours.split("");
        }
		
	},
	mounted() {
		// 动态更新系统时间
		this.siteTime();
		this.timeFn = setInterval(this.siteTime, 1000);
		//本地存储
		this.localStor()
	},
	
};
</script>

<style scoped>
.sectionBody1 {
	padding-left: 20px;
}
.sectionBody1 .BZleft {
	width: 30%;
	height: 90%;
	margin-top: 20px;
	float: left;
	position: relative;
}
.sectionBody1 .BZleft .imgFixed{
	 width: 45px;
	 height:45px;
	 background-image: url(../components/baidumap/assets/images/bdstatus/icon_sanjiao.png);
	 background-repeat: no-repeat;
	 background-size: cover;
	 background-position: center;
	 display: block;
	 position: absolute;
	 top: 0;
	 left: 0;
	 
}
.sectionBody1 .BZleft .BZleftImg{
	width: 90%;
	height: 90%;
	margin: 0 auto;
	background-image: url(../components/baidumap/assets/images/bdstatus/BD_number.png);
	background-repeat: no-repeat;
	background-size: auto;
	background-position: center;
}
.sectionBody1 .BZright {
	width: 65%;
	height: 90%;
	margin-top: 20px;
	float: right;
	position: relative;
}
.sectionBody1 .BZright .goBack{
	width: 80px;
	height: 40px;
	background-color: #0f2753;
	position: absolute;
	top: -65px;
	right: 60px;
	cursor: pointer;
	border-radius: 3px;
	color: #adcbff;
	padding: 8px 5px;
	font-size: 15px;
}
.sectionBody1 .BZright .goBack img{
	width: 20px;
	height: 20px;
	display: inline-block;
	vertical-align: bottom;
	margin: 0 6px 0 5px;
}

.sectionBody1 .BZright h2{
	color: #FFFFFF;
	line-height: 40px;
	font-size: 30px;
	letter-spacing: 2px;
	margin-bottom: 20px;
	font-weight: normal;
}
.sectionBody1 .BZright h2 b{
	font-size: 25px;
	color: #d8e4fe;
}
.sectionBody1 .BZright  h3{
	color: #d8e4fe;
	line-height: 60px;
	font-size: 25px;
	font-weight: normal;
}
.sectionBody1 .BZright  h2 span,
.sectionBody1 .BZright  h3 span{
	display: inline-block;
	width: 180px;
	text-align: left;
}
.sectionBody1 .BZright  h3  b{
	color: #59e7e9;
	font-size: 25px;
}
.sectionBody1 .BZright  h3 input{
	background: transparent;
	border: none;
	color: #82fe46;
	font-size: 25px;
}
.BZright i{
	padding: 4px 8px;
	margin-right: 10px;
    font-style: normal;
	color: #FFFFFF;
	background-color: rgba(89,231,233,.4)
}
.BZright  #lacal_storage{
	background: transparent;
	border: none;
	color: #82fe46;
	font-size: 25px;
	appearance:none;
	-moz-appearance:none;
	-webkit-appearance:none;
}
</style>

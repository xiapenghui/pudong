<template>
	<div class="workBoxs" v-show="workBox">
		<div class="shixuHead">
		   {{detail.carMc}}
			<i class="close" @click="showclose"></i>
		</div>
			<div class="bigBox">
				<div class="boxleft">
					<div class="boxleftTop">
						<div class="boxleftImg">
							<div class="oneImg" :style="{backgroundImage:'url('+detail.images1+')'}"></div>
							<div class="twoImg" :style="{backgroundImage:'url('+detail.images2+')'}"></div>
						</div>
						<div class="boxleftDetail">
							<ul>
								<li><b>编号:</b><span>{{detail.carName}}</span></li>
								<li><b>名称:</b><span>{{detail.carMc}}</span></li>
								<li><b>型号:</b><span>{{detail.carXh}}</span></li>
								<li><b>车牌号:</b><span>{{detail.carNumber}}</span></li>
								<li><b>所属单位:</b><span>{{detail.company}}</span></li>
								<li><b>单位地址:</b><span>{{detail.address}}</span></li>
								<li><b>停放地址:</b><span>{{detail.tfsj}}</span></li>
								<li><b>负责人:</b><span>{{detail.person}}</span></li>
								<li><b>厂商名称:</b><span>{{detail.csmc}}</span></li>
								<li><b>厂商地址:</b><span>{{detail.csdz}}</span></li>
								<li><b>厂商联系方式:</b><span>{{detail.cslxfs}}</span></li>
								<li><b>保养周期:</b><span>{{detail.byzq}}</span></li>
								<li><b>生产日期:</b><span>{{detail.scrq}}</span></li>
								<li><b>强制使用年限:</b><span>{{detail.qzsynx}}</span></li>
							</ul>
						</div>
					</div>
					<div class="boxleftBottom">
						<div class="boxleftBottomRight">
							<ul>
								<li>{{detail.detail}}</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="boxRight">
					<h3>{{detail.carNumber}}</h3>
					<ul>
						<li><b>外形尺寸</b><span>{{detail.wxcc}}</span></li>
						<li><b>地盘型号</b><span>{{detail.dpxh}}</span></li>
						<li><b>总质量</b><span>{{detail.zzl}}</span></li>
						<li><b>接近/离去角</b><span>{{detail.jjlqj}}</span></li>
						<li><b>前悬/后悬</b><span>{{detail.qxhx}}</span></li>
						<li><b>整备质量</b><span>{{detail.zbzz}}</span></li>
						<li><b>车速</b><span>{{detail.cs}}</span></li>
						<li><b>发动机型号</b><span>{{detail.fdjxh}}</span></li>
						<li><b>功率</b><span>{{detail.gl}}</span></li>
						<li><b>排量</b><span>{{detail.pl}}</span></li>
						<li><b>生产厂家</b><span>{{detail.sccj}}</span></li>
						<li><b>排放标准</b><span>{{detail.pfbz}}</span></li>
						<li><b>轴数</b><span>{{detail.zs}}</span></li>
						<li><b>轴距</b><span>{{detail.zj}}</span></li>
						<li><b>前轮距</b><span>{{detail.qlj}}</span></li>
						<li><b>后轮距</b><span>{{detail.hlj}}</span></li>
						<li><b>防抱死</b><span>{{detail.fbs}}</span></li>
					</ul>
				</div>
			</div>
	</div>
</template>

<script>
export default {
	props: {
		isShow:{
			type:Boolean,
			default:false
		},
		detail:{
			type:Object,
			default:{}
		}
	},
	data() {
		return {
			handTitle:'应急发电照明车',
			workBox: false,
			iconImg: require('../components/baidumap/assets/images/bdstatus/icon_bg.png')
		};
	},
	watch:{
		isShow(val){
			console.log("val",val)
			this.workBox = val
		}
	},
	methods: {
		// 弹出窗关闭
		showclose() {
			this.workBox = false;
			this.$emit('show-close')
		},
	}
};
</script>

<style scoped="scoped">

.shixuHead {
	width: 100%;
	padding-top: 10px;
	text-indent: 20px;
	color: #00ffff;
	font-size: 25px;
	font-weight: bold;
	position: relative;
}

/* 通道感知弹出窗 */
.workBoxs {
	width: 1300px;
	height: 780px;
	position: absolute;
	left: 1350px;
	bottom: 0px;
	background-color:rgba(3,12,41,.9);
	transition: 0.3s;
	border-top: 1px solid #2d86c4;
	border-bottom: 1px solid #2d86c4;
	z-index: 999;
	padding: 0 10px;
}
.workBoxs .bigBox{
	width: 100%;
	height: 100%;
	padding: 20px;
}
.workBoxs .bigBox .boxleft{
	width: 65%;
    height: 95%;
	float: left;
}
.workBoxs .bigBox .boxleft .boxleftTop{
	width: 100%;
	height: 75%;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftImg{
	width: 30%;
	height: 100%;
	float: left;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftImg div{
	width: 100%;
	height: 40%;
	border-radius: 5px;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: center;
	margin-bottom: 20px;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftDetail{
	width: 68%;
	height: 100%;
	float: right;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftDetail ul li{
	line-height: 35px;
	width: 100%;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftDetail ul li b{
	font-weight: normal;
	color:#cbdbf9;
	display: inline-block;
	width: 30%;
	text-align: left;
	padding-left: 10px;
	font-size: 14px;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftDetail ul li:nth-child(odd) b{
	background-color:rgba(11,24,61,.8);
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftDetail ul li span{
	display: inline-block;
	width: 68%;
	color: #FFFFFF;
	padding-left: 10px;
	margin-left: 10px;
	font-size: 14px;
}
.workBoxs .bigBox .boxleft .boxleftTop .boxleftDetail ul li:nth-child(odd) span{
	background-color:rgba(10,35,62,.8);
}
.workBoxs .bigBox .boxleft .boxleftBottom{
	width: 100%;
	height: 25%;
}
/* .workBoxs .bigBox .boxleft .boxleftBottom .boxleftBottomLeft{
	width: 20%;
	height: 100%;
	float: left;
	padding: 40px 25px;
	text-align: center;
	color: #2996a3;
	font-size: 14px;
}
.workBoxs .bigBox .boxleft .boxleftBottom .boxleftBottomLeft p{
	line-height: 20px;
	border-radius: 10px;
	padding: 5px 10px;
	border: 1px solid #2996a3;
	margin: 20px 0;
	
} */
.workBoxs .bigBox .boxleft .boxleftBottom .boxleftBottomRight{
	width: 99%;
	height: 100%;
	float: right;
	font-size: 14px;
	color: #2996a3;
	line-height: 30px;
	padding: 20px 0;
}
.workBoxs .bigBox .boxRight{
	width: 33%;
    height: 95%;
	float: right;
}
.workBoxs .bigBox .boxRight h3{
	font-size: 20px;
	color: #00d4d7;
	margin-bottom: 20px;
}
.workBoxs .bigBox .boxRight ul li{
	line-height: 35px;
}
.workBoxs .bigBox .boxRight ul li b{
	font-weight: normal;
	color:#cbdbf9;
	display: inline-block;
	width: 30%;
	text-align: justify;
	padding-left: 10px;
	font-size: 14px;
}
.workBoxs .bigBox .boxRight ul li span{
	display: inline-block;
	width: 65%;
	color: #FFFFFF;
	padding-left: 10px;
	margin-left: 10px;
	font-size: 14px;
	border-top: 1px solid #9c9ea1;
}
.workBoxs .bigBox .boxRight ul li:last-child span{
	border-bottom: 1px solid #9c9ea1;
}

.workBoxs .close {
	float: right;
	width: 30px;
	height: 30px;
	background: url(../components/baidumap/assets/images/bdstatus/ic_close.png) no-repeat center;
	background-size: cover;
	transition: all 0.6s;
}

.workBoxs i:hover {
	transform: rotate(180deg);
	transition: all 0.6s;
}

</style>

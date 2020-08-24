<template>
	<div  class="messageBox" v-show="workBox">
		<div class="messageTotalkBox">
			<div class="messageTitle">统计信息</div>
			<div class="perStatus onlinePer">
				<img src="../assets/images/infogreen.png">
				目前在岗人员：<span>5</span>人
			</div>
			<div class="perStatus offlinePer">
				<img src="../assets/images/infoyellow.png">
				未上岗人员：<span>15</span>人
			</div>
		</div>
		<div class="messageInfoBox">
			<div class="messageListBox" v-for="(item,index) in defectDetail" :key="index">
				<img src="../assets/images/infotips.png">
				<span class="messageDate">{{ item.time }}</span>
				<span class="messageName">{{ item.name }}</span>
				<div class="messageScrollBox">
					<marquee behavior="scroll" contenteditable="true" scrollamount="3" width="210"> {{ item.status }} </marquee>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
export default {
	props: {
		isShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			workBox: false,
			// 巡视缺陷明细列表数据
			defectDetail: [
				{
					time: '18:00',
					name: '张三',
					status: '祖冲站目前保障正常'
				},
				{
					time: '18:00',
					name: '李四',
					status: '祖冲站目前保障正常'
				},{
					time: '18:00',
					name: '王五',
					status: '龙祖3978目前保障正常'
				},{
					time: '18:00',
					name: '赵六',
					status: '祖冲站目前保障正常'
				},
			],
		};
	},
	methods: {
      scrollLeft(){

	  }
	},
	mounted() {
		this.workBox = this.isShow;
		this.$parent.msgInterval(this.$refs.detailUl, this.$refs.detailUl2, 3000);
	},
	watch: {
		isShow(val) {
			this.workBox = val;
		}
	}
};
</script>

<style scoped="scoped">
.messageBox{
	position: absolute;
	left: 1141px;
	top: 180px;
	display: none;
}
.messageTotalkBox {
	/* position: absolute;
	left: 1141px;
	top: 180px; */
	width: 462px;
	height: 200px;
	padding: 0 20px;
	font-size: 24px;
	font-weight: bold;
	background-color: rgba(31, 70, 126, 0.5);
	background: url('../assets/images/infobg.png') no-repeat center;
	background-size: contain;
	/* display: none; */
}

.messageTitle {
	line-height: 60px;
	color: #80ffff;
}
.perStatus {
	display: flex;
	align-items: center;
	font-weight:normal;
	padding: 15px 0;
	color: #ffffff;
}
.perStatus span{
	padding: 0 40px;
	font-weight:bold;
}
.perStatus img{
	margin-right: 10px;
}
.onlinePer span {
	color: #80ffff;
}
.offlinePer span{
	color: #d59250;
}


.messageInfoBox{
	width: 462px;
	height: auto;
}
.messageListBox{
	display: flex;
	width: 100%;
	height: 50px;
	margin-top: 10px;
	padding: 10px 20px;
	font-size: 18px;
	color: #b9e4fc;
	align-items: center;
	background: url('../assets/images/infolist.png') no-repeat center;
	background-size: cover;
}
.messageListBox img{
	margin-right: 20px;
}
.messageDate{
	color: #73f2a9
}
.messageName{
	margin: 0 20px;
	padding: 0 20px;
	color: #e2f253;
	border-width: 0 1px;
	border-style: solid;
	border-color: #3e596f
}
.messageScrollBox{
	widows: 210px;
	white-space: nowrap;
	overflow: hidden;
}

/* .messageNotificBox {
	position: absolute;
	right: 1370px;
	top: 300px;
	width: 430px;
	height: 210px;
	padding: 10px 18px;
	background-color: rgba(32, 71, 129, 0.8);
	overflow: hidden;
	display: none; 
}
#messageNotificBox {
	width: 100%;
	height: 210px;
	overflow: hidden;
}
#messageNotificBox ul li.detailLi{
	height: 50px;
	line-height: 30px;
}
#messageNotificBox ul li span{
	margin: 0 5px;
} */
</style>

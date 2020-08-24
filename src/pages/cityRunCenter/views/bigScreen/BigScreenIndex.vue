<template>
	<div id="pdaqfhVueApp">
		<div class="homePage">
			<pageHeader />
			<sbjcSection v-show="homePage && controlShow" class="section" />
			<!-- <sbjsSection v-show="homePage && controlShow" class="section"/> -->
			<xsqxSection v-show="homePage && controlShow" class="section" ref="xsqx" />
			<!-- <xsyhSection v-show="homePage && controlShow" class="section" /> -->
			<jpzzSection v-show="homePage && controlShow" class="section" />
			<mapSection class="mapWrap" />
			<xczySection v-show="homePage && !controlShow" class="section" />
			<zyjkSection v-show="homePage && !controlShow" class="section" />
			<!-- 暂时隐藏中控 -->
            <!-- <centerControl class="centerControl" v-show="zkCenter"/> -->
			<tdjpSection v-show="!homePage" class="section" />
			<znjgSection v-show="!homePage" class="section" />
			<ychmSection v-show="!homePage" class="section hasLeftSection" />
			<ychjSection v-show="!homePage" class="section" />

		</div>
	</div>
</template>

<script>
	import pageHeader from '../../components/Header.vue'
	import sbjcSection from '../../components/SbjcSection.vue'
	import xsqxSection from '../../components/XsqxSection.vue'
	import xsyhSection from '../../components/XsyhSection.vue'
	import jpzzSection from '../../components/JpzzSection.vue'
	import xczySection from '../../components/XczySection.vue'
	import zyjkSection from '../../components/ZyjkSection.vue'
	import mapSection from '../../components/MapSection.vue'
	import centerControl from '../../components/CenterControl.vue'
	import tdjpSection from '../../components/TdjpSection.vue'
	import znjgSection from '../../components/ZnjgSection.vue'
	import ychmSection from '../../components/YchmSection.vue'
	import ychjSection from '../../components/YchjSection.vue'

	export default {
		name: 'bigScreenIndex',
		data() {
			return {
				// logo与地图中丁香站按钮切换显示
				homePage: true,
				//地图下方中央控制部分
				zkCenter:true,//中控默认出现
				controlShow: true,
				clearLeft: null,
				myChartIndex: null
			}
		},
		components: {
			pageHeader,
			sbjcSection,
			xsqxSection,
			xsyhSection,
			jpzzSection,
			zyjkSection,
			xczySection,
			mapSection,
			centerControl,
			tdjpSection,
			znjgSection,
			ychmSection,
			ychjSection
		},
		methods: {

			// logo与地图中丁香站按钮切换事件
			changePage(home) {
				// this.homePage = home ? true : false;
				this.homePage = !this.homePage;
			},
			// 获取元素样式方法
			getStyle(ele, attr) {
				return Math.ceil(parseInt(getComputedStyle(ele)[attr]));
			},
			//走马灯事件(为无缝滚动许复制消息列表)
			msgInterval(ele, ele2, timeSplit = 3000) {
				if (ele && ele2) {
					let _this = this;
					let len = ele.children.length;
					let eleSize = _this.getStyle(ele.children[0], 'height') + _this.getStyle(ele.children[0], 'paddingTop') + _this.getStyle(
						ele.children[0], 'paddingBottom');
					// 初始化元素2的top值
					ele2.style.top = len * eleSize + 'px';
					// 消息轮播定时器
					setInterval(() => {
						let top1 = _this.getStyle(ele, 'top');
						let top2 = _this.getStyle(ele2, 'top');
						// console.log("ele1---"+top1);
						// console.log("ele2---"+top2);
						ele.style.top = top1 - eleSize + 'px';
						ele2.style.top = top2 - eleSize + 'px';
						if (top1 == -eleSize * len) {
							ele.style.zIndex = -100;
							ele.style.display = 'none';
							ele.style.top = (len - 1) * eleSize + 'px';
						} else {
							ele.style.zIndex = 3;
						}
						if (top1 == (len - 1) * eleSize) {
							ele.style.display = 'block';
						}
						if (top2 == -eleSize * len) {
							ele2.style.zIndex = -99;
							ele2.style.display = 'none';
							ele2.style.top = (len - 1) * eleSize + 'px';
						} else {
							ele2.style.zIndex = 2;
						}
						if (top2 == (len - 1) * eleSize) {
							ele2.style.display = 'block';
						}
					}, timeSplit);
				}
			},

			// 初始化列表宽度
			setWidth(ele, ele2) {
				let _this = this;
				let len = ele.children.length;
				let eleSize = _this.getStyle(ele.children[0], 'width') + _this.getStyle(ele.children[0], 'paddingLeft') + _this.getStyle(
					ele.children[0], 'paddingRight');
				ele.style.width = len * eleSize + 'px';
				ele2.style.width = len * eleSize + 'px';
				ele2.style.left = len * eleSize + 'px';
			},

			//向左轮播事件(为无缝滚动许复制消息列表)
			leftInterval(ele, ele2, timeSplit = 4000) {
				if (ele && ele2) {
					let _this = this;
					let len = ele.children.length;
					let eleSize = _this.getStyle(ele.children[0], 'width') + _this.getStyle(ele.children[0], 'paddingLeft') + _this.getStyle(
						ele.children[0], 'paddingRight');
					// 初始化元素2的top值
					ele2.style.left = len * eleSize + 'px';
					// 消息轮播定时器
					this.clearLeft = setInterval(() => {
						let top1 = _this.getStyle(ele, 'left');
						let top2 = _this.getStyle(ele2, 'left');
						// console.log("ele1---"+top1);
						// console.log("ele2---"+top2);
						ele.style.left = top1 - eleSize + 'px';
						ele2.style.left = top2 - eleSize + 'px';
						if (top1 == -eleSize * len) {
							ele.style.zIndex = -100;
							ele.style.display = 'none';
							ele.style.left = (len - 1) * eleSize + 'px';
						} else {
							ele.style.zIndex = 3;
						}
						if (top1 == (len - 1) * eleSize) {
							ele.style.display = 'block';
						}
						if (top2 == -eleSize * len) {
							ele2.style.zIndex = -99;
							ele2.style.display = 'none';
							ele2.style.left = (len - 1) * eleSize + 'px';
						} else {
							ele2.style.zIndex = 2;
						}
						if (top2 == (len - 1) * eleSize) {
							ele2.style.display = 'block';
						}
					}, timeSplit);
				}
			},

			//设置tab切换主体echarts元素id
			setId(pid, id) {
				return 'echarts-' + pid + '-' + (id + 1);
			},

			// 巡视tab切换事件
			tabChange(data, index) {
				if (data.length) {
					for (var i = 0; i < data.length; i++) {
						data[i].display = false;
					}
					data[index].display = true;
				}
			},
			// 地图下方中央控制事件
			showControlOne() {
				this.controlShow = true;
			},
			showControlTwo() {
				this.controlShow = false;
			},

			//保持前端登录状态方法
			keepAlive(time) {
				let _this = this;
				setInterval(function() {
					_this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/aqfh/keepAlive', '大屏保持登录状态').then(result => {
						// console.log("status1-on-login");
					});
				}, time);
			},

		},
		mounted() {

			//保持前端登录状态
			this.keepAlive(60000);

		}
	}
</script>

<style lang="scss">
	body {
		margin: 0;
		padding: 0;
		font-size: 18px;
		font-family: '微软雅黑';
		width: 4224px;
		height: 1080px;
		// width: 100%;
		// height: 100%;
		background: #090f27;
		// overflow: hidden
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	img {
		border: none;
	}

	a {
		text-decoration: none;
		display: block;
	}

	@keyframes rotate {
		from {
			-webkit-transform: rotate(0);
			-moz-transform: rotate(0);
			-ms-transform: rotate(0);
			-o-transform: rotate(0);
			transform: rotate(0);
		}

		to {
			-webkit-transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-ms-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	// body > div {
	//     width: 4224px;
	//     height: 1080px;
	//     // width: 100%;
	//     // height: 100%;
	//     position: absolute;
	//     left: 0;
	//     top: 0;
	// }
    body .el-message,
	body .el-message--error{
		display: none !important;
	}
	body #bigScrenVueApp {
		width: 4224px;
		height: 1080px;
		// width: 100%;
		// height: 100%;
		transform: scale(1.59,2);
		transform-origin: 0% 0%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.homePage {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.sectionBox {
		position: absolute;
		z-index: 500;
	}

	.sectionMain {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 200;
	}

	.sectionHead {
		width: 100%;
		height: 70px;
		line-height: 70px;
		padding-bottom: 8px;
		font-size: 26px;
		color: #ffffff;
		text-shadow: 0px 0px 7px rgba(53, 200, 255, 0.8);
	}

	.sectionHead span {
		font-size: 18px;
		padding-left: 16px;
		position: relative;
	}

	.sectionHead span:before {
		content: "";
		display: block;
		position: absolute;
		left: 6px;
		top: -2px;
		width: 1px;
		height: 26px;
		background: #ffffff;
	}

	.sectionBody {
		width: 100%;
		height: calc(100% - 70px);
		box-sizing: border-box;
		position: relative;
	}

	.sectionTail {
		position: absolute;
		left: 0;
		width: 100%;
		height: 32px;
		line-height: 32px;
		text-indent: 65px;
		font-size: 14px;
		color: #ffffff;
		text-shadow: 0px 0px 7px rgba(53, 200, 255, 0.8);
	}

	.sectionTail:before {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 30px;
		width: 32px;
		height: 32px;
		background: url("../../assets/images/ic_bdrw.png") no-repeat left center;
		-webkit-animation: rotate 2s linear infinite;
		-moz-animation: rotate 2s linear infinite;
		-ms-animation: rotate 2s linear infinite;
		-o-animation: rotate 2s linear infinite;
		animation: rotate 2s linear infinite;
	}

	.sectionItem {
		float: left;
		margin-right: 12px;
		background: rgba(37, 62, 106, 0.3);
		width: 50%;
	}

	.sectionCons {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.sectionConInner {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		/* opacity: 0; */
	}

	.sectionConInner.active {
		opacity: 1;
	}

	.sectionSplit {
		float: left;
		width: 520px;
		height: 100%;
		position: relative;
	}

	.sectionSplit:nth-of-type(2) {
		width: 490px;
	}

	.sectionSplit2 {
		width: 100%;
		height: 544px;
	}

	.sectionSplit2:nth-of-type(2) {
		height: calc(100% - 544px);
	}

	.sectionSplit3 {
		float: left;
		width: 50%;
		height: 100%;
		position: relative;
	}

	.sectionSplit3:nth-of-type(2) {
		width: 50%;
		height: 100%;
	}

	.sectionSplit3 .sectionTab {
		top: 0;
		z-index: 300;
	}

	.sectionSplit3 .sectionBody {
		padding-top: 41px;
		height: 100%;
	}

	.sectionSplit3 .sectionBody.sectionBody11 {
		padding-right: 30px;
		box-sizing: border-box;
	}

	.sectionTab {
		position: absolute;
		right: 33px;
		top: 48px;
		height: 41px;
	}

	.sectionTab.tab2 {
		top: 58px;
		z-index: 300;
	}

	.sectionTabLink {
		float: left;
		margin-right: 5px;
		padding: 0 9px;
		height: 38px;
		line-height: 38px;
		border-bottom: 3px solid transparent;
		font-size: 18px;
		color: #ffffff;
		transition: 0.3s;
	}

	.sectionTabLink.active,
	.sectionTabLink:hover {
		border-color: #3dd8ff;
		color: #3dd8ff;
	}

	.forEcharts {
		width: 100%;
		height: 100%;
	}

	.forEcharts.etype1 {
		width: 520px;
		height: 358px;
	}

	.forEcharts.etype2 {
		position: absolute;
		top: 30px;
		width: 670px;
		height: 474px;
	}

	.forEcharts.etype3 {
		width: 470px;
		height: 350px;
	}

	.forEcharts.etype4 {
		width: 510px;
		height: 357px;
	}

	.forEcharts.etype5 {
		width: 612px;
		height: 357px;
	}

	.detailUlWrap {
		width: 100%;
		padding-top: 10px;
		height: calc(100% - 40px);
		position: relative;
		overflow: hidden;
	}

	.detailUl {
		width: 100%;
		height: 100%;
		font-size: 18px;
		color: #ffffff;
		box-sizing: border-box;
		padding: 0 30px;
		position: absolute;
		left: 0;
		top: 0;
		transition: 1.2s linear;
	}

	.detailUl2 {
		top: 100%;
	}

	.detailLi {
		width: 100%;
		height: 22px;
		line-height: 22px;
		padding: 9px 0;
		box-sizing: content-box;
	}

	.detailLiCon {
		float: left;
		height: 22px;
		margin: 0 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.detailLiCon:nth-of-type(1) {
		width: 44px;
		text-align: center;
		border-radius: 3px;
		font-size: 12px;
		background: #e0b133;
	}

	.detailLiCon:nth-of-type(2) {
		width: 190px;
	}

	.detailLiCon:nth-of-type(3) {
		width: calc(100% - 54px - 210px);
	}

	.detailLiCon.type1 {
		background: #e0b133;
	}

	.detailLiCon.type2 {
		// background: #e85533;
		background: #825384;
		
	}

	.detailLiCon.type3 {
		background: #2cc276;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(1) {
		width: 65px;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(2) {
		width: 44px;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(3) {
		width: 60px;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(4) {
		width: calc(100% - 75px - 64px - 70px);
	}

	.troubleUl2 {
		top: 100%;
	}

	.detailLi.type2 {
		font-size: 16px;
		color: #d1f6ff;
		height: 32px;
		padding: 4px 0;
	}

	.detailLi.type2 .detailLiCon {
		height: 32px;
		line-height: 32px;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(1) {
		text-indent: 28px;
		font-size: 16px;
		background: url("../../assets/images/ic_loc_ser.png") no-repeat left center;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(1).type2 {
		background: url("../../assets/images/ic_loc_nor.png") no-repeat left center;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(2) {
		color: #33c172;
		border: 1px solid #33c172;
		border-radius: 3px;
		text-align: center;
		height: 22px;
		line-height: 20px;
		position: relative;
		top: 4px;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(2) {
		background: none;
	}

	.detailLi.type2 .detailLiCon:nth-of-type(2).type2 {
		border-color: #f23d3d;
		color: #f23d3d;
		background: none;
	}

	.mapWrap {
		width: 1860px;
		height: 1080px;
		position: absolute;
		left: 980px;
		top: 0;
		// z-index: 100;
	    //background: #0b1933;
	}

	.sectionBody9 {
		height: calc(100% - 92px);
		padding-left: 25px;
	}

	.sourceBlock {
		width: 100%;
		height: 51%;
	}

	.sourceBlock:nth-of-type(2) {
		height: 49%;
	}

	.sourceSplit {
		float: left;
		height: 100%;
		width: 45%;
		position: relative;
	}

	.sourceSplit:nth-of-type(2) {
		width: 55%;
	}

	.todayWorkBox {
		width: 375px;
		height: 350px;
		position: absolute;
		left: 35%;
		top: 35%;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		// background: url("../../assets/images/chart.png") no-repeat center center;
	}

	.todayItem {
		position: absolute;
		text-align: center;
		font-size: 14px;
		color: #60f0ac;
		width: 84px;
		left: 20px;
		top: 62px;
	}

	.todayItem .itemText {
		width: 100%;
		height: 24px;
		line-height: 24px;
	}

	.todayItem .itemNum {
		width: 100%;
		height: 20px;
		line-height: 20px;
	}

	.todayItem:nth-of-type(2) {
		width: 70px;
		left: 285px;
		top: 107px;
	}

	.todayItem2 {
		position: absolute;
		text-align: center;
		font-size: 16px;
		color: #60f0ac;
		width: 94px;
		left: 0;
		top: 130px;
		text-align: right;
	}

	.todayItem2 .itemText {
		width: 100%;
		height: 26px;
		line-height: 26px;
	}

	.todayItem2 .itemNum {
		width: 100%;
		height: 28px;
		line-height: 28px;
	}

	.todayItem2.rightType {
		width: 70px;
		left: 305px;
		top: 174px;
		text-align: left;
		color: #0d7dfa;
	}

	.todayItem3 {
		position: absolute;
		left: 59px;
		bottom: 0;
		width: 294px;
		height: 35px;
		line-height: 35px;
		color: #0d7dfa;
		font-size: 18px;
		color: #19c3e6;
		text-align: center;
	}

	.todayItem3 .itemText {
		float: left;
		width: 136px;
		margin-right: 24px;
	}

	.todayItem3 .itemNum {
		float: left;
	}

	.todayItem3 .itemNum span {
		display: block;
		float: left;
		width: 32px;
		height: 100%;
		margin-right: 10px;
		font-size: 26px;
		color: #ffffff;
	}

	#sectionBox8 {
		width: 1242px;
		height: 940px;
		position: absolute;
		top: 114px;
		right: 58px;
	}

	.sectionBody8 {
		padding-left: 40px;
	}

	#sectionBox8 .sectionHead {
		height: 92px;
		line-height: 92px;
	}

	.echartsTitle {
		width: 100%;
		height: 60px;
		padding-top: 20px;
		line-height: 40px;
		color: #ffffff;
		font-size: 20px;
		text-indent: 25px;
	}

	.echartsTitle strong {
		font-size: 30px;
		color: #4bb5ff;
		padding-left: 5px;
	}

	.detailHead {
		width: 100%;
		height: 40px;
		line-height: 22px;
		box-sizing: border-box;
		padding: 9px 20px 9px 0;
		position: absolute;
		top: 0;
		right: 0;
	}

	.detailHeadItemWrap {
		float: left;
		width: 25%;
		height: 100%;
		box-sizing: border-box;
		padding-right: 10px;
	}

	.detailHeadItem {
		width: 100%;
		height: 100%;
		border-radius: 11px;
		font-size: 12px;
		color: #ffffff;
	}

	.detailHeadItem span {
		display: inline-block;
		// float: left;
		height: 100%;
	}

	.detailHeadItem span:nth-of-type(1) {
		width: 70%;
		text-align: right;
	}

	.detailHeadItem span:nth-of-type(2) {
		width: 30%;
		text-align: left;
	}

	/* .detailHeadItemWrap:nth-of-type(1) .detailHeadItem {
		background: #5d564a;
	}

	.detailHeadItemWrap:nth-of-type(2) .detailHeadItem {
		background: #5d564a;
	}

	.detailHeadItemWrap:nth-of-type(3) .detailHeadItem {
		background: #024e74;
	}

	.detailHeadItemWrap:nth-of-type(4) .detailHeadItem {
		background: #0174ad;
	} */

	.detailContext {
		width: 100%;
		height: 100%;
	}

	.detailContextItemWrap {
		width: 100%;
		height: 144px;
		padding: 8px 0;
		box-sizing: content-box;
	}

	.detailContextItem {
		width: 100%;
		height: 100%;
		position: relative;
		background: rgba(37, 62, 106, 0.4);
		overflow: hidden;
		box-sizing: border-box;
		padding: 10px 0;
	}

	.detailContextItem:before {
		content: "";
		display: block;
		position: absolute;
		right: -25px;
		top: -12px;
		width: 60px;
		height: 36px;
		background: rgba(0, 183, 238, 0.3);
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.detailTable {
		border: none;
		width: 100%;
		height: 100%;
	}

	.detailTable td {
		height: 25%;
		font-size: 16px;
	}

	.detailTable td:first-of-type {
		width: 25%;
		text-align: right;
		color: #bde6fb;
	}

	.detailTable td:last-of-type {
		width: 75%;
		text-indent: 32px;
		color: #2fa9ff;
	}

	.sourceHead {
		width: 100%;
		height: 55px;
		padding-top: 23px;
		line-height: 32px;
		color: #ffffff;
		font-size: 20px;
		text-indent: 48px;
		background: url("../../assets/images/ic_triangle.png") no-repeat left 12px top 23px;
	}

	.sourceBox {
		background: rgba(37, 62, 106, 0.3);
		margin-right: 40px;
		float: left;
	}

	.sourceBox:nth-of-type(1) {
		width: 510px;
		height: 412px;
	}

	.sourceBox:nth-of-type(2) {
		width: calc(100% - 590px);
		height: 412px;
	}

	.sourceBox:nth-of-type(3) {
		margin-top: 46px;
		width: calc(100% - 40px);
		height: 350px;
		position: relative;
	}

	.sourceBox:nth-of-type(3):after {
		content: "";
		display: block;
		width: 2px;
		height: 200px;
		background: #1e769a;
		position: absolute;
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.sourceBody {
		width: 100%;
		height: calc(100% - 55px);
	}


	.section {
		position: absolute;
		background: url("../../assets/images/section_bg4.png") no-repeat right bottom;
		padding: 63px 25px 14px 44px;
		z-index: 500;
	}

	.sectionTop {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 30px;
		height: 40px;
		line-height: 40px;
		font-size: 26px;
		color: #ffffff;
		padding-bottom: 3px;
		box-sizing: content-box;
		background: url("../../assets/images/section_bg3.png") repeat-x bottom;
		text-shadow: 0px 0px 7px rgba(53, 200, 255, 0.8);
	}

	.sectionTop:before {
		content: "";
		display: block;
		width: 41px;
		height: 190px;
		position: absolute;
		right: 100%;
		top: 100%;
		background: url("../../assets/images/section_bg1.png") no-repeat 0 0;
		margin-top: -23px;
	}

	.sectionTop:after {
		content: "";
		display: block;
		width: 204px;
		height: 40px;
		position: absolute;
		left: 100%;
		top: 0;
		background: url("../../assets/images/section_bg2.png") no-repeat 0 bottom;
		margin-top: 3px;
	}

	.sectionIn {
		width: 100%;
		height: 100%;
	}

	.sectionInBody {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.articleUl {
		width: auto;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		transition: 1.5s;
	}

	.articleLi {
		width: 492px;
		height: 100%;
		float: left;
	}

	.articleItem {
		width: 100%;
		height: 50%;
		box-sizing: border-box;
		padding: 0 25px 14px 0;
	}

	.articleItemIn {
		width: 100%;
		height: 100%;
		background: rgba(37, 62, 106, 0.4);
		color: #ffffff;
	}

	.articleItemIn.hasBorder {
		border: 2px solid #43f2f4;
	}

	.articleItemIn img {
		width: 100%;
		height: 100%;
	}

	.sectionInLeft {
		width: 310px;
		height: calc(100% - 14px);
		margin-right: 14px;
		float: left;
		background: rgba(37, 62, 106, 0.4);
	}

	.hasLeftSection .sectionInBody {
		width: calc(100% - 324px);
		float: left;
	}


	// 附件预览遮罩层定位
	.viewer-open {
		position: relative !important;
	}

	 .viewer-fixed {
		position: absolute !important;
		top: 120px !important;
		left: 1142px !important;
		width: 1930px !important;
		height: 941px !important;
	}
	.viewer-navbar,
	.viewer-title{
		display: none
	}
	.viewer-toolbar{
		bottom: 0;
	}
	.viewer-canvas{
		top: 0 !important;
	}
	.viewer-canvas > img{
		// width: 100% !important;
		// height: 100% !important;
	    margin-top: 70px !important;
		margin-left: auto !important;
		position: initial !important;
		max-width: none !important;
		transform: none;
	}
</style>

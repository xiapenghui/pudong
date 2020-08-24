<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show" class="centerControl">
		<div class="controlMask"></div>
		<div class="controlMask"></div>
		<div class="controlBox" :class="{ active: controlClass }" @click="showControlOne">
			<CenterOne></CenterOne>
			<CenterTwo></CenterTwo>
		</div>
		<div class="controlBox" :class="{ active: !controlClass }" @click="showControlTwo">
			<CenterThree></CenterThree>
			<CenterFour></CenterFour>
		</div>
	</div>
</template>
<script>
import axiosRequest from '@utils/axiosRequest';
import eventBus from '../components/baidumap/base/EventBus';
import CenterOne from './CenterOne.vue';
import CenterTwo from './CenterTwo.vue';
import CenterThree from './CenterThree.vue';
import CenterFour from './CenterFour.vue';
export default {
	name: 'centerControl',
	props: {
		width: {
			type: Number,
			default: 1600
		},
		height: {
			type: Number,
			default: 170
		},
		left: {
			type: Number,
			default: 1205
		},
		top: {
			type: Number,
			default: 879
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			controlClass: true,
		};
	},
	components: {
		CenterOne,
		CenterTwo,
		CenterThree,
		CenterFour
	},
	computed: {},
	methods: {
		showControlOne() {
			this.controlClass = true;
			this.$parent.showControlOne();
			eventBus.emit('switch-switchLayer', '综合监控');
		},
		showControlTwo() {
			this.controlClass = false;
			this.$parent.showControlTwo();
			eventBus.emit('switch-switchLayer', '安全管控');
		}
	},
	mounted() {}
};
</script>

<style scoped>
.centerControl {
	position: absolute;
	/* z-index: 500; */
	z-index: 100;
}

.controlBox {
	width: 754px;
	height: 170px;
	float: left;
	margin-right: 38px;
}

.controlItem {
	width: 358px;
	height: 170px;
	float: left;
	background: url('../assets/images/bg_button_nor.png') no-repeat center center;
	/* background: url("../assets/images/bg_button_sel.png") no-repeat center center; */
	cursor: pointer;
}

.controlItem:first-of-type {
	margin-right: 38px;
}

.controlBox.active .controlItem,
.controlBox:hover .controlItem {
	background: url('../assets/images/bg_button_sel.png') no-repeat center center;
}

.controlBox.active .controlItem {
	cursor: default;
}

.controlMask {
	width: 38px;
	height: 170px;
	position: absolute;
	top: 0;
	left: 358px;
}

.controlMask:nth-of-type(2) {
	left: 1150px;
}

.cTitle {
	width: 100%;
	height: 52px;
	box-sizing: border-box;
	padding-top: 6px;
	line-height: 46px;
	text-indent: 24px;
	color: #8ed0ff;
	font-size: 20px;
}

.cDetail {
	width: 100%;
	height: 32px;
	line-height: 32px;
}

.cText {
	float: left;
	width: 130px;
	height: 100%;
	color: #ffffff;
	font-size: 18px;
	text-indent: 30px;
}

.cLine {
	float: left;
	width: 148px;
	height: 100%;
	box-sizing: border-box;
	padding: 8px 0;
}

.cLineItem {
	width: 6px;
	height: 100%;
	margin-right: 6px;
	background: #32b16c;
	float: left;
}

.cLineItem.cLineItem2 {
	margin-right: 0;
}

.emptyLine {
	float: left;
	width: 148px;
	height: 100%;
	box-sizing: border-box;
	padding: 8px 0;
}

.emptyLineItem {
	width: 100%;
	height: 100%;
	border: 1px solid #32b16c;
	box-sizing: border-box;
}

.cNum {
	float: left;
	width: calc(100% - 278px);
	height: 100%;
	color: #43f2f4;
	font-size: 18px;
	text-indent: 12px;
}

.cNum .warnNum {
	color: #ec6941;
}
</style>

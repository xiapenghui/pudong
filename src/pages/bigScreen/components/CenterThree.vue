<template>
	<div class="controlItem">
		<div class="cTitle">作业安全管控</div>
		<div class="cDetail">
			<div class="cText">当日作业</div>
			<div class="emptyLine" v-if="!conComputedData.drzy.type"><div class="emptyLineItem"></div></div>
			<warn-line v-else :className="['cLine']" :itemClassName="['cLineItem', 'cLineItem2']" :itemSize="conComputedData.drzy.item"></warn-line>
			<div class="cNum">
				<span>{{ conComputedData.drzy.num }}</span>
			</div>
		</div>
		<div class="cDetail">
			<div class="cText">变电站异常</div>
			<warn-line :className="['cLine']" :itemClassName="['cLineItem', { warnItem: conComputedData.bdzyc.type }]" :itemSize="conComputedData.bdzyc.item"></warn-line>
			<div class="cNum">
				<span class="warnNum" v-if="conComputedData.bdzyc.type">{{ conComputedData.bdzyc.num }}</span>
				<span v-else>正常</span>
			</div>
		</div>
		<div class="cDetail">
			<div class="cText">作业点异常</div>
			<warn-line :className="['cLine']" :itemClassName="['cLineItem', { warnItem: conComputedData.zydyc.type }]" :itemSize="conComputedData.zydyc.item"></warn-line>
			<div class="cNum">
				<span class="warnNum" v-if="conComputedData.zydyc.type">{{ conComputedData.zydyc.num }}</span>
				<span v-else>正常</span>
			</div>
		</div>
	</div>
</template>

<script>
import warnLine from './WarnLine.vue';
import axiosRequest from '@utils/axiosRequest';
import * as dataApi from '../api/apiData.js';
export default {
	data() {
		return {
			controlClass: true,
			conData: {
				drzy: 0,
				bdzyc: 0,
				zydyc: 0
			}
		};
	},
	components: {
		warnLine
	},
	computed: {
		// 用于显示中控部分
		conComputedData() {
			//获取数字对应视图展示,len参数是视图中一个格子对应的数值,默认为10
			let getComputed = function(num, other = false) {
				let num_c = {
					num: num,
					type: false,
					item: 12
				};
				if (num > 12 * 10) {
					num_c.type = true;
				} else if (num > 0) {
					num_c.type = true;
					num_c.item = Math.ceil(num / 10);
				}
				num_c.item = other ? num_c.item * 2 : num_c.item;
				return num_c;
			};
			let otherType = ['drzy', 'ywdw', 'sgdw', 'yddb'];
			let newData = {};
			for (let p in this.conData) {
				if (otherType.indexOf(p) !== -1) {
					newData[p] = getComputed(this.conData[p], true);
				} else {
					newData[p] = getComputed(this.conData[p]);
				}
			}
			return newData;
		}
	},
	methods: {
		// 变电站异常
		bdzycNumber() {
			let params = {
				rangeType: 'month',
				messageType: 'bdzzdfy_state'
			};
			dataApi.getcentreNumber(params).then(result => {
				this.conData.bdzyc = parseInt(result.data.data.bdzzdfy_state);
			});
		},
		// 当日作业
		drzyNumber() {
			dataApi.getcenterWarNumber().then(result => {
				this.conData.drzy = parseInt(result.data.data.signStats);
			});
		}
	},
	mounted() {
		this.bdzycNumber();
		this.drzyNumber();
	}
};
</script>

<style scoped>
centerControl {
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

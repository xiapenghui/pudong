<template>
	<div class="controlItem">
		<div class="cTitle">设备综合监控</div>
		<div class="cDetail">
			<div class="cText">危急缺陷</div>
			<warn-line :className="['cLine']" :itemClassName="['cLineItem', { warnItem: conComputedData.wjqx.type }]" :itemSize="conComputedData.wjqx.item"></warn-line>
			<div class="cNum">
				<span class="warnNum" v-if="conComputedData.wjqx.type">{{ conComputedData.wjqx.num }}</span>
				<span v-else>正常</span>
			</div>
		</div>
		<div class="cDetail">
			<div class="cText">异常监控</div>
			<warn-line :className="['cLine']" :itemClassName="['cLineItem', { warnItem: conComputedData.ycjk.type }]" :itemSize="conComputedData.ycjk.item"></warn-line>
			<div class="cNum">
				<span class="warnNum" v-if="conComputedData.ycjk.type">{{ conComputedData.ycjk.num }}</span>
				<span v-else>正常</span>
			</div>
		</div>
		<div class="cDetail">
			<div class="cText">火灾消防</div>
			<warn-line :className="['cLine']" :itemClassName="['cLineItem', { warnItem: conComputedData.hzxf.type }]" :itemSize="conComputedData.hzxf.item"></warn-line>
			<div class="cNum">
				<span class="warnNum" v-if="conComputedData.hzxf.type">{{ conComputedData.hzxf.num }}</span>
				<span v-else>正常</span>
			</div>
		</div>
	</div>
</template>

<script>
import warnLine from './WarnLine.vue';
import axiosRequest from '@utils/axiosRequest';
import eventBus from '../components/baidumap/base/EventBus';
import * as dataApi from '../api/apiData.js';
export default {
	data() {
		return {
			conData: {
				wjqx: 0,
				ycjk: 0,
				hzxf: 0
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
		// 危急缺陷
		wjqxNumber() {
			let params = {
				rangeType: 'today',
				bugType: '1',
				offset: '0',
				limit: '1000'
			};
			dataApi.getqxjkDetail(params).then(result => {
				let newQx = 0;
				for (let i = 0; i < result.data.data.page.list.length; i++) {
					let name = result.data.data.page.list[i].bug_property_name;
					if (name == '危急') {
						newQx++;
						this.conData.wjqx = newQx;
					}
				}
			});
		},
		// 异常监控
		ycjkNumber() {
			Promise.all([
				axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=suojunAlarmTopic', '获取告警消息统计信息'),
				axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=das_alarm', '获取告警消息统计信息'),
				axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=znjg_qxgj', '获取告警消息统计信息'),
				axiosRequest('/pdaqfh_war_exploded/f/sgxcycjk/getVideoSummary', '获取变电站摄像设备汇总信息'),
				axiosRequest('/pdaqfh_war_exploded/f/dzspjk/getDeviceSummary', '获取电站视频监控设备统计数据')
			]).then(result => {
				debugger;
				let suojunAlarmTopic = parseInt(result[0].data.suojunAlarmTopic);
				let das_alarm = parseInt(result[1].data.das_alarm);
				let znjg_qxgj = parseInt(result[2].data.znjg_qxgj);
				let video_summary = parseInt(result[3].data.noOnlineNum);
				let device_summary = parseInt(result[4].data.noOnlineNum);
				this.conData.ycjk = suojunAlarmTopic + das_alarm + znjg_qxgj + video_summary + device_summary;
			});
		},
		// 火灾消防
		hzxfNumber() {
			let params = {
				rangeType: 'month',
				messageType: 'xfwlw_fire'
			};
			dataApi.getcentreNumber(params).then(result => {
				this.conData.hzxf = parseInt(result.data.data.xfwlw_fire);
			});
		}
	},
	mounted() {
		this.wjqxNumber();
		this.ycjkNumber();
		this.hzxfNumber();
	}
};
</script>

<style>
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

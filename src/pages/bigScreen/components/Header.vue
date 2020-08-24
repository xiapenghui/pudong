<template>
	<div class="header" :style="{ width: width, height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="homeLink" @click="toHome"></div>
		<div class="messagePart">
			<ul ref="messageUl" class="messageUl">
				<li class="messageLi">网格化运维：已审核隐患/缺陷
					<span>{{ headerData.todaySummary }}</span>个 在线运维（变电
					<span>{{ headerData.bd }}</span>人 线路
					<span>{{ headerData.xl }}</span>人 电缆
					<span>{{ headerData.dl }}</span>人 配电
					<span>{{ headerData.pd }}</span>人）
				</li>
				<li class="messageLi">现场施工管控：今日施工
					<span>{{ headerData.signStats }}</span>起，在线工作
					<span>{{ headerData.onlineMap }}</span>人
				</li>
				<li class="messageLi">浦东公司全电网运行正常</li>
			</ul>
			<ul ref="messageUl2" class="messageUl messageUl2">
				<li class="messageLi">网格化运维：已审核隐患/缺陷
					<span>{{ headerData.todaySummary }}</span>个 在线运维（变电
					<span>{{ headerData.bd }}</span>人 线路
					<span>{{ headerData.xl }}</span>人 电缆
					<span>{{ headerData.dl }}</span>人 配电
					<span>{{ headerData.pd }}</span>人）
				</li>
				<li class="messageLi">
					现场施工管控：今日施工
					<span>{{ headerData.signStats }}</span>起，在线工作
					<span>{{ headerData.onlineMap }}</span>人
				</li>
				<li class="messageLi">浦东公司全电网运行正常</li>
			</ul>
		</div>
		<div class="statusPart">
			<a class="statusLink">{{ yjStatus }}</a>
			<a class="statusLink" @click="bdStstus">{{ bdStatus }}</a>
			<a class="statusLink">{{ qxStatus }}</a>
		</div>
		<div class="timePart">{{ timeData }}</div>
		<div class="weatherPart">
			<div class="weatherIcon"><img :src="weatherUrls[weatherText.indexOf(weatherData.weatherPre)]" :title="weatherData.weatherPre" alt="起始天气" /></div>
			<div class="weatherIcon" v-if="weatherData.weatherNext">
				<img :src="weatherUrls[weatherText.indexOf(weatherData.weatherNext)]" :title="weatherData.weatherNext" alt="最终天气" />
			</div>
			<div class="weatherContent">
				<span>{{ weatherData.min }}</span>~<span>{{ weatherData.max }}</span>℃
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from './baidumap/base/EventBus';
import * as dataApi from '../api/apiData.js';
export default {
	name: 'pageHeader',
	props: {
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: Number,
			default: 95
		},
		left: {
			type: Number,
			default: 0
		},
		top: {
			type: Number,
			default: 0
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			yjStatus: '预警状态正常',
			bdStatus: '保电状态正常',
			qxStatus: '抢修状态正常',
			// 接口数据：获取今日工作汇总情况
			todayWorkSummary: {
				signStats: 0,
				supervisor: 0,
				manage: 0,
				temporaryNum: 0,
				planNum: 0
			},

			// 接口数据：获取当前施工现场人员出动情况
			curConstructorStats: {
				totalMap: {
					wkresponser: 0,
					supervisor: 0,
					wkapprover: 0,
					manage: 0
				},
				onlineMap: {
					wkresponser: 0,
					supervisor: 0,
					wkapprover: 0,
					manage: 0
				}
			},

			// 接口数据：获取今日已审核隐患缺陷数
			todayAuditedBugSummary: {
				pdNum: 0,
				dlNum: 0,
				bdNum: 0,
				xlNum: 0,
				pdzdhNum: 0
			},

			// 接口数据：获取当前人员统计信息
			currentPersonSummary: [
				{ id: 1, offline_users: 0, online_users: 0, professional_name: '线路' },
				{ id: 2, offline_users: 0, online_users: 0, professional_name: '配电' },
				{ id: 3, offline_users: 0, online_users: 0, professional_name: '电缆' },
				{ id: 4, offline_users: 0, online_users: 0, professional_name: '变电' },
				{ id: 5, offline_users: 0, online_users: 0, professional_name: '营销一体化' },
				{ id: 6, offline_users: 0, online_users: 0, professional_name: '营业站' },
				{ id: 7, offline_users: 0, online_users: 0, professional_name: '配电自动化' },
				{ id: 8, offline_users: 0, online_users: 0, professional_name: '线路联防（虚拟）' }
			],
			// 系统时间
			timeData: '2019-03-13 14:30',
			// 天气图标
			weatherUrls: [
				require('../assets/images/ic_weather_cloudy.png'),
				require('../assets/images/ic_weather_foggy.png'),
				require('../assets/images/ic_weather_overcast.png'),
				require('../assets/images/ic_weather_rain_heavy.png'),
				require('../assets/images/ic_weather_rain_light.png'),
				require('../assets/images/ic_weather_rain_moderate.png'),
				require('../assets/images/ic_weather_snow.png'),
				require('../assets/images/ic_weather_sunny.png'),
				require('../assets/images/ic_weather_thunder.png'),
				require('../assets/images/ic_weather_windy.png')
			],
			// 天气文字表述情况
			weatherText: ['多云', '雾', '阴', '大雨', '小雨', '中雨', '雪', '晴', '雷阵雨', '台风'],
			// 天气情况
			weatherData: {
				weatherPre: '多云',
				weatherNext: '',
				min: 8,
				max: 20
			}
		};
	},
	computed: {
		headerData() {
			return {
				//用于头部-现场施工管控：今日施工()起
				signStats: this.todayWorkSummary.signStats,
				//用于头部-现场施工管控：在线工作()人
				// onlineMap: this.curConstructorStats.onlineMap.wkresponser + this.curConstructorStats.onlineMap.supervisor + this.curConstructorStats.onlineMap.wkapprover + this.curConstructorStats.onlineMap.manage,
				onlineMap: this.curConstructorStats,
				//用于头部-网格化运维：已审核隐患/缺陷()个
				todaySummary:
					this.todayAuditedBugSummary.pdNum +
					this.todayAuditedBugSummary.dlNum +
					this.todayAuditedBugSummary.bdNum +
					this.todayAuditedBugSummary.xlNum +
					this.todayAuditedBugSummary.pdzdhNum,
				//用于头部-网格化运维：在线运维 变电()人 线路()人 电缆()人 配电()人
				bd: this.currentPersonSummary[3].online_users,
				xl: this.currentPersonSummary[0].online_users,
				dl: this.currentPersonSummary[2].online_users,
				pd: this.currentPersonSummary[1].online_users
			};
		}
	},
	methods: {
		toHome() {
			this.$parent.changePage(true);
		},
		// 点击智能保障
		bdStstus() {
			this.$parent.bdStstusParent();
			eventBus.emit('switch-switchLayer', '智慧保电');
		},
		// 获取当前系统时间
		getLocalTime() {
			let date = new Date();
			let dateTime = date.toString().split(' ')[4]; //包含秒时间
			let dateTime2 = date.toString().split(' ')[4].slice(0, -3); //去除包含秒时间
			let seperator1 = '-';
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = '0' + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate;
			}
			let dateDay = year + seperator1 + month + seperator1 + strDate;
			return dateDay + ' ' + dateTime2;
		},

		// 动态设置系统时间
		setSystemTime() {
			let _this = this;
			setInterval(function() {
				_this.timeData = _this.getLocalTime();
			}, 6000);
		},
		// 获取今日工作汇总情况
		getTodayWork() {
			dataApi.getcenterWarNumber().then(result => {
				this.todayWorkSummary = result.data.data;
			});
		},
		// 获取当前施工现场人员出动情况
		getCurConstructor() {
			dataApi.getsgdwNumber().then(result => {
				let onlineMap = result.data.data.onlineMap;
				let manage = parseInt(onlineMap.manage);
				let supervisor = parseInt(onlineMap.supervisor);
				let wkapprover = parseInt(onlineMap.wkapprover);
				let wkresponser = parseInt(onlineMap.wkresponser);
				manage = isNaN(manage) ? 0 : manage;
				supervisor = isNaN(supervisor) ? 0 : supervisor;
				wkapprover = isNaN(wkapprover) ? 0 : wkapprover;
				wkresponser = isNaN(wkresponser) ? 0 : wkresponser;
				this.curConstructorStats = manage + supervisor + wkapprover + wkresponser;
			});
		},

		// 获取今日已审核隐患缺陷数
		getTodayAuditedBug() {
			dataApi.getjryh().then(result => {
				this.todayAuditedBugSummary = result.data.data;
			});
		},
		// 获取当前人员统计信息
		getCurrentPerson() {
			dataApi.getrytj().then(result => {
				this.currentPersonSummary = result.data.data;
			});
		},
		// 获取百度天气
		getWeathers() {
			dataApi.getbdtq().then(result => {
				let todayTem = result.data.data.results[0].weather_data[0];
				let weather = todayTem.weather;
				let tem = todayTem.temperature.split(' ~ ');
				let max = tem[0];
				let min = tem[1].slice(0, -1);
				let weatherPre = '';
				let weatherNext = '';
				if (weather.indexOf('转') !== -1) {
					weatherPre = weather.split('转')[0];
					weatherNext = weather.split('转')[1];
				} else {
					weatherPre = weather;
				}
				this.weatherData = {
					weatherPre: weatherPre,
					weatherNext: weatherNext,
					min: min,
					max: max
				};
			});
		},
		//保电状态
		getXnGdfwYjByYwdw() {
			let params = {
				ywdw: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFSP06'
			};
			dataApi.getbdzt(params).then(result => {
				this.yjStatus = result.data.data[0].yjztms;
				this.qxStatus = result.data.data[1].yjztms;
				this.bdStatus = result.data.data[2].yjztms;
			});
		}
	},
	mounted() {
		// 动态更新系统时间
		this.setSystemTime();
		this.getTodayWork();
		this.getCurConstructor();
		this.getTodayAuditedBug();
		this.getCurrentPerson();
		this.getWeathers();
		this.getXnGdfwYjByYwdw();
		//头部消息走马灯
		this.$parent.msgInterval(this.$refs.messageUl, this.$refs.messageUl2, 3000);
	}
};
</script>

<style scoped>
.header {
	line-height: 95px;
	background: url('../assets/images/head.png') no-repeat 0 0;
	position: absolute;
	font-size: 18px;
	color: #ffffff;
	z-index: 500;
}
.homeLink {
	width: 1080px;
	height: 95px;
	cursor: pointer;
}
.weatherPart {
	width: 175px;
	height: 100%;
	position: absolute;
	right: 0;
	top: 0;
}
.weatherIcon {
	width: 24px;
	margin-right: 8px;
	height: 100%;
	float: left;
	position: relative;
}
.weatherIcon img {
	width: 24px;
	height: 24px;
	position: absolute;
	left: 0;
	top: 50%;
	margin-top: -12px;
}
.weatherContent {
	float: left;
	height: 100%;
}
.timePart {
	width: 231px;
	height: 100%;
	position: absolute;
	right: 175px;
	top: 0;
	text-indent: 28px;
	background: url('../assets/images/ic_time.png') no-repeat left center;
}
.statusPart {
	height: 100%;
	position: absolute;
	right: 406px;
	top: 0;
	padding-right: 60px;
}
.statusLink {
	float: left;
	height: 100%;
	padding: 0 7px 0 39px;
	margin-right: 20px;
	color: #ffffff;
	font-size: 24px;
	cursor: pointer;
}
.statusLink:nth-of-type(1) {
	background: url('../assets/images/ic_yj.png') no-repeat left center;
}
.statusLink:nth-of-type(2) {
	background: url('../assets/images/ic_bd.png') no-repeat left center;
}
.statusLink:nth-of-type(3) {
	background: url('../assets/images/ic_wx.png') no-repeat left center;
}
.messagePart {
	width: 1312px;
	height: 60px;
	line-height: 60px;
	position: absolute;
	left: 1280px;
	top: 34px;
	font-size: 24px;
	color: #ffffff;
	background: url('../assets/images/ic_news.png') no-repeat left 142px center;
	overflow-y: hidden;
}
.messageUl {
	width: 100%;
	box-sizing: border-box;
	padding-left: 197px;
	position: absolute;
	left: 0;
	top: 0;
	transition: 0.5s;
}
.messageUl2 {
	top: 180px;
}
.messageLi {
	width: 100%;
	height: 100%;
}
.messageLi span {
	color: #fed35f;
}
</style>

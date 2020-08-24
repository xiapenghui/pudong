<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop"><div class="sectiontitle">行为监测</div></div>
			</div>
			<div class="sectionBody sectionBody7">
				<div class="sectionItem">
					<div class="picbox"></div>
					<div class="infobox">
						<div class="infotop">
							通道监拍(台)
							<span class="infonull">
								<b ref="tdjp" @click="tdjp('tdjpZc')">{{ monitoringDevice.tdjp.total }}</b>
								<b class="oncut" v-if="onCut">/</b>
								<i @click="tdjp('tdjpYc')">{{ monitoringDevice.tdjp.num1 }}</i>
							</span>
						</div>
						<!-- <div class="infotop">
							通道监拍(台)
							<span class="infonull">
								<b ref="tdjp" @click="tdjp('tdjpZc')">{{ monitoringDevice.tdjp.total }}</b>
								<b class="oncut" v-if="onCut"></b>
							</span>
						</div> -->
						<div class="infobottom">
							<div class="zaixian">在线率</div>
							<div class="zhexian"></div>
							<div class="scale">{{ monitoringDevice.tdjp.onlineRate }}%</div>
						</div>
					</div>
				</div>

				<div class="sectionItem">
					<div class="picbox"></div>
					<div class="infobox">
						<div class="infotop">
							视频监视(台)
							<span class="infonull">
								<b ref="spjs">{{ monitoringDevice.spjs.total }}</b>
							</span>
						</div>
						<div class="infobottom">
							<div class="zaixian">在线率</div>
							<div class="zhexian"></div>
							<div class="scale">{{ monitoringDevice.spjs.onlineRate }}%</div>
						</div>
					</div>
				</div>

				<div class="sectionItem">
					<div class="picbox"></div>
					<div class="infobox">
						<div class="infotop">
							环境监测(台)
							<span class="infonull">
								<b ref="hjjc" @click="onClickNum('hjjc')">{{ monitoringDevice.hjjc.total }}</b>
							</span>
						</div>
						<div class="infobottom">
							<div class="zaixian">在线率</div>
							<div class="zhexian"></div>
							<div class="scale">{{ monitoringDevice.hjjc.onlineRate }}%</div>
						</div>
					</div>
				</div>

				<div class="sectionItem">
					<div class="picbox"></div>
					<div class="infobox">
						<div class="infotop">
							安防监测(套)
							<span class="infonull">
								<b ref="afjc" @click="onClickNum('afjc')">{{ monitoringDevice.afjc.total }}</b>
							</span>
						</div>
						<div class="infobottom">
							<div class="zaixian">在线率</div>
							<div class="zhexian"></div>
							<div class="scale">{{ monitoringDevice.afjc.onlineRate }}%</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 行为监测弹窗 -->
			<detail-info
				:columns="tableColumns"
				:dataSource="tableData"
				:currentPage="currentPage"
				:hasIndex="true"
				:isShow="isShow"
				:total="total"
				:pageSize="pageSize"
				:handTitle="handTitle"
				:loading="loading"
				@showClose="onClose"
				@current-change="onCurrentChange"
			></detail-info>
		</div>
	</div>
</template>

<script>
import eventBus from './baidumap/base/EventBus';
import DetailInfo from './baidumap/detailed/DetailInfo'; //行为监测弹窗
import table from '../mixins/table'; //引入表格混入
import hjjcInfo from './baidumap/assets/mock/hjjcinfo'; //环境检测数据
import afjcInfo from './baidumap/assets/mock/afjcinfo'; //安防检测数据
import hjjcTable from './baidumap/tables/xwjcJs/hjjcTable'; // 环境监测表头Table
import afjcTable from './baidumap/tables/xwjcJs/afjcTable'; // 安防监测表头Table
import * as dataApi from '../api/apiData.js';
export default {
	mixins: [table],
	components: {
		DetailInfo
	},
	name: 'jpzzSection',
	props: {
		width: {
			type: Number,
			default: 560
		},
		height: {
			type: Number,
			default: 940
		},
		left: {
			type: Number,
			default: 3626
		},
		top: {
			type: Number,
			default: 126
		},
		show: {
			type: Boolean,
			default: true
		},
		time: {
			type: Number,
			default: 5
		}
	},
	data() {
		return {
			handTitle: '行为监测',
			loading: false, //加载中...
			tableData: [],
			tableColumns: [],
			list: [],
			staticObj: '',
			hjjcInfo: hjjcInfo,
			afjcInfo: afjcInfo,
			onCut: true, // 异常画面分割线
			// 监拍装置
			monitoringDevice: {
				tdjp: {
					total: 589,
					num1: 2,
					onlineRate: '100'
				},
				spjs: {
					total: 28,
					num1: 502,
					onlineRate: '100'
				},
				hjjc: {
					total: 56,
					num1: 502,
					onlineRate: '100'
				},
				afjc: {
					total: 626,
					num1: 502,
					onlineRate: '100'
				}
			},
			hjjcColumns:hjjcTable,// 环境监测表头
			afjcColumns:afjcTable,// 安防监测表头
		};
	},
	methods: {
		// numberGrow(ele, value) {
		// 	let _this = this
		// 	let step = parseInt((value * 15) / (_this.time * 50))
		// 	let current = 0
		// 	let start = 0
		// 	let t = setInterval(function() {
		// 		start += step
		// 		if (start > value) {
		// 			clearInterval(t)
		// 			start = value
		// 			t = null
		// 		}
		// 		if (current === start) {
		// 			return
		// 		}
		// 		current = start
		// 		ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
		// 	}, 10)
		// },

		// 通道监拍正常画面
		tdjp(obj) {
			if (obj == 'tdjpZc') {
				eventBus.emit('graphic-click-showPicInfo', 'aaa');
			} else {
				eventBus.emit('graphic-click-showNopicInfo', 'aaa');
			}
		},

		// 安防监测弹出框
		onClickNum(obj) {
			this.isShow = true;
			this.newObj = obj;
			this.isSearch = false;
			this.list = [];
			this.offset = 0;
			this.currentPage = 1;
			if (obj == 'hjjc') {
				this.handTitle = '环境监测';
				this.tableColumns = this.hjjcColumns;
				this.onall(this.hjjcInfo);
			} else if (obj == 'afjc') {
				this.handTitle = '安防监测';
				this.tableColumns = this.afjcColumns;
				this.onall(this.afjcInfo);
			}
		},
		// 行为检测,通道检拍数据
		getDeviceCountInfo() {
			dataApi.gettdjpNumber().then(result =>{
				this.monitoringDevice.tdjp.total = result.data.data.onLine;
				this.monitoringDevice.tdjp.num1 = result.data.data.offLine;
			})
		},

		// xx监测mock数据分页
		onall(obj) {
			//初始化显示默认条数和总条数
			console.log('onall', obj);
			console.log('this.offset', this.offset);
			console.log('this.currentPage', this.currentPage);
			this.total = obj.length;
			this.staticObj = obj;
			this.list = [];
			obj.map((dom, index) => {
				if (index >= this.offset && index < this.currentPage * this.pageSize) {
					this.list.push(dom);
				}
			});
			this.tableData = this.list;
		},

		onCurrentChange(page) {
			//分页切换时
			this.currentPage = page;
			this.offset = (page - 1) * this.pageSize;
			if (this.list.length > 0) {
				this.onall(this.staticObj);
			} else {
				this.onClickNum(this.newObj);
			}
		},
	},
	mounted() {
		this.getDeviceCountInfo();
		// this.numberGrow(this.$refs.tdjp, this.monitoringDevice.tdjp.total);
		// this.numberGrow(this.$refs.spjs, this.monitoringDevice.spjs.total);
		// this.numberGrow(this.$refs.hjjc, this.monitoringDevice.hjjc.total);
		// this.numberGrow(this.$refs.afjc, this.monitoringDevice.afjc.total);
	}
};
</script>

<style scoped>
.sectionBody7 {
	padding-left: 28px;
}

.sectionBody7 .sectionItem {
	width: 500px;
	height: 190px;
	margin-bottom: 20px;
	box-sizing: border-box;
	padding: 50px 0 28px 28px;
}

.sectionBody7 .sectionItem .picbox {
	float: left;
	width: 20%;
	height: 90px;
	/* background-image:url(../assets/images/ic_xljp.png) ; */
	background-size: contain;
	background-repeat: no-repeat;
}

.sectionBody7 .sectionItem .infobox {
	float: right;
	width: 78%;
	height: 90px;
}

.sectionBody7 .sectionItem .infobox .infotop {
	color: #ffffff;
	font-size: 22px;
}

.sectionBody7 .sectionItem .infobox .infotop .infonull {
	float: right;
	padding-right: 40px;
	color: #c66048;
	font-size: 20px;
}

.sectionBody7 .sectionItem .infobox .infotop .infonull b {
	color: #e945e6;
	font-size: 25px;
	cursor: pointer;
}

.sectionBody7 .sectionItem .infobox .infotop .infonull i {
	font-style: normal;
	cursor: pointer;
}

.sectionBody7 .sectionItem .infobox .infobottom {
	margin-top: 30px;
}

.sectionBody7 .sectionItem .infobox .infobottom div {
	display: inline-block;
	color: #2dbb77;
}

.sectionBody7 .sectionItem .infobox .infobottom .zaixian {
	width: 20%;
	padding-left: 10px;
	vertical-align: super;
	position: relative;
}

.sectionBody7 .sectionItem .infobox .infobottom .zaixian:after {
	width: 5px;
	height: 18px;
	content: '';
	background: #2dbb77;
	position: absolute;
	top: 2px;
	left: 0;
}

.sectionBody7 .sectionItem .infobox .infobottom .zhexian {
	width: 52%;
	height: 40px;
	background-image: url(../assets/images/ic_zxl.png);
	background-repeat: no-repeat;
	background-size: cover;
}

.sectionBody7 .sectionItem .infobox .infobottom .scale {
	width: 15%;
	margin-left: 20px;
	vertical-align: super;
	font-weight: 600;
}

.sectionBody7 .sectionItem:nth-of-type(1) .picbox {
	background-image: url(../assets/images/ic_xljp.png);
}

.sectionBody7 .sectionItem:nth-of-type(2) .picbox {
	background-image: url(./baidumap/assets/images/sbgzpic/ic_video.png);
}

.sectionBody7 .sectionItem:nth-of-type(3) .picbox {
	background-image: url(./baidumap/assets/images/sbgzpic/ic_hjjc.png);
}

.sectionBody7 .sectionItem:nth-of-type(4) .picbox {
	background-image: url(./baidumap/assets/images/sbgzpic/ic_afjc.png);
}

/* 弹窗定位 */
.sectionMain .workBox {
	top: initial !important;
	bottom: 30px !important;
	right: 30px !important;
	width: 1190px;
	height: 415px;
}
/deep/ .workBox .el-table th,
/deep/ .workBox .el-table td {
	padding: 19px 0;
}
</style>

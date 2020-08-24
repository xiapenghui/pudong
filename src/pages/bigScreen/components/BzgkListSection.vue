<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="same same1">
				<div class="sameLeft"></div>
				<div class="sameRight">
					<h3>保障对象</h3>
					<h4>
						<span @click="onClickNum('bzdx')">{{ bddxNumber }}</span>
					</h4>
				</div>
			</div>
			<div class="sameMerge">
				<div class="sameAs">
					<div class="title">特级</div>
					<div class="sameNumber" @click="onClickNum('tj')">{{ EspNumber }}</div>
				</div>
				<div class="sameAs">
					<div class="title">一级</div>
					<div class="sameNumber" @click="onClickNum('one')">{{ oneNumber }}</div>
				</div>
				<div class="sameAs">
					<div class="title">二级</div>
					<div class="sameNumber" @click="onClickNum('two')">{{ twoNumber }}</div>
				</div>
			</div>
			<div class="same same2">
				<div class="sameLeft"></div>
				<div class="sameRight">
					<h3>保障队伍</h3>
					<h4>
						<span @click="onClickNum('bzry')">{{ bzryNumber }}</span>
						<b style="margin: 0 5px;">-</b>
						<b class="bzryOnline" @click="onClickNum('bzzx')">{{ bzryOnline }}</b>
						<b style="margin: 0 5px;">-</b>
						<b class="noOnline" @click="onClickNum('wsg')">{{ noOnline }}</b>
					</h4>
				</div>
			</div>

			<div class="same same3">
				<div class="sameLeft"></div>
				<div class="sameRight">
					<h3>4G单兵</h3>
					<h4>
						<span @click="onClickNum('danbing')">{{ dbNumber }}</span>
					</h4>
				</div>
			</div>
			<div class="same same4">
				<div class="sameLeft"></div>
				<div class="sameRight">
					<h3>应急装备车辆</h3>
					<h4>
						<span @click="onClickNum('yjc')">{{ yjcNumber }}</span>
					</h4>
				</div>
			</div>

			<div class="same same5">
				<div class="sameLeft"></div>
				<div class="sameRight">
					<h3>通道监拍</h3>
					<h4>
						<span @click="onClickNum('tdjp')">{{ tdjpNumber }}</span>
					</h4>
				</div>
			</div>

			<div class="same same6">
				<div class="sameLeft"></div>
				<div class="sameRight">
					<h3>智能井盖</h3>
					<h4>
						<span @click="onClickNum('znjg')">{{ znjgNumber }}</span>
					</h4>
				</div>
			</div>

			<!-- 保障任务弹窗 -->
			<detail-info
				:columns="tableColumns"
				:dataSource="tableData"
				:currentPage="currentPage"
				:hasIndex="true"
				:isShow="isShow"
				:isSearch="isSearch"
				:total="total"
				:pageSize="pageSize"
				:handTitle="handTitle"
				:loading="loading"
				@showClose="onClose"
				@current-change="onCurrentChange"
				@onhand-click="onhandClick"
				@ondetail-click="onDetailClick"
				@on-input="onInput"
			></detail-info>

			<!-- 智能保电弹窗框 -->
			<carDetailed :isShow="carShow" class="znbdTc" @show-close="onCardClose" :detail="detail" />
		</div>
	</div>
</template>

<script>
import eventBus from './baidumap/base/EventBus';
import DetailInfo from './baidumap/detailed/DetailInfo'; //设备感知弹窗
import OnlineUrl from './baidumap/base/OnlineUrl'; //在线接口地址
import { wgs2bd } from './baidumap/utils/Convert'; //坐标转换
import allbzdx from './baidumap/assets/mock/allbzdx'; //保障对象json
import tjbzdx from './baidumap/assets/mock/tjbzdx'; //特级保障对象json
import onebzdx from './baidumap/assets/mock/onebzdx'; //一级保障对象json
import twobzdx from './baidumap/assets/mock/twobzdx'; //二级保障对象json
import fourWorker from './baidumap/assets/mock/fourWorker'; ////4G单兵json
import carinfo from './baidumap/assets/mock/carinfo'; //应急车json
import carDetailed from '../components/CarDetailed.vue'; // 应急车弹窗
import table from '../mixins/table'; //引入表格混入
import getCachedUser from './LeftProtectUserCache';
import bzdxTable from './baidumap/tables/bzgkJs/bzdxTable'; // 保障对象Table
import tjTable from './baidumap/tables/bzgkJs/tjTable'; // 特级Table
import oneTable from './baidumap/tables/bzgkJs/oneTable'; // 一级Table
import twoTable from './baidumap/tables/bzgkJs/twoTable'; // 二级Table
import bzryTable from './baidumap/tables/bzgkJs/bzryTable'; // 保障队伍Table
import bzzxTable from './baidumap/tables/bzgkJs/bzzxTable'; // 在线保障队伍Table
import wsgTable from './baidumap/tables/bzgkJs/wsgTable'; // 未上岗Table
import dbTable from './baidumap/tables/bzgkJs/dbTable'; // 4G单兵Table
import yjcTable from './baidumap/tables/bzgkJs/yjcTable'; // 应急车Table
import znjgTable from './baidumap/tables/bzgkJs/znjgTable'; // 智能井盖Table
import * as dataApi from '../api/apiData.js';

let cachedUsers = null;
export default {
	mixins: [table],
	components: {
		DetailInfo,
		carDetailed
	},
	name: 'xsqxSection',
	props: {
		width: {
			type: Number,
			default: 1010
		},
		height: {
			type: Number,
			default: 500
		},
		left: {
			type: Number,
			default: 74
		},
		top: {
			type: Number,
			default: 530
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			isSecond: false,
			perChangeArr: [], //上线下线人员数组总和
			carShow: false,
			detail: {},
			bddxNumber: 6,
			bzryNumber: 0,
			bzryOnline: 0,
			noOnline: 0,
			yjcNumber: 7,
			dbNumber: 0,
			znjgNumber: 13,
			tdjpNumber: 0,
			EspNumber: 0,
			oneNumber: 4,
			twoNumber: 2,
			handTitle: '设备感知',
			loading: false, //加载中...
			isdefult: true,
			isSearch: false,
			allData: [],
			tableData: [],
			tableColumns: [],
			carinfo: carinfo,
			list: [],
			// mock数据分页
			pageSize: 7,
			total: 0,
			staticObj: '',
			page: 1,
			offset: 0,
			allbzdx: allbzdx,
			tjbzdx: tjbzdx,
			onebzdx: onebzdx,
			twobzdx: twobzdx,
			// userTests: userTests,
			fourWorker: fourWorker,
			wghryList: [],
			sgdwLIist: [],
			dwTip: '',
			users: [],
			danbing: [],
			bzdxColumns: bzdxTable, // 保障对象
			tjColumns: tjTable, //特级
			oneColumns: oneTable, //一级
			twoColumns: twoTable, //二级
			bzryColumns: bzryTable, //保障队伍
			bzzxColumns: bzzxTable, //在线保障队伍
			wsgColumns: wsgTable, //未上岗
			dbColumns: dbTable, //4G单兵
			yjcColumns: yjcTable, //应急车
			znjgColumns: znjgTable // 智能井盖
		};
	},
	methods: {
		onClickNum(obj) {
			this.isShow = true;
			this.newObj = obj;
			this.isSearch = false;
			this.list = [];
			if (obj == 'bzdx') {
				this.dwTip = 'bzdx';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '保障对象'; //标题
				this.tableColumns = this.bzdxColumns;
				this.onall(this.allbzdx);
				console.log('this.allbzdx', this.allbzdx);
			} else if (obj == 'tj') {
				this.isShow = false;
				this.dwTip = 'bzdx';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '特级'; //标题
				this.tableColumns = this.tjColumns;
				this.onall(this.tjbzdx);
			} else if (obj == 'one') {
				this.dwTip = 'bzdx';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '一级'; //标题
				this.tableColumns = this.oneColumns;
				this.onall(this.onebzdx);
			} else if (obj == 'two') {
				this.dwTip = 'bzdx';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '二级'; //标题
				this.tableColumns = this.twoColumns;
				this.onall(this.twobzdx);
			} else if (obj == 'bzry') {
				this.dwTip = 'bzry';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '保障队伍'; //标题
				this.tableColumns = this.bzryColumns;
				this.onall(this.users);
			} else if (obj == 'bzzx') {
				this.dwTip = 'bzzx';
				this.offset = 0;
				this.currentPage = 1;
				this.tableColumns = this.bzzxColumns;
				this.handTitle = '报岗人员'; //标题
				this.loading = true; //加载中默认出现
				this.total = cachedUsers.onlineUserCount;
				this.tableData = cachedUsers.onlineUsers;
				this.onall(cachedUsers.onlineUsers);
				this.loading = false;
			} else if (obj == 'wsg') {
				this.dwTip = 'wsg';
				this.offset = 0;
				this.currentPage = 1;
				this.tableColumns = this.wsgColumns;
				this.handTitle = '未上岗'; //标题
				this.loading = true; //加载中默认出现
				this.total = cachedUsers.offlineUserCount;
				this.tableData = cachedUsers.offlineUsers;
				this.onall(cachedUsers.offlineUsers);
				this.loading = false;
			} else if (obj == 'danbing') {
				this.dwTip = 'zxdb';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '4G单兵'; //标题
				this.tableColumns = this.dbColumns;
				this.onall(this.danbing);
			} else if (obj == 'yjc') {
				this.dwTip = 'yjc';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '应急装备车辆'; //标题
				this.tableColumns = this.yjcColumns;
				this.onall(this.carinfo);
			} else if (obj == 'znjg') {
				this.dwTip = 'znjg';
				this.isSearch = true;
				this.handTitle = '智能井盖'; //标题
				this.tableColumns = this.znjgColumns;
				this.loading = true; //加载中默认出现

				let params={
					pmsIds:'FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286',
					offset:'0',
					limit:'1000'
				};
				let params1={
					pmsIds:'FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286',
					offset:this.offset,
					limit:this.pageSize
				};
				//搜索调用接口
				dataApi.getznjg(params).then(result =>{
					debugger
					let list = result.data.data.page.list;
						this.allData = list;
						for (let i = 0; i < list.length; i++) {
							this.allData[i].jgName = list[i].name;
							this.allData[i].online = list[i].channelName;
						}
				}),
				//详情调用接口
				dataApi.getznjg(params1).then(result =>{
					debugger
					let list = result.data.data.page.list;
					this.total = result.data.data.page.count;
					for (let i = 0; i < list.length; i++) {
						this.tableData = list;
						this.tableData[i].jgName = list[i].name;
						this.tableData[i].online = list[i].channelName;
						this.loading = false; //加载中结束隐藏
					}
				})
               
			} else if (obj == 'tdjp') {
				this.isShow = false;
				eventBus.emit('ZnbzPicInfo-click-showPicInfo', 'aaa');
			}
		},
		onInput(val) {
			this.currentPage = 1;
			this.offset = 0;
			let objData = [];
			this.allData.map(item => {
				if (item.name.indexOf(val) != -1 || item.channelName.indexOf(val) != -1) {
					objData.push(item);
				}
			});
			this.onall(objData);
		},
		onCardClose() {
			this.carShow = false;
		},

		// 坐标定位
		onhandClick(row) {
			//智能井盖
			let point = wgs2bd(row.lon, row.lat); //世界大地坐标转为百度坐标
			if (this.dwTip == 'znjg') {
				let layer = {
					id: row.id, //primaryId, //定位对象id
					layerName: 'IntelligentCoverYSLayer', //定位图层
					zoom: 18, //定位图层
					point: {
						lng: point[0],
						lat: point[1]
					}
				};
				eventBus.emit('layer-flyClickTips', {
					layer
				}); //隐患缺陷图层定位
			} else if (this.dwTip == 'bzzx') {
				//保障在线人员
				let layer = {
					id: row.id, //定位对象id
					layerName: 'ConstructionSiteLayer', //定位图层
					zoom: 18, //定位图层
					point: {
						lng: 0,
						lat: 0
					}
				};
				eventBus.emit('layer-flyClickTips', {
					layer
				}); //隐患缺陷图层定位
			} else if (this.dwTip == 'bzdx') {
				if (row.bzdx == '东郊宾馆') {
					//保障对象
					let layer = {
						id: row.ID, //primaryId, //定位对象id
						layerName: 'ProtectionObjectBdLayer', //定位图层
						zoom: 18, //定位图层
						point: {
							lng: 0,
							lat: 0
						}
					};
					eventBus.emit('layer-flyClickTips', {
						layer
					}); //隐患缺陷图层定位
				} else {
					//保障对象
					let layer = {
						id: row.ID, //primaryId, //定位对象id
						layerName: 'ProtectionObjectLayer', //定位图层
						zoom: 18, //定位图层
						point: {
							lng: 0,
							lat: 0
						}
					};
					eventBus.emit('layer-flyClickTips', {
						layer
					}); //隐患缺陷图层定位
				}
			} else if (this.dwTip == 'yjc') {
				//应急车
				let layer = {
					id: row.userName, //定位对象id
					layerName: 'ConstructionSiteLayer', //定位图层
					zoom: 18, //定位图层
					point: {
						lng: 0,
						lat: 0
					}
				};
				eventBus.emit('layer-flyClickTips', {
					layer
				}); //隐患缺陷图层定位
			} else if (this.dwTip == 'zxdb') {
				let url = '/common-assets/plugins/singlePawn/singlePawn.html?deviceNo=' + row.dbzh;
				eventBus.emit('showVue-SinglePawn', url);
			}
		},
		//应急车详情
		onDetailClick(row) {
			if (this.dwTip == 'yjc') {
				//应急车弹窗
				this.carShow = true;
				this.detail = row;
			} else if (this.dwTip == 'zxdb') {
				let url = '/common-assets/plugins/singlePawn/singlePawn.html?deviceNo=' + row.dbzh;
				eventBus.emit('showVue-SinglePawn', url);
			}
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
			obj.map(
				function(dom, index) {
					if (index >= this.offset && index < this.currentPage * this.pageSize) {
						this.list.push(dom);
					}
				}.bind(this)
			);
			this.tableData = this.list;
		},

		onCurrentChange(page) {
			//分页切换时
			this.currentPage = page;
			this.offset = (page - 1) * this.pageSize;
			console.log('this.list', this.list);
			if (this.list.length > 0) {
				this.onall(this.staticObj);
			} else {
				console.log('this.newObj', this.newObj);
				this.onClickNum(this.newObj);
			}
		},

		noticeOnline(noticeOnlineUsers) {
			noticeOnlineUsers.map(
				function(item, index) {
					setTimeout(
						function() {
							this.$message({
								message: '来自' + item.ryly + '的,' + item.full_name + '报岗啦!',
								type: 'success'
							});
						}.bind(this),
						index * 3500
					);
				}.bind(this)
			);
		},

		noticeOffline(noticeOfflineUsers) {
			noticeOfflineUsers.map(
				function(item, index) {
					setTimeout(
						function() {
							this.$message({
								message: '来自' + item.ryly + '的,' + item.full_name + '离岗啦！',
								type: 'warning'
							});
						}.bind(this),
						index * 3500
					);
				}.bind(this)
			);
		},

		onUserRefreshHandler(event) {
			var data = event;
			cachedUsers = data;
			this.bzryOnline = data.onlineUserCount;
			this.bzryNumber = data.count;
			this.noOnline = data.offlineUserCount;
			this.users = data.users;
			this.noticeOnline(data.noticeOnlineUsers);
		},

		//单兵
		zxbdList(list) {
			this.dbNumber = list.length;
			this.danbing = list;
		},
		// 通道监拍异常设备
		tdjpWarring() {
			let params = {
				linePMSID:
					'FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286,FF000000-0000-0050-0000-000000001300-18649'
			};
			dataApi.gettdjpOnline(params).then(result => {
				this.tdjpNumber = result.data.data.onLine;
			});
		},
		// 获取智能井盖接口
		znjgSection() {
			let params = {
				pmsIds:
					'FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286',
				offset: '0',
				limit: '-1'
			};
			dataApi.getznjg(params).then(result => {
				this.znjgNumber = result.data.data.page.count;
			});
		}
	},
	watch: {},
	mounted() {
		let result = getCachedUser();
		this.onUserRefreshHandler(result);
		eventBus.on(
			'app.bzgk.user.refresh',
			function(event) {
				this.onUserRefreshHandler(event);
			}.bind(this)
		);
		// 通道监拍异常设备
		this.tdjpWarring();
		// 获取智能井盖接口
		this.znjgSection();
		//4G单兵
		this.dbNumber = 0;
		eventBus.on('set.bd.zxdbList', this.zxbdList); //在线设备
	}
};
</script>

<style scoped>
.sectionMain {
	width: 95%;
	height: 95%;
	padding: 15px;
	background-color: rgba(20, 36, 61, 0.7);
}

.sectionMain .same {
	width: 31%;
	height: 125px;
	margin: 10px;
	float: left;
	background-image: url(../components/baidumap/assets/images/bdstatus/znbdBox.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: center;
	cursor: pointer;
}

.sectionMain .sameMerge {
	width: 64%;
	height: 125px;
	margin: 10px;
	float: left;
	background-color: rgba(23, 42, 75, 0.7);
}

.sectionMain .sameMerge .sameAs {
	width: 31.5%;
	margin: 0 5px;
	float: left;
	text-align: center;
}

.sectionMain .sameMerge .sameAs .title {
	height: 45px;
	line-height: 45px;
	margin-bottom: 20px;
	background-color: rgba(30, 91, 145, 0.7);
	color: #ffffff;
	font-size: 20px;
}

.sectionMain .sameMerge .sameAs .sameNumber {
	color: #4cf0f1;
	font-size: 27px;
}

.sectionMain .same .sameLeft {
	width: 35%;
	height: 100%;
	float: left;
	background-repeat: no-repeat;
	background-size: 70%;
	background-position: right;
}

.sectionMain .same .sameRight {
	width: 60%;
	height: 100%;
	float: right;
	padding: 20px 0 20px 10px;
	line-height: 40px;
}

.sectionMain .same .sameRight h3 {
	color: #c8d9f7;
	font-weight: normal;
}

/* .sectionMain .same .sameRight h4 {
	color: #4cf0f1;
	font-size: 27px;
} */
.sectionMain .same .sameRight h4 span {
	color: #4cf0f1;
	font-size: 27px;
}

.sectionMain .same .sameRight h4 b {
	color: orange;
	font-size: 30px;
}

.sectionMain .same .sameRight h4 b.noOnline {
	color: red;
	font-size: 30px;
}

.sectionMain .same1 .sameLeft {
	background-image: url(../components/baidumap/assets/images/bdstatus/bddx.png);
}

.sectionMain .same2 .sameLeft {
	background-image: url(../components/baidumap/assets/images/bdstatus/bzry.png);
}

.sectionMain .same3 .sameLeft {
	background-image: url(../components/baidumap/assets/images/bdstatus/BD_4g.png);
}

.sectionMain .same4 .sameLeft {
	background-image: url(../components/baidumap/assets/images/bdstatus/yjc2.png);
}

.sectionMain .same5 .sameLeft {
	background-image: url(../components/baidumap/assets/images/bdstatus/znjg2.png);
}

.sectionMain .same6 .sameLeft {
	background-image: url(../components/baidumap/assets/images/bdstatus/tdjp2.png);
}

.sectionMain .workBox {
	top: -10px !important;
	height: 475px !important;
	right: -10px !important;
}
</style>

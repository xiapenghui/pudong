<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop"><div class="sectiontitle">保障对象</div></div>
			</div>
			<div class="sectionBody sectionBody8">
				<div class="securityTaskBox">
					<div class="securityTaskLeft">
						<div class="securityTaskTitle">
							<span class="securityTaskColor">{{ bzrwTitle }}</span>
							<!-- <img src="./baidumap/assets/images/bdstatus/icon2.png" /> -->
						</div>
					</div>
					<!-- <div class="securityTaskRight">
						<div class="securityTaskTitle">
							保障时间：
							<span class="securityTaskColor">{{ bzshTime }}</span>
						</div>
					</div> -->
				</div>

				<div class="securityTaskList">
					<div class="securityTaskItem">
						<div class="securityTaskItems">
							<img src="./baidumap/assets/images/bdstatus/bzzw.png" />
							<div class="securityListRight">
								<p>保障设备</p>
								<b @click="onClickNum('bzsb')">{{ bzseNumber }}</b>
							</div>
						</div>
					</div>
					<div class="securityTaskItem">
						<div class="securityTaskItems">
							<img src="./baidumap/assets/images/bdstatus/bzry2.png" />
							<div class="securityListRight">
								<p>保障队伍</p>
								<b @click="onClickNum('bzry')">{{ bzryNumber }}</b>
								<b style="margin: 0 5px;">-</b>
								<b class="bzryOnline" @click="onClickNum('bzzx')">{{ bzryOnline }}</b>
								<b style="margin: 0 5px;">-</b>
								<b class="noOnline" @click="onClickNum('wsg')">{{ noOnline }}</b>
							</div>
						</div>
					</div>
					<div class="securityTaskItem">
						<div class="securityTaskItems">
							<img src="./baidumap/assets/images/bdstatus/yjc.png" />
							<div class="securityListRight">
								<p>应急装备车辆</p>
								<b class="cartNum" @click="onClickNum('yjc')">{{ yjcNumber }}</b>
							</div>
						</div>
					</div>
				</div>

				<div class="securityTable">
					<!-- <detail-info
						:columns="tableColumns"
						:dataSource="tableData"
						:currentPage="currentPage"
						:handTitle="handTitle"
						:loading="loading"
						:total="total"
						:pageSize="pageSize"
						@current-change="onCurrentChange"
						@onhand-click="onhandClick"
					></detail-info> -->
					<el-table
						class="my-class"
						:data="tableDataOne"
						:highlight-current-row="true"
						:row-style="rowStyle"
						:header-cell-style="tableHeaderColor"
						:span-method="objectSpanMethod"
						height="360"
						border
						style="width: 100%"
					>
						<el-table-column prop="zdsb" label="站点/线路/用户设备点" align="center"></el-table-column>
						<el-table-column prop="full_name" label="人员名单" align="center"></el-table-column>
						<el-table-column prop="zyfl" label="专业分类" align="center"></el-table-column>
						<el-table-column prop="lxfs" label="联系方式" align="center"></el-table-column>
						<el-table-column prop="zshxsbz" label="值守或巡视标准" align="center"></el-table-column>
						<el-table-column prop="clmc" label="车辆名称" align="center"></el-table-column>
						<el-table-column prop="sjxx" label="司机信息" align="center"></el-table-column>
					</el-table>
				</div>

				<div class="securityTaskFooter">
					<div class="securityFooterItem">
						<div class="securityFooterItems">
							<img src="./baidumap/assets/images/bdstatus/tdjp.png" />
							<p>
								通道监拍
								<span @click="onClickNum('tdjp')">{{ tdjpNumber }}</span>
							</p>
						</div>
						<img src="./baidumap/assets/images/bdstatus/icon1.png" class="securityIcon" />
					</div>
					<div class="securityFooterItem">
						<div class="securityFooterItems">
							<img src="./baidumap/assets/images/bdstatus/znjg.png" />
							<p>
								智能井盖
								<span @click="onClickNum('znjg')">{{ znjgNumber }}</span>
							</p>
						</div>
						<img src="./baidumap/assets/images/bdstatus/icon1.png" class="securityIcon" />
					</div>
				</div>
				<!-- 弹窗框 -->
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
	</div>
</template>

<script>
import OnlineUrl from './baidumap/base/OnlineUrl'; //在线接口地址
import { wgs2bd } from './baidumap/utils/Convert'; //坐标转换
import eventBus from './baidumap/base/EventBus';
// import DetailInfo from "./baidumap/detailed/tableInfo"; //表格
import DetailInfo from './baidumap/detailed/DetailInfo'; //设备感知弹窗
import bzsbTest from './baidumap/assets/mock/bzsbTest'; //引入保障设备测试json
import carinfo from './baidumap/assets/mock/carinfo'; //应急车json
import carDetailed from '../components/CarDetailed.vue'; // 应急车弹窗
import table from '../mixins/table'; //引入表格混入
import getCachedUser from './ProtectUserCache';
import tableDataOne from './baidumap/tables/bzdxJs/tableDataOne'; // 东郊宾馆信息Table
import bzsbTable from './baidumap/tables/bzdxJs/bzsbTable'; // 保障设备数据Table
import bzryTable from './baidumap/tables/bzdxJs/bzryTable'; // 保障人员Table
import bzzxTable from './baidumap/tables/bzdxJs/bzzxTable'; // 在线保障人员Table
import wsgTable from './baidumap/tables/bzdxJs/wsgTable'; // 未上岗Table
import yjcTable from './baidumap/tables/bzdxJs/yjcTable'; // 应急车Table
import znjgTable from './baidumap/tables/bzdxJs/znjgTable'; // 智能井盖Table
let cachedUsers = null; //makeUserStateArray(copyUserArray(userArray) , []);
import * as dataApi from '../api/apiData.js';
// let cachedUserTimer = null;
export default {
	mixins: [table],
	components: {
		DetailInfo,
		carDetailed
	},
	name: 'BzrwSection',
	props: {
		width: {
			type: Number,
			default: 1242
		},
		height: {
			type: Number,
			default: 940
		},
		left: {
			type: Number,
			default: 2924
		},
		top: {
			type: Number,
			default: 114
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			perChangeArr: [], //上线下线人员数组总和
			bzrwTitle: '东郊宾馆',
			// bzshTime: '11月3日 8:00-11月11日 18:00',
			bzseNumber: '8',
			bzryNumber: 0,
			yjcNumber: '7',
			znjgNumber: '25',
			tdjpNumber: '125',
			bzryOnline: 0,
			noOnline: 0,
			handTitle: '标题',
			loading: false, //加载中...
			isdefult: true,
			isSearch: false,
			allData: [],
			tableData: [],
			tableColumns: [],
			list: [],
			carShow: false,
			// mock数据分页
			pageSize: 9,
			total: 0,
			staticObj: '',
			page: 1,
			offset: 0,
			bzsbTest: bzsbTest,
			carinfo: carinfo,
			detail: {},
			dwTip: '',
			users: [],
			tableDataOne: tableDataOne,
			bzsbColumns: bzsbTable, // 保障设备数据
			bzryColumns: bzryTable, //保障人员
			bzzxColumns: bzzxTable, //在线保障人员
			wsgColumns: wsgTable, // 未上岗
			yjcColumns: yjcTable, //应急车
			znjgColumns: znjgTable // 智能井盖
		};
	},
	methods: {
		onCardClose() {
			this.carShow = false;
		},
		// 修改表格样式
		rowStyle({ row, rowIndex }) {
			if (rowIndex % 2 == 1) {
				return 'color:white;background-color:rgba(24,41,69,.3)';
			} else {
				return 'color:white;background-color:rgba(24,41,69,.3)';
			}
		},
		//修改table header的背景色
		tableHeaderColor({ row, column, rowIndex, columnIndex }) {
			if (rowIndex === 0) {
				return 'background-color: #102a4f;color: #a1cbf1;font-size: 14px;';
			}
		},
		// 修改table合并单元格

		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			// if (columnIndex === 1) {
			// 	if (rowIndex % 2 === 0) {
			// 		return {
			// 			rowspan: 5,
			// 			colspan: 1
			// 		};
			// 	} else {
			// 		return {
			// 			rowspan: 0,
			// 			colspan: 0
			// 		};
			// 	}
			// }
		},

		onClickNum(obj) {
			this.isShow = true;
			this.newObj = obj;
			this.isSearch = false;
			this.list = [];
			if (obj == 'bzsb') {
				this.dwTip = 'bzsb';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '保障设备'; //标题
				this.tableColumns = this.bzsbColumns;
				this.onall(this.bzsbTest);
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

				let params = {
					pmsIds:
						'FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286',
					offset: '0',
					limit: '-1'
				};
				let params2 = {
					pmsIds:
						'FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286',
					offset: this.offset,
					limit: this.pageSize
				};
				//搜索接口调用
				dataApi.getznjg(params).then(result => {
					let list = result.data.data.page.list;
					this.allData = list;
					for (let i = 0; i < list.length; i++) {
						this.allData[i].jgName = list[i].name;
						this.allData[i].online = list[i].channelName;
					}
				});
				//详情调用接口
				dataApi.getznjg(params2).then(result => {
					let list = result.data.data.page.list;
					this.total = result.data.data.page.count;
					for (let i = 0; i < list.length; i++) {
						this.tableData = list;
						// this.tableData[i].gjID = list[i].id;
						this.tableData[i].jgName = list[i].name;
						this.tableData[i].online = list[i].channelName;
						this.loading = false; //加载中结束隐藏
					}
				});
			} else if (obj == 'tdjp') {
				this.isShow = false;
				eventBus.emit('BzdxInfo-click-showPicInfo', 'aaa');
			}
		},
		onInput(val) {
			console.log('val', val);
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
		// 坐标定位
		onhandClick(row) {
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
			} else if (this.dwTip == 'bzsb') {
				let layer = {
					id: '1', //primaryId, //定位对象id
					layerName: 'FlyPointBdLayer', //定位图层
					zoom: 16, //定位图层
					point: {
						lng: row.X,
						lat: row.Y
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
			} else if (this.dwTip == 'bzry') {
				// debugger
				console.log('row', row);
				//保障人员
				let layer = {
					id: row.personName, //定位对象id
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
			}
		},
		//应急车详情
		onDetailClick(row) {
			if (this.dwTip == 'yjc') {
				//应急车弹窗
				this.carShow = true;
				this.detail = row;
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
								type: 'success',
								customClass: 'rightMessageMask'
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

		// refreshUserCache(){
		//     Promise.all([
		// 		this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/wgyw/getOnlinePeopleLocations?limit=-1', '获取当前人员统计信息'),
		// 		this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=wkresponser&status=-1&limit=-1&offset=0', '施工队伍明细-工作负责人'),
		// 		this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=wkapprover&status=-1&limit=-1&offset=0', '施工队伍明细-工作许可人'),
		// 		this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=manage&status=-1&limit=-1&offset=0', '施工队伍明细-管理人'),
		// 		this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=supervisor&status=-1&limit=-1&offset=0', '施工队伍明细-查岗人员')
		// 	]).then(function(responses) {
		//                 let result = makeUserStateArray(cachedUsers.users, responses);
		//                 cachedUsers = result;
		//                 eventBus.emit("app.bzrw.user.refresh" , result);
		// 			}.bind(this)
		// 		).catch(function(error) {
		// 			console.error(error);
		// 		}.bind(this));
		// },

		onUserRefreshHandler(event) {
			var data = event;
			cachedUsers = data;

			this.bzryOnline = data.onlineUserCount;
			this.bzryNumber = data.count;
			this.noOnline = data.offlineUserCount;
			this.users = data.users;

			this.noticeOnline(data.noticeOnlineUsers);
		},
		loadLineVideoData() {
			let params = {
				linePMSID:
					'FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286'
			};
			dataApi.gettdjpOnline(params).then(result => {
				this.lineVideoResponse = result;
				this.tdjpNumber = result.data.data.onLine;
			});
		},

		loadCoverData() {
			let params = {
				pmsIds:
					'FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286',
				offset: '0',
				limit: '-1'
			};
			dataApi.getznjg(params).then(result => {
				this.coverResponse = result;
				this.znjgNumber = result.data.data.page.count;
			});
		},
		perTimeWatch() {
			// let result = getCachedUser();
			// this.onUserRefreshHandler(result);
			// eventBus.on(
			// 	'app.bzrw.user.refresh',
			// 	function(event) {
			// 		this.onUserRefreshHandler(event);
			// 	}.bind(this)
			// );
			// this.refreshUserCache();
			// cachedUserTimer = setInterval(
			// 	function() {
			// 		this.refreshUserCache();
			// 	}.bind(this),
			// 	1000 * 60 * 1
			// );
		}
	},
	watch: {},
	mounted() {
		let result = getCachedUser();
		this.onUserRefreshHandler(result);

		eventBus.on(
			'app.bzrw.user.refresh',
			function(event) {
				this.onUserRefreshHandler(event);
			}.bind(this)
		);

		// this.refreshUserCache();
		// cachedUserTimer = setInterval(function(){
		//     this.refreshUserCache();
		// }.bind(this) , 1000 * 60 * 1);

		//通道监拍异常设备
		this.loadLineVideoData();
		// 获取智能井盖接口
		this.loadCoverData();
	}
};
</script>

<style scoped>
.sectionBody8 {
	padding-right: 40px;
}
.securityTaskBox {
	overflow: hidden;
	margin-bottom: 30px;
}
.securityTaskLeft,
.securityTaskRight {
	float: left;
	font-size: 20px;
	color: #d8e4fe;
}
.securityTaskLeft {
	width: 45%;
}
.securityTaskRight {
	width: 55%;
}
.securityTaskTitle {
	height: 50px;
	line-height: 50px;
	font-size: 25px;
}
.securityTaskColor {
	font-weight: bold;
	color: #53ecec;
}
.securityTaskTitle img {
	width: 40px;
	height: 40px;
	vertical-align: middle;
	margin-left: 20px;
}

.securityTaskList {
	overflow: hidden;
	margin-right: -30px;
	margin-bottom: 30px;
}
.securityTaskItem {
	float: left;
	width: calc(100% / 3 - 30px);
	height: 150px;
	line-height: 150px;
	margin-right: 30px;
	text-align: center;
	background-image: url(../components/baidumap/assets/images/bdstatus/znbdBox.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: center;
	cursor: pointer;
}
.securityTaskItems {
	display: inline-block;
	width: 280px;
	height: 82px;
	line-height: 82px;
	text-align: left;
	vertical-align: middle;
}
.securityTaskItems img,
.securityListRight,
.securityFooterItems img,
.securityFooterItems p {
	float: left;
}
.securityTaskItems img {
	margin-right: 20px;
}
.securityListRight {
	display: contents;
	line-height: 1;
	font-size: 20px;
	color: #d8e4fe;
}

.securityListRight b {
	margin-top: auto;
	color: #46efef;
	font-size: 27px;
}
.securityListRight .bzryOnline {
	color: orange;
	font-size: 30px;
}
.securityListRight .noOnline {
	color: red;
	font-size: 30px;
}
.securityTable {
	width: 100%;
	height: 42%;
	margin-bottom: 30px;
	background-color: rgba(17, 31, 58, 0.7);
}

.securityTaskFooter {
	overflow: hidden;
	margin-right: -40px;
}
.securityFooterItem {
	position: relative;
	float: left;
	width: calc(50% - 40px);
	height: 150px;
	line-height: 150px;
	margin-right: 40px;
	text-align: center;
	background-image: url(../components/baidumap/assets/images/bdstatus/bdBigBox.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-position: center;
	cursor: pointer;
}
.securityFooterItems {
	display: inline-block;
	width: 380px;
	height: 82px;
	line-height: 82px;
	font-size: 22px;
	color: #d8e4fe;
	text-align: left;
	vertical-align: middle;
}
.securityFooterItems img {
	margin-right: 20px;
}
.securityFooterItems span {
	margin-left: 20px;
	font-weight: bold;
	color: #46efef;
	font-size: 27px;
}
.securityIcon {
	position: absolute;
	top: 35px;
	right: 70px;
}

/* 明细弹出框 */
.sectionBody8 {
	position: relative;
}

.sectionBody8 .workBox {
	position: absolute;
	top: 10px;
	left: 40px;
	width: 1160px;
	height: 650px;
}
.sectionBody8 .workBoxs {
	position: absolute;
	left: -1500px !important;
	bottom: 50px !important;
}

/deep/ .el-table {
	overflow: hidden;
	background-color: transparent !important;
}
/deep/ .el-table .cell {
	line-height: 30px !important;
	font-size: 22px;
}
.my-class,
.my-class /deep/ th,
.my-class /deep/ td,
.my-class /deep/ th.is-leaf {
	border: none;
}
.my-class /deep/ .el-table__body tr:hover > td {
	background-color: #122140 !important;
}

.my-class /deep/ .el-table__body tr.current-row > td {
	background-color: transparent !important;
}
.el-table--group::after,
.el-table--border::after,
.el-table::before {
	display: none;
}
</style>

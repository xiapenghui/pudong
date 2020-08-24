<template>
	<div :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop"><div class="sectiontitle">设备感知</div></div>
			</div>
			<div class="sectionBody sectionBody1">
				<div class="sectionItem">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_fkjc.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								辅控监测(套)
								<span class="inforight">
									<strong @click="onClickNum('fkjc')">{{ deviceDetails.fkjc.total }}</strong>
								</span>
							</div>
							<div class="bottomtext">
								电站(个)
								<span class="inforight">{{ deviceDetails.fkjc.num1 }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{deviceDetails.fkjc.onlineRate}}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem" :class="{ defult: isdefult }">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_jqr.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								机器人(套)
								<span class="inforight">
									<strong @click="onClickNum('jqr')">{{ deviceDetails.jqr.total }}</strong>
								</span>
							</div>
							<div class="bottomtext">
								电站(个)
								<span class="inforight">{{ deviceDetails.jqr.num1 }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.jqr.onlineRate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_xfsb.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								消防设备(套)
								<span class="inforight">
									<strong>{{ deviceDetails.xfsb.equipmentCount }}</strong>
								</span>
							</div>
							<div class="bottomtext">
								电站(个)
								<span class="inforight">{{ deviceDetails.xfsb.onlineCount }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.xfsb.onlineRate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem" :class="{ rounds: round }">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_spjk.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								视频监控(套)
								<span class="inforight">
									<strong @click="onClickNum('spjk')">{{ deviceDetails.spjk.total }}</strong>
								</span>
							</div>
							<div class="bottomtext">
								电站(个)
								<span class="inforight">{{ deviceDetails.spjk.onlineNum }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.spjk.onlineRate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem" :class="{ rounds: round }">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_xldx.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								线缆断线(套)
								<span class="inforight">
									<strong @click="onClickNum('xldx')">{{ deviceDetails.xldx.deviceNum }}</strong>
								</span>
							</div>
							<div class="bottomtext">
								架空线(条)
								<span class="inforight">{{ deviceDetails.xldx.onlineNum }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.xldx.onlineRate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem" :class="{ rounds: round }">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_gxzd.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								光纤振动(套)
								<span class="inforight">
									<strong @click="onClickNum('gxzd')">{{ deviceDetails.gqzd.Device_num }}/</strong>
									<b @click="onClickNum('ycgx')">{{ ycgxNumber }}</b>
								</span>
							</div>
							<div class="bottomtext">
								电缆(条)
								<span class="inforight">{{ deviceDetails.gqzd.Online_num }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.gqzd.Online_rate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem" :class="{ rounds: round }">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_znjg.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								智能井盖(个)
								<span class="inforight">
									<strong @click="onClickNum('znjg')">{{ deviceDetails.znjg.manholeCover }}/</strong>
									<b @click="onClickNum('ycjg')">{{ ycjgNumber }}</b>
								</span>
							</div>
							<div class="bottomtext">
								工井(个)
								<span class="inforight">{{ deviceDetails.znjg.deviceTotal }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.znjg.onlineRate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>
				<div class="sectionItem">
					<div class="sbgzbox">
						<div class="picbox"><img src="./baidumap/assets/images/sbgzpic/ic_hplc.png" alt="" /></div>
						<div class="infobox">
							<div class="toptext">
								HPLC
								<span class="inforight">
									<strong @click="onClickNum('hplc')">{{ deviceDetails.hplc.total }}</strong>
								</span>
							</div>
							<div class="bottomtext">
								用户(户)
								<span class="inforight">{{ deviceDetails.hplc.num1 }}</span>
							</div>
						</div>
					</div>
					<div class="deviceOn">
						<div class="deviceOnText">在线率</div>
						<div class="deviceOnLine"></div>
						<!-- <div class="deviceOnNum">{{ deviceDetails.hplc.onlineRate }}%</div> -->
						<div class="deviceOnNum">100%</div>
					</div>
				</div>

				<!-- 设备感知弹窗 -->
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
					@on-input="onInput"
				></detail-info>
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from './baidumap/base/EventBus';
import DetailInfo from './baidumap/detailed/DetailInfo'; //设备感知弹窗
import OnlineUrl from './baidumap/base/OnlineUrl'; //在线接口地址
import { wgs2bd } from './baidumap/utils/Convert'; //坐标转换
import table from '../mixins/table'; //引入表格混入
import jqrInfo from './baidumap/assets/mock/jqrinfo'; //引入机器人数据
import fkjcInfo from './baidumap/assets/mock/fkjcinfo'; //引入辅控数据
import fkjcTable from './baidumap/tables/sbgzJs/fkjcTable'; //引入辅控table
import jqrTable from './baidumap/tables/sbgzJs/jqrTable'; //引入机器人table
import xldxTable from './baidumap/tables/sbgzJs/xldxTable'; //线缆断线table
import gxzdTable from './baidumap/tables/sbgzJs/gxzdTable'; //光纤震动table
import ycgxTable from './baidumap/tables/sbgzJs/ycgxTable'; //异常光纤振动table
import znjgTable from './baidumap/tables/sbgzJs/znjgTable'; // 智能井盖table
import ycjgTable from './baidumap/tables/sbgzJs/ycjgTable'; //异常井盖table
import * as dataApi from '../api/apiData.js';

export default {
	mixins: [table],
	components: {
		DetailInfo
	},
	name: 'sgbcSection',
	data() {
		return {
			handTitle: '设备感知',
			loading: false, //加载中...
			isdefult: true,
			round: true,
			isSearch: false,
			allData: [],
			tableData: [],
			tableColumns: [],
			list: [],
			// mock数据分页
			pageSize: 5,
			total: 0,
			staticObj: '',
			jqrInfo: jqrInfo,
			fkjcInfo: fkjcInfo,
			page: 1,
			offset: 0,
			ycjgNumber: 0,
			ycgxNumber: 0,
			dwTip: '',
			// 设备监测部分
			deviceDetails: {
				fkjc: {
					total: 105,
					num1: 105,
					onlineRate: '100'
				},
				jqr: {
					total: 8,
					num1: 8,
					onlineRate: '100'
				},
				xfsb: {
					equipmentCount: 38,
					onlineCount: 38,
					onlineRate: '100'
				},
				spjk: {
					total: 129,
					onlineNum: 30,
					onlineRate: '100'
				},
				xldx: {
					deviceNum: 58,
					onlineNum: 5,
					onlineRate: '100'
				},
				gqzd: {
					Device_num: 2,
					Online_num: 2,
					Online_rate: '100'
				},
				znjg: {
					manholeCover: 158,
					deviceTotal: 158,
					onlineRate: '100'
				},
				hplc: {
					total: 2400,
					num1: 2400,
					onlineRate: '100'
				}
			},
			//辅控监测
			fkjcColumns: fkjcTable,
			//机器人
			jqrColumns: jqrTable,
			//线缆断线
			xldxColumns: xldxTable,
			//光纤振动
			gxzdColumns: gxzdTable,
			//异常光纤振动
			ycgxColumns: ycgxTable,
			// 智能井盖
			znjgColumns: znjgTable,
			//异常井盖
			ycjgColumns: ycjgTable
		};
	},
	props: {
		width: {
			type: Number,
			default: 1010
		},
		height: {
			type: Number,
			default: 478
		},
		left: {
			type: Number,
			default: 74
		},
		top: {
			type: Number,
			default: 126
		},
		show: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		onClickNum(obj) {
			this.isShow = true;
			this.newObj = obj;
			this.isSearch = false;
			this.list = [];
			if (obj == 'fkjc') {
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '辅控监测'; //标题
				this.tableColumns = this.fkjcColumns;
				this.onall(this.fkjcInfo);
			} else if (obj == 'jqr') {
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '机器人'; //标题
				this.tableColumns = this.jqrColumns;
				this.onall(this.jqrInfo);
			} else if (obj == 'xfsp') {
				this.handTitle = '消防设备'; //标题
				this.isShow = false;
			} else if (obj == 'spjk') {
				this.handTitle = '视频监控'; //标题
				this.isShow = false;
				// eventBus.emit("showVideo-PowerStationVideo", true);
				let active = $('.liveVideo').css('display');
				console.log('none', active);
				if (active == 'none') {
					eventBus.emit('showVideo-PowerStationVideo', true);
				} else {
					eventBus.emit('showVideo-PowerStationVideo', false);
					eventBus.emit('clossVideo-PowerStationVideo'); //关闭时销毁
				}
			} else if (obj == 'xldx') {
				this.handTitle = '线缆断线'; //标题
				this.tableColumns = this.xldxColumns;
				this.tableData = this.xldxTableData;
				this.loading = true;
				let params = {
					systemCode: 'dydldx',
					orderBy: 'name',
					serviceCode: 'dydldx_002',
					offset: this.offset,
					limit: this.pageSize
				};
				dataApi.getxldx(params).then(res => {
					let list = res.data.data.page.list;
					this.total = res.data.data.page.count;
					for (let i = 0; i < list.length; i++) {
						this.tableData = list;
						this.loading = false; //加载中结束隐藏
					}
				});
			} else if (obj == 'gxzd') {
				this.handTitle = '光纤振动'; //标题
				this.tableColumns = this.gxzdColumns;
				this.tableData = this.gxzdTableData;
				this.loading = true;
				let params = {
					offset: this.offset,
					limit: this.pageSize
				};
				dataApi.getgxzd(params).then(result => {
					let list = result.data.data.page.list;
					this.total = result.data.data.page.count;
					for (let i = 0; i < list.length; i++) {
						this.tableData = list;
					}
					this.loading = false; //加载中结束隐藏
				});
			} else if (obj == 'ycgx') {
				eventBus.emit('layer-addLayer-CableVibrationLayer', true); //光纤振动告警-地图
				this.dwTip = 'ycgx';
				this.handTitle = '异常光纤'; //标题
				this.tableColumns = this.ycgxColumns;
				this.loading = true;
				let params = {
					types: 'das_alarm',
					rangeType: 'today',
					offset: this.offset,
					limit: this.pageSize
				};
				dataApi.getycgx(params).then(result => {
					let list = result.data.data.list;
					this.total = result.data.data.count;
					var dataList = [];
					for (let i = 0; i < list.length; i++) {
						dataList.push({
							device_id: JSON.parse(list[i].entity).device_id,
							title: list[i].title,
							lon: list[i].longitude,
							lat: list[i].latitude
						});
					}
					this.tableData = dataList;
					this.loading = false;
				});
			} else if (obj == 'znjg') {
				this.dwTip = 'znjg';
				this.isSearch = true;
				this.handTitle = '智能井盖'; //标题
				this.tableColumns = this.znjgColumns;
				this.loading = true; //加载中默认出现
				let params = {
					offset: 0,
					limit: -1
				};
				let self = this;
				//原始智能井盖数据搜索和
				// 新增和池智能井盖数据
				this.$http.all([dataApi.getznjg(params), dataApi.getNewZnjg(params)]).then(
					self.$http.spread((res1, res2) => {
						let listznjg = res1.data.data.page.list;
						let listhcznjg = res2.data.data.page.list;
						let arr = listznjg.concat(listhcznjg);
						this.allData = arr;
						for (let i = 0; i < arr.length; i++) {
							this.allData[i].jgName = arr[i].name;
						}
					})
				);
				//原始智能井盖数据搜索和
				// 新增和池智能井盖数据分页
				this.$http.all([dataApi.getznjg(params), dataApi.getNewZnjg(params)]).then(
					self.$http.spread((res1, res2) => {
						let listznjg = res1.data.data.page.list;
						let listhcznjg = res2.data.data.page.list;
						let listArr = listznjg.concat(listhcznjg);
						for (let i = 0; i < listArr.length; i++) {
							listArr[i].jgName = listArr[i].name;
						}
						console.log('listArr', listArr);
						this.onall(listArr);
						this.loading = false; //加载中结束隐藏
					})
				);
			} else if (obj == 'ycjg') {
				this.dwTip = 'ycjg';
				// this.isSearch = true;
				this.handTitle = '异常井盖'; //标题
				this.tableColumns = this.ycjgColumns;
				this.loading = true; //加载中默认出现
				// 获取异常井盖设备列表
				let params = {
					types: 'znjg_qxgj',
					rangeType: 'today',
					offset: this.offset,
					limit: this.pageSize
				};
				dataApi.getycjg(params).then(result => {
					console.log('res11', result);
					let list = result.data.data.list;
					this.total = result.data.data.count;
					var dataList = [];
					if (this.total == 0) {
						this.loading = false;
					}
					for (let i = 0; i < list.length; i++) {
						dataList.push({
							jgName: JSON.parse(list[i].entity).deviceName,
							announceTime: JSON.parse(list[i].entity).checkTime,
							content: JSON.parse(list[i].entity).content,
							value: JSON.parse(list[i].entity).value,
							deviceId: JSON.parse(list[i].entity).deviceId,
							uid: JSON.parse(list[i].entity).uid,
							lon: list[i].longitude,
							lat: list[i].latitude
						});
					}
					this.tableData = dataList;
					this.loading = false;
				});
			} else if (obj == 'hplc') {
				this.handTitle = '智能电表'; //标题
				this.isShow = false;
			}
		},
		onInput(val) {
			console.log('val', val);
			this.currentPage = 1;
			this.offset = 0;
			let objData = [];
			this.allData.map(item => {
				if (item.name.indexOf(val) != -1) {
					objData.push(item);
				}
			});
			this.onall(objData);
		},
		// 坐标定位
		onhandClick(row) {
			let point = wgs2bd(row.lon, row.lat); //世界大地坐标转为百度坐标
			console.log(row);
			console.log('point', point);
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
			} else if (this.dwTip == 'ycjg') {
				let layer = {
					id: row.uid, //primaryId, //定位对象id
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
			} else if (this.dwTip == 'ycgx') {
				let layer = {
					id: row.device_id, //定位对象id
					layerName: 'CableVibrationLayer', //定位图层
					zoom: 18, //定位图层
					point: {
						lng: point[0],
						lat: point[1]
					}
				};
				eventBus.emit('layer-flyClickTips', {
					layer
				}); //告警电缆振动图层定位
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
			if (this.list.length > 0) {
				this.onall(this.staticObj);
			} else {
				this.onClickNum(this.newObj);
			}
		},
		// 获取异常数据的接口
		delayed() {
			let params = {
				rangeType: 'today',
				offset: '0',
				limit: '-1'
			};
			dataApi.gettodayBugList(params).then(result => {
				//异常井盖
				this.ycjgNumber = 0;
				//异常光纤
				this.ycgxNumber = 0;
				result.data.data.list.map(item => {
					if (item.type == 'znjg_qxgj') {
						this.ycjgNumber++;
					}
					if (item.type == 'das_alarm') {
						this.ycgxNumber++;
					}
				});
			});
		},
		//监听异常光纤
		testChange() {
			const vm = this;
			const sysGatewayRoute = '/sys'; //vm.$$sysConfig.gatewayRoute
			// 设置跟用户相关的消息频道
			vm.$$config.ws.initUserWs();
			// 设置消息监听
			vm.$$utils.axiosRequest(`${sysGatewayRoute}/getJWTToken`, '获取消息服务认证信息').then(result => {
				const socket = new SockJS(`/api${sysGatewayRoute}/websocket`);
				const socket_client = Stomp.over(socket);
				socket_client.connect(
					{ 'Auth-Token': result.data },
					() => {
						socket_client.subscribe('/topic/dasWarningChannel', message => {
							this.testDlzd(message);
						});
					}
				);
			});
		},
		//监听异常光纤弹窗
		testDlzd(obj) {
			this.delayed();
			console.log(obj);
			this.$message({
				message: JSON.parse(obj.body).title,
				type: 'warning'
			});
		},
		// 请求视频监控(摄像头统计信息)接口
		getDeviceNumber() {
			dataApi.getdzsx().then(result => {
				this.deviceDetails.spjk.total = result.data.data.total;
				this.deviceDetails.spjk.onlineNum = result.data.data.onlineNum;
			});
		},
		//获取线缆断线接口
		monitorNumber() {
			let params = {
				systemCode: 'dydldx',
				serviceCode: 'dydldx_002'
			};
			dataApi.getxldxNumber(params).then(result => {
				this.deviceDetails.xldx.deviceNum = result.data.data.deviceNum;
				this.deviceDetails.xldx.onlineNum = result.data.data.onlineNum;
			});
		},
		// 获取光纤振动接口
		getSystemNumber() {
			dataApi.getgxzdNumber().then(result => {
				if(result.data.data==null){
					this.deviceDetails.gqzd.Device_num=0
				}else{
					this.deviceDetails.gqzd.Device_num = result.data.data.Device_num;
					this.deviceDetails.gqzd.Online_rate = parseInt(result.data.data.Online_rate);
				}
				
			}); 
		},
		// 获取智能井盖接口个数+和池井盖
		getStatisticNumber() {
			let self = this;
			this.$http.all([dataApi.getznjgNumber(), dataApi.gethcznjgNumber()]).then(
				self.$http.spread((res1, res2) => {
					let znjg = parseInt(res1.data.data.manholeCover);
					let hcznjg = parseInt(res2.data.data.deviceTotal);
					this.deviceDetails.znjg.manholeCover = znjg + hcznjg;
				})
			);
		},
		// 获取消防设备接口(p_f_016)
		getFireNumber() {
			dataApi.getxfsbdNumber().then(result => {
				this.deviceDetails.xfsb.equipmentCount = result.data.data.equipmentCount;
				this.deviceDetails.xfsb.onlineCount = result.data.data.onlineCount
			})
			 
		}
	},
	mounted() {
		this.getDeviceNumber();
		this.monitorNumber();
		this.getSystemNumber();
		this.getStatisticNumber();
		this.getFireNumber();
		this.delayed();
		// let _this = this;
		// setInterval(function() {
		// 	_this.delayed();
		// }, 60000);
		this.testChange();
	}
};
</script>

<style scoped>
.sectionBody1 {
	padding-left: 20px;
}

.sectionBody1 .sectionItem {
	width: 235px;
	height: 180px;
	margin-bottom: 20px;
	border: 2px solid #112039;
	cursor: pointer;
}

.sectionItem:hover {
	background: #3d65ab;
}

.sectionBody1 .defult {
	/* border: 2px solid #fe774e; */
	/* ad533e 新的背景色颜色值 */
}

.sectionBody1 .sectionItem .sbgzbox {
	width: 100%;
	height: 130px;
	padding: 25px 10px 0 10px;
	display: inline-block;
}

.sectionBody1 .sectionItem .sbgzbox .picbox {
	width: 30%;
	height: 90px;
	margin: 10px auto;
	display: inline-block;
}

.sectionBody1 .sectionItem .sbgzbox .picbox img {
	width: 60px;
	height: 60px;
	margin: 10px auto;
}

.sectionBody1 .sectionItem .sbgzbox .infobox {
	width: 70%;
	height: 90px;
	display: inline-block;
	vertical-align: top;
}

.sectionBody1 .sectionItem .sbgzbox .infobox .toptext {
	color: #ffffff;
	font-size: 13px;
	margin-top: 15px;
	font-weight: 600;
}

.sectionBody1 .sectionItem .sbgzbox .infobox .bottomtext {
	color: #73839d;
	margin-top: 30px;
	font-size: 16px;
}

.sectionBody1 .sectionItem .sbgzbox .infobox .toptext .inforight {
	float: right;
	display: inline-block;
	color: #50f1e9;
	font-size: 17px;
	margin-top: -3px;
}

.sectionBody1 .sectionItem .sbgzbox .infobox .toptext .inforight b {
	color: #fe774e;
	font-size: 15px;
	font-weight: normal;
	margin-left: 1px;
}

.sectionBody1 .sectionItem .sbgzbox .infobox .bottomtext .inforight {
	float: right;
	display: inline-block;
	color: #ae6bc8;
	font-size: 20px;
	font-weight: 600;
}

.sectionBody1 .sectionTail {
	bottom: 13px;
}

.deviceTitle {
	width: 100%;
	height: 42px;
	line-height: 42px;
	color: #ffffff;
	font-size: 14px;
	text-align: center;
}

.deviceNum {
	width: 100%;
	height: 40px;
	line-height: 40px;
	text-align: center;
}

.deviceNum span {
	color: #43f2f4;
	font-size: 34px;
	font-weight: bold;
}

.deviceNum span:nth-of-type(3) {
	color: #fe774e;
	font-size: 22px;
}

.deviceText {
	width: 100%;
	height: 40px;
	padding-top: 20px;
	line-height: 20px;
	text-align: center;
}

.deviceText span {
	font-size: 14px;
	color: #b0e0fc;
	padding: 0 10px;
}

.deviceText span strong {
	color: #43f2f4;
	font-size: 16px;
	padding: 0 2px;
}

.deviceOn {
	width: 100%;
	height: 40px;
	line-height: 40px;
}

.deviceOnText {
	width: 68px;
	height: 40px;
	line-height: 40px;
	font-size: 12px;
	color: #ffffff;
	float: left;
	text-indent: 20px;
}

.deviceOnLine {
	width: 88px;
	height: 6px;
	float: left;
	background: #43f2f4;
	border-radius: 3px;
	margin-top: 17px;
}

.deviceOnNum {
	width: calc(100% - 166px);
	height: 40px;
	line-height: 40px;
	font-size: 16px;
	color: #7c90b3;
	float: left;
	text-indent: 10px;
	font-weight: bold;
}

.rounds {
	position: relative;
}

.rounds:after {
	position: absolute;
	top: 10px;
	left: 10px;
	width: 10px;
	height: 10px;
	content: '';
	background: #43f2f4;
	border-radius: 50%;
}
</style>

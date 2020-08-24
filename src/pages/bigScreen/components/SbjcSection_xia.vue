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
					deviceNum: 56,
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

			// 辅控检测数据
			fkjcColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbName', //<String>  对应属性名
					label: '设备编号' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbStyle', //<String>  对应属性名
					label: '设备类型' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbClass', //<String>  对应属性名
					label: '所属分类' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbDz', //<String>  对应属性名
					label: '所属电站' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbAdress', //<String>  对应属性名
					label: '设备地址' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'state', //<String>  对应属性名
					label: '状态(正常/异常)' //<String>   表头标签
				}
			],
			// fkjcTableData: [{
			// 	sbName: '001',
			// 	sbStyle: '测试测试',
			// 	sbClass: '三峡水电站',
			// 	sbDz: '测试测试',
			// 	sbAdress: '上海市徐汇区漕河泾',
			// 	state: '稳定'
			// },
			// ],
			//机器人
			jqrColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'jqrName', //<String>  对应属性名
					label: '设备名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'jqrStyle', //<String>  对应属性名
					label: '设备类型' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'dzName', //<String>  对应属性名
					label: '电站名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbAdress', //<String>  对应属性名
					label: '设备地址' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'state', //<String>  对应属性名
					label: '设备(正常/异常)' //<String>   表头标签
				}
			],
			jqrTableData: [
				{
					jqrName: '测试机器人',
					jqrStyle: '三峡水电站',
					dzName: '测试测试',
					sbAdress: '上海市徐汇区漕河泾',
					state: '稳定'
				}
			],

			//线缆断线
			xldxColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'devName', //<String>  对应属性名
					label: '设备名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'groupName', //<String>  对应属性名
					label: '班组名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'devType', //<String>  对应属性名
					label: '设备类型' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'stationCode', //<String>  对应属性名
					label: '所属电缆/箱变' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'deployStatus', //<String>  对应属性名
					label: '布放状态' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'onlineStatus', //<String>  对应属性名
					label: '在线状态' //<String>   表头标签
				}
			],
			xldxTableData: [
				{
					// devName: '设备名称',
					// groupName:'班组名称',
					// devType:'设备类型',
					// stationCode:'所属电缆',
					// deployStatus:'布放状态',
					// onlineStatus:'在线状态'
				}
			],

			//光纤振动
			gxzdColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'Device_id', //<String>  对应属性名
					label: '设备编号' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'Staion_name', //<String>  对应属性名
					label: '线路名称' //<String>   表头标签
				}
			],
			gxzdTableData: [],

			//异常振动
			ycgxColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: true, //<Boolean> 是否自定义
					prop: 'operate', //<String>  对应属性名
					label: '操作' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'device_id', //<String>  对应属性名
					label: '设备编号' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'location', //<String>  对应属性名
					label: '线路名称' //<String>   表头标签
				}
			],
			ycgxTableData: [],

			// 智能井盖
			znjgColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: true, //<Boolean> 是否自定义
					prop: 'operate', //<String>  对应属性名
					label: '操作' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'jgName', //<String>  对应属性名
					label: '井盖名称' //<String>   表头标签
				}
			],
			tableData: [],

			//异常井盖
			ycjgColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: true, //<Boolean> 是否自定义
					prop: 'operate', //<String>  对应属性名
					label: '操作' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'jgName', //<String>  对应属性名
					label: '井盖名称' //<String>   表头标签
				},
				{
					hasSort: true, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'announceTime', //<String>  对应属性名
					label: '告警时间' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'content', //<String>  对应属性名
					label: '告警内容' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'value', //<String>  对应属性名
					label: '超警戒值' //<String>   表头标签
				}
			],
			ycjgTableData: [
				{
					jgName: '浦城路160021857',
					checkTime: '2018-10-29 16:42:30',
					content: '水位过高',
					value: '0.04'
				}
			]
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
				this.$$utils
					.axiosRequest(
						'/pdaqfh_war_exploded/f/sjafpt/monitorDevice?systemCode=dydldx&orderBy=name&serviceCode=dydldx_002&offset=' + this.offset + '&limit=' + this.pageSize,
						'获取索骏安防平台监测设备列表--线缆断线明细'
					)
					.then(result => {
						let list = result.data.page.list;
						this.total = result.data.page.count;
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
				this.$$utils
					.axiosRequest('/pdaqfh_war_exploded/f/dasgxczd/getOnlineDevice?offset=' + this.offset + '&limit=' + this.pageSize, '获取DAS当前系统状态--光纤振动')
					.then(result => {
						let list = result.data.page.list;
						this.total = result.data.page.count;
						for (let i = 0; i < list.length; i++) {
							this.tableData = list;
							this.loading = false; //加载中结束隐藏
						}
					});
			} else if (obj == 'ycgx') {
				this.dwTip = 'ycgx';
				this.handTitle = '异常光纤'; //标题
				this.tableColumns = this.ycgxColumns;
				this.loading = true;
				this.$$utils
					.axiosRequest(
						'/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList?types=das_alarm&rangeType=month&offset=' + this.offset + '&limit=' + this.pageSize,
						'获取异常光纤设备列表'
					)
					.then(result => {
						debugger;
						let list = result.data.list;
						this.total = result.data.count;
						var dataList = [];
						for (let i = 0; i < list.length; i++) {
							dataList.push({
								device_id: JSON.parse(list[i].entity).device_id,
								location: JSON.parse(list[i].entity).location,
								lon: list[i].longitude,
								lat: list[i].latitude
							});
							this.loading = false;
						}
						this.tableData = dataList;
					});
			} else if (obj == 'znjg') {
				this.dwTip = 'znjg';
				this.isSearch = true;
				this.handTitle = '智能井盖'; //标题
				this.tableColumns = this.znjgColumns;
				this.loading = true; //加载中默认出现
				//原始智能井盖数据搜索
				this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/znjg/getDeviceList?offset=0&limit=-1', '获取智能井盖设备列表').then(result => {
					let listznjg = result.data.page.list;
					// 新增和池智能井盖数据搜索
					this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/znjg/getDevices?offset=0&limit=-1', '获取和池智能井盖设备列表').then(result => {
						let listhcznjg = result.data.page.list;
						let arr = listznjg.concat(listhcznjg);
						this.allData = arr;
						for (let i = 0; i < arr.length; i++) {
							this.allData[i].jgName = arr[i].name;
						}
					});
				});

				// 原始智能井盖数据
				this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/znjg/getDeviceList?offset=0&limit=-1', '获取智能井盖设备列表').then(result => {
					let listznjg = result.data.page.list; // 新增和池智能井盖数据
					this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/znjg/getDevices?offset=0&limit=-1', '获取和池智能井盖设备列表').then(result => {
						let listhcznjg = result.data.page.list;
						let listArr = listznjg.concat(listhcznjg);
						for (let i = 0; i < listArr.length; i++) {
							listArr[i].jgName = listArr[i].name;
						}
						console.log('listArr', listArr);
						this.onall(listArr);
						this.loading = false; //加载中结束隐藏
					});
				});
			} else if (obj == 'ycjg') {
				this.dwTip = 'ycjg';
				// this.isSearch = true;
				this.handTitle = '异常井盖'; //标题
				this.tableColumns = this.ycjgColumns;
				this.loading = true; //加载中默认出现
				this.$$utils
					.axiosRequest(
						'/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList?types=znjg_qxgj&rangeType=today&offset=' + this.offset + '&limit=' + this.pageSize,
						'获取异常井盖设备列表'
					)
					.then(result => {
						let list = result.data.list;
						this.total = result.data.count;
						var dataList = [];
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
							this.loading = false;
						}
						this.tableData = dataList;
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
					id: row.uid, //primaryId, //定位对象id
					layerName: 'IntelligentCoverYSLayer', //定位图层
					zoom: 18, //定位图层
					point: {
						lng: point[0],
						lat: point[1]
					}
				};
				eventBus.emit('layer-addLayer-CableVibrationLayer', layer);
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
			this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/getTodayWarnMessageList', '获取今日告警消息列表').then(result => {
				console.log('获取今日告警消息列表', result);
				this.ycjgNumber = 0;
				this.ycgxNumber = 0;
				result.data.map(item => {
					if (item.type == 'znjg_qxgj') {
						this.ycjgNumber++;
					}
					if (item.type == 'das_alarm') {
						this.ycgxNumber++;
					}
				});
				//异常井盖弹窗推送
				if (this.ycjgNumber > 0) {
					console.log('异常');
				} else {
					this.$message({
						message: '警告哦1111',
						type: 'warning'
					});
				};
				//异常光纤弹窗推送
				if (this.ycgxNumber > 0) {
					console.log('异常');
				} else {
					this.$message({
						message: '222',
						type: 'warning',
						customClass: 'fixeTop'
					});
				}
			});
		}
	},
	mounted() {
		// 请求视频监控(电站)接口（p_f_025）
		this.$$utils.axiosRequest(OnlineUrl.getspjkdz, '获取电站视频监控设备统计数据').then(result => {
			this.deviceDetails.spjk.total = result.data.total;
		});

		// 请求视频监控(摄像头统计信息)接口（p_f_018）
		this.$$utils.axiosRequest(OnlineUrl.getspjksxt, '获取变电站摄像设备汇总信息').then(result => {
			this.deviceDetails.spjk.onlineNum = result.data.total;
			this.deviceDetails.spjk.onlineRate = result.data.onlineRate;
		});
		//获取线缆断线接口（p_f_028）
		this.$$utils.axiosRequest(OnlineUrl.getxldx, '获取索骏安防平台监测统计数据').then(result => {
			this.deviceDetails.xldx = result.data;
		});

		// 获取光纤振动接口(p_f_022)
		this.$$utils.axiosRequest(OnlineUrl.getgqzd, '获取DAS系统在线情况').then(result => {
			this.deviceDetails.gqzd = result.data;
			this.deviceDetails.gqzd.Online_rate = parseInt(result.data.Online_rate);
		});
		// 获取智能井盖接口
		this.$$utils.axiosRequest(OnlineUrl.getznjg, '获取智能井盖数据状态统计数据').then(result => {
			let znjg = parseInt(result.data.manholeCover);
			this.$$utils.axiosRequest(OnlineUrl.gethcznjg, '获取和池智能井盖数据状态统计数据').then(result => {
				let hcznjg = parseInt(result.data.deviceTotal);
				this.deviceDetails.znjg.manholeCover = znjg + hcznjg;
			});
		});

		// 获取消防设备接口(p_f_016)
		this.$$utils.axiosRequest(OnlineUrl.getxfsb, '获取消防设备数据状态统计数据').then(result => {
			// console.log('获取智能井盖数据状态统计数据',result)
			this.deviceDetails.xfsb = result.data;
		});

		this.delayed();
		let _this = this;
		setInterval(function() {
			_this.delayed();
		}, 300000);
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

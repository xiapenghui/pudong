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
							<img src="./baidumap/assets/images/bdstatus/icon2.png" />
						</div>
					</div>
					<div class="securityTaskRight">
						<div class="securityTaskTitle">
							保障时间：
							<span class="securityTaskColor">{{ bzshTime }}</span>
						</div>
					</div>
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
								<p>保障人员</p>
								<b @click="onClickNum('bzry')">{{ bzryNumber }}</b><b style="margin: 0 5px;">-</b>
								<b  class="bzryOnline"  @click="onClickNum('bzzx')">{{ bzryOnline }}</b>
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
						:span-method="objectSpanMethod"
						:highlight-current-row="true"
						:row-style="rowStyle"
						:header-cell-style="tableHeaderColor"
						height="360"
						border
						style="width: 100%"
					>
						<el-table-column prop="sbmc" label="设备名称" align="center"></el-table-column>
						<el-table-column prop="wlzz" label="物联装置" align="center"></el-table-column>
						<el-table-column prop="zzzt" label="装置状态" align="center"></el-table-column>
						<el-table-column prop="rymd" label="人员名单" align="center"></el-table-column>
						<el-table-column prop="zyname" label="专业" align="center"></el-table-column>
						<el-table-column prop="lxfz" label="联系方式" align="center"></el-table-column>
						<el-table-column prop="zshxsbz" label="值守或巡视标准" align="center"></el-table-column>
						<el-table-column prop="clbh" label="车牌编号" align="center"></el-table-column>
						<el-table-column prop="clname" label="车辆名称" align="center"></el-table-column>
						<el-table-column prop="cph" label="车牌号" align="center"></el-table-column>
						<el-table-column prop="person" label="负责人" align="center"></el-table-column>
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
import userArray from './baidumap/assets/mock/djbgUser'; //引入保障人员测试json
// import userArray from './baidumap/assets/mock/userTest'; //引入人员对比测试json
import carinfo from './baidumap/assets/mock/carinfo'; //应急车json
// 应急车弹窗
import carDetailed from '../components/CarDetailed.vue'
import table from '../mixins/table'; //引入表格混入


/**
 * 创建新一轮的人员初始状态
 */
let copyUserArray = userArray => {

	return userArray.map(user => {
		return {
			id: user.user_id,
            name: user.full_name,
            user_id : user.user_id,
            full_name : user.full_name,
            fzsb : user.fzsb,
            zyfl: user.zyfl,
            lxfs : user.lxfs,
            zshxsbz : user.zshxsbz,
            ryly : user.ryly,
			online: false,
			onlineDate: null,
			notice: false,
			found: false
		};
	});
};

/**
 * 创建人员的Map映射关系
 */
let makeUserMap = userArray => {
	let userMap = {};
	userArray.forEach(user => {
		userMap[user.id] = user;
	});
	return userMap;
};

/**
 * 判断人员的上线状态
 */
let changeUserHasOnline = (copyed, resUserArray, fun) => {
	let userMap = makeUserMap(copyed);

	resUserArray.forEach(item => {
		let id = fun(item);
		if (!id) {
			return;
		}

		let user = userMap[id];
		if (!user) {
			return;
		}

		user.found = true;
		if (user.online) {
			return;
		}

		user.online = true;
		user.onlineDate = new Date();
	});
};

/**
 * 判断人员与上一次的在线状态是否一致，不一致需要通知
 */
let changeUserNotice = (copyed, preUserArray) => {
	let userMap = makeUserMap(copyed);
	preUserArray.forEach(item => {
		let id = item.id;
		let user = userMap[id];

		if (user.online !== item.online) {
			user.notice = true;
		}
	});
};

/**
 * 判断现场管控人员是否在线
 */
let onlinePersonIsOnline = item => {
	if (item && item.realtime_point && item.realtime_point.location && item.realtime_point.location.length > 0) {
		return item.entity_name;
	}

	return null;
};

/**
 * 判断施工人员是否在线
 */
let workPersonIsOnline = item => {
	if (item && item.longitude && item.latitude) {
		return item.id;
	}

	return null;
};

let makeUserStateArray = (users, responses) => {
	let copyed = copyUserArray(userArray);

	responses.forEach(response => {
		if (0 !== parseInt(response.type)) {
			return;
		}

		var data = response.data;
		if (!data) {
			return;
		}

		if (Array.isArray(data)) {
			changeUserHasOnline(copyed, data, onlinePersonIsOnline);
		} else {
			data = data.list;
			if (!data) {
				return;
			}
			changeUserHasOnline(copyed, data, workPersonIsOnline);
		}
	});

	changeUserNotice(copyed, users);

	let currentOnlineCount = 0;
	let currentOfflineCount = 0;
    let onlineArr=[]
    let offlineArr = [];
    let noticeOnlineArr = [];
    let noticeOfflineArr = [];
	copyed.forEach(user => {
        if(user.online){
            onlineArr.push(user);
        }else{
            offlineArr.push(user);
        }

		if (user.notice) {
			if (user.online) {
				noticeOnlineArr.push(user)
				currentOnlineCount++;
			} else {
                noticeOfflineArr.push(user);
				currentOfflineCount++;
			}
		}
	});
	
	return {
        users: copyed, //当前人员状态
        onlineUserCount : onlineArr.length,
        onlineUsers : onlineArr,
        offlineUserCount : offlineArr.length,
        offlineUsers : offlineArr,
		noticeOnlineUsers: noticeOnlineArr, //当前上线人员
		noticeOfflineUsers: noticeOnlineArr.length, //当前下线人员
		noticeOnlineCount: noticeOfflineArr, //当前上线的人数
		noticeOfflineCount: noticeOfflineArr.length //当前下线的人数
	};
};


let cachedUsers = makeUserStateArray(copyUserArray(userArray) , []);
let cachedUserTimer = null;


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
			perChangeArr:[],//上线下线人员数组总和
			bzrwTitle: '东郊宾馆',
			bzshTime: '11月3日8:00-11月11日8:00',
			bzseNumber: '10',
			bzryNumber: cachedUsers.users.length,
			yjcNumber: '7',
			znjgNumber: '25',
			tdjpNumber: '125',
			bzryOnline: 0,
			handTitle:'标题',
			loading: false, //加载中...
			isdefult: true,
			isSearch: false,
			allData: [],
			tableData: [],
			tableColumns: [],
			list: [],
			carShow:false,
			// mock数据分页
			pageSize: 9,
			total: 0,
			staticObj: '',
			page: 1,
			offset: 0,
			bzsbTest:bzsbTest,
			carinfo:carinfo,
			detail:{},
			dwTip:'',
			users: copyUserArray(userArray),
			tableDataOne: [
				{
					sbmc: '龙东站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					cph: '/',
					clbh:'/',
					clname:'/',
					person:'/',
				},
				{
					sbmc: '紫薇站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				/* {
					sbmc: '祖冲站',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					sjname: '',
					clbh:'YJCL00006,YJCL00007,YJCL00022,YJCL00023,YJCL00024',
					clname:'移动箱变车,移动环网柜车,抽水车,抽水车,耐压试验车',
					cph:'沪D-H8131,沪D-H4360,沪E-L3366,沪E-P9523,沪E-K0092',
					person:'江正恺,江正恺,潘志君,潘志君,潘志君',
				}, */
				{
					sbmc: '祖冲站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					sjname: '',
					clbh:'YJCL00006',
					clname:'移动箱变车',
					cph:'沪D-H8131',
					person:'江正恺',
				},
				{
					sbmc: '祖冲站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					sjname: '',
					clbh:'YJCL00007',
					clname:'移动环网柜车',
					cph:'沪D-H4360',
					person:'江正恺',
				},
				{
					sbmc: '祖冲站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					sjname: '',
					clbh:'YJCL00022',
					clname:'抽水车',
					cph:'沪E-L3366',
					person:'潘志君',
				},
				{
					sbmc: '祖冲站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					sjname: '',
					clbh:'YJCL00023',
					clname:'抽水车',
					cph:'沪E-P9523',
					person:'潘志君',
				},
				{
					sbmc: '祖冲站',
					wlzz:'/',
					zzzt:'/',
					rymd: '/',
					zyname: '/',
					lxfz: '/',
					zshxsbz: '/',
					sjname: '',
					clbh:'YJCL00024',
					clname:'耐压试验车',
					cph:'沪E-K0092',
					person:'潘志君',
				},
				

				
				{
					sbmc: '时珍站',
					wlzz:'/',
					zzzt:'/',
					rymd: '胡依斌、陆勇军',
					zyname: '变电',
					lxfz: '13916052651',
					zshxsbz: '固定值守',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				{
					sbmc: '龙祖3978',
					wlzz:'/',
					zzzt:'/',
					rymd: '张惠杰、杨嵘、杨晓俊、闵志华、孙磊',
					zyname: '电缆',
					lxfz: '15901677963',
					zshxsbz: '流动巡视',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				{
					sbmc: '龙珍3965',
					wlzz:'/',
					zzzt:'/',
					rymd: '周建明、倪建威',
					zyname: '电缆',
					lxfz: '17717060368',
					zshxsbz: '流动巡视',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				{
					sbmc: '紫祖8358',
					wlzz:'/',
					zzzt:'/',
					rymd: '杨嵘、王培玉',
					zyname: '电缆',
					lxfz: '18001623115',
					zshxsbz: '流动巡视',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				{
					sbmc: '祖7东郊甲',
					wlzz:'/',
					zzzt:'/',
					rymd: '张海华、王兵、夏军、王卫军',
					zyname: '电缆',
					lxfz: '15901677963',
					zshxsbz: '固定值守',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				{
					sbmc: '珍1东郊乙',
					wlzz:'/',
					zzzt:'/',
					rymd: '张海华、王兵、夏军、王卫军',
					zyname: '电缆',
					lxfz: '15901677963',
					zshxsbz: '固定值守',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},
				{
					sbmc: '祖27东郊丙',
					wlzz:'/',
					zzzt:'/',
					rymd: '张海华、王兵、夏军、王卫军',
					zyname: '电缆',
					lxfz: '15901677963',
					zshxsbz: '固定值守',
					clbh:'/',
					clname:'/',
					cph: '/',
					person:'/',
				},

			],
			// 保障设备数据
			bzsbColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: true, //<Boolean> 是否自定义
					prop: 'operate', //<String>  对应属性名
					label: '操作', //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'zdxl', //<String>  对应属性名
					label: '站点/线路/用户设备点' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'sbyh', //<String>  对应属性名
					label: '设备/用户地址' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'dydj', //<String>  对应属性名
					label: '电压等级' //<String>   表头标签
				},
			],
			bzsbTableData: [
				{
					PMSID: '001',
					zdxl: '测试测试',
					sbyh: '三峡水电站',
					dydj: '测试测试'
				}
			],
			//保障人员
			bzryColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'full_name', //<String>  对应属性名
					label: '人员名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'fzsb', //<String>  对应属性名
					label: '负责设备' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'zyfl', //<String>  对应属性名
					label: '专业分类' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'lxfs', //<String>  对应属性名
					label: '联系方式' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'zshxsbz', //<String>  对应属性名
					label: '值守或巡视标准' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'ryly', //<String>  对应属性名
					label: '人员来源' //<String>   表头标签
				}
			],
			bzryTableData: [

			],
			
			//在线保障人员
			bzzxColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: true, //<Boolean> 是否自定义
					prop: 'operate', //<String>  对应属性名
					label: '操作', //<String>   表头标签
				},
				  {
				  	hasSort: false, //<Boolean> 是否排序
				  	isShow: true, //<Boolean> 是否展示
				  	prop: 'full_name', //<String>  对应属性名
				  	label: '人员名称' //<String>   表头标签
				  },
				  {
				  	hasSort: false, //<Boolean> 是否排序
				  	isShow: true, //<Boolean> 是否展示
				  	prop: 'fzsb', //<String>  对应属性名
				  	label: '负责设备' //<String>   表头标签
				  },
				  {
				  	hasSort: false, //<Boolean> 是否排序
				  	isShow: true, //<Boolean> 是否展示
				  	prop: 'zyfl', //<String>  对应属性名
				  	label: '专业分类' //<String>   表头标签
				  },
				  {
				  	hasSort: false, //<Boolean> 是否排序
				  	isShow: true, //<Boolean> 是否展示
				  	prop: 'lxfs', //<String>  对应属性名
				  	label: '联系方式' //<String>   表头标签
				  },
				  {
				  	hasSort: false, //<Boolean> 是否排序
				  	isShow: true, //<Boolean> 是否展示
				  	prop: 'zshxsbz', //<String>  对应属性名
				  	label: '值守或巡视标准' //<String>   表头标签
				  },
				  {
				  	hasSort: false, //<Boolean> 是否排序
				  	isShow: true, //<Boolean> 是否展示
				  	prop: 'ryly', //<String>  对应属性名
				  	label: '人员来源' //<String>   表头标签
				  }
				
			],
			bzzxTableData: [
			
			],
			
			
			

			//应急车
			yjcColumns: [
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: true, //<Boolean> 是否自定义
					isOterIcon:true,//自定义图标
					prop: 'operate', //<String>  对应属性名
					label: '操作' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'carName', //<String>  对应属性名
					label: '车辆编号' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'carMc', //<String>  对应属性名
					label: '名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'carNumber', //<String>  对应属性名
					label: '车牌号' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'address', //<String>  对应属性名
					label: '单位地址' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'tfsj', //<String>  对应属性名
					label: '停放地址' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isShow: true, //<Boolean> 是否展示
					prop: 'person', //<String>  对应属性名
					label: '司机信息' //<String>   表头标签
				}
			],
			yjcTableData: [
				{
					carName: 'YJCL00007',
					carMc: '移动环网柜车',
					carNumber: '沪D-H4360',
					company: '浦东供电公司',
					address: '浦电路111号',
					person: '江正恺'
				}
			],


			// 智能井盖
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
					prop: 'gjID', //<String>  对应属性名
					label: '工井ID' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'jgName', //<String>  对应属性名
					label: '井盖名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'online', //<String>  对应属性名
					label: '线路名称' //<String>   表头标签
				},
				{
					hasSort: false, //<Boolean> 是否排序
					isCustomize: false, //<Boolean> 是否自定义
					prop: 'adress', //<String>  对应属性名
					label: '井盖地址' //<String>   表头标签
				}
				
			],
			znjgTableData: [
				{
					operate: '1',
					jgName: '徐家汇井盖',
					company: '上海浦东电力',
					people: '张三',
					phone: '17621555555'
				}
			]
		};
	},
	methods: {
		onCardClose(){
			this.carShow=false
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
		         // if (columnIndex === 0) {
		         //   if (rowIndex % 2 === 0) {
		         //     return {
		         //       rowspan: 5,
		         //       colspan: 1
		         //     };
		         //   } else {
		         //     return {
		         //       rowspan: 0,
		         //       colspan: 0
		         //     };
		         //   }
		         // }
		       },



		onClickNum(obj) {
			this.isShow = true;
			this.newObj = obj;
			this.isSearch = false;
			this.list = [];
			if (obj == 'bzsb') {
				this.dwTip='bzsb';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '保障设备'; //标题
				this.tableColumns = this.bzsbColumns;
				this.onall(this.bzsbTest)
			} else if (obj == 'bzry') {
				this.dwTip='bzry';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '保障人员'; //标题
				this.tableColumns = this.bzryColumns;
				this.onall(this.users)
			} else if(obj == 'bzzx'){
				this.dwTip='bzzx';
				this.offset = 0;
				this.currentPage = 1;
				this.tableColumns = this.bzzxColumns;
				this.handTitle = '在线人员'; //标题
                this.loading = true; //加载中默认出现
                
                this.total = cachedUsers.onlineUserCount;
                this.tableData=cachedUsers.onlineUsers;
                this.loading = false;
			}
			else if (obj == 'yjc') {
				this.dwTip='yjc';
				this.offset = 0;
				this.currentPage = 1;
				this.handTitle = '应急装备车辆', //标题
			    this.tableColumns = this.yjcColumns;
				this.onall(this.carinfo)
			} else if (obj == 'znjg') {
				this.dwTip='znjg';
				this.isSearch = true;
				this.handTitle = '智能井盖'; //标题
				this.tableColumns = this.znjgColumns;
				this.loading = true; //加载中默认出现
				this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/znjg/getDeviceList?offset=0&limit=1000',
					'获取智能井盖设备列表').then(result => {
					let list = result.data.page.list;
					this.allData = list;
					for (let i = 0; i < list.length; i++) {
						this.allData[i].jgName = list[i].name;
						// this.allData[i].company = '上海浦东电力有限公司';
					}
				});
				this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/znjg/getDeviceList?pmsIds=FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286&offset=' + this.offset + '&limit=' + this.pageSize,
					'获取智能井盖设备列表').then(result => {
					console.log('result',result)
					let list = result.data.page.list;
					this.total = result.data.page.count
					for (let i = 0; i < list.length; i++) {
						this.tableData = list;
						this.tableData = list;
						this.tableData[i].gjID = list[i].id;
						this.tableData[i].jgName = list[i].name;
						this.tableData[i].online = list[i].channelName;
						this.tableData[i].adress = list[i].address;
						// this.tableData[i].company=list[i].address
						// this.tableData[i].company = '上海浦东电力有限公司';
						this.loading = false; //加载中结束隐藏
					}
				});
			} else if (obj == 'tdjp') {
				this.isShow=false
				eventBus.emit("BzdxInfo-click-showPicInfo","aaa" );
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
			if(this.dwTip=="znjg"){
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

			}else if(this.dwTip=="bzsb"){
			    console.log('row',row)
			    if(row.zdxl=='龙东站'){
					canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: 121.5785200565, y: 31.1978269720, zoom: 15 });//定位
				}else if(row.zdxl=='紫薇站'){
					canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: 121.6050693098, y: 31.2088137016, zoom: 15 });//定位
				}else if(row.zdxl=='祖冲站'){
					canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: 121.5931347794, y: 31.2082923617, zoom: 15 });//定位
				}else if(row.zdxl=='时珍站'){
					canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: 121.6129318542, y: 31.2202050302, zoom: 15 });//定位
				}else if(row.zdxl=='祖冲站'){
					
				}
			
			
			}else if(this.dwTip=="bzzx"){
				//保障在线人员
				let layer = {
					id: row.name, //定位对象id
					layerName: "ConstructionSiteLayer", //定位图层
					zoom: 18, //定位图层
					point: {
						lng: 0,
						lat: 0,
					}
				}
				eventBus.emit("layer-flyClickTips", {
					layer
				}); //隐患缺陷图层定位
			}else if(this.dwTip=="bzry"){
				console.log('row',row)
				//保障人员
				let layer = {
					id: row.personName, //定位对象id
					layerName: "ConstructionSiteLayer", //定位图层
					zoom: 18, //定位图层
					point: {
						lng: 0,
						lat: 0
					}
				}
				eventBus.emit("layer-flyClickTips", {
					layer
				}); //隐患缺陷图层定位
			}else if(this.dwTip=='yjc'){
				this.carShow=true;
				this.detail=row
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
        

        noticeOnline(noticeOnlineUsers){
            noticeOnlineUsers.map(function(item, index) {
				setTimeout(function() {
					this.$message({
						message: '来自' + item.ryly + '的,' + item.full_name + '上线啦!',
						type: 'success'
					});
				}.bind(this), index * 3500);
			}.bind(this));
        },

        noticeOffline(noticeOfflineUsers){
            noticeOfflineUsers.map(function(item,index){
				setTimeout(function() {
					this.$message({
						message: '来自' + item.ryly + '的,' + item.full_name + '下线啦！',
						type: 'warning'
					});
				}.bind(this), index * 3500);
			}.bind(this));
        },

        

        refreshUserCache(){
            Promise.all([
				this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/wgyw/getOnlinePeopleLocations?limit=-1', '获取当前人员统计信息'),
				this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=wkresponser&status=-1&limit=-1&offset=0', '施工队伍明细-工作负责人'),
				this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=wkapprover&status=-1&limit=-1&offset=0', '施工队伍明细-工作许可人'),
				this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=manage&status=-1&limit=-1&offset=0', '施工队伍明细-管理人'),
				this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=supervisor&status=-1&limit=-1&offset=0', '施工队伍明细-查岗人员')
			]).then(function(responses) {
                        let result = makeUserStateArray(cachedUsers.users, responses);
                        cachedUsers = result;
                        eventBus.emit("app.bzrw.user.refresh" , result);
					}.bind(this)
				).catch(function(error) {
					console.error(error);
				}.bind(this));
        },

        onUserRefreshHandler(event){ 
            var data = event;
            
            this.bzryOnline = data.onlineUserCount;
            this.bzryNumber = data.users.length; 
            this.users = data.users;
            
            this.noticeOnline(data.noticeOnlineUsers);
            this.noticeOffline(data.noticeOfflineUsers);
        },

        loadLineVideoData(){
            this.$$utils.axiosRequest(
                '/pdaqfh/f/sdxltd/getDeviceStateOnLineBylineID?linePMSID=FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286', '通道监拍异常设备'
                ).then(function(result){
                console.log('通道监拍异常设备12', result);
                this.lineVideoResponse = result;
			    this.tdjpNumber=result.data.onLine
            }.bind(this));
        },

        loadCoverData(){
            this.$$utils.axiosRequest(
                '/pdaqfh_war_exploded/f/znjg/getDeviceList?pmsIds=FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286&offset=0&limit=-1', 
                '获取智能井盖数据状态统计数据'
                ).then(function(result) {
                    this.coverResponse = result;
			        this.znjgNumber=result.data.page.count;
		        }.bind(this));
        }
	},
	watch:{
	},
	mounted() {
        eventBus.on("app.bzrw.user.refresh" , (function(event){
            this.onUserRefreshHandler(event);
        }).bind(this));

        this.refreshUserCache();
        cachedUserTimer = setInterval(function(){
            this.refreshUserCache();
        }.bind(this) , 1000 * 60 * 1);

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
/* .securityListRight .cartNum {
	color: #e5757f;
} */

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
	height: 610px;
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

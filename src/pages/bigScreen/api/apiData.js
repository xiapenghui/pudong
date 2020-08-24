import api from './apis'
import axios from 'axios'

// 头部模块
//今日已审核隐患缺陷数
export function getjryh() {
	return axios.get(api.heard.jryh, {})
}
//获取当前人员统计信息
export function getrytj() {
	return axios.get(api.heard.rytj, {})
}
// 获取百度天气
export function getbdtq() {
	return axios.get(api.heard.bdtq, {})
}
//
export function getbdzt(params) {
	return axios.get(api.heard.bdzt, {
		params: params
	})
}


// 设备感知模块开始---------------
// 获取线缆断线
export function getxldx(params) {
	return axios.get(api.sbgz.xldx, {
		params: params
	})
}
// 获取光纤震动
export function getgxzd(params) {
	return axios.get(api.sbgz.gxzd, {
		params: params
	})
}
// 获取异常光纤
export function getycgx(params) {
	return axios.get(api.sbgz.ycgx, {
		params: params
	})
}
// 获取智能井盖
export function getznjg(params) {
	return axios.get(api.sbgz.znjg, {
		params: params
	})
}
// 获取新增和池智能井盖
export function getNewZnjg(params) {
	return axios.get(api.sbgz.newZnjg, {
		params: params
	})
}
// 获取异常井盖
export function getycjg(params) {
	return axios.get(api.sbgz.ycjg, {
		params: params
	})
}
//获取今日告警列表
export function gettodayBugList(params) {
	return axios.get(api.sbgz.todayBugList, {
		params: params
	})
}
//请求视频监控(摄像头统计信息)接口
export function getdzsx() {
	return axios.get(api.sbgz.dzsx, {})
}
//获取线缆断线接口
export function getxldxNumber(params) {
	return axios.get(api.sbgz.xldxNumber, {
		params: params
	})
}
//获取光纤震动接口
export function getgxzdNumber() {
	return axios.get(api.sbgz.gxzdNumber, {})
}
//获取智能井盖个数接口
export function getznjgNumber() {
	return axios.get(api.sbgz.znjgNumber, {})
}
//获取和池智能井盖个数接口
export function gethcznjgNumber() {
	return axios.get(api.sbgz.hcznjgNumber, {})
}
//获取和池智能井盖个数接口
export function getxfsbdNumber() {
	return axios.get(api.sbgz.xfsbdNumber, {})
}

// 设备缺陷监控模块开始---------------
export function getqxjkDetail(params) {
	return axios.get(api.qxjk.qxjkDetail, {
		params: params
	})
}
// 缺陷监控柱状图数据
export function getcensusList(params) {
	return axios.get(api.qxjk.censusList, {
		params: params
	})
}
export function getswiperList(params) {
	return axios.get(api.qxjk.swiperList, {
		params: params
	})
}
// 中控模块开始---------------
export function getcentreNumber(params) {
	return axios.get(api.centre.centreNumber, {
		params: params
	})
}
// 当日作业
export function getcenterWarNumber() {
	return axios.get(api.centre.centerWarNumber, {})
}
// 施工队伍
export function getsgdwNumber() {
	return axios.get(api.centre.sgdwNumber, {})
}
// 施工队伍
export function getywdwNumber() {
	return axios.get(api.centre.ywdwNumber, {})
}
//行为检测
export function gettdjpNumber() {
	return axios.get(api.xwjc.tdjpNumber, {})
}

// 作业安全管控模块
//今日工作情况
export function gettodayDetail(params) {
	return axios.get(api.zyaqgk.todayDetail, {
		params: params
	})
}
//时序图在线
export function getonlineTime(params) {
	return axios.get(api.zyaqgk.onlineTime, {
		params: params
	})
}
//工作票情况详情
export function getgzpDetail(params) {
	return axios.get(api.zyaqgk.gzpDetail, {
		params: params
	})
}
//工作票柱状图-已完成
export function getgzpOver(params) {
	return axios.get(api.zyaqgk.gzpOver, {
		params: params
	})
}
// //工作票柱状图-未完成
// export function getgzpNo(params1) {
//   return axios.get(api.zyaqgk.gzpNo, {params1: params1})
// }

//资源集约管控模块
//运维队伍
export function getywdwOnline(params) {
	return axios.get(api.zyjygk.ywdwOnline, {
		params: params
	})
}
//施工队伍详情
export function getsgdwDetail(params) {
	return axios.get(api.zyjygk.sgdwDetail, {
		params: params
	})
}
//保障概况
//通道监拍
export function gettdjpOnline(params) {
	return axios.get(api.bzgk.tdjpOnline, {
		params: params
	})
}

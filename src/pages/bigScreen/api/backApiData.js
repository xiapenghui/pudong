import backApis from './backApis'
import axios from 'axios'

//资源集约管控--网格化运维
export function getwghyw() {
	return axios.get(backApis.zyjygk.wghyw, {})
}
// 设备感知--智能井盖
export function getznjg(params) {
	return axios.get(backApis.sbgz.znjg, {params:params})
}

// 设备感知--今日告警消息列表
export function getjrgj(params) {
	return axios.get(backApis.sbgz.jrgj, {params:params})
}
// 设备感知--今日智能井盖列表
export function getznjgNumber(params) {
	return axios.get(backApis.sbgz.znjgNumber, {params:params})
}

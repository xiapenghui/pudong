export default {
    getTAqfhStationInfoList: "/pdaqfh_war_exploded/f/tAqfhStationInfo/getTAqfhStationInfoList?limit=-1&offset=0",//获取电站信息列表
    getBugList: "/pdaqfh_war_exploded/f/wgyw/getBugList?offset=0&limit=1000",//缺陷隐患列表
    getCurConstructorList: "/pdaqfh_war_exploded/f/sggk/getCurConstructorList?status=-1&offset=0&limit=-1",//施工现场人员列表
    getOnlineConstructorList: "/pdaqfh_war_exploded/f/sggk/getCurConstructorList?status=0&offset=0&limit=-1",//施工现场人员列表
    getOnlineHistoryTrack: "pdaqfh_Web_exploded/f/sggk/getOnlineHistoryTrack?",//施工现场人员-历史轨迹
    getWorkTicketList: "/pdaqfh_war_exploded/f/sggk/getWorkTicketList?ticketType=-1&status=-1&limit=-1&offset=0",//工作票汇总列表
    getDeviceList: "/pdaqfh_war_exploded/f/znjg/getDeviceList?offset=0&limit=-1",//智能井盖设备列表
    getCollectionDataList: "/pdaqfh_war_exploded/f/znjg/getCollectionDataList?offset=0&limit=-1",//智能井盖历史采集信息
    getTodayWarnMessageList: "/pdaqfh_war_exploded/f/xczy/tXczyWarnMessage/getTodayWarnMessageList",//获取今日告警消息列表
    getTXczyWarnMessageList: "/pdaqfh_war_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList?offset=0&limit=5&rangeType=month",//获取告警消息列表
    getTaqfhUserInfoList: "/pdaqfh_war_exploded/a/pdaqfh/taqfhUserInfo/getTaqfhUserInfoList?offset=0&limit=-1",//获取全部用户信息列表

}
        // this.$$utils.axiosRequest("/pdaqfh_war_exploded/f/sdxltd/getDeviceInfo", '获取输电线路通道可视化检测设备信息').then(result => {
        //     
        //     });
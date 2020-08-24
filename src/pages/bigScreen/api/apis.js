export default {
	//头部模块
	heard:{
		jryh:'/pdaqfh_war_exploded/f/wgyw/getTodayAuditedBugSummary',
		rytj:'/pdaqfh_war_exploded/f/wgyw/getCurrentPersonSummary',
		bdtq:'/pdaqfh_war_exploded/f/aqfh/getWeathers',
		bdzt:'/pdaqfh_Web_exploded/f/aqfh/getXnGdfwYjByYwdw'
	},
	// 设备感知模块
	sbgz:{
		xldx:"/pdaqfh_war_exploded/f/sjafpt/monitorDevice",
		gxzd:"/pdaqfh_war_exploded/f/dasgxczd/getOnlineDevice",
		ycgx:"/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList",
		znjg:"/pdaqfh_war_exploded/f/znjg/getDeviceList",
		ycjg:"/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList",
		newZnjg:"/pdaqfh_war_exploded/f/znjg/getDevices",
		todayBugList:'/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList',
		dzsx:'/pdaqfh_war_exploded/f/dzspjk/getDeviceSummary',
		xldxNumber:'/pdaqfh_war_exploded/f/sjafpt/monitorStatistics',
		gxzdNumber:'/pdaqfh_war_exploded/f/dasgxczd/getSystemState',
		znjgNumber:'/pdaqfh_war_exploded/f/znjg/getDeviceSummary',
		hcznjgNumber:'/pdaqfh_war_exploded/f/znjg/getStatistic',
		xfsbdNumber:'/pdaqfh_Web_exploded/f/fireSystem/getFireSystemData',
	},
	// 缺陷和隐患监控模块
	qxjk:{
		qxjkDetail:'/pdaqfh_war_exploded/f/wgyw/getBugList',
		censusList:'/pdaqfh_war_exploded/f/wgyw/getBugSummaryByType',
		swiperList:'/pdaqfh_war_exploded/f/wgyw/getBugList',
	},
	// 中控模块
	centre:{
		centreNumber:'/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic',
		centerWarNumber:'/pdaqfh_Web_exploded/f/sggk/getTodayWorkSummary',
		sgdwNumber:'/pdaqfh_Web_exploded/f/sggk/getCurConstructorStats',
		ywdwNumber:'/pdaqfh_war_exploded/f/wgyw/getCurrentPersonSummary'
	},
	// 行为检测模块
	xwjc:{
		tdjpNumber:'/pdaqfh_war_exploded/f/sdxltd/getDeviceCountInfo'
	},
	// 作业安全管控模块
	zyaqgk:{
		todayDetail:'/pdaqfh_Web_exploded/f/sggk/getTodayWorkList',
		onlineTime:'/pdaqfh_Web_exploded/f/sggk/getTimeRangeOnlineStats',
		gzpDetail:'/pdaqfh_Web_exploded/f/sggk/getWorkTicketList',
		gzpOver:'/pdaqfh_Web_exploded/f/sggk/getWorkTicketSummary',
		// getgzpNo:'/pdaqfh_Web_exploded/f/sggk/getWorkTicketSummary',
	},
	//资源集约管控
	zyjygk:{
		ywdwOnline:'/pdaqfh_Web_exploded/f/wgyw/getOnlinePeopleLocations',
		sgdwDetail:'/pdaqfh_Web_exploded/f/sggk/getCurConstructorList',
	},
    // 保障概况通道监拍
	bzgk:{
		tdjpOnline:'/pdaqfh/f/sdxltd/getDeviceStateOnLineBylineID',
	}
}
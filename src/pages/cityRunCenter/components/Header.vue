<template>
    <div class="header" :style="{width:width,height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
            <div class="homeLink" @click="toHome"></div>
           <!-- <div class="messagePart">
            <ul ref="messageUl" class="messageUl">
                <li class="messageLi">网格化运维：已审核隐患/缺陷<span>{{ headerData.todaySummary }}</span>个   在线运维（变电<span>{{ headerData.bd }}</span>人 线路<span>{{ headerData.xl }}</span>人 电缆<span>{{ headerData.dl }}</span>人 配电<span>{{ headerData.pd }}</span>人）</li>
                <li class="messageLi">现场施工管控：今日施工<span>{{ headerData.signStats }}</span>起，在线工作<span>{{ headerData.onlineMap }}</span>人</li>
                <li class="messageLi">浦东公司全电网运行正常</li>
            </ul>
            <ul ref="messageUl2" class="messageUl messageUl2">
                <li class="messageLi">网格化运维：已审核隐患/缺陷<span>{{ headerData.todaySummary }}</span>个   在线运维（变电<span>{{ headerData.bd }}</span>人 线路<span>{{ headerData.xl }}</span>人 电缆<span>{{ headerData.dl }}</span>人 配电<span>{{ headerData.pd }}</span>人）</li>
                <li class="messageLi">现场施工管控：今日施工<span>{{ headerData.signStats }}</span>起，在线工作<span>{{ headerData.onlineMap }}</span>人</li>
                <li class="messageLi">浦东公司全电网运行正常</li>
            </ul>
            </div> -->
            <div class="statusPart">
                <a class="statusLink" href="javasript:;">预警状态正常</a>
                <a class="statusLink" href="javasript:;">保电状态正常</a>
                <a class="statusLink" href="javasript:;">抢修状态正常</a>
            </div>
            <div class="timePart">{{ timeData }}</div>
            <div class="weatherPart">
               <!-- <div class="weatherIcon">
                    <img :src=weatherUrls[weatherText.indexOf(weatherData.weatherPre)] :title="weatherData.weatherPre" alt="起始天气">
                </div>
                <div class="weatherIcon" v-if="weatherData.weatherNext">
                    <img :src=weatherUrls[weatherText.indexOf(weatherData.weatherNext)] :title="weatherData.weatherNext" alt="最终天气">
                </div> -->
                <div class="weatherContent"><b>中国上海</b> <b>天气</b>：{{weatherData.weatherPre}} {{ weatherData.max}}</span>℃</div>
            </div>
			 <div class="resources"><span>能源监控</span></div>
    </div>
</template>

<script>

    export default{
        name: 'pageHeader',
        props:{
          width: {
            type: String,
            default: '100%'
          },
          height: {
            type: Number,
            default: 116
          },
          left: {
            type: Number,
            default:0
          },
          top: {
            type: Number,
            default: 0
          },
          show: {
            type: Boolean,
            default: true
          },
        },
        data(){
            return {
                 // 接口数据：获取今日工作汇总情况
                todayWorkSummary: {
                  signStats: 0,
                  supervisor: 0,
                  manage: 0,
                  temporaryNum: 0,
                  planNum: 0
                },

                // 接口数据：获取当前施工现场人员出动情况
                curConstructorStats: {
                  totalMap: {
                    wkresponser: 0,
                    supervisor: 0,
                    wkapprover: 0,
                    manage: 0
                  },
                  onlineMap: {
                    wkresponser: 0,
                    supervisor: 0,
                    wkapprover: 0,
                    manage: 0
                  }
                },

                // 接口数据：获取今日已审核隐患缺陷数
                todayAuditedBugSummary: {
                  pdNum: 0,
                  dlNum: 0,
                  bdNum: 0,
                  xlNum: 0,
                  pdzdhNum: 0
                },
                // 接口数据：获取当前人员统计信息
                currentPersonSummary: [
                    {id: 1, offline_users: 0, online_users: 0, professional_name: '线路'},
                    {id: 2, offline_users: 0, online_users: 0, professional_name: '配电'},
                    {id: 3, offline_users: 0, online_users: 0, professional_name: '电缆'},
                    {id: 4, offline_users: 0, online_users: 0, professional_name: '变电'},
                    {id: 5, offline_users: 0, online_users: 0, professional_name: '营销一体化'},
                    {id: 6, offline_users: 0, online_users: 0, professional_name: '营业站'},
                    {id: 7, offline_users: 0, online_users: 0, professional_name: '配电自动化'},
                    {id: 8, offline_users: 0, online_users: 0, professional_name: '线路联防（虚拟）'},
                ],
                // 系统时间
                timeData: '2019-03-13 星期五 14:30:00',
                // 天气图标
                weatherUrls: [
                    require('../assets/images/ic_weather_cloudy.png'),
                    require('../assets/images/ic_weather_foggy.png'),
                    require('../assets/images/ic_weather_overcast.png'),
                    require('../assets/images/ic_weather_rain_heavy.png'),
                    require('../assets/images/ic_weather_rain_light.png'),
                    require('../assets/images/ic_weather_rain_moderate.png'),
                    require('../assets/images/ic_weather_snow.png'),
                    require('../assets/images/ic_weather_sunny.png'),
                    require('../assets/images/ic_weather_thunder.png'),
                    require('../assets/images/ic_weather_windy.png'),
                ],
                // 天气文字表述情况
                weatherText: ['多云', '雾', '阴', '大雨', '小雨', '中雨', '雪', '晴', '雷阵雨', '台风'],
                // 天气情况
                weatherData: {
                    weatherPre: '多云',
                    weatherNext: '',
                    min: 8,
                    max: 20,
                }
            }
        },
        computed:{
          headerData(){
            return {
              //用于头部-现场施工管控：今日施工()起
              signStats: this.todayWorkSummary.signStats,
              //用于头部-现场施工管控：在线工作()人
              // onlineMap: this.curConstructorStats.onlineMap.wkresponser + this.curConstructorStats.onlineMap.supervisor + this.curConstructorStats.onlineMap.wkapprover + this.curConstructorStats.onlineMap.manage,
              onlineMap: this.curConstructorStats,
              //用于头部-网格化运维：已审核隐患/缺陷()个
              todaySummary: this.todayAuditedBugSummary.pdNum + this.todayAuditedBugSummary.dlNum + this.todayAuditedBugSummary.bdNum + this.todayAuditedBugSummary.xlNum + this.todayAuditedBugSummary.pdzdhNum,
              //用于头部-网格化运维：在线运维 变电()人 线路()人 电缆()人 配电()人
              bd: this.currentPersonSummary[3].online_users,
              xl: this.currentPersonSummary[0].online_users,
              dl: this.currentPersonSummary[2].online_users,
              pd: this.currentPersonSummary[1].online_users,
            }
          },

        },
        methods: {
          toHome(){
            this.$parent.changePage(true);
          },
          // 获取当前系统时间
          getLocalTime(){
              let date = new Date();
              let dateTime = date.toString().split(' ')[4]; //包含秒时间
              // let dateTime2 = date.toString().split(' ')[4].slice(0, -3); //去除包含秒时间
              let dateTime2 = date.toString().split(' ')[4]; //不去除包含秒时间
              let seperator1 = "-";
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let strDate = date.getDate();
			  let myddy=date.getDay();//获取存储当前日期
			  let weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
              if(month >= 1 && month <= 9){
                month = "0" + month;
              }
              if(strDate >= 0 && strDate <= 9){
                strDate = "0" + strDate;
              }
              let dateDay = year + seperator1 + month + seperator1 + strDate+"  "+(weekday[myddy]);
              return dateDay+ " " + dateTime2;
              return dateDay;
			  
          },

          // 动态设置系统时间
          setSystemTime(){
            let _this = this;
            setInterval(function(){
              _this.timeData = _this.getLocalTime();
            }, 1000);
          }

        },
        mounted(){

            // 动态更新系统时间
            this.setSystemTime();
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getTodayWorkSummary', '获取今日工作汇总情况').then(result => {
                this.todayWorkSummary = result.data;
            });

            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorStats', '获取当前施工现场人员出动情况').then(result => {
                // this.curConstructorStats = result.data;
								let onlineMap = result.data.onlineMap;
								let manage= parseInt(onlineMap.manage);
								let supervisor= parseInt(onlineMap.supervisor);
								let wkapprover= parseInt(onlineMap.wkapprover);
								let wkresponser= parseInt(onlineMap.wkresponser);
								manage = isNaN(manage) ? 0 : manage;
								supervisor = isNaN(supervisor) ? 0 : supervisor;
								wkapprover = isNaN(wkapprover) ? 0 : wkapprover;
								wkresponser = isNaN(wkresponser) ? 0 : wkresponser;
								this.curConstructorStats =  manage + supervisor + wkapprover + wkresponser;									
            });

            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getTodayAuditedBugSummary', '获取今日已审核隐患缺陷数').then(result => {
                this.todayAuditedBugSummary = result.data;
            });

            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getCurrentPersonSummary', '获取当前人员统计信息').then(result => {
                this.currentPersonSummary = result.data;
            });

            //头部消息走马灯
            this.$parent.msgInterval(this.$refs.messageUl,this.$refs.messageUl2, 3000);

            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/aqfh/getWeathers', '获取百度天气').then(result => {

                console.log(result.data.results[0].weather_data);

                let todayTem = result.data.results[0].weather_data[0];
                let weather = todayTem.weather;
                let tem = todayTem.temperature.split(" ~ ");
                let max = tem[0];
                let min = tem[1].slice(0, -1);
                let weatherPre = '';
                let weatherNext = '';
                if(weather.indexOf('转') !== -1){
                  weatherPre = weather.split('转')[0];
                  weatherNext = weather.split('转')[1];
                }else{
                  weatherPre = weather;
                }

                this.weatherData = {
                  weatherPre: weatherPre,
                  weatherNext: weatherNext,
                  min: min,
                  max: max,
                }
                console.log(this.weatherData);
            });
        }
    }

</script>

<style scoped>
  .header{
    line-height: 116px;
    background: url("../assets/images/cityHead.png") no-repeat 0 0;
	background-size: cover;
    position: absolute;
    font-size: 18px;
    color: #ffffff;
   z-index: 500;
  }
  .homeLink{
    width: 1080px;
    height: 116px;
    cursor: pointer;
  }
  .weatherPart{
    width: 350px;
    height: 100%;
    position: absolute;
    right: 430px;
    top: -10px;
  }
  .weatherIcon{
    width: 24px;
    margin-right: 8px;
    height: 100%;
    float: left;
    position: relative;
  }
  .weatherIcon img{
    width: 24px;
    height: 24px;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -12px;
  }
  .resources{
	  width: 140px;
	  height: 40px;
	  line-height: 40px;
	  position: absolute;
	  right: 115px;
	  top: 0px;
	  text-align: center;
	  background: #166c8f;
	  margin-top: 37px;
	  font-size: 23px;
	  border-radius: 5px;
	  cursor: pointer;
  }
  .resources:hover{
	 background: #3d65ab;
  }
  .weatherContent{
    float: left;
    height: 100%;
	font-size: 25px;
  }
  .weatherContent b{
	  margin: 0 10px;
	  font-weight: normal;
  }
  .timePart{
    width: 231px;
    height: 100%;
    position: absolute;
    left: 1350px;
    top: 40px;
    line-height: 30px;
    text-align: center;
    /* text-indent: 28px; */
    /* background: url("../assets/images/ic_time.png") no-repeat left center; */
  }
  .statusPart{
    height: 100%;
    position: absolute;
    right: 900px;
    top: 25px;
    padding-right: 60px;
  }
  .statusLink{
    float: left;
    height: 100%;
    padding: 0 7px 0 39px;
    margin-right: 20px;
    color: #ffffff;
	font-size: 20px;
  }
  .statusLink:nth-of-type(1){
    background: url("../assets/images/ic_yj.png") no-repeat left center;
  }
  .statusLink:nth-of-type(2){
    background: url("../assets/images/ic_bd.png") no-repeat left center;
  }
  .statusLink:nth-of-type(3){
    background: url("../assets/images/ic_wx.png") no-repeat left center;
  }
  .messagePart{
    width: 1312px;
    height: 60px;
    line-height: 60px;
    position: absolute;
    left: 1280px;
    top: 34px;
    font-size: 24px;
    color: #ffffff;
    background: url("../assets/images/ic_news.png") no-repeat left 142px center;
    overflow-y: hidden;
  }
  .messageUl{
    width: 100%;
    box-sizing: border-box;
    padding-left: 197px;
    position: absolute;
    left: 0;
    top: 0;
    transition: 0.5s;
  }
  .messageUl2{
    top: 180px;
  }
  .messageLi{
    width: 100%;
    height: 100%;
  }
  .messageLi span{
    color: #fed35f;
  }
</style>

<template>
  <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show" class="centerControl">
                <div class="controlMask"></div>
                <div class="controlMask"></div>
                <div class="controlBox" :class="{active: controlClass}" @click="showControlOne">
                    <div class="controlItem">
                        <div class="cTitle">设备综合监控</div>
                        <div class="cDetail">
                            <div class="cText">危急缺陷</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.wjqx.type}]"  :itemSize="conComputedData.wjqx.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.wjqx.type">{{ conComputedData.wjqx.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">异常监控</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.ycjk.type}]"  :itemSize="conComputedData.ycjk.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.ycjk.type">{{ conComputedData.ycjk.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">火灾消防</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.hzxf.type}]"  :itemSize="conComputedData.hzxf.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.hzxf.type">{{ conComputedData.hzxf.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                    </div>
                    <div class="controlItem">
                        <div class="cTitle">智能风险监测</div>
                        <div class="cDetail">
                            <div class="cText">危急隐患</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.wjyh.type}]" :itemSize="conComputedData.wjyh.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.wjyh.type">{{ conComputedData.wjyh.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">线路隐患</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.xlyh.type}]" :itemSize="conComputedData.xlyh.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.xlyh.type">{{ conComputedData.xlyh.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">安全防护</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.aqfh.type}]" :itemSize="conComputedData.aqfh.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.aqfh.type">{{ conComputedData.aqfh.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="controlBox" :class="{active: !controlClass}" @click="showControlTwo">
                    <div class="controlItem">
                        <div class="cTitle">作业安全管控</div>
                        <div class="cDetail">
                            <div class="cText">当日作业</div>
                            <div class="emptyLine" v-if="!conComputedData.drzy.type"><div class="emptyLineItem"></div></div>
                            <warn-line v-else :className="['cLine']" :itemClassName="['cLineItem','cLineItem2']"  :itemSize="conComputedData.drzy.item"></warn-line>
                            <div class="cNum">
                                <span>{{ conComputedData.drzy.num }}</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">变电站异常</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.bdzyc.type}]" :itemSize="conComputedData.bdzyc.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.bdzyc.type">{{ conComputedData.bdzyc.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">作业点异常</div>
                            <warn-line :className="['cLine']" :itemClassName="['cLineItem',{'warnItem': conComputedData.zydyc.type}]" :itemSize="conComputedData.zydyc.item"></warn-line>
                            <div class="cNum">
                                <span class="warnNum" v-if="conComputedData.zydyc.type">{{ conComputedData.zydyc.num }}</span>
                                <span v-else>正常</span>
                            </div>
                        </div>
                    </div>
                    <div class="controlItem">
                        <div class="cTitle">资源集约管控</div>
                        <div class="cDetail">
                            <div class="cText">运维队伍</div>
                            <div class="emptyLine" v-if="!conComputedData.ywdw.type"><div class="emptyLineItem"></div></div>
                            <warn-line v-else :className="['cLine']" :itemClassName="['cLineItem','cLineItem2']"  :itemSize="conComputedData.ywdw.item"></warn-line>
                            <div class="cNum">
                                <span>{{ conComputedData.ywdw.num }}</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">施工队伍</div>
                            <div class="emptyLine" v-if="!conComputedData.sgdw.type"><div class="emptyLineItem"></div></div>
                            <warn-line v-else :className="['cLine']" :itemClassName="['cLineItem','cLineItem2']"  :itemSize="conComputedData.sgdw.item"></warn-line>
                            <div class="cNum">
                                <span>{{ conComputedData.sgdw.num }}</span>
                            </div>
                        </div>
                        <div class="cDetail">
                            <div class="cText">移动单兵</div>
                            <div class="emptyLine" v-if="!conComputedData.yddb.type"><div class="emptyLineItem"></div></div>
                            <warn-line v-else :className="['cLine']" :itemClassName="['cLineItem','cLineItem2']" :itemSize="conComputedData.yddb.item"></warn-line>
                            <div class="cNum">
                                <span>{{ conComputedData.yddb.num }}</span>
                            </div>
                        </div>
                    </div>
                </div>
  </div>
</template>

<script>


    import warnLine from './WarnLine.vue'
	import eventBus from "./baidumap/base/EventBus";

    export default{
        name: 'centerControl',
        props:{
          width: {
            type: Number,
            default: 1600
          },
          height: {
            type: Number,
            default: 170
          },
          left: {
            type: Number,
            default: 1390
          },
          top: {
            type: Number,
            default: 879
          },
          show: {
            type: Boolean,
            default: true
          },
        },
        data(){
            return {
              controlClass: true,
              conData: {
                    wjqx: 0,
                    ycjk: 0,
                    hzxf: 0,
                    wjyh: 0,
                    xlyh: 0,
                    aqfh: 0,
                    drzy: 0,
                    bdzyc: 0,
                    zydyc: 0,
                    ywdw: 0,
                    sgdw: 0,
                    yddb: 0
                }
            }
        },
        components: {
          warnLine
        },
        computed:{

            // 用于显示中控部分
            conComputedData(){
                //获取数字对应视图展示,len参数是视图中一个格子对应的数值,默认为10
                let getComputed = function(num, other=false){
                    let num_c = {
                        num: num,
                        type: false,
                        item: 12,
                    }
                    if(num > 12*10){
                        num_c.type = true;
                    }else if(num > 0){
                        num_c.type = true;
                        num_c.item = Math.ceil(num / 10);
                    }
                    num_c.item = other ? num_c.item * 2 : num_c.item;
                    return num_c;
                };
                let otherType = ['drzy', 'ywdw', 'sgdw', 'yddb'];
                let newData = {};
                for(let p in this.conData){
                    if(otherType.indexOf(p) !== -1){
                        newData[p] = getComputed(this.conData[p],true);
                    }else{
                        newData[p] = getComputed(this.conData[p]);
                    }
                }

                return newData;
            }
        },
        methods: {

          showControlOne(){
            this.controlClass = true;
            this.$parent.showControlOne();

			  eventBus.emit("switch-switchLayer", "综合监控");
          },

          showControlTwo(){
            this.controlClass = false;
            this.$parent.showControlTwo();
			eventBus.emit("switch-switchLayer", "安全管控");
          }

        },
        mounted(){
            // 危急缺陷
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=wgyw_qxgj', '获取告警消息统计信息').then(result => {
                this.conData.wjqx = parseInt(result.data.wgyw_qxgj);
            });

            // 危急隐患
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=wgyw_yhgj', '获取告警消息统计信息').then(result => {
                this.conData.wjyh = parseInt(result.data.wgyw_yhgj);
            });

            // 火灾消防
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=xfwlw_fire', '获取告警消息统计信息').then(result => {
                this.conData.hzxf = parseInt(result.data.xfwlw_fire);
            });

            // 线路隐患
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=tdjp_tpgj', '获取告警消息统计信息').then(result => {
                this.conData.xlyh = parseInt(result.data.tdjp_tpgj);
            });

            // 异常监控
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=suojunAlarmTopic', '获取告警消息统计信息').then(result => {
                let suojunAlarmTopic = parseInt(result.data.suojunAlarmTopic);
                    this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=das_alarm', '获取告警消息统计信息').then(result => {
                    let das_alarm = parseInt(result.data.das_alarm);
                        this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=znjg_qxgj', '获取告警消息统计信息').then(result => {
                        let znjg_qxgj = parseInt(result.data.znjg_qxgj);
                            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/sgxcycjk/getVideoSummary', '获取变电站摄像设备汇总信息').then(result => {
                            let video_summary = parseInt(result.data.noOnlineNum);
                                this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/dzspjk/getDeviceSummary', '获取电站视频监控设备统计数据').then(result => {
                                let device_summary = parseInt(result.data.noOnlineNum);
                                this.conData.ycjk = suojunAlarmTopic + das_alarm + znjg_qxgj + video_summary + device_summary;
                            });
                        });
                    });
                });
            });

            // 变电站异常
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/xczy/tXczyWarnMessage/messageStatistic?rangeType=month&messageType=bdzzdfy_state', '获取告警消息统计信息').then(result => {
                this.conData.bdzyc = parseInt(result.data.bdzzdfy_state);
            });

            // 当日作业
            this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getTodayWorkSummary', '获取告警消息统计信息').then(result => {
                this.conData.drzy = parseInt(result.data.signStats);
            });

            // 施工队伍
			   this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorStats', '获取当前施工现场人员出动情况').then(result => {
				let onlineMap = result.data.onlineMap;
				let manage= parseInt(onlineMap.manage);
				let supervisor= parseInt(onlineMap.supervisor);
				let wkapprover= parseInt(onlineMap.wkapprover);
				let wkresponser= parseInt(onlineMap.wkresponser);
				manage = isNaN(manage) ? 0 : manage
				supervisor = isNaN(supervisor) ? 0 : supervisor
				wkapprover = isNaN(wkapprover) ? 0 : wkapprover
				wkresponser = isNaN(wkresponser) ? 0 : wkresponser
               this.conData.sgdw = manage + supervisor + wkapprover + wkresponser;
			});

            // 运维队伍
            this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getCurrentPersonSummary', '获取当前人员统计信息').then(result => {
                if(result.data){
                   for(let i=0;i<result.data.length;i++){
                       this.conData.ywdw +=  result.data[i].online_users;
                   }
                }
            });
        }
    }

</script>

<style scoped>
    .centerControl{
        position: absolute;
        /* z-index: 500; */
		z-index: 100;
		
    }
    .controlBox{
        width: 754px;
        height: 170px;
        float: left;
        margin-right: 38px;
    }
    .controlItem{
        width: 358px;
        height: 170px;
        float: left;
        background: url("../assets/images/bg_button_nor.png") no-repeat center center;
		/* background: url("../assets/images/bg_button_sel.png") no-repeat center center; */
        cursor: pointer;
    }
    .controlItem:first-of-type{
        margin-right: 38px;
    }
    .controlBox.active .controlItem,.controlBox:hover .controlItem{
        background: url("../assets/images/bg_button_sel.png") no-repeat center center;
    }
    .controlBox.active .controlItem{
        cursor: default;
    }
    .controlMask{
        width: 38px;
        height: 170px;
        position: absolute;
        top: 0;
        left: 358px;
    }
    .controlMask:nth-of-type(2){
        left: 1150px;
    }
    .cTitle{
        width: 100%;
        height: 52px;
        box-sizing: border-box;
        padding-top: 6px;
        line-height: 46px;
        text-indent: 24px;
        color: #8ed0ff;
        font-size: 20px;
    }
    .cDetail{
        width: 100%;
        height: 32px;
        line-height: 32px;
    }
    .cText{
        float: left;
        width: 130px;
        height: 100%;
        color: #ffffff;
        font-size: 18px;
        text-indent: 30px;
    }
    .cLine{
        float: left;
        width: 148px;
        height: 100%;
        box-sizing: border-box;
        padding: 8px 0;
    }
    .cLineItem{
        width: 6px;
        height: 100%;
        margin-right: 6px;
        background: #32b16c;
        float: left;
    }
    .cLineItem.cLineItem2{
        margin-right: 0;
    }
    .emptyLine{
        float: left;
        width: 148px;
        height: 100%;
        box-sizing: border-box;
        padding: 8px 0;
    }
    .emptyLineItem{
        width: 100%;
        height: 100%;
        border: 1px solid #32b16c;
        box-sizing: border-box;
    }
    .cNum{
        float: left;
        width: calc(100% - 278px);
        height: 100%;
        color: #43f2f4;
        font-size: 18px;
        text-indent: 12px;
    }
    .cNum .warnNum{
        color: #ec6941;
    }
</style>

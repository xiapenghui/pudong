<template>
    <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
        <div class="sectionMain">
            <div class="sectionHead">
                <div class="sectionTop">
                  <div class="sectiontitle">设备监测</div>
                </div>
            </div>
            <div class="sectionBody sectionBody1">
                <div class="sectionItem">
                    <div class="deviceTitle">线缆断线报警(台)</div>
                    <div class="deviceNum"><span>{{ deviceDetails.xldx.total }}</span></div>
                    <div class="deviceText"><span>覆盖架空线<strong>{{ deviceDetails.xldx.num1 }}</strong>条</span></div>
                    <div class="deviceOn">
                        <div class="deviceOnText">在线率</div>
                        <div class="deviceOnLine"></div>
                        <div class="deviceOnNum">100%</div>
                    </div>
                </div>
                <div class="sectionItem">
                    <div class="deviceTitle">光纤振动监测(套)</div>
                    <div class="deviceNum"><span>{{ deviceDetails.gqzd.total }}</span><span>/</span><span>{{ deviceDetails.gqzd.total_sub }}</span></div>
                    <div class="deviceText"><span>变电站<strong>{{ deviceDetails.gqzd.num1 }}</strong>个</span><span>电缆<strong>{{ deviceDetails.gqzd.num2 }}</strong>条</span></div>
                    <div class="deviceOn">
                        <div class="deviceOnText">在线率</div>
                        <div class="deviceOnLine"></div>
                        <div class="deviceOnNum">100%</div>
                    </div>
                </div>
                <div class="sectionItem">
                    <div class="deviceTitle">智能井盖(个)</div>
                    <div class="deviceNum"><span>{{ deviceDetails.znjg.total }}</span></div>
                    <div class="deviceText"><span>覆盖工井个数<strong>{{ deviceDetails.znjg.num1 }}</strong>条</span></div>
                    <div class="deviceOn">
                        <div class="deviceOnText">在线率</div>
                        <div class="deviceOnLine"></div>
                        <div class="deviceOnNum">100%</div>
                    </div>
                </div>
                <div class="sectionItem">
                    <div class="deviceTitle">火灾报警(套)</div>
                    <div class="deviceNum"><span>{{ deviceDetails.hzbj.total }}</span></div>
                    <div class="deviceText"><span>覆盖变电站<strong>{{ deviceDetails.hzbj.num1 }}</strong>个</span></div>
                    <div class="deviceOn">
                        <div class="deviceOnText">在线率</div>
                        <div class="deviceOnLine"></div>
                        <div class="deviceOnNum">100%</div>
                    </div>
                </div>
                <div class="sectionTail">丁香站、国际站当前在保电任务中</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default{
        name: 'sgbcSection',
        data(){
            return {
                // 设备监测部分
                deviceDetails: {
                    xldx: {
                        total: 43,
                        num1: 3
                    },
                    gqzd: {
                        total: 43,
                        total_sub: 3,
                        num1: 3,
                        num2: 5
                    },
                    znjg: {
                        total: 63,
                        num1: 3
                    },
                    hzbj: {
                        total: 56,
                        num1: 20
                    },
                }
            }
        },
        props:{
          width: {
            type: Number,
            default: 490
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
          },
        },
    }

</script>

<style scoped>
  .sectionBody1{
    padding-left: 20px;
  }
  .sectionBody1 .sectionItem{
    width: 218px;
    height: 162px;
    margin-bottom: 20px;
  }
  .sectionBody1 .sectionTail{
    bottom: 13px;
  }
  .deviceTitle{
    width: 100%;
    height: 42px;
    line-height: 42px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
  }
  .deviceNum{
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .deviceNum span{
    color: #43f2f4;
    font-size: 34px;
    font-weight: bold;
  }
  .deviceNum span:nth-of-type(3){
    color: #fe774e;
    font-size: 22px;
  }
  .deviceText{
    width: 100%;
    height: 40px;
    padding-top: 20px;
    line-height: 20px;
    text-align: center;
  }
  .deviceText span{
    font-size: 14px;
    color: #b0e0fc;
    padding: 0 10px;
  }
  .deviceText span strong{
    color: #43f2f4;
    font-size: 16px;
    padding: 0 2px;
  }
  .deviceOn{
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .deviceOnText{
    width: 68px;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #ffffff;
    float: left;
    text-indent: 20px;
  }
  .deviceOnLine{
    width: 88px;
    height: 6px;
    float: left;
    background: #ab6df7;
    border-radius: 3px;
    margin-top: 17px;
  }
  .deviceOnNum{
    width: calc(100% - 166px);
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #7c90b3;
    float: left;
    text-indent: 10px;
    font-weight: bold;
  }
</style>

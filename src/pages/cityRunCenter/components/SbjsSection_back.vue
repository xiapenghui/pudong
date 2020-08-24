<template>
    <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
        <div class="sectionMain">
            <div class="sectionHead">
                <div class="sectionTop">
                  <div class="sectiontitle">设备监视</div>
                </div>
            </div>
            <div class="sectionBody sectionBody2">
                <div class="sectionItem">
                    <div class="videoImg"></div>
                    <div class="videoText">变电站视频（台）</div>
                    <div class="videoNum">{{ videoData.bdNum }}</div>
                    <div class="videoOn">
                        <div class="videoOnText">在线率</div>
                        <div class="videoOnLine">
                            <div v-for="item in videoBd" :key="item" class="viItem"></div>
                        </div>
                        <div class="videoOnNum">{{ videoData.bdOn }}</div>
                    </div>
                </div>
                <div class="sectionItem">
                    <div class="videoImg"></div>
                    <div class="videoText">配电站视频（台）</div>
                    <div class="videoNum">{{ videoData.pdNum }}</div>
                    <div class="videoOn">
                        <div class="videoOnText">在线率</div>
                        <div class="videoOnLine">
                            <div v-for="item in videoPd"  :key="item" class="viItem"></div>
                        </div>
                        <div class="videoOnNum">{{ videoData.pdOn }}</div>
                    </div>
                </div>
                <div class="sectionTail">丁香站、国际站当前在保电任务中</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default{
        name: 'sgbsSection',
        data(){
            return {
                // 设备监视部分
                videoData: {
                    bdNum: 63,
                    pdNum: 47,
                    bdOn: '86%',
                    pdOn: '35%',
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
            default: 594
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
        computed: {
            videoBd(){
                let len = Math.ceil( parseInt(this.videoData.bdOn)/5 )
                return len >= 1 ? len : 1;
            },
            videoPd(){
                let len = Math.ceil( parseInt(this.videoData.pdOn)/5 )
                return len >= 1 ? len : 1;
            }
        }
    }

</script>

<style scoped>
  .sectionBody2{
    padding-left: 30px;
  }
  .sectionBody2 .sectionItem{
    width: 210px;
    height: 310px;
  }
  .sectionBody2 .sectionTail{
    bottom: 33px;
  }
  .videoImg{
    width: 100%;
    height: 137px;
    padding-top: 22px;
    box-sizing: border-box;
    background: url("../assets/images/ic_video.png") no-repeat center center;
  }
  .videoText{
    width: 100%;
    height: 28px;
    line-height: 28px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
  }
  .videoNum{
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: #f4c549;
    font-size: 48px;
    text-align: center;
    font-weight: bold;
    text-shadow: 0px 0px 7px rgba(244, 94, 64, 1);
  }
  .videoOn{
    width: 100%;
    height: 20px;
    line-height: 20px;
    margin-top: 26px;
  }
  .videoOnText{
    width: 60px;
    height: 100%;
    float: left;
    color: #ffffff;
    font-size: 12px;
    text-indent: 18px;
  }
  .videoOnLine{
    width: 104px;
    height: 100%;
    float: left;
    background: url("../assets/images/bg_zxl.png") no-repeat center center;
    box-sizing: border-box;
    padding: 3px 0 3px 3px;
  }
  .viItem{
    width: 3px;
    height: 100%;
    margin-right: 2px;
    background: #2fd581;
    border-radius: 2px;
    float: left;
  }
  .videoOnNum{
    width: 46px;
    height: 100%;
    float: left;
    color: #7c90b3;
    font-size: 14px;
    text-indent: 5px;
  }
</style>

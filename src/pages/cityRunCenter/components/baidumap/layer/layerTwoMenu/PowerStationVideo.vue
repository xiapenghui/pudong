<template>
  <div class="liveVideo" v-show="isShow==true">
    <div style="height: 100%; width:20%; float: left">
      <div class="liveControl">
        <ul style="background: rgba(14, 50, 55, 0.5);">
          <li>
            <h3>视窗</h3>
            <select class="choosenum" id="selectOption" @change="selectChange">
              <option value="1">不分屏</option>
              <option value="4">四分屏</option>
              <option value="6">六分屏</option>
            </select>
          </li>
          <!-- <li>
            <h3>轮巡</h3>
            <div>
              <select class="choosenum">
                <option value="10">10秒</option>
                <option value="30">30秒</option>
                <option value="60">1分钟</option>
                <option value="180">3分钟</option>
              </select>
            </div>
          </li>-->
          <li>
            <div class="row" style="height: 30px;">
              <div class="row2">
                <div class="largeico">
                  <a href="javascript:;">
                    <i></i>
                    <p style="text-align: center;" @click="playVideo">播放</p>
                  </a>
                </div>
              </div>
              <div class="row2">
                <div class="largeico">
                  <a href="javascript:;">
                    <i></i>
                    <p style="text-align: center;" @click="disposeVideo">关闭全部</p>
                  </a>
                </div>
              </div>
            </div>
          </li>
          <li class="controltabs">
            <ul>
              <li style="height: 40px;background-color: #008ed2;">
                <a style="padding-top: 10px;color: #f8f4f4;" href="javascript:; " class="active">电站</a>
              </li>
              <li>
                <a style="padding-top: 10px;" href="javascript:;"></a>
              </li>
            </ul>
            <div class="tree">
              <template>
                <el-tree
                  :data="dataTree"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  ref="tree"
                  @check="checkClick"
                ></el-tree>
              </template>
              <!-- check-strictly -->
              <!-- <ul style="color: #f8f8f8;">
                <li>
                  <a>全部电站</a>
                  <ul>
                    <li>
                      <a>10kV电站</a>
                    </li>
                    <li>
                      <a>35kV电站</a>
                      <ul>
                        <li>
                          <a>xx站</a>
                        </li>
                        <li>
                          <a>xx站</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a>110kV电站</a>
                      <ul>
                        <li>
                          <a>xx站</a>
                        </li>
                        <li>
                          <a>xx站</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>-->
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="livePlay">
      <!-- <div class="liveSplit">
        <div class="livePlayVideo">
          <video
            id="liveSplitVideo1"
            class="video-js vjs-default-skin"
            preload="auto"
            style="width:99%;height:100%"
          >
            <source
              src="rtmp://116.247.116.42/live/61?streamOpenMode=1&audioEnabled=0&accessToken=at2m6keovady3o5g0nd4tt3wcyd6z2qqch"
              type="rtmp/flv"
            >
          </video>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import eventBus from "../../base/EventBus";
import videojs from "video.js";
import "videojs-flash";
import "video.js/dist/video-js.min.css";
import $ from "jquery";

export default {
  components: {},
  data() {
    return {
      playId: [],
      videoList: [],
      isShow: false,
      // testDataTree: [
      // {
      //   cameraId: "1999215616001",
      //   monitoringPointDesp: "",
      //   longitude: 121.639732,
      //   latitude: 31.219908,
      //   address:
      //     "rtmp://116.247.116.42/live/1?streamOpenMode=1&amp;audioEnabled=0&amp;accessToken=at2m6keovady3o5g0nd4tt3wcyd",
      //   ascriptionSite: "35kV测试站",
      //   cameraNumber: "1-1",
      //   usableSign: "1",
      //   stationId: "FF000000-0000-0000-1000-000000001300-13962111"
      // },
      //   {
      //     cameraId: "1999215616",
      //     monitoringPointDesp: "",
      //     longitude: 121.639732,
      //     latitude: 31.219908,
      //     address:
      //       "rtmp://116.247.116.42/live/1?streamOpenMode=1&amp;audioEnabled=0&amp;accessToken=at2m6keovady3o5g0nd4tt3wcyd",
      //     ascriptionSite: "35kV蔷薇站",
      //     cameraNumber: "3-1",
      //     usableSign: "1",
      //     stationId: "FF000000-0000-0000-1000-000000001300-13962"
      //   },
      //   {
      //     cameraId: "1273603767",
      //     monitoringPointDesp: "",
      //     longitude: 121.639732,
      //     latitude: 31.219908,
      //     address:
      //       "rtmp://116.247.116.42/live/2?streamOpenMode=1&amp;audioEnabled=0&amp;accessToken=at2m6keovady3o5g0nd4tt3wcyd",
      //     ascriptionSite: "35kV蔷薇站",
      //     cameraNumber: "3-2",
      //     usableSign: "1",
      //     stationId: "FF000000-0000-0000-1000-000000001300-13962"
      //   },
      //   {
      //     cameraId: "285706105",
      //     monitoringPointDesp: "",
      //     longitude: 121.639732,
      //     latitude: 31.219908,
      //     address:
      //       "rtmp://116.247.116.42/live/3?streamOpenMode=1&amp;audioEnabled=0&amp;accessToken=at2m6keovady3o5g0nd4tt3wcyd",
      //     ascriptionSite: "35kV蔷薇站",
      //     cameraNumber: "3-3",
      //     usableSign: "1",
      //     stationId: "FF000000-0000-0000-1000-000000001300-13962"
      //   },
      //   {
      //     cameraId: "2014607974",
      //     monitoringPointDesp: "",
      //     longitude: "",
      //     latitude: "",
      //     address:
      //       "rtmp://116.247.116.42/live/65?streamOpenMode=1&amp;audioEnabled=0&amp;accessToken=at2m6keovady3o5g0nd4tt3wcy",
      //     ascriptionSite: "110kV铜山站",
      //     cameraNumber: "",
      //     usableSign: "1",
      //     stationId: "1c2b6fdec3ff80808163caecd101641c2b000d1167"
      //   },
      //   {
      //     cameraId: "150957175",
      //     monitoringPointDesp: "",
      //     longitude: "",
      //     latitude: "",
      //     address:
      //       "rtmp://116.247.116.42/live/65?streamOpenMode=1&amp;audioEnabled=0&amp;accessToken=at2m6keovady3o5g0nd4tt3wcy",
      //     ascriptionSite: "110kV铜山站",
      //     cameraNumber: "5-1",
      //     usableSign: "1",
      //     stationId: "1c2b6fdec3ff80808163caecd101641c2b000d1167"
      //   }
      // ],
      checkTreeList: [], //需要播放的视频
      dataTree: [
        // {
        //   id: 1,
        //   label: "全部电站",
        //   children: [
        {
          id: "220kv",
          label: "220kv",
          children: [
            {
              id: "220kv1",
              label: "220kv1",
              children: [
                {
                  id: "220kv11",
                  label: "220kv11"
                },
                {
                  id: "220kv12",
                  label: "220kv12"
                }
              ]
            },
            {
              id: "220kv2",
              label: "220kv2",
              children: [
                {
                  id: "220kv21",
                  label: "220kv21"
                }
              ]
            }
          ]
        },
        {
          id: 3,
          label: "110kv",
          children: [
            {
              id: 5,
              label: "三级 1-1-1",
              children: [
                {
                  id: 7,
                  label: "四级级 1-1-1-1"
                }
              ]
            },
            {
              id: 10,
              label: "三级 1-1-2",
              children: [
                {
                  id: 11,
                  label: "四级级 1-1-1-2"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
    // ],
    // defaultProps: {
    //   children: "children",
    //   label: "label"
    // }
    // };
  },
  computed: {},
  methods: {
    //初始化树菜单
    initDataTree(data) {
      data.push({
        cameraId: "001",
        monitoringPointDesp: "",
        longitude: 0,
        latitude: 0,
        address:
          "rtmp://116.247.116.42/live/61?streamOpenMode=1&audioEnabled=0&accessToken=at2m6keovady3o5g0nd4tt3wcyd6z2qqch",
        ascriptionSite: "35kV测试站",
        cameraNumber: "1-1",
        usableSign: "1",
        stationId: "001"
      });
      var name = []; //名称
      var dydj = []; //电压等级
      for (var i = 0; i < data.length; i++) {
        name.push(data[i].ascriptionSite);
        dydj.push(data[i].ascriptionSite.replace(/[\u4E00-\u9FA5]/g, "")); //电压等级 去掉中文
      }
      let nameRepeat = this.uniquePipeline(name); //去重复的name;
      let dydjRepeat = this.uniquePipeline(dydj); //去重复的dydj;
      let tree1 = []; //一级菜单
      for (var i = 0; i < dydjRepeat.length; i++) {
        if (dydjRepeat[i] == "10kV") {
          tree1.push({
            id: 1,
            label: "10kV",
            tree: 1, //菜单级别
            children: []
          });
        }
        if (dydjRepeat[i] == "35kV") {
          tree1.push({
            id: 2,
            label: "35kV",
            tree: 1, //菜单级别
            children: []
          });
        }
        if (dydjRepeat[i] == "110kV") {
          tree1.push({
            id: 3,
            label: "110kV",
            tree: 1, //菜单级别
            children: []
          });
        }
        if (dydjRepeat[i] == "220kV") {
          tree1.push({
            id: 4,
            label: "220kV",
            tree: 1, //菜单级别
            children: []
          });
        }
      }
      let tree2 = []; //二级菜单
      for (var i = 0; i < nameRepeat.length; i++) {
        tree2.push({
          id: i + 10,
          label: nameRepeat[i],
          dydj: nameRepeat[i].replace(/[\u4E00-\u9FA5]/g, ""),
          tree: 2, //菜单级别
          children: []
        });
      }
      let tree3 = []; //三级菜单
      for (var i = 0; i < data.length; i++) {
        tree3.push({
          id: data[i].cameraId,
          label: data[i].cameraNumber,
          name: data[i].ascriptionSite,
          url: data[i].address,
          stationId: data[i].stationId,
          tree: 3, //菜单级别
          usableSign: data[i].usableSign
        });
      }
      //合并菜单
      for (var i = 0; i < tree1.length; i++) {
        for (var j = 0; j < tree2.length; j++) {
          if (tree1[i].label == tree2[j].dydj) {
            for (var k = 0; k < tree3.length; k++) {
              if (tree2[j].label == tree3[k].name) {
                tree2[j].children.push(tree3[k]);
              }
            }
            tree1[i].children.push(tree2[j]);
          }
        }
      }
      this.dataTree = [];
      this.dataTree = tree1;
    },
    //勾选菜单事件
    checkClick(data, checked) {
       this.disposeVideo(); // 销毁
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedKeys([data.id]);

      this.checkTreeList = []; //存放需要播放的设备
      if (data.tree == 3) {
        this.checkTreeList.push(data);
      } else if (data.tree == 2) {
        this.checkTreeList = data.children;
      } else if (data.tree == 1) {
        for (var i = 0; i < data.children.length; i++) {
          for (var j = 0; j < data.children[i].children.length; j++) {
            this.checkTreeList.push(data.children[i].children[j]); //1
          }
        }
      }
      this.newVideo(); //创建需要播放的视频
    },
    //打开视频电站页面
    showVideo(type) {
      this.isShow = type;
    },
    //下拉分屏
    selectChange() {
      this.disposeVideo(); // 销毁
      this.newVideo();
    },
    //创建需要播放的视频
    newVideo() {
      let optionVal = $("#selectOption").val(); //下拉框值
      if (this.isShow && this.checkTreeList.length>0) {
        $(".livePlay").empty();
        for (let i = 0; i < optionVal; i++) {
          var videoUrl="";
          if(this.checkTreeList[i]!=undefined){
            videoUrl=this.checkTreeList[i].url;
          }else{
            break;
          }
          //根据不同分屏切换样式
          if (optionVal == 1) {
            $(".livePlay").append(
              "" +
                '<div class="liveSplit" style="height: 100%;width: 100%;float: left;padding: 10px;"> ' +
                ' <div class="livePlayVideo" style="height: 100%;width: 100%;border: 1px solid #008ed2;background: #0e0e37;">' +
                '   <video id="liveSplitVideo' +
                i +
                '" class="video-js vjs-default-skin" preload="auto" style="width:99%;height:100%"> ' +
                '     <source src="'+videoUrl+'" type="rtmp/flv">' +
                "   </video>" +
                " </div>" +
                "</div>"
            );
          } else if (optionVal == 4) {
            $(".livePlay").append(
              "" +
                '<div class="liveSplit" style="height: 50%;width: 50%;float: left;padding: 10px;"> ' +
                ' <div class="livePlayVideo" style="height: 100%;width: 100%;border: 1px solid #008ed2;background: #0e0e37;">' +
                '   <video id="liveSplitVideo' +
                i +
                '" class="video-js vjs-default-skin" preload="auto" style="width:99%;height:100%"> ' +
                '     <source src="'+videoUrl+'" type="rtmp/flv">' +
                "   </video>" +
                " </div>" +
                "</div>"
            );
          } else if (optionVal == 6) {
            $(".livePlay").append(
              "" +
                '<div class="liveSplit" style="height: 50%;width: 33.3%;float: left;padding: 10px;"> ' +
                ' <div class="livePlayVideo" style="height: 100%;width: 100%;border: 1px solid #008ed2;background: #0e0e37;">' +
                '   <video id="liveSplitVideo' +
                i +
                '" class="video-js vjs-default-skin" preload="auto" style="width:99%;height:100%"> ' +
                '     <source src="'+videoUrl+'" type="rtmp/flv">' +
                "   </video>" +
                " </div>" +
                "</div>"
            );
          }
        }
      }
      if (this.isShow) {
        this.playId = []; //视频窗口id
        for (let i = 0; i < optionVal; i++) {
          let id = "liveSplitVideo" + i;
          this.playId.push(id);
          if (optionVal == 1) {
            //this.playVideo(id);
          }
        }
      } else {
        this.disposeVideo(); // 销毁
      }
    },
    //销毁视频 暂停 this.pause() 销毁 this.dispose()
    disposeVideo() {
      let vs = this.videoList;
      if (vs.length > 0) {
        for (let i = 0; i < vs.length; i++) {
          vs[i].pause();
          vs[i].dispose();
        }
      }
      if(this.isShow==false){
        this.$refs.tree.setCheckedKeys([]);
      }
      this.videoList = [];
    },
    //开始播放视频
    playVideo() {
      if (this.playId.length > 0 && this.checkTreeList.length > 0) {
        for (let i = 0; i < this.playId.length; i++) {
          // todo 重新播放按钮、声音面板调整、直播标志、按钮移到右侧、中文提示、画面跟随、画面左上
          let options = {
            autoplay: true,
            controls: true,
            controlBar: {
              // 设置是否显示该组件
              // 'liveDisplay': true,
              playToggle: false,
              fullscreenToggle: true,
              progressControl: false,
              // 'currentTimeDisplay': true,
              // 'timeDivider': true,
              // 'durationDisplay': true,
              remainingTimeDisplay: false,
              volumePanel: false
            },
            flash: {
              swf: "/common-assets/plugins/videojs/video-js.swf"
              //swf: "./video-js.swf"
              //swf: "http://127.0.0.1:8080/rtmpVideo2/7.1/video-js.swf"
              //swf: "./components/baidumap/layer/layerTwoMenu/video-js.swf"
            },
            poster: "/common-assets/plugins/videojs//three-dots.svg",
            techOrder: ["flash"],
            muted: true, // 静音
            preload: "auto", // 预加载
            language: "zh-CN", // 初始化语言
            languages: {
              "zh-cn": { Fullscreen: "全屏", "Non-Fullscreen": "退出全屏" }
            },
            playbackRates: [1, 2, 3, 4, 5, 8, 10, 20] // 播放速度
          };
          let playVideo = videojs(
            this.playId[i],
            options,
            function onPlayerReady() {
              videojs.log("Your player is ready!");
              var player = this;
              player.on("ended", function() {
                videojs.log("Awww...over so soon?!");
              });
              this.on("error", function() {
                videojs.log("Awww...error!" + player.id());
              });
              this.on("loadeddata", function() {});
            }
          );
          playVideo.play();
          this.videoList.push(playVideo);
        }
      }
    },
    //去重复
    uniquePipeline: function(array) {
      var n = [array[0]];
      for (var i = 1; i < array.length; i++) {
        if (array.indexOf(array[i]) == i) {
          n.push(array[i]);
        }
      }
      return n;
    }
  },
  mounted() {
    eventBus.on("showVideo-PowerStationVideo", this.showVideo); //打开
    eventBus.on("clossVideo-PowerStationVideo", this.disposeVideo); //关闭

    this.$$utils
      .axiosRequest(
        "/pdaqfh_war_exploded/f/dzspjk/getDeviceList",
        "获取电站视频监控"
      )
      .then(result => {
        if (result.data.list.length == 0) {
          return;
        }
        this.initDataTree(result.data.list);
      });
    // this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/sgxcycjk/getDeviceInfo', '施工现场远程监控').then(result => {
    //
    // });
  }
};
</script>

<style scoped>
/* video div*/
.liveVideo {
  z-index: 101;
  display: block;
  position: absolute;
  width: 1930px;
  height: 910px;
  /* left: 1140px !important; */
  top: 0px !important;
  background: #041224;
  border: 1px solid #008ed2;
}

/* video 控制*/
.liveVideo .liveControl {
  height: 100%;
  /* background: rgba(14, 50, 55, 0.5); */
  padding: 10px;
  overflow: hidden;
}
.liveVideo .liveControl ul li {
  margin-bottom: 20px;
  width: 100%;
  position: relative;
}
.liveVideo .liveControl ul li h3 {
  display: inline-block;
  font-size: 16px;
  color: #3863a7;
  position: absolute;
  right: 0;
  top: 8px;
}
.liveVideo .choosenum {
  background: url(../../assets/images/menuTips/select_down.png) no-repeat scroll
    right center transparent;
  border: 1px solid #2a6496;
  height: 31px;
  color: #2a6496;
  border-radius: 5px;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding: 0 30px 0 10px;
}
.row .row2 {
  float: left;
  width: 50%;
}
.largeico a {
  display: block;
  background: rgba(47, 113, 250, 0.1);
  padding-bottom: 6px;
  border-radius: 5px;
  color: #2a6496;
  border: 1px solid;
}
.largeico a:hover,
.largeico a.active {
  display: block;
  background: rgba(47, 113, 250, 0.1);
  border: 1px solid rgba(47, 113, 250, 1);
  padding-bottom: 6px;
  border-radius: 5px;
  color: #5ecdfa;
}
.controltabs > ul > li {
  float: left;
  width: 50% !important;
  text-align: center;
  margin-bottom: 0 !important;
}
.controltabs .tree {
  border: 1px solid #008ed2;
  height: 783px;
  width: calc(100% - 2px);
  overflow: hidden;
}
.tree ul li {
  margin-bottom: 0 !important;
  margin-left: 20px;
}

/* video 播放*/
.livePlay {
  height: 100%;
  width: 80%;
  float: left;
}
.liveSplit {
  height: 50%;
  width: 33.3%;
  float: left;
  padding: 10px;
}
.livePlayVideo {
  height: 100%;
  width: 100%;
  border: 1px solid #008ed2;
  background: #0e0e37;
}

/* 树形组件样式修改 */
.el-tree {
  background: transparent;
}

/deep/ .el-tree-node__content:hover {
  background: #008ed2;
}
/deep/ .el-tree-node__label {
  font-size: 18px;
  color: #ffffff;
}

/deep/ .el-tree-node__content {
  height: 40px;
}

/deep/ .el-tree-node:focus > .el-tree-node__content,
/deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: transparent;
}
</style>

